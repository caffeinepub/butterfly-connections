import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useBrowseMentors } from '../hooks/useQueries';
import { Link } from '@tanstack/react-router';
import { Users } from 'lucide-react';

export default function Directory() {
  const [filterMentoring, setFilterMentoring] = useState(true);
  const [filterMentorship, setFilterMentorship] = useState(true);

  const { data: profiles, isLoading } = useBrowseMentors({
    mentoring: filterMentoring,
    mentorship: filterMentorship,
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
        <div className="grid md:grid-cols-2 gap-6">
          {profiles.map((profile, index) => (
            <Card
              key={index}
              className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)] hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/assets/generated/default-avatar-set.dim_1024x1024.png" />
                    <AvatarFallback className="bg-[oklch(0.65_0.15_320)] text-white">
                      {profile.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold text-[oklch(0.35_0.08_320)] text-lg">
                        {profile.displayName}
                      </h3>
                      {profile.pronouns && (
                        <p className="text-sm text-[oklch(0.50_0.06_320)]">{profile.pronouns}</p>
                      )}
                    </div>

                    {profile.bio && (
                      <p className="text-sm text-[oklch(0.45_0.06_320)] line-clamp-2">
                        {profile.bio}
                      </p>
                    )}

                    {profile.tags && profile.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {profile.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-[oklch(0.96_0.03_340)] text-[oklch(0.45_0.06_320)] rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs text-[oklch(0.50_0.06_320)]">
                      {profile.openToMentoring && <span>✓ Mentoring</span>}
                      {profile.seekingMentorship && <span>✓ Seeking mentorship</span>}
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mt-2 border-[oklch(0.65_0.15_320)] text-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.65_0.15_320)] hover:text-white"
                    >
                      <Link to="/profile/$userId" params={{ userId: 'placeholder' }}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Users className="w-16 h-16 mx-auto text-[oklch(0.65_0.15_320)]" />
              <p className="text-[oklch(0.45_0.06_320)]">
                No community members found with the selected filters. Try adjusting your search!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
