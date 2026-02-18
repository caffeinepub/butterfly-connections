import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  // Old CommunityProfile type without the profilePhoto field.
  type OldCommunityProfile = {
    displayName : Text;
    pronouns : Text;
    bio : Text;
    tags : [Text];
    avatar : ?Storage.ExternalBlob;
    openToMentoring : Bool;
    seekingMentorship : Bool;
  };

  // Old actor type
  type OldActor = {
    nextReportId : Nat;
    eligibilityConfirmed : Map.Map<Principal, Bool>;
    communityProfiles : Map.Map<Principal, OldCommunityProfile>;
    connections : Map.Map<Principal, [Principal]>;
  };

  // New CommunityProfile type with the profilePhoto field.
  type NewCommunityProfile = {
    displayName : Text;
    pronouns : Text;
    bio : Text;
    tags : [Text];
    avatar : ?Storage.ExternalBlob;
    profilePhoto : ?Storage.ExternalBlob;
    openToMentoring : Bool;
    seekingMentorship : Bool;
  };

  // New actor type
  type NewActor = {
    nextReportId : Nat;
    eligibilityConfirmed : Map.Map<Principal, Bool>;
    communityProfiles : Map.Map<Principal, NewCommunityProfile>;
    connections : Map.Map<Principal, [Principal]>;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : NewActor {
    let newProfiles = old.communityProfiles.map<Principal, OldCommunityProfile, NewCommunityProfile>(
      func(_id, oldProfile) {
        { oldProfile with profilePhoto = null };
      }
    );
    {
      old with
      communityProfiles = newProfiles
    };
  };
};
