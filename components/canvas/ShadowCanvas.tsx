"use client";

import { useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, RoundedBox, MeshTransmissionMaterial, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import { GlassSettingsPanel, DEFAULT_SETTINGS } from "./GlassSettingsPanel";

export interface TileData {
  left: number | "50%+213";
  top: number;
  label: string;
  videoSrc?: string;
  color: string;
}

export interface SceneSettings {
  // Light
  lightAzimuth:        number; // degrees 0-360, default 225 (SW)
  lightAltitude:       number; // degrees 0-90,  default 12
  lightIntensity:      number; // 0-4,            default 1.5
  lightColor:          string; // hex,             default "#FFB347"
  // Shadow
  shadowOpacity:       number; // 0-1,            default 0.28
  shadowRadius:        number; // 1-16,            default 4
  // Glass
  transmission:        number; // 0-1,            default 1
  ior:                 number; // 1-3,             default 1.5
  roughness:           number; // 0-0.5,           default 0.05
  thickness:           number; // 0-20,            default 10
  chromaticAberration: number; // 0-0.2,           default 0.03
  // Extras
  useBrandColor:       boolean; // tint glass+pool,  default true
  glassCastShadow:     boolean; // ghost casters on/off, default false
}

function VideoIconPlane({ videoSrc, position }: { videoSrc: string; position: [number, number, number] }) {
  const texture = useVideoTexture(videoSrc, { start: true, loop: true, muted: true });
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function ColorIconPlane({ color, position }: { color: string; position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function IconPlane({ videoSrc, color, position }: {
  videoSrc?: string;
  color: string;
  position: [number, number, number];
}) {
  return videoSrc
    ? <VideoIconPlane videoSrc={videoSrc} position={position} />
    : <ColorIconPlane color={color} position={position} />;
}

function SunShadowScene({ tiles, settings: s }: { tiles: TileData[]; settings: SceneSettings }) {
  const { size } = useThree();
  const W = size.width;
  const H = size.height;

  // DOM → world coordinate helpers (origin at canvas centre)
  const wx = (domLeft: number, domWidth: number) => domLeft + domWidth / 2 - W / 2;
  const wz = (domTop: number, domHeight: number) => domTop + domHeight / 2 - H / 2;

  // Resolve "50%+213" sentinel to a pixel value using the Three.js canvas size
  const resolvedTiles = tiles.map((t) => ({
    ...t,
    leftPx: t.left === "50%+213" ? W / 2 + 213 : t.left,
  }));

  // Light position from azimuth/altitude
  const r2d = Math.PI / 180;
  const dist = 1384;
  const hDist = dist * Math.cos(s.lightAltitude * r2d);
  const lx = hDist * Math.sin(s.lightAzimuth * r2d);
  const ly = dist * Math.sin(s.lightAltitude * r2d);
  const lz = -hDist * Math.cos(s.lightAzimuth * r2d);

  return (
    <>
      <Environment preset="city" background={false} />

      <directionalLight
        castShadow
        position={[lx, ly, lz]}
        color={s.lightColor}
        intensity={s.lightIntensity}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-800}
        shadow-camera-right={800}
        shadow-camera-top={800}
        shadow-camera-bottom={-800}
        shadow-camera-near={1}
        shadow-camera-far={5000}
        shadow-bias={-0.001}
        shadow-radius={s.shadowRadius}
      />

      {/* Hemisphere light — sky/ground colour separation */}
      <hemisphereLight args={["#87CEEB", "#C2956C", 0.4]} />

      {/* Ground plane — receives shadows, invisible in colour */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3000, 3000]} />
        <shadowMaterial transparent opacity={s.shadowOpacity} />
      </mesh>

      {/* Icon planes — flat textures below each glass tile (y=1) */}
      {resolvedTiles.map(({ leftPx, top, label, videoSrc, color }) => (
        <IconPlane
          key={`icon-${label}`}
          videoSrc={videoSrc}
          color={color}
          position={[wx(leftPx, 64), -5, wz(top, 64)]}
        />
      ))}

      {/* Glass tiles — MeshTransmissionMaterial for true scene refraction */}
      {resolvedTiles.map(({ leftPx, top, label, color }) => (
        <RoundedBox
          key={label}
          args={[64, 12, 64]}
          radius={6}
          smoothness={4}
          position={[wx(leftPx, 64), 6, wz(top, 64)]}
        >
          <MeshTransmissionMaterial
            transmission={s.transmission}
            thickness={s.thickness}
            roughness={s.roughness}
            chromaticAberration={s.chromaticAberration}
            ior={s.ior}
            samples={6}
            backside={false}
            envMapIntensity={1.0}
            {...(s.useBrandColor ? { attenuationColor: color, attenuationDistance: 8 } : {})}
          />
        </RoundedBox>
      ))}

      {/* Invisible shadow casters — only rendered when glassCastShadow is enabled */}
      {s.glassCastShadow && resolvedTiles.map(({ leftPx, top, label }) => (
        <mesh
          key={`caster-${label}`}
          position={[wx(leftPx, 64), 6, wz(top, 64)]}
          castShadow
        >
          <boxGeometry args={[64, 12, 64]} />
          <meshBasicMaterial colorWrite={false} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

export function ShadowCanvas({ tiles }: { tiles: TileData[] }) {
  const [settings, setSettings] = useState<SceneSettings>(DEFAULT_SETTINGS);

  return (
    <>
      <Canvas
        orthographic
        shadows
        camera={{ position: [0, 800, 0], zoom: 1, up: [0, 0, -1] }}
        gl={{ alpha: true, antialias: false }}
        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.setClearAlpha(0);
        }}
      >
        <SunShadowScene tiles={tiles} settings={settings} />
      </Canvas>
      <GlassSettingsPanel settings={settings} onChange={setSettings} />
    </>
  );
}
