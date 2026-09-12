import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import flightVideo from "@/assets/video/sao-cloud-flight.mp4.asset.json";
import flightPoster from "@/assets/video/sao-cloud-flight-poster.jpg";
import { Button } from "@/components/ui/button";

function blockStyle(progress: number, start: number, end: number) {
  const edge = 0.08;
  const opacity = Math.min(1, Math.max(0, (progress - start) / edge), Math.max(0, (end - progress) / edge));
  return { opacity, transform: `translate3d(0, ${(1 - opacity) * 24}px, 0)`, pointerEvents: opacity > 0.6 ? "auto" as const : "none" as const };
}

export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [desktopMotion, setDesktopMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setDesktopMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    let current = 0;
    let target = 0;
    let active = true;
    const measure = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      target = Math.min(1, Math.max(0, -rect.top / distance));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const tick = () => {
      frame = 0;
      current += (target - current) * (desktopMotion ? 0.12 : 0.25);
      if (Math.abs(target - current) < 0.001) current = target;
      setProgress(current);
      const video = videoRef.current;
      if (desktopMotion && video && Number.isFinite(video.duration) && video.duration > 0) {
        const time = current * Math.max(0, video.duration - 0.05);
        if (Math.abs(video.currentTime - time) > 0.025) video.currentTime = time;
      }
      if (active && Math.abs(target - current) >= 0.001) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = Boolean(entry?.isIntersecting);
      if (active) measure();
    });
    observer.observe(section);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      active = false;
      observer.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [desktopMotion]);

  const dark = progress >= 0.62;

  return (
    <section ref={sectionRef} className="relative h-[500svh] bg-sao-ivory" data-nav-tone={dark ? "dark" : "light"}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <img src={flightPoster} alt="Avion de ligne survolant les nuages" width={1920} height={1080} className="absolute inset-0 size-full object-cover" />
        {desktopMotion && (
          <video ref={videoRef} src={flightVideo.url} poster={flightPoster} muted playsInline preload="auto" tabIndex={-1} aria-hidden="true" className="absolute inset-0 size-full object-cover" onLoadedMetadata={(event) => event.currentTarget.pause()} />
        )}
        <div className={`absolute inset-0 transition-colors duration-700 ${dark ? "bg-sao-navy/70" : "bg-background/15"}`} aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sao-navy/45 to-transparent" aria-hidden="true" />

        <div className="sao-container relative h-full">
          <div className="absolute inset-x-[18px] top-1/2 max-w-3xl -translate-y-1/2 transition-[opacity,transform] duration-300" style={blockStyle(progress, 0, 0.3)}>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-sao-navy">Connecter l'Afrique, ouvrir le monde</p>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.92] text-sao-navy md:text-7xl lg:text-8xl">LE MONDE<br /><span className="text-sao-gold">COMMENCE ICI</span></h1>
            <Button asChild className="mt-8 size-24 rounded-full bg-sao-navy p-0 text-primary-foreground hover:bg-sao-navy-soft">
              <Link to="/vols" aria-label="Réserver un vol"><span className="max-w-14 text-center text-[11px] leading-tight">Réserver un vol</span><ArrowRight className="size-4" /></Link>
            </Button>
          </div>

          <div className="absolute inset-x-[18px] top-1/2 mx-auto max-w-5xl -translate-y-1/2 text-center transition-[opacity,transform] duration-300" style={blockStyle(progress, 0.34, 0.63)}>
            <p className="text-3xl font-semibold leading-tight text-sao-navy md:text-5xl lg:text-6xl">Nous bâtissons des <span className="text-sao-gold">ponts durables</span> entre <span className="text-sao-red">l'Afrique</span> et le reste du monde</p>
            <ArrowDown className="mx-auto mt-10 size-6 text-sao-navy" aria-hidden="true" />
            <div className="mt-5 flex justify-center gap-2" aria-label="Étape 2 sur 3">{[0, 1, 2].map((dot) => <span key={dot} className={`size-2 rounded-full ${dot === 1 ? "bg-sao-gold" : "bg-sao-navy/30"}`} />)}</div>
          </div>

          <div className="absolute inset-x-[18px] top-1/2 ml-auto max-w-3xl -translate-y-1/2 text-right transition-[opacity,transform] duration-300" style={blockStyle(progress, 0.67, 1)}>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sao-gold">Voyagez. Connectez. Découvrez.</p>
            <h2 className="mt-5 text-5xl font-extrabold leading-[0.92] text-primary-foreground md:text-7xl lg:text-8xl">SAO GLOBAL<br />TRAVEL</h2>
            <Button asChild variant="outline" className="mt-8 h-14 rounded-full border-primary-foreground/60 bg-transparent px-7 text-primary-foreground hover:bg-primary-foreground hover:text-sao-navy">
              <Link to="/contact">Nous contacter <ArrowRight /></Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 h-px w-36 -translate-x-1/2 overflow-hidden bg-primary-foreground/30" aria-hidden="true"><span className="block h-full origin-left bg-sao-gold" style={{ transform: `scaleX(${progress})` }} /></div>
      </div>
    </section>
  );
}