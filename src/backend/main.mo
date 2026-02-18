import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

// Apply explicit migration logic with 'with' clause
(with migration = Migration.run)
actor {
  public type Error = {
    #Unauthorized;
    #Forbidden;
    #NotBanned;
    #AlreadyExists;
    #NotFound;
    #AlreadyConnected;
    #NotFoundForAuthor;
    #AlreadyReported;
    #InvalidReply;
    #Banned;
    #InvalidThread;
    #ThreadNotFound;
  };

  // Component state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Connections Forum Specific Types
  type ThreadId = Nat;
  type ReplyId = Nat;

  // Connections Forum Types
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

  // State variables
  var nextThreadId = 0;
  var nextReplyId = 0;
  let threads = Map.empty<ThreadId, ConnectionsThread>();
  let threadReplies = Map.empty<ThreadId, [ConnectionsReply]>();
  let pendingConnectionRequests = Map.empty<Principal, [ConnectionRequest]>();
  let connections = Map.empty<Principal, [Principal]>();

  // Helper Functions
  func isConnection(caller : Principal, other : Principal) : Bool {
    if (caller == other) { return true };
    switch (connections.get(caller)) {
      case (?connList) { connList.values().find(func(p) { p == other }) != null };
      case (null) { false };
    };
  };

  // Connections Forum Functions

  public shared ({ caller }) func createThread(title : Text, content : Text) : async ThreadId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create threads");
    };

    let thread : ConnectionsThread = {
      id = nextThreadId;
      author = caller;
      title;
      content;
      createdAt = 0;
      replies = [];
      isVisible = true;
    };

    threads.add(nextThreadId, thread);
    threadReplies.add(nextThreadId, []);

    let id = nextThreadId;
    nextThreadId += 1;
    id;
  };

  public query ({ caller }) func getThread(threadId : ThreadId) : async ConnectionsThread {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view threads");
    };

    switch (threads.get(threadId)) {
      case (null) { Runtime.trap("Thread not found") };
      case (?thread) {
        if (not isConnection(caller, thread.author)) {
          Runtime.trap("Unauthorized: You can only view threads from your connections");
        };

        let replies = switch (threadReplies.get(threadId)) {
          case (?r) { r };
          case (null) { [] };
        };

        { thread with replies };
      };
    };
  };

  public query ({ caller }) func listThreads(offset : Nat, limit : Nat) : async [ConnectionsThread] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list threads");
    };

    let allThreads = threads.values().toArray();
    let accessibleThreads = allThreads.filter(func(thread) {
      isConnection(caller, thread.author)
    });

    let totalThreads = accessibleThreads.size();
    if (offset >= totalThreads) { return [] };

    let endIndex = if (offset + limit > totalThreads) {
      totalThreads
    } else {
      offset + limit;
    };

    let paginatedThreads = accessibleThreads.sliceToArray(offset, endIndex);

    paginatedThreads.map(func(thread) {
      let replies = switch (threadReplies.get(thread.id)) {
        case (?r) { r };
        case (null) { [] };
      };
      { thread with replies };
    });
  };

  public shared ({ caller }) func replyToThread(threadId : ThreadId, content : Text) : async ReplyId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reply to threads");
    };

    switch (threads.get(threadId)) {
      case (null) { Runtime.trap("Thread not found") };
      case (?_) {
        let reply : ConnectionsReply = {
          id = nextReplyId;
          author = caller;
          content;
          createdAt = 0;
          threadId;
        };

        switch (threadReplies.get(threadId)) {
          case (?existing) {
            threadReplies.add(threadId, existing.concat([reply]));
          };
          case (null) {
            threadReplies.add(threadId, [reply]);
          };
        };

        let id = nextReplyId;
        nextReplyId += 1;
        id;
      };
    };
  };

  public query ({ caller }) func getThreadReplies(threadId : ThreadId) : async [ConnectionsReply] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view replies");
    };

    switch (threads.get(threadId)) {
      case (null) { Runtime.trap("Thread not found") };
      case (?_) {
        switch (threadReplies.get(threadId)) {
          case (?replies) { replies };
          case (null) { [] };
        };
      };
    };
  };

  // Connection Management

  public shared ({ caller }) func sendConnectionRequest(target : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send connection requests");
    };

    if (caller == target) {
      Runtime.trap("Cannot send connection request to yourself");
    };

    let request : ConnectionRequest = {
      from = caller;
      to = target;
      timestamp = 0;
    };

    switch (pendingConnectionRequests.get(target)) {
      case (?existing) {
        let alreadyExists = existing.values().any(func(r) { r.from == caller });
        if (alreadyExists) {
          Runtime.trap("Connection request already sent");
        };
        pendingConnectionRequests.add(target, existing.concat([request]));
      };
      case (null) {
        pendingConnectionRequests.add(target, [request]);
      };
    };
  };

  public shared ({ caller }) func acceptConnectionRequest(requester : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can accept connection requests");
    };

    switch (pendingConnectionRequests.get(caller)) {
      case (?requests) {
        let matchingRequest = requests.values().find(func(r) { r.from == requester });
        switch (matchingRequest) {
          case (?_) {
            let updatedRequests = requests.filter(func(r) { r.from != requester });
            if (updatedRequests.size() == 0) {
              pendingConnectionRequests.remove(caller);
            } else {
              pendingConnectionRequests.add(caller, updatedRequests);
            };

            switch (connections.get(caller)) {
              case (?existing) {
                connections.add(caller, existing.concat([requester]));
              };
              case (null) {
                connections.add(caller, [requester]);
              };
            };

            switch (connections.get(requester)) {
              case (?existing) {
                connections.add(requester, existing.concat([caller]));
              };
              case (null) {
                connections.add(requester, [caller]);
              };
            };
          };
          case (null) {
            Runtime.trap("Connection request not found");
          };
        };
      };
      case (null) {
        Runtime.trap("No pending connection requests");
      };
    };
  };

  public query ({ caller }) func getUserConnections(user : Principal) : async [Principal] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own connections");
    };
    switch (connections.get(user)) {
      case (?active) { active };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getPendingConnectionRequests() : async [ConnectionRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view connection requests");
    };

    switch (pendingConnectionRequests.get(caller)) {
      case (?requests) { requests };
      case (null) { [] };
    };
  };
};
