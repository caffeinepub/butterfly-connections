import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    eligibilityConfirmed : Map.Map<Principal, Bool>;
    communityProfiles : Map.Map<Principal, CommunityProfile>;
    connections : Map.Map<Principal, [Principal]>;
    blockedUsers : Map.Map<Principal, [Principal]>;
    bannedUsers : Map.Map<Principal, Text>;
    nextMessageId : Nat;
    messages : Map.Map<Nat, Message>;
    messageReactions : Map.Map<Nat, [MessageReaction]>;
    nextReportId : Nat;
    reports : Map.Map<Nat, Report>;
  };

  type CommunityProfile = {
    displayName : Text;
    pronouns : Text;
    bio : Text;
    tags : [Text];
    avatar : ?Blob;
    profilePhoto : ?Blob;
    openToMentoring : Bool;
    seekingMentorship : Bool;
    supporterOfCommunity : Bool;
  };

  type Message = {
    id : Nat;
    author : Principal;
    text : Text;
    photo : ?Blob;
    video : ?Blob;
    createdAt : Int;
  };

  type MessageReaction = {
    user : Principal;
    reaction : ReactionType;
  };

  type ReactionType = {
    #like;
    #dislike;
  };

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
  type ReportId = Nat;
  type ReportStatus = { #pending; #reviewed };
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

  type ThreadId = Nat;
  type ReplyId = Nat;

  type ConnectionsThread = {
    id : ThreadId;
    author : Principal;
    title : Text;
    content : Text;
    createdAt : Int;
    replies : [ConnectionsReply];
    isVisible : Bool;
  };

  type ConnectionsReply = {
    id : ReplyId;
    author : Principal;
    content : Text;
    createdAt : Int;
    threadId : ThreadId;
  };

  type ConnectionRequest = {
    from : Principal;
    to : Principal;
    timestamp : Int;
  };

  type NewActor = {
    threads : Map.Map<ThreadId, ConnectionsThread>;
    threadReplies : Map.Map<ThreadId, [ConnectionsReply]>;
    pendingConnectionRequests : Map.Map<Principal, [ConnectionRequest]>;
    connections : Map.Map<Principal, [Principal]>;
  };

  public func run(_old : OldActor) : NewActor {
    {
      threads = Map.empty<ThreadId, ConnectionsThread>();
      threadReplies = Map.empty<ThreadId, [ConnectionsReply]>();
      pendingConnectionRequests = Map.empty<Principal, [ConnectionRequest]>();
      connections = Map.empty<Principal, [Principal]>();
    };
  };
};
