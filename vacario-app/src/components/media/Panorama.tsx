"use client";

import { useEffect, useRef, useState } from "react";
import { Rotate3d } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Equirectangular 360° viewer. three.js is imported lazily so it never lands in
 * the initial bundle — pages that show no panorama never pay for it.
 */
export function Panorama({
  src,
  className,
  autoRotate = true,
  showHint = true,
}: {
  src: string;
  className?: string;
  autoRotate?: boolean;
  showHint?: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const THREE = await import("three");
        if (disposed || !mount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(74, mount.clientWidth / mount.clientHeight, 0.1, 1100);
        camera.position.set(0, 0, 0.1);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(500, 64, 40);
        geometry.scale(-1, 1, 1); // render the inside of the sphere

        const texture = await new Promise<InstanceType<typeof THREE.Texture>>((resolve, reject) => {
          new THREE.TextureLoader().load(src, resolve, undefined, reject);
        });
        if (disposed) {
          texture.dispose();
          renderer.dispose();
          return;
        }
        texture.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        setReady(true);

        let lon = 0;
        let lat = 0;
        let dragging = false;
        let interacted = false;
        let pointerX = 0;
        let pointerY = 0;
        let fov = 74;

        const onDown = (event: PointerEvent) => {
          dragging = true;
          interacted = true;
          pointerX = event.clientX;
          pointerY = event.clientY;
          renderer.domElement.setPointerCapture(event.pointerId);
        };
        const onMove = (event: PointerEvent) => {
          if (!dragging) return;
          lon -= (event.clientX - pointerX) * 0.16;
          lat += (event.clientY - pointerY) * 0.16;
          pointerX = event.clientX;
          pointerY = event.clientY;
        };
        const onUp = (event: PointerEvent) => {
          dragging = false;
          try {
            renderer.domElement.releasePointerCapture(event.pointerId);
          } catch {
            /* pointer already released */
          }
        };
        const onWheel = (event: WheelEvent) => {
          event.preventDefault();
          interacted = true;
          fov = Math.min(95, Math.max(35, fov + event.deltaY * 0.05));
          camera.fov = fov;
          camera.updateProjectionMatrix();
        };

        const el = renderer.domElement;
        el.style.touchAction = "none";
        el.style.cursor = "grab";
        el.addEventListener("pointerdown", onDown);
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointercancel", onUp);
        el.addEventListener("wheel", onWheel, { passive: false });

        const resize = () => {
          if (!mount.clientWidth || !mount.clientHeight) return;
          camera.aspect = mount.clientWidth / mount.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        const observer = new ResizeObserver(resize);
        observer.observe(mount);

        let frame = 0;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const render = () => {
          frame = requestAnimationFrame(render);
          if (autoRotate && !dragging && !interacted && !reduceMotion) lon += 0.035;
          lat = Math.max(-85, Math.min(85, lat));
          const phi = THREE.MathUtils.degToRad(90 - lat);
          const theta = THREE.MathUtils.degToRad(lon);
          camera.lookAt(
            500 * Math.sin(phi) * Math.cos(theta),
            500 * Math.cos(phi),
            500 * Math.sin(phi) * Math.sin(theta),
          );
          renderer.render(scene, camera);
        };
        render();

        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          el.removeEventListener("pointerdown", onDown);
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerup", onUp);
          el.removeEventListener("pointercancel", onUp);
          el.removeEventListener("wheel", onWheel);
          geometry.dispose();
          material.dispose();
          texture.dispose();
          renderer.dispose();
          if (el.parentNode === mount) mount.removeChild(el);
        };
      } catch (error) {
        console.error("[panorama]", error);
        if (!disposed) setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [src, autoRotate]);

  return (
    <div className={cn("relative overflow-hidden bg-ink-900", className)}>
      <div ref={mountRef} className="h-full w-full" />
      {failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="360 degree panorama" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      {!ready && !failed ? (
        <div className="absolute inset-0 grid place-items-center bg-ink-900 text-white/70">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Rotate3d className="h-4 w-4 animate-spin" /> Loading 360° view…
          </div>
        </div>
      ) : null}
      <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
        <Rotate3d className="h-3.5 w-3.5" /> 360°
      </span>
      {showHint && ready ? (
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur">
          Drag to look around · scroll to zoom
        </span>
      ) : null}
    </div>
  );
}
