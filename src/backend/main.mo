import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Char "mo:core/Char";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

// Apply migration with 'with clause'
(with migration = Migration.run)
actor {
  // Error Types
  public type Error = {
    #Unauthorized;
    #Forbidden;
    #NotBanned;
    #AlreadyExists;
    #NotFound;
    #AlreadyConnected;
  };

  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types and Identifiers
  type CommunityProfile = {
    displayName : Text;
    pronouns : Text;
    bio : Text;
    tags : [Text];
    avatar : ?Storage.ExternalBlob;
    profilePhoto : ?Storage.ExternalBlob;
    openToMentoring : Bool;
    seekingMentorship : Bool;
    supporterOfCommunity : Bool;
  };

  type PostId = Nat;
  type CommentId = Nat;

  module CommentId {
    public func compare(a : CommentId, b : CommentId) : Order.Order {
      Nat.compare(a, b);
    };
  };

  type ConnectionRequest = {
    from : Principal;
    to : Principal;
    message : ?Text;
    timestamp : Int;
  };

  type ContentReport = {
    id : Nat;
    reportedBy : Principal;
    contentId : Text;
    reason : Text;
    timestamp : Int;
    resolved : Bool;
  };

  type MessageId = Nat;
  type ReactionType = {
    #like;
    #dislike;
  };

  type HelloCornerMessage = {
    id : MessageId;
    author : Principal;
    text : Text;
    photo : ?Storage.ExternalBlob;
    video : ?Storage.ExternalBlob;
    createdAt : Int;
  };

  type MessageReaction = {
    user : Principal;
    reaction : ReactionType;
  };

  type PaginatedMessages = {
    messages : [HelloCornerMessage];
    hasMore : Bool;
    nextOffset : Nat;
  };

  type ReportId = Nat;
  type ReportType = {
    #profile;
    #message;
  };
  type ReasonType = {
    #lecture;
    #troll;
    #offTopic;
    #violation;
    #insensitive;
    #other : Text;
  };
  type ReportStatus = { #pending; #reviewed };

  type Report = {
    id : ReportId;
    reporter : Principal;
    contentId : Text;
    reportType : ReportType;
    reasonType : ReasonType;
    description : Text;
    status : ReportStatus;
    timestamp : Int;
  };

  // State
  var nextReportId = 0;
  let eligibilityConfirmed = Map.empty<Principal, Bool>();
  let communityProfiles = Map.empty<Principal, CommunityProfile>();
  let connections = Map.empty<Principal, [Principal]>();
  let blockedUsers = Map.empty<Principal, [Principal]>();

  // HelloCorner state
  var nextMessageId = 0;
  let messages = Map.empty<MessageId, HelloCornerMessage>();
  let messageReactions = Map.empty<MessageId, [MessageReaction]>();

  // Moderation state
  let bannedUsers = Map.empty<Principal, Text>(); // Store ban timestamp and reason
  let reports = Map.empty<ReportId, Report>();

  // Helper function for formatted values with default fallback
  func formatValue(value : Text, default : Text) : Text {
    if (value.isEmpty()) { default } else { value };
  };

  // Helper function for formatted boolean values
  func formatBoolean(value : Bool, default : Text) : Text {
    if (value) { "Yes" } else { default };
  };

  public shared ({ caller }) func confirmEligibility() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can confirm eligibility");
    };
    eligibilityConfirmed.add(caller, true);
  };

  public query ({ caller }) func hasConfirmedEligibility() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check eligibility");
    };
    eligibilityConfirmed.containsKey(caller);
  };

  // Profile Management
  public shared ({ caller }) func updateCommunityProfile(profile : CommunityProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    switch (bannedUsers.get(caller)) {
      case (null) {
        communityProfiles.add(caller, profile);
      };
      case (?_) {
        Runtime.trap("Your account is banned");
      };
    };
  };

  public query ({ caller }) func getCommunityProfile(user : Principal) : async CommunityProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (communityProfiles.get(user)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func browseMentors(lookingFor : { mentoring : Bool; mentorship : Bool; supporterOfCommunity : Bool }) : async [CommunityProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse mentors");
    };
    let filteredProfiles = communityProfiles.values().toArray().filter(
      func(p) {
        (lookingFor.mentoring and p.openToMentoring) or
        (lookingFor.mentorship and p.seekingMentorship) or
        (lookingFor.supporterOfCommunity and p.supporterOfCommunity)
      }
    );
    filteredProfiles;
  };

  // Profile Photo Upload
  public shared ({ caller }) func uploadProfilePhoto(blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload profile photos");
    };
    switch (communityProfiles.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) {
        let updatedProfile = { profile with profilePhoto = ?blob };
        communityProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getProfilePhoto(user : Principal) : async ?Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profile photos");
    };
    switch (communityProfiles.get(user)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) { profile.profilePhoto };
    };
  };

  // Connections
  public shared ({ caller }) func addContact(to : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add contacts");
    };
    if (caller == to) { Runtime.trap("Cannot add yourself as a contact") };
    switch (communityProfiles.get(to)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?_) {};
    };
    switch (connections.get(caller)) {
      case (?current) { if (current.values().any(func(p) { p == to })) { return } };
      case (null) {};
    };
  };

  public shared ({ caller }) func acceptContact(_requester : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can accept contacts");
    };
    Runtime.trap("Contact request not found");
  };

  public query ({ caller }) func getContacts(user : Principal) : async [Principal] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own contacts");
    };
    switch (connections.get(user)) {
      case (?active) { active };
      case (null) { [] };
    };
  };

  // Moderation API

  public shared ({ caller }) func banUser(user : Principal, reason : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can ban users");
    };
    bannedUsers.add(user, reason);
  };

  public shared ({ caller }) func unbanUser(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can unban users");
    };
    bannedUsers.remove(user);
  };

  public query ({ caller }) func getBanReason(user : Principal) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view ban reasons");
    };
    switch (bannedUsers.get(user)) {
      case (null) { Runtime.trap("User is not banned") };
      case (?reason) { reason };
    };
  };

  public shared ({ caller }) func reportContent(contentId : Text, contentType : ReportType, reasonType : ReasonType, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can report content");
    };
    let newReport : Report = {
      id = nextReportId;
      reporter = caller;
      contentId;
      reportType = contentType;
      reasonType;
      description;
      status = #pending;
      timestamp = 0;
    };
    reports.add(nextReportId, newReport);
    nextReportId += 1;
  };

  public shared ({ caller }) func resolveReport(reportId : ReportId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can resolve reports");
    };

    switch (reports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?r) {
        let updatedReport = { r with status = #reviewed };
        reports.add(reportId, updatedReport);
      };
    };
  };

  public query ({ caller }) func getReport(reportId : ReportId) : async Report {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can get reports");
    };
    switch (reports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) { report };
    };
  };

  public query ({ caller }) func listReports(skip : Nat, take : Nat) : async [Report] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list reports");
    };
    let reportsArray = reports.toArray();
    if (reportsArray.size() <= skip) { return [] };
    let endIndex = if (skip + take > reportsArray.size()) {
      reportsArray.size();
    } else {
      skip + take;
    };
    let range = reportsArray.range(skip, endIndex);
    range.map(func((k, v)) { v }).toArray();
  };

  public query ({ caller }) func getUserReportStats(_user : Principal) : async {
    profileReportCount : Nat;
    messageReportCount : Nat;
  } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can get report stats");
    };

    let profileReports = reports.values().toArray().filter(
      func(r) { switch (r.reportType) { case (#profile) { true }; case (_) { false } } }
    );
    let messageReports = reports.values().toArray().filter(
      func(r) { switch (r.reportType) { case (#message) { true }; case (_) { false } } }
    );

    { profileReportCount = profileReports.size(); messageReportCount = messageReports.size() };
  };

  public query ({ caller }) func isUserBannedForAdminCheck(user : Principal) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can check for confirmed users");
    };
    bannedUsers.containsKey(user);
  };

  func getReportsByReason(reportsArray : [Report], reason : ReasonType) : [Report] {
    reportsArray.filter(func(r) { r.reasonType == reason });
  };

  public query ({ caller }) func getLectureReports(skip : Nat, take : Nat) : async [Report] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can get lecture reports");
    };
    let filteredReports = getReportsByReason(reports.values().toArray(), #lecture);
    let size = filteredReports.size();
    let endIndex = if (skip + take > size) {
      size;
    } else {
      skip + take;
    };
    filteredReports.sliceToArray(skip, endIndex);
  };

  // Helper function to filter reports by status and reason
  func getReportsByStatusAndReason(reportsArray : [Report], status : ReportStatus, reasonType : ReasonType) : [Report] {
    reportsArray.filter(func(r) { r.status == status and r.reasonType == reasonType });
  };

  public query ({ caller }) func getPendingTrollReports(skip : Nat, take : Nat) : async {
    pendingTrollReports : [Report];
    totalCount : Nat;
  } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can get pending troll reports");
    };
    let pendingReports = getReportsByStatusAndReason(
      reports.values().toArray(),
      #pending,
      #troll,
    );
    let totalCount = pendingReports.size();
    let pendingTrollReports = if (totalCount <= skip) { [] } else {
      let safeEndIndex = if (skip + take > totalCount) { totalCount } else {
        skip + take;
      };
      pendingReports.sliceToArray(skip, safeEndIndex);
    };
    { pendingTrollReports; totalCount };
  };

  // HelloCorner -- Chat Stream with video support
  public shared ({ caller }) func createHelloCornerMessage(text : Text, photo : ?Storage.ExternalBlob, video : ?Storage.ExternalBlob) : async MessageId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post messages");
    };

    switch (bannedUsers.get(caller)) {
      case (null) {
        let message : HelloCornerMessage = {
          id = nextMessageId;
          author = caller;
          text;
          photo;
          video;
          createdAt = 0;
        };

        messages.add(nextMessageId, message);
        messageReactions.add(nextMessageId, []);

        let id = nextMessageId;
        nextMessageId += 1;
        id;
      };
      case (?_) {
        Runtime.trap("Your account is banned");
      };
    };
  };

  public query ({ caller }) func listHelloCornerMessages(offset : Nat, limit : Nat) : async PaginatedMessages {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    let totalMessages = messages.size();
    let rangeCheck = if (offset < totalMessages) { offset } else { totalMessages };

    let orderedMessages = messages.values().toArray();
    let paginatedMessages = orderedMessages.range(rangeCheck, totalMessages);
    let paginatedArray = paginatedMessages.toArray();
    let finalSize = paginatedArray.size();
    let hasMore = offset + finalSize < totalMessages;
    let nextOffset = offset + finalSize;

    {
      messages = paginatedArray;
      hasMore;
      nextOffset;
    };
  };

  // HelloCorner -- Reactions
  public shared ({ caller }) func reactToMessage(messageId : MessageId, reaction : ReactionType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can react to messages");
    };

    switch (messages.get(messageId)) {
      case (null) { Runtime.trap("Message not found") };
      case (?_) {
        if (bannedUsers.containsKey(caller)) {
          Runtime.trap("Your account is banned. You cannot perform this action.");
        };
        let newReaction : MessageReaction = {
          user = caller;
          reaction;
        };

        switch (messageReactions.get(messageId)) {
          case (null) {
            messageReactions.add(messageId, [newReaction]);
          };
          case (?existingReactions) {
            let filteredReactions = existingReactions.filter(
              func(r) { r.user != caller }
            );
            let updatedReactions = filteredReactions.concat([newReaction]);
            messageReactions.add(messageId, updatedReactions);
          };
        };
      };
    };
  };

  public shared ({ caller }) func removeReaction(messageId : MessageId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove reactions");
    };

    switch (messages.get(messageId)) {
      case (null) { Runtime.trap("Message not found") };
      case (?_) {
        if (bannedUsers.containsKey(caller)) {
          Runtime.trap("Your account is banned. You cannot perform this action.");
        };
        switch (messageReactions.get(messageId)) {
          case (null) { () };
          case (?existingReactions) {
            let filteredReactions = existingReactions.filter(
              func(r) { r.user != caller }
            );
            messageReactions.add(messageId, filteredReactions);
          };
        };
      };
    };
  };

  public query ({ caller }) func getMessageReactions(messageId : MessageId) : async {
    likeCount : Nat;
    dislikeCount : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reaction counts");
    };

    switch (messages.get(messageId)) {
      case (null) { Runtime.trap("Message not found") };
      case (?_) {
        switch (messageReactions.get(messageId)) {
          case (null) { { likeCount = 0; dislikeCount = 0 } };
          case (?reactions) {
            let likeCount = reactions.filter(func(r) { r.reaction == #like }).size();
            let dislikeCount = reactions.filter(func(r) { r.reaction == #dislike }).size();
            { likeCount; dislikeCount };
          };
        };
      };
    };
  };
};
