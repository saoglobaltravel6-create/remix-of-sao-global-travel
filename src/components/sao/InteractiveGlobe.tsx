import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { DESTINATIONS, type Destination } from "@/lib/destinations";

type ThreeModule = typeof import("three");

function pointFromCoordinates(three: ThreeModule, lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new three.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export function InteractiveGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Destination>(DESTINATIONS[0]!);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let frame = 0;
    let cleanup = () => undefined;

    void import("three").then((three) => {
      if (disposed || !mount) return;
      const scene = new three.Scene();
      const camera = new three.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.z = 4.8;
      const renderer = new three.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const globe = new three.Group();
      scene.add(globe);
      globe.add(new three.Mesh(
        new three.SphereGeometry(1.55, 48, 48),
        new three.MeshStandardMaterial({ color: 0x0b2f62, roughness: 0.72, metalness: 0.1 }),
      ));
      globe.add(new three.Mesh(
        new three.SphereGeometry(1.58, 24, 24),
        new three.MeshBasicMaterial({ color: 0xf6c10d, wireframe: true, transparent: true, opacity: 0.12 }),
      ));

      const markers: { destination: Destination; mesh: import("three").Mesh }[] = [];
      DESTINATIONS.forEach((destination) => {
        const marker = new three.Mesh(
          new three.SphereGeometry(destination.iata === "NDJ" || destination.iata === "DSS" ? 0.055 : 0.036, 12, 12),
          new three.MeshBasicMaterial({ color: 0xf6c10d }),
        );
        marker.position.copy(pointFromCoordinates(three, destination.lat, destination.lng, 1.62));
        marker.userData = { iata: destination.iata };
        globe.add(marker);
        markers.push({ destination, mesh: marker });
      });

      scene.add(new three.AmbientLight(0xffffff, 1.5));
      const light = new three.DirectionalLight(0xffffff, 2.7);
      light.position.set(3, 2, 4);
      scene.add(light);

      const raycaster = new three.Raycaster();
      const pointer = new three.Vector2();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let dragging = false;
      let lastX = 0;

      const resize = () => {
        const rect = mount.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / Math.max(rect.height, 1);
        camera.updateProjectionMatrix();
      };
      const onPointerDown = (event: PointerEvent) => {
        dragging = true;
        lastX = event.clientX;
        renderer.domElement.setPointerCapture(event.pointerId);
      };
      const onPointerMove = (event: PointerEvent) => {
        if (!dragging) return;
        globe.rotation.y += (event.clientX - lastX) * 0.008;
        lastX = event.clientX;
      };
      const onPointerUp = (event: PointerEvent) => {
        if (Math.abs(event.clientX - lastX) < 5) {
          const rect = renderer.domElement.getBoundingClientRect();
          pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObjects(markers.map(({ mesh }) => mesh))[0];
          const destination = markers.find(({ mesh }) => mesh === hit?.object)?.destination;
          if (destination) setSelected(destination);
        }
        dragging = false;
      };
      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      renderer.domElement.addEventListener("pointermove", onPointerMove);
      renderer.domElement.addEventListener("pointerup", onPointerUp);
      window.addEventListener("resize", resize);
      resize();

      const animate = () => {
        if (!reduced && !dragging) globe.rotation.y += 0.0015;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        renderer.domElement.removeEventListener("pointermove", onPointerMove);
        renderer.domElement.removeEventListener("pointerup", onPointerUp);
        renderer.dispose();
        mount.replaceChildren();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  const chooseDestination = () => {
    window.dispatchEvent(new CustomEvent("sao:destination", { detail: selected.iata }));
    document.querySelector("#moteur")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="bg-sao-navy py-20 text-primary-foreground" aria-labelledby="interactive-globe-title">
      <div className="sao-container grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
        <div ref={mountRef} className="h-[420px] min-h-[320px] touch-none md:h-[560px]" aria-label="Globe 3D interactif des destinations SAO" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sao-gold">Réseau SAO</p>
          <h2 id="interactive-globe-title" className="mt-3 font-display text-4xl leading-none md:text-6xl">Le monde à portée de main.</h2>
          <p className="mt-5 text-primary-foreground/75">Faites tourner le globe et sélectionnez un point pour préparer votre destination dans le moteur Voyager.</p>
          <div className="mt-8 border-l-2 border-sao-gold pl-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-sao-gold"><MapPin className="size-4" /> {selected.iata}</p>
            <p className="mt-1 text-2xl font-bold">{selected.city}, {selected.country}</p>
            <p className="mt-2 text-sm text-primary-foreground/65">{selected.airport}</p>
          </div>
          <button type="button" onClick={chooseDestination} className="mt-7 rounded-full bg-sao-gold px-6 py-3 text-sm font-semibold text-sao-navy">Choisir cette destination</button>
        </div>
      </div>
    </section>
  );
}