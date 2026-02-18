import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Heart, Users, MessageCircle } from 'lucide-react';

export default function Guidelines() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[oklch(0.35_0.08_320)]">Community Guidelines</h1>
        <p className="text-[oklch(0.45_0.06_320)]">
          Our guidelines help keep Butterfly Connections a safe, welcoming space for everyone.
        </p>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-[oklch(0.65_0.15_320)]" />
            <CardTitle className="text-[oklch(0.35_0.08_320)]">Be Respectful and Kind</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-[oklch(0.45_0.06_320)]">
          <p>
            Treat every community member with dignity and respect. We're all on our own unique journeys, and this is a space to support one another.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Use people's correct names and pronouns</li>
            <li>Be patient and understanding with those who are questioning or exploring</li>
            <li>Celebrate differences and diverse experiences</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[oklch(0.65_0.15_320)]" />
            <CardTitle className="text-[oklch(0.35_0.08_320)]">Keep It Safe</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-[oklch(0.45_0.06_320)]">
          <p>
            This is an 18+ community, but we maintain strict standards for appropriate content and behavior.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>No harassment, bullying, or hate speech of any kind</li>
            <li>No sexually explicit content or nudity</li>
            <li>No sharing of personal information without consent</li>
            <li>No spam, scams, or commercial solicitation</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-[oklch(0.65_0.15_320)]" />
            <CardTitle className="text-[oklch(0.35_0.08_320)]">Foster Community</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-[oklch(0.45_0.06_320)]">
          <p>
            Help us build a supportive, affirming community where everyone can thrive.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Share your experiences authentically and honestly</li>
            <li>Offer support and encouragement to others</li>
            <li>Ask questions with genuine curiosity and openness</li>
            <li>Respect boundaries and consent in all interactions</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-[oklch(0.65_0.15_320)]" />
            <CardTitle className="text-[oklch(0.35_0.08_320)]">Reporting and Moderation</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-[oklch(0.45_0.06_320)]">
          <p>
            If you see content or behavior that violates these guidelines, please report it. Our moderation team reviews all reports and takes appropriate action.
          </p>
          <p>
            Violations may result in content removal, temporary suspension, or permanent ban depending on severity.
          </p>
          <p className="font-medium text-[oklch(0.35_0.08_320)] pt-2">
            Remember: This space exists because of our collective commitment to safety, respect, and authenticity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
