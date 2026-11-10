import { useCallback, useEffect, useState } from 'react';
import { ScrollTrigger } from './lib/gsap';
import { lockScroll, startSmoothScroll } from './lib/scroll';
import { Loader } from './components/Loader';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Education } from './components/Education';
import { Quests } from './components/Quests';
import { Inventory } from './components/Inventory';
import { Stages } from './components/Stages';
import { Achievements } from './components/Achievements';
import { Contact } from './components/Contact';
import { Footer, Marquee } from './components/Footer';
import { Konami } from './components/Konami';

export default function App() {
  const [booted, setBooted] = useState(false);
  const [crt, setCrt] = useState(() => {
    try {
      return localStorage.getItem('mx-crt') !== 'off';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const stop = startSmoothScroll();
    lockScroll(true);
    // layout settles after webfonts + images — re-measure every trigger then
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      stop();
      window.removeEventListener('load', refresh);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mx-crt', crt ? 'on' : 'off');
    } catch {
      /* ignore */
    }
  }, [crt]);

  const onBoot = useCallback(() => {
    setBooted(true);
    lockScroll(false);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <a href="#about" className="skip">
        Skip to content
      </a>
      {!booted && <Loader onDone={onBoot} />}
      <Nav crt={crt} onCrt={() => setCrt((c) => !c)} />
      <main>
        <Hero started={booted} />
        <About />
        <Education />
        <Quests />
        <Inventory />
        <Stages />
        <Marquee />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <Konami />
      {crt && <div className="crt" aria-hidden="true" />}
    </>
  );
}
