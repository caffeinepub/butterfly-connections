import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '../hooks/useAuth';
import { useGetCommunityProfile, useUpdateCommunityProfile } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { CommunityProfile, ExternalBlob } from '../backend';
import ProfilePhotosManager from '../components/profile/ProfilePhotosManager';

export default function ProfileMe() {
  const { principalString } = useAuth();
  const { data: profile, isLoading } = useGetCommunityProfile(principalString);
  const { mutate: updateProfile, isPending } = useUpdateCommunityProfile();

  const [displayName, setDisplayName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [bio, setBio] = useState('');
  const [tags, setTags] = useState('');
  const [openToMentoring, setOpenToMentoring] = useState(false);
  const [seekingMentorship, setSeekingMentorship] = useState(false);
  const [avatar, setAvatar] = useState<ExternalBlob | undefined>(undefined);
  const [profilePhoto, setProfilePhoto] = useState<ExternalBlob | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPronouns(profile.pronouns || '');
      setBio(profile.bio || '');
      setTags(profile.tags.join(', ') || '');
      setOpenToMentoring(profile.openToMentoring || false);
      setSeekingMentorship(profile.seekingMentorship || false);
      setAvatar(profile.avatar);
      setProfilePhoto(profile.profilePhoto);
    }
  }, [profile]);

  const handleSave = () => {
    if (!displayName.trim()) {
      toast.error('Display name is required');
      return;
    }

    const updatedProfile: CommunityProfile = {
      displayName: displayName.trim(),
      pronouns: pronouns.trim(),
      bio: bio.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
      openToMentoring,
      seekingMentorship,
      avatar,
      profilePhoto,
    };

    updateProfile(updatedProfile, {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      },
      onError: (error) => {
        toast.error('Failed to update profile');
        console.error(error);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[oklch(0.65_0.15_320)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[oklch(0.45_0.06_320)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  const showSetup = !profile || !profile.displayName;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-[oklch(0.35_0.08_320)]">
          {showSetup ? 'Complete Your Profile' : 'My Profile'}
        </h1>
        {showSetup && (
          <p className="text-[oklch(0.45_0.06_320)]">
            Let's set up your profile so you can start connecting with the community!
          </p>
        )}
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[oklch(0.35_0.08_320)]">Profile Information</CardTitle>
            {!showSetup && !isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-[oklch(0.65_0.15_320)] text-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.65_0.15_320)] hover:text-white"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {(isEditing || showSetup) ? (
            <>
              {/* Edit Mode */}
              <ProfilePhotosManager
                currentAvatar={profile?.avatar}
                currentProfilePhoto={profile?.profilePhoto}
                displayName={displayName || 'User'}
                onAvatarChange={setAvatar}
                onProfilePhotoChange={setProfilePhoto}
              />

              <div className="space-y-4 pt-4 border-t border-[oklch(0.90_0.02_320)]">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="How should we call you?"
                    className="border-[oklch(0.90_0.02_320)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pronouns">Pronouns</Label>
                  <Input
                    id="pronouns"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    placeholder="e.g., she/her, he/him, they/them"
                    className="border-[oklch(0.90_0.02_320)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a bit about yourself..."
                    rows={4}
                    className="border-[oklch(0.90_0.02_320)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Interests & Tags</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., art, music, gaming (comma-separated)"
                    className="border-[oklch(0.90_0.02_320)]"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-[oklch(0.90_0.02_320)]">
                  <h3 className="font-semibold text-[oklch(0.35_0.08_320)]">Mentorship</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mentoring" className="cursor-pointer">
                      Open to mentoring others
                    </Label>
                    <Switch
                      id="mentoring"
                      checked={openToMentoring}
                      onCheckedChange={setOpenToMentoring}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="seeking" className="cursor-pointer">
                      Seeking mentorship
                    </Label>
                    <Switch
                      id="seeking"
                      checked={seekingMentorship}
                      onCheckedChange={setSeekingMentorship}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isPending || !displayName.trim()}
                  className="flex-1 bg-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.60_0.15_320)] text-white"
                >
                  {isPending ? 'Saving...' : 'Save Profile'}
                </Button>
                {!showSetup && (
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      // Reset to current profile values
                      if (profile) {
                        setDisplayName(profile.displayName || '');
                        setPronouns(profile.pronouns || '');
                        setBio(profile.bio || '');
                        setTags(profile.tags.join(', ') || '');
                        setOpenToMentoring(profile.openToMentoring || false);
                        setSeekingMentorship(profile.seekingMentorship || false);
                        setAvatar(profile.avatar);
                        setProfilePhoto(profile.profilePhoto);
                      }
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* View Mode */}
              <div className="space-y-6">
                {/* Avatar and Profile Photo Display */}
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={profile?.avatar?.getDirectURL() || '/assets/generated/default-avatar-set.dim_1024x1024.png'}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[oklch(0.90_0.02_320)]"
                  />
                  
                  {profile?.profilePhoto && (
                    <div className="w-full max-w-md">
                      <img
                        src={profile.profilePhoto.getDirectURL()}
                        alt="Profile photo"
                        className="w-full h-64 object-cover rounded-lg border-2 border-[oklch(0.90_0.02_320)]"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-[oklch(0.90_0.02_320)]">
                  <div>
                    <h3 className="text-sm font-medium text-[oklch(0.50_0.06_320)] mb-1">Display Name</h3>
                    <p className="text-[oklch(0.35_0.08_320)] text-lg">{profile?.displayName || 'Not set'}</p>
                  </div>

                  {profile?.pronouns && (
                    <div>
                      <h3 className="text-sm font-medium text-[oklch(0.50_0.06_320)] mb-1">Pronouns</h3>
                      <p className="text-[oklch(0.35_0.08_320)]">{profile.pronouns}</p>
                    </div>
                  )}

                  {profile?.bio && (
                    <div>
                      <h3 className="text-sm font-medium text-[oklch(0.50_0.06_320)] mb-1">Bio</h3>
                      <p className="text-[oklch(0.35_0.08_320)] whitespace-pre-wrap">{profile.bio}</p>
                    </div>
                  )}

                  {profile?.tags && profile.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-[oklch(0.50_0.06_320)] mb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-[oklch(0.96_0.03_340)] text-[oklch(0.45_0.06_320)] rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(profile?.openToMentoring || profile?.seekingMentorship) && (
                    <div className="pt-4 border-t border-[oklch(0.90_0.02_320)]">
                      <h3 className="text-sm font-medium text-[oklch(0.50_0.06_320)] mb-2">Mentorship</h3>
                      <div className="space-y-1">
                        {profile.openToMentoring && (
                          <p className="text-[oklch(0.35_0.08_320)]">✓ Open to mentoring others</p>
                        )}
                        {profile.seekingMentorship && (
                          <p className="text-[oklch(0.35_0.08_320)]">✓ Seeking mentorship</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
