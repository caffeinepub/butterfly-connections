import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { Heart } from 'lucide-react';

export default function Landing() {
  const { login, loginStatus } = useAuth();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.98_0.02_320)] via-[oklch(0.96_0.03_340)] to-[oklch(0.94_0.04_360)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/assets/generated/butterfly-hero-bg.dim_1920x1080.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img
                src="/assets/generated/butterfly-connections-logo.dim_1024x256.png"
                alt="Butterfly Connections"
                className="h-16 md:h-20 w-auto"
              />
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-[oklch(0.35_0.08_320)] leading-tight">
              A Safe Space to Connect,
              <br />
              Share, and Grow
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-[oklch(0.45_0.06_320)] max-w-2xl mx-auto">
              Created by transgender people for transgender people — a cozy digital neighborhood where every part of your journey is seen, respected, and celebrated.
            </p>

            {/* CTA */}
            <div className="pt-8">
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="lg"
                className="bg-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.60_0.15_320)] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                {isLoggingIn ? 'Connecting...' : 'Join Our Community'}
              </Button>
              <p className="mt-4 text-sm text-[oklch(0.50_0.06_320)]">
                18+ only • Safe, affirming, and judgment-free
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[oklch(0.35_0.08_320)] mb-12">
            What You'll Find Here
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              title="Find Your Community"
              description="Connect with other trans, nonbinary, genderfluid, and questioning people who share similar experiences and understand your journey."
            />
            <FeatureCard
              title="Share Your Story"
              description="Express yourself freely in a space designed to be safe, affirming, and free from judgment. Your voice matters here."
            />
            <FeatureCard
              title="Build Friendships"
              description="Meet people who genuinely understand what it means to grow, transition, and transform. Build lasting connections."
            />
            <FeatureCard
              title="Connect with Mentors"
              description="Find mentors and peers who can offer support, advice, or simply a listening ear when you need it most."
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white/50 backdrop-blur-sm py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[oklch(0.35_0.08_320)]">
              Why Butterfly Connections?
            </h2>
            <p className="text-lg text-[oklch(0.45_0.06_320)] leading-relaxed">
              Like butterflies, we grow, shed old layers, and emerge brighter and more ourselves than ever. 
              Butterfly Connections is where those transformations are honored — and where you can connect 
              with others who are on their own beautiful path.
            </p>
            <p className="text-lg text-[oklch(0.45_0.06_320)] leading-relaxed">
              This is a space created by our community, for our community. Every feature, every guideline, 
              and every interaction is designed with your safety, dignity, and authenticity in mind.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[oklch(0.35_0.08_320)] text-white py-8">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="flex items-center justify-center gap-2">
            Built with <Heart className="w-4 h-4 fill-current text-[oklch(0.75_0.15_320)]" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[oklch(0.85_0.10_320)] transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-sm text-[oklch(0.70_0.08_320)]">
            © {new Date().getFullYear()} Butterfly Connections. A safe space for our community.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold text-[oklch(0.35_0.08_320)] mb-3">{title}</h3>
      <p className="text-[oklch(0.45_0.06_320)] leading-relaxed">{description}</p>
    </div>
  );
}
