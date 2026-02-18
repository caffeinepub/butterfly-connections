import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldCommunityProfile = {
    displayName : Text;
    pronouns : Text;
    bio : Text;
    tags : [Text];
    avatar : ?Storage.ExternalBlob;
    profilePhoto : ?Storage.ExternalBlob;
    openToMentoring : Bool;
    seekingMentorship : Bool;
  };

  type NewCommunityProfile = {
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

  type OldActor = {
    communityProfiles : Map.Map<Principal, OldCommunityProfile>;
  };

  type NewActor = {
    communityProfiles : Map.Map<Principal, NewCommunityProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newCommunityProfiles = old.communityProfiles.map<Principal, OldCommunityProfile, NewCommunityProfile>(
      func(_principal, oldProfile) {
        { oldProfile with supporterOfCommunity = false };
      }
    );
    { communityProfiles = newCommunityProfiles };
  };
};
