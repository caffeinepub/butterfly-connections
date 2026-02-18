import { useParams } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetCommunityProfile, useAddContact } from '../hooks/useQueries';
import { useAuth } from '../hooks/useAuth';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

export default function ProfileView() {
  const { userId } = useParams({ from: '/profile/$userId' });
  const { principalString } = useAuth();
  const { data: profile, isLoading } = useGetCommunityProfile(userId);
  const { mutate: addContact, isPending } = useAddContact();

  const isOwnProfile = userId === principalString;

  const handleConnect = () => {
    try {
      const principal = Principal.fromText(userId);
      addContact(principal, {
        onSuccess: () => {
          toast.success('Connection request sent!');
        },
        onError: (error) => {
          toast.error('Failed to send connection request');
          console.error(error);
        },
      });
    } catch (error) {
      toast.error('Invalid user ID');
    }
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

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-[oklch(0.45_0.06_320)]">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[oklch(0.35_0.08_320)]">Profile</CardTitle>
            {!isOwnProfile && (
              <Button
                onClick={handleConnect}
                disabled={isPending}
                className="bg-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.60_0.15_320)] text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {isPending ? 'Connecting...' : 'Connect'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/assets/generated/default-avatar-set.dim_1024x1024.png" />
              <AvatarFallback className="bg-[oklch(0.65_0.15_320)] text-white text-2xl">
                {profile.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-[oklch(0.50_0.06_320)] mb-1">Display Name</h3>
              <p className="text-[oklch(0.35_0.08_320)] text-lg">{profile.displayName}</p>
            </div>

            {profile.pronouns && (
              <div>
                <h3 className="text-sm font-medium text-[oklch(0.50_0.06_320)] mb-1">Pronouns</h3>
                <p className="text-[oklch(0.35_0.08_320)]">{profile.pronouns}</p>
              </div>
            )}

            {profile.bio && (
              <div>
                <h3 className="text-sm font-medium text-[oklch(0.50_0.06_320)] mb-1">Bio</h3>
                <p className="text-[oklch(0.35_0.08_320)] whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            {profile.tags && profile.tags.length > 0 && (
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

            {(profile.openToMentoring || profile.seekingMentorship) && (
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
        </CardContent>
      </Card>
    </div>
  );
}
