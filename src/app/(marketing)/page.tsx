import Background from './_components/background';
import Community from './_components/community';
import Footer from './_components/footer';
import Header from './_components/header';
import Hero from './_components/hero';
import Support from './_components/support';
import UseCases from './_components/use-cases';
import WhySection from './_components/why-section';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-50">
      <div className="fixed inset-0 pointer-events-none">
        <Background />
      </div>

      <Header />
      <Hero />
      <WhySection />
      <UseCases />
      <Community />
      <Support />
      <Footer />
    </div>
  );
}
