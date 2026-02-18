import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
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

  // State
  var nextReportId = 0;
  let eligibilityConfirmed = Map.empty<Principal, Bool>();
  let communityProfiles = Map.empty<Principal, CommunityProfile>();
  let connections = Map.empty<Principal, [Principal]>();

  // Eligibility
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
    communityProfiles.add(caller, profile);
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

  public query ({ caller }) func browseMentors(lookingFor : { mentoring : Bool; mentorship : Bool }) : async [CommunityProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse mentors");
    };
    let filteredProfiles = communityProfiles.values().toArray().filter(
      func(p) {
        (lookingFor.mentoring and p.openToMentoring) or
        (lookingFor.mentorship and p.seekingMentorship)
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

  // Reporting
  public shared ({ caller }) func reportContent(contentId : Text, _reason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can report content");
    };
    let _ : ContentReport = {
      id = nextReportId;
      reportedBy = caller;
      contentId;
      reason = "";
      timestamp = 0;
      resolved = false;
    };
    nextReportId += 1;
  };

  public shared ({ caller }) func removeContent(_reportId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove content");
    };
  };
};
