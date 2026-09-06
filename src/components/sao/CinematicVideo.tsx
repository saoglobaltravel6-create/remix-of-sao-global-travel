import { useEffect, useRef, useState } from "react";
import type { VideoAsset } from "@/lib/media";

type Props = {
  asset: VideoAsset;
  /** Progression 0→1 pilotée par le scroll ; si absente, lecture en boucle. */
  progress?: number;
  className?: string;
  /** Objet-position CSS de la vidéo (cadrage). */
  objectPosition?: string;
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function useIsSmall() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setSmall(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return small;
}

/**
 * Vidéo cinématique : chargement différé à l'approche du viewport,
 * poster systématique en repli (absence de fichier, erreur, mobile bridé,
 * mouvement réduit), et progression optionnelle pilotée par le scroll.
 */
export function CinematicVideo({
  asset,
  progress,
  className = "",
  objectPosition = "center",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  const small = useIsSmall();

  const src = (small && asset.mobileSrc) || asset.src;
  const showVideo = Boolean(src) && !failed && !reduced && near;
  const scrubbed = progress !== undefined && !small;

  // Chargement uniquement à proximité de la section.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setNear(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Pause hors viewport pour éviter le décodage inutile.
  useEffect(() => {
    const node = wrapRef.current;
    const v = videoRef.current;
    if (!node || !v || scrubbed) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) void v.play().catch(() => undefined);
          else v.pause();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [showVideo, scrubbed]);

  // Progression liée au scroll (desktop uniquement, lissée).
  useEffect(() => {
    if (!scrubbed || !ready) return;
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    let raf = 0;
    const target = Math.min(Math.max(progress ?? 0, 0), 1) * (v.duration - 0.05);
    const step = () => {
      const current = v.currentTime;
      const next = current + (target - current) * 0.18;
      if (Math.abs(target - current) < 0.02) {
        v.currentTime = target;
        return;
      }
      v.currentTime = next;
      raf = requestAnimationFrame(step);
    };
    v.pause();
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [progress, scrubbed, ready]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <img
        src={asset.poster}
        alt={asset.description}
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition }}
        loading="lazy"
      />
      {showVideo && (
        <video
          ref={videoRef}
          src={src}
          poster={asset.poster}
          muted
          playsInline
          loop={!scrubbed}
          autoPlay={!scrubbed}
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onLoadedData={() => setReady(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition }}
        />
      )}
    </div>
  );
}
