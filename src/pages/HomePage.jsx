import { useRef, useState } from 'react';
import { Hero } from '../components/Hero';
import { ShareForm } from '../components/ShareForm';
import { PublicWall } from '../components/PublicWall';
import { HelpSection } from '../components/HelpSection';

export function HomePage() {
  const shareRef = useRef(null);
  const [wallRefresh, setWallRefresh] = useState(0);

  const scrollToShare = () => {
    shareRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Hero onCtaClick={scrollToShare} />
      <ShareForm sectionRef={shareRef} onSubmitted={() => setWallRefresh((k) => k + 1)} />
      <PublicWall refreshKey={wallRefresh} />
      <HelpSection />
    </>
  );
}
