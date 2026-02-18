import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useBrowseMentors } from '../hooks/useQueries';
import { Link } from '@tanstack/react-router';
import { Users } from 'lucide-react';

export default function Directory() {
  const [filterMentoring, setFilterMentoring] = useState(true);
  const [filterMentorship, setFilterMentorship] = useState(true);
  const [filterSupporter, setFilterSupporter] = useState(true);

  const { data: profiles, isLoading } = useBrowseMentors({
    mentoring: filterMentoring,
    mentorship: filterMentorship,
    supporterOfCommunity: filterSupporter,
  });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[oklch(0.35_0.08_320)]">Community Directory</h1>
        <p className="text-[oklch(0.45_0.06_320)] max-w-2xl mx-auto">
          Find mentors, peers, and friends who share your interests and can support your journey.
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <CardTitle className="text-[oklch(0.35_0.08_320)]">Filter by Mentorship</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="mentoring"
                checked={filterMentoring}
                onCheckedChange={setFilterMentoring}
              />
              <Label htmlFor="mentoring" className="cursor-pointer">
                Open to mentoring
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="mentorship"
                checked={filterMentorship}
                onCheckedChange={setFilterMentorship}
              />
              <Label htmlFor="mentorship" className="cursor-pointer">
                Seeking mentorship
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="supporter"
                checked={filterSupporter}
                onCheckedChange={setFilterSupporter}
              />
              <Label htmlFor="supporter" className="cursor-pointer">
                Supporter of the community
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[oklch(0.65_0.15_320)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[oklch(0.45_0.06_320)]">Loading directory...</p>
          </div>
        </div>
      ) : profiles && profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile, index) => (
            <Card
              key={index}
              className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)] hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <img
                    src={profile.avatar?.getDirectURL() || '/assets/generated/default-avatar-set.dim_1024x1024.png'}
                    alt={`${profile.displayName}'s avatar`}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[oklch(0.90_0.02_320)]"
                  />
                  
                  <div className="space-y-2 w-full">
                    <h3 className="text-lg font-semibold text-[oklch(0.35_0.08_320)]">
                      {profile.displayName}
                    </h3>
                    
                    {profile.pronouns && (
                      <p className="text-sm text-[oklch(0.50_0.06_320)]">{profile.pronouns}</p>
                    )}
                    
                    {profile.bio && (
                      <p className="text-sm text-[oklch(0.45_0.06_320)] line-clamp-3">
                        {profile.bio}
                      </p>
                    )}
                    
                    {profile.tags && profile.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center pt-2">
                        {profile.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-[oklch(0.96_0.03_340)] text-[oklch(0.45_0.06_320)] rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {profile.tags.length > 3 && (
                          <span className="px-2 py-1 text-[oklch(0.50_0.06_320)] text-xs">
                            +{profile.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 text-xs text-[oklch(0.50_0.06_320)] pt-2 justify-center">
                      {profile.openToMentoring && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-[oklch(0.65_0.15_320)] rounded-full" />
                          Mentoring
                        </span>
                      )}
                      {profile.seekingMentorship && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-[oklch(0.55_0.15_280)] rounded-full" />
                          Seeking
                        </span>
                      )}
                      {profile.supporterOfCommunity && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-[oklch(0.60_0.15_200)] rounded-full" />
                          Supporter
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    asChild
                    className="w-full bg-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.60_0.15_320)] text-white"
                  >
                    <Link to="/profile/$userId" params={{ userId: 'placeholder' }}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Users className="w-16 h-16 mx-auto text-[oklch(0.70_0.06_320)]" />
              <div>
                <h3 className="text-xl font-semibold text-[oklch(0.35_0.08_320)] mb-2">
                  No profiles found
                </h3>
                <p className="text-[oklch(0.50_0.06_320)]">
                  Try adjusting your filters to see more community members.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
