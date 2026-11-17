import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PythonPlayground from './components/PythonPlayground';
import type { ExternalCodeLoad } from './components/PythonPlayground';
import EcosystemSection from './components/EcosystemSection';
import GuideAndFaqSection from './components/GuideAndFaqSection';
import Footer from './components/Footer';

export default function App() {
  const [pythonVersion, setPythonVersion] = useState<string>('Python 3.10.12');
  const [externalLoad, setExternalLoad] = useState<ExternalCodeLoad | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { pythonVersion?: string } | null) => {
        if (mounted && data?.pythonVersion) {
          setPythonVersion(data.pythonVersion);
        }
      })
      .catch(() => {
        // Keep default fallback version label
      });

    return () => {
      mounted = false;
    };
  }, []);

  const scrollToSandbox = () => {
    const el = document.getElementById('sandbox');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLoadCodeToSandbox = (title: string, code: string) => {
    setExternalLoad({
      title,
      code,
      autoRun: true,
      nonce: Date.now(),
    });
    scrollToSandbox();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar onJumpToSandbox={scrollToSandbox} />

      <main className="flex-1">
        <HeroSection pythonVersion={pythonVersion} onJumpToSandbox={scrollToSandbox} />
        <PythonPlayground externalLoad={externalLoad} pythonVersion={pythonVersion} />
        <EcosystemSection onLoadCodeToSandbox={handleLoadCodeToSandbox} />
        <GuideAndFaqSection />
      </main>

      <Footer pythonVersion={pythonVersion} />
    </div>
  );
}
