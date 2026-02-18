import HelloCornerSection from '@/components/helloCorner/HelloCornerSection';

export default function Feed() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[oklch(0.35_0.08_320)]">Community Feed</h1>
        <p className="text-[oklch(0.45_0.06_320)] max-w-2xl mx-auto">
          Share your story, connect with others, and celebrate your journey in our safe and affirming space.
        </p>
      </div>

      <HelloCornerSection />
    </div>
  );
}
