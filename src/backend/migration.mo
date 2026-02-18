import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

import Storage "blob-storage/Storage";

module {
  public type CommunityProfile = {
    displayName : Text;
    pronouns : Text;
    bio : Text;
    tags : [Text];
    avatar : ?Storage.ExternalBlob;
    profilePhoto : ?Storage.ExternalBlob;
    openToMentoring : Bool;
    seekingMentorship : Bool;
    supporterOfCommunity : Bool; // New field
  };

  public type ConnectionRequest = {
    from : Principal;
    to : Principal;
    message : ?Text;
    timestamp : Int;
  };

  public type ContentReport = {
    id : Nat;
    reportedBy : Principal;
    contentId : Text;
    reason : Text;
    timestamp : Int;
    resolved : Bool;
  };

  public type HelloCornerMessage = {
    id : Nat;
    author : Principal;
    text : Text;
    photo : ?Storage.ExternalBlob;
    video : ?Storage.ExternalBlob; // New field for optional video
    createdAt : Int;
  };

  public type MessageReaction = {
    user : Principal;
    reaction : { #like; #dislike };
  };

  public type PaginatedMessages = {
    messages : [HelloCornerMessage];
    hasMore : Bool;
    nextOffset : Nat;
  };

  public type ReportId = Nat;
  public type ReportType = {
    #profile;
    #message;
  };
  public type ReasonType = {
    #lecture;
    #troll;
    #offTopic;
    #violation;
    #insensitive;
    #other : Text;
  };
  public type ReportStatus = { #pending; #reviewed };

  public type Report = {
    id : ReportId;
    reporter : Principal;
    contentId : Text;
    reportType : ReportType;
    reasonType : ReasonType;
    description : Text;
    status : ReportStatus;
    timestamp : Int;
  };

  // Types from original backend
  type OldActor = {
    communityProfiles : Map.Map<Principal, CommunityProfile>;
    connections : Map.Map<Principal, [Principal]>;
    messages : Map.Map<Nat, HelloCornerMessage>;
    messageReactions : Map.Map<Nat, [MessageReaction]>;
  };

  type NewActor = {
    communityProfiles : Map.Map<Principal, CommunityProfile>;
    connections : Map.Map<Principal, [Principal]>;
    messages : Map.Map<Nat, HelloCornerMessage>;
    messageReactions : Map.Map<Nat, [MessageReaction]>;
    bannedUsers : Map.Map<Principal, Text>;
    reports : Map.Map<ReportId, Report>;
  };

  public func run(old : OldActor) : NewActor {
    let bannedUsers = Map.empty<Principal, Text>();
    let reports = Map.empty<ReportId, Report>();
    {
      old with
      bannedUsers;
      reports;
    };
  };
};
