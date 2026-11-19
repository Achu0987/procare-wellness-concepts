"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

export type WalkRoom = { side: number; img: string; room: string };
export type WalkDriver = { t: number; kick: () => void };

// One unit is 100 CSS pixels. The corridor is 17 wide, 10 tall; rooms are 15 apart.
const W = 17;
const H = 10;
const D = 15;
const STAND = 8.2;
const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const easeIn = (x: number) => x * x;

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export default function Walk3D({ rooms, endImg, driver }: { rooms: WalkRoom[]; endImg: string; driver: MutableRefObject<WalkDriver> }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (!window.matchMedia("(min-width: 60.0625rem) and (prefers-reduced-motion: no-preference)").matches) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);
    const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    const scene = new THREE.Scene();
    const paper = new THREE.Color("#f7f4ef");
    scene.background = paper;
    scene.fog = new THREE.Fog(paper, 14, 72);
    const camera = new THREE.PerspectiveCamera(53, el.clientWidth / el.clientHeight, 0.1, 200);

    const L = (rooms.length + 2) * D;
    const disposables: { dispose: () => void }[] = [];
    const plane = (w: number, h: number, mat: THREE.Material) => {
      const g = new THREE.PlaneGeometry(w, h);
      disposables.push(g, mat);
      const m = new THREE.Mesh(g, mat);
      scene.add(m);
      return m;
    };
    const mat = (map: THREE.Texture, transparent = false) => {
      map.anisotropy = aniso;
      disposables.push(map);
      return new THREE.MeshBasicMaterial({ map, transparent, toneMapped: false });
    };

    // floor: polished tiles with a soft sheen down the middle
    const floorTex = canvasTex(512, 512, (g) => {
      g.fillStyle = "#ece8e2";
      g.fillRect(0, 0, 512, 512);
      const s = g.createLinearGradient(0, 0, 512, 0);
      s.addColorStop(0, "rgba(255,255,255,0)");
      s.addColorStop(0.5, "rgba(255,255,255,0.35)");
      s.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = s;
      g.fillRect(0, 0, 512, 512);
      g.fillStyle = "#dcd6ce";
      g.fillRect(0, 0, 512, 3);
      g.fillRect(0, 0, 3, 512);
    });
    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(W / 2.4, L / 2.4);
    const floor = plane(W, L, mat(floorTex));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -H / 2, -L / 2 + 4);

    // ceiling: a run of light panels
    const ceilTex = canvasTex(256, 512, (g) => {
      g.fillStyle = "#fbfaf7";
      g.fillRect(0, 0, 256, 512);
      const glow = g.createLinearGradient(0, 0, 256, 0);
      glow.addColorStop(0.26, "rgba(214,240,238,0)");
      glow.addColorStop(0.36, "rgba(214,240,238,1)");
      glow.addColorStop(0.64, "rgba(214,240,238,1)");
      glow.addColorStop(0.74, "rgba(214,240,238,0)");
      g.fillStyle = glow;
      g.fillRect(0, 40, 256, 432);
      g.fillStyle = "#ffffff";
      g.fillRect(98, 70, 60, 372);
    });
    ceilTex.wrapT = THREE.RepeatWrapping;
    ceilTex.repeat.set(1, L / 6);
    const ceil = plane(W, L, mat(ceilTex));
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, H / 2, -L / 2 + 4);

    // walls: panels, a teal wayfinding stripe, a skirting board
    const wallTex = canvasTex(1024, 680, (g) => {
      const k = 680 / H;
      const bg = g.createLinearGradient(0, 0, 0, 680);
      bg.addColorStop(0, "#f8f6f2");
      bg.addColorStop(1, "#efebe5");
      g.fillStyle = bg;
      g.fillRect(0, 0, 1024, 680);
      g.fillStyle = "#e6e1da";
      for (let x = 0; x < 1024; x += 256) g.fillRect(x, 0, 3, 680);
      g.fillStyle = "#1e8c87";
      g.fillRect(0, 680 - 4.0 * k, 1024, 0.22 * k);
      g.fillStyle = "#7fd6cf";
      g.fillRect(0, 680 - 3.78 * k, 1024, 0.08 * k);
      g.fillStyle = "#ddd6cc";
      g.fillRect(0, 680 - 0.46 * k, 1024, 0.46 * k);
    });
    wallTex.wrapS = THREE.RepeatWrapping;
    wallTex.repeat.set(L / D, 1);
    const wallL = plane(L, H, mat(wallTex));
    wallL.rotation.y = Math.PI / 2;
    wallL.position.set(-W / 2, 0, -L / 2 + 4);
    const wallR = plane(L, H, mat(wallTex.clone()));
    (wallR.material as THREE.MeshBasicMaterial).map!.repeat.set(L / D, 1);
    (wallR.material as THREE.MeshBasicMaterial).map!.wrapS = THREE.RepeatWrapping;
    (wallR.material as THREE.MeshBasicMaterial).map!.needsUpdate = true;
    wallR.rotation.y = -Math.PI / 2;
    wallR.position.set(W / 2, 0, -L / 2 + 4);

    // a framed photograph per room, and a hanging sign
    let pending = 0;
    const loader = new THREE.ImageLoader();
    const framed = (src: string, w: number, h: number, onTex: (t: THREE.Texture) => void) => {
      pending++;
      loader.load(src, (img) => {
        const cw = 1000;
        const ch = Math.round((cw * h) / w);
        const t = canvasTex(cw, ch, (g) => {
          const r = 28, p = 14;
          g.fillStyle = "#ffffff";
          g.beginPath();
          g.roundRect(0, 0, cw, ch, r);
          g.fill();
          g.save();
          g.beginPath();
          g.roundRect(p, p, cw - 2 * p, ch - 2 * p, r - 10);
          g.clip();
          const ir = img.width / img.height, br = (cw - 2 * p) / (ch - 2 * p);
          let sw = img.width, sh = img.height, sx = 0, sy = 0;
          if (ir > br) { sw = img.height * br; sx = (img.width - sw) / 2; } else { sh = img.width / br; sy = (img.height - sh) / 2; }
          g.drawImage(img, sx, sy, sw, sh, p, p, cw - 2 * p, ch - 2 * p);
          g.restore();
        });
        onTex(t);
        pending--;
        kick();
      });
    };
    rooms.forEach((r, i) => {
      const z = -(i + 1) * D;
      const m = plane(10, 6.8, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, toneMapped: false }));
      m.position.set(r.side * 5.2, -0.2, z);
      m.rotation.y = -r.side * (28 * Math.PI) / 180;
      framed(r.img, 10, 6.8, (t) => {
        t.anisotropy = aniso;
        disposables.push(t);
        const mm = m.material as THREE.MeshBasicMaterial;
        mm.map = t;
        mm.opacity = 1;
        mm.needsUpdate = true;
      });

      const drawSign = (g: CanvasRenderingContext2D) => {
        g.clearRect(0, 0, 1040, 200);
        g.textAlign = "left";
        g.fillStyle = "#14234d";
        g.beginPath();
        g.roundRect(0, 0, 1040, 200, 32);
        g.fill();
        g.font = "700 68px Figtree, system-ui, sans-serif";
        g.textBaseline = "middle";
        g.fillStyle = "#7fd6cf";
        g.fillText(String(i + 1).padStart(2, "0"), 64, 104);
        g.fillStyle = "#fbfaf7";
        g.font = "600 68px Figtree, system-ui, sans-serif";
        g.fillText(r.room, 190, 104);
        g.fillStyle = "#7fd6cf";
        g.font = "600 72px Figtree, system-ui, sans-serif";
        g.textAlign = "right";
        g.fillText(r.side < 0 ? "←" : "→", 980, 100);
      };
      const sign = canvasTex(1040, 200, drawSign);
      // redraw once the brand font has loaded
      document.fonts?.ready.then(() => {
        const c = sign.image as HTMLCanvasElement;
        drawSign(c.getContext("2d")!);
        sign.needsUpdate = true;
        kick();
      });
      const s = plane(5.2, 1, mat(sign, true));
      s.position.set(r.side * 5.2, 4.2 - 0.5, z + 3.2);
      const rodMat = new THREE.MeshBasicMaterial({ color: "#d9d2c8" });
      for (const dx of [-2, 2]) {
        const rod = plane(0.04, 0.8, rodMat);
        rod.position.set(r.side * 5.2 + dx, 4.6, z + 3.2);
      }
    });

    // the end of the corridor opens onto a garden
    const end = plane(W, H, new THREE.MeshBasicMaterial({ color: "#f7f4ef", toneMapped: false }));
    end.position.set(0, 0, -(rooms.length + 1) * D);
    pending++;
    new THREE.TextureLoader().load(endImg, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = aniso;
      disposables.push(t);
      const a = t.image.width / t.image.height, b = W / H;
      if (a > b) { t.repeat.set(b / a, 1); t.offset.set((1 - b / a) / 2, 0); } else { t.repeat.set(1, a / b); t.offset.set(0, (1 - a / b) / 2); }
      const mm = end.material as THREE.MeshBasicMaterial;
      mm.map = t;
      mm.color.set("#ffffff");
      mm.needsUpdate = true;
      pending--;
      kick();
    });

    // camera path: stand in front of each room, then walk into the garden
    const stops = [{ z: 4, x: 0 }, ...rooms.map((r, i) => ({ z: -((i + 1) * D - STAND), x: r.side * 1.4 })), { z: -(rooms.length + 1) * D + 9.4, x: 0 }];
    const target = (t: number) => {
      const k = Math.max(0, Math.min(stops.length - 2, Math.floor(t)));
      const local = Math.max(0, Math.min(1, t - k));
      const e = k === stops.length - 2 ? easeIn(local) : ease(local);
      const a = stops[k], b = stops[k + 1];
      return { z: a.z + (b.z - a.z) * e, x: a.x + (b.x - a.x) * e };
    };
    const cam = { ...target(driver.current.t) };
    let raf = 0;
    const frame = () => {
      const goal = target(driver.current.t);
      cam.z += (goal.z - cam.z) * 0.12;
      cam.x += (goal.x - cam.x) * 0.12;
      camera.position.set(cam.x, 0, cam.z);
      // near the garden the fog lifts so the picture is clear
      const fog = scene.fog as THREE.Fog;
      const toEnd = Math.abs(cam.z - stops[stops.length - 1].z);
      fog.far = toEnd < 20 ? 72 + (20 - toEnd) * 6 : 72;
      fog.near = toEnd < 20 ? 14 + (20 - toEnd) * 2 : 14;
      renderer.render(scene, camera);
      if (Math.abs(goal.z - cam.z) > 0.002 || Math.abs(goal.x - cam.x) > 0.002) raf = requestAnimationFrame(frame);
      else raf = 0;
    };
    function kick() {
      if (!raf) raf = requestAnimationFrame(frame);
    }
    driver.current.kick = kick;

    const ro = new ResizeObserver(() => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      kick();
    });
    ro.observe(el);
    document.fonts?.ready.then(kick);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      driver.current.kick = () => {};
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      void pending;
    };
  }, [rooms, endImg, driver]);

  return <div ref={host} className="pc-walk-gl" aria-hidden="true" />;
}
