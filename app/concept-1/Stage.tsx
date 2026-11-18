"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// A soft, organic dissolve between two photographs: light moving across a room,
// not a slideshow wipe. Both images are cover-fitted and drift very slowly.
const frag = /* glsl */ `
precision highp float;
uniform sampler2D tA;
uniform sampler2D tB;
uniform vec2 uSizeA;
uniform vec2 uSizeB;
uniform vec2 uRes;
uniform float uP;
uniform float uTime;
varying vec2 vUv;

vec2 cover(vec2 uv, vec2 size, float zoom) {
  float rs = uRes.x / uRes.y;
  float ri = size.x / size.y;
  vec2 s = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  return (uv - 0.5) * s / zoom + 0.5;
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
void main() {
  float drift = 1.03 + 0.015 * sin(uTime * 0.12);
  vec2 uvA = cover(vUv, uSizeA, drift + 0.05 * uP);
  vec2 uvB = cover(vUv, uSizeB, drift + 0.05 * (1.0 - uP));
  vec4 a = texture2D(tA, uvA);
  vec4 b = texture2D(tB, uvB);
  float n = fbm(vUv * vec2(2.2, 3.0) + vec2(0.0, uTime * 0.015));
  float t = uP * 1.5 - 0.25;
  float m = smoothstep(t - 0.22, t + 0.22, n * 0.75 + (1.0 - vUv.y) * 0.25);
  m = 1.0 - m;
  gl_FragColor = mix(a, b, clamp(m, 0.0, 1.0));
}
`;

type Tex = { tex: THREE.Texture; w: number; h: number };

function Plane({ images, active, onReady }: { images: string[]; active: number; onReady: () => void }) {
  const { size, invalidate } = useThree();
  const texRef = useRef<(Tex | null)[]>([]);
  const shownRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const uniforms = useMemo(
    () => ({
      tA: { value: null as THREE.Texture | null },
      tB: { value: null as THREE.Texture | null },
      uSizeA: { value: new THREE.Vector2(1, 1) },
      uSizeB: { value: new THREE.Vector2(1, 1) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uP: { value: 0 },
      uTime: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let first = true;
    images.forEach((src, i) => {
      loader.load(src, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        const img = tex.image as HTMLImageElement;
        texRef.current[i] = { tex, w: img.width, h: img.height };
        if (i === 0 && first) {
          first = false;
          uniforms.tA.value = tex;
          uniforms.tB.value = tex;
          uniforms.uSizeA.value.set(img.width, img.height);
          uniforms.uSizeB.value.set(img.width, img.height);
          invalidate();
          onReady();
        }
      });
    });
    return () => texRef.current.forEach((t) => t?.tex.dispose());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const next = texRef.current[active];
    if (!next || active === shownRef.current) return;
    // Whatever is on screen now becomes the starting image.
    if (tweenRef.current && uniforms.uP.value > 0.5) {
      uniforms.tA.value = uniforms.tB.value;
      uniforms.uSizeA.value.copy(uniforms.uSizeB.value);
    }
    tweenRef.current?.kill();
    uniforms.tB.value = next.tex;
    uniforms.uSizeB.value.set(next.w, next.h);
    uniforms.uP.value = 0;
    shownRef.current = active;
    tweenRef.current = gsap.to(uniforms.uP, {
      value: 1,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        uniforms.tA.value = next.tex;
        uniforms.uSizeA.value.set(next.w, next.h);
        uniforms.uP.value = 0;
        tweenRef.current = null;
      },
    });
  }, [active, uniforms]);

  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
    uniforms.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthTest={false} />
    </mesh>
  );
}

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The fixed half of the page. DOM images are always present underneath (they are the
 * accessible, no-script and reduced-motion version); the WebGL layer fades in on top
 * once its first texture is ready.
 */
export default function Stage({ images, active, alts }: { images: string[]; active: number; alts: string[] }) {
  const [gl, setGl] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && canUseWebGL()) setGl(true);
  }, []);

  return (
    <div className="c1-stage-media">
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={i === active ? alts[i] : ""}
          aria-hidden={i === active ? undefined : true}
          className="c1-stage-img"
          data-on={i === active}
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "auto"}
        />
      ))}
      {gl && (
        <div className="c1-stage-gl" data-ready={ready} aria-hidden>
          <Canvas flat linear dpr={[1, 1.5]} gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}>
            <Plane images={images} active={active} onReady={() => setReady(true)} />
          </Canvas>
        </div>
      )}
    </div>
  );
}
