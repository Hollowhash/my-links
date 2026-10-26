import React from "react";
import * as THREE from "three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { AMAN, C, CardBG, F, Rise, Sumber, glass, ramp, springAt } from "../../lib";

const AKSEN = "#D9482B";
const NAVY = "#1E2638";

const R = 3.1;

/** Kamera bergeser pelan supaya dua lingkaran terasa melayang. */
const Rig: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree();
  camera.position.set(Math.sin(t * 0.3) * 1.5, 0.6 + Math.sin(t * 0.25) * 0.25, 13.5);
  camera.lookAt(0, -0.5, 0);
  camera.updateProjectionMatrix();
  return null;
};

/** Bentuk irisan dua lingkaran, dihitung dari jarak pusatnya. */
const bentukIrisan = (d: number) => {
  const sudut = Math.acos(Math.min(1, Math.max(-1, d / R)));
  const s = new THREE.Shape();
  s.absarc(-d, 0, R, -sudut, sudut, false);
  s.absarc(d, 0, R, Math.PI - sudut, Math.PI + sudut, false);
  return s;
};

const Panggung: React.FC<{ t: number; dekat: number; nyala: number }> = ({ t, dekat, nyala }) => {
  // Lingkaran bergerak saling mendekat sampai beririsan.
  const d = R * (1.08 - dekat * 0.54);
  const adaIrisan = d < R - 0.02;

  return (
    <>
      <Rig t={t} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 8, 8]} intensity={1.2} />

      <group position={[0, -0.5, 0]} rotation={[0.1, 0, 0]}>
        <mesh position={[-d, 0, 0]}>
          <circleGeometry args={[R, 72]} />
          <meshBasicMaterial color={NAVY} transparent opacity={0.16} />
        </mesh>
        <mesh position={[-d, 0, 0.01]}>
          <ringGeometry args={[R - 0.07, R, 72]} />
          <meshBasicMaterial color={NAVY} transparent opacity={0.55} />
        </mesh>

        <mesh position={[d, 0, 0]}>
          <circleGeometry args={[R, 72]} />
          <meshBasicMaterial color={NAVY} transparent opacity={0.16} />
        </mesh>
        <mesh position={[d, 0, 0.01]}>
          <ringGeometry args={[R - 0.07, R, 72]} />
          <meshBasicMaterial color={NAVY} transparent opacity={0.55} />
        </mesh>

        {adaIrisan ? (
          <mesh position={[0, 0, 0.03]}>
            <shapeGeometry args={[bentukIrisan(d)]} />
            <meshBasicMaterial color={AKSEN} transparent opacity={0.25 + nyala * 0.65} />
          </mesh>
        ) : null}
      </group>
    </>
  );
};

/**
 * Momen utama episode 5: dua lingkaran harta yang saling mendekat,
 * irisannya menyala sebagai harta bersama.
 */
export const Venn3D: React.FC<{
  T: number;
  mulai: number;
  selesai: number;
  atBersama: number;
  atMasingMasing: number;
}> = ({ T, mulai, selesai, atBersama, atMasingMasing }) => {
  const { width, height } = useVideoConfig();
  const t = T - mulai;
  const dekat = ramp(T, mulai + 0.3, atBersama);
  const nyala = ramp(T, atBersama, atBersama + 0.5);

  const chip = (teks: string, at: number) => {
    const m = springAt(T, at, 11);
    return (
      <div
        style={{
          flex: 1,
          padding: "20px 14px",
          borderRadius: 26,
          background: "rgba(255,255,255,0.96)",
          color: C.navy,
          fontFamily: F.sans,
          fontWeight: 800,
          fontSize: 36,
          textAlign: "center",
          opacity: ramp(T, at, at + 0.2),
          transform: `translateY(${(1 - m) * 24}px)`,
          boxShadow: "0 12px 26px rgba(30,38,56,0.16)",
        }}
      >
        {teks}
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <CardBG />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 58, position: [0, 0.6, 13.5] }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Panggung t={t} dekat={dekat} nyala={nyala} />
      </ThreeCanvas>

      <AbsoluteFill style={{ padding: `${AMAN.atas}px 82px 0`, pointerEvents: "none" }}>
        <Rise T={T} at={mulai + 0.1}>
          <div style={{ ...glass(0.96, 0, false), padding: 40 }}>
            <div
              style={{
                fontFamily: F.mono,
                fontWeight: 600,
                fontSize: 28,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.kedua,
                marginBottom: 14,
              }}
            >
              faktanya
            </div>
            <div
              style={{
                fontFamily: F.sans,
                fontWeight: 800,
                fontSize: 60,
                lineHeight: 1.1,
                color: C.navy,
                letterSpacing: "-0.015em",
              }}
            >
              Harta yang didapat selama nikah jadi{" "}
              <span style={{ color: C.aksen }}>harta bersama</span>
            </div>
          </div>
        </Rise>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: `0 82px ${1920 - AMAN.bawah + 20}px`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.kedua,
            marginBottom: 14,
            opacity: ramp(T, atMasingMasing - 0.3, atMasingMasing),
          }}
        >
          tetap milik masing-masing
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
          {chip("bawaan", atMasingMasing)}
          {chip("hadiah", atMasingMasing + 0.5)}
          {chip("warisan", atMasingMasing + 1)}
        </div>
        <div
          style={{
            ...glass(0.96, 0, false),
            padding: 26,
            opacity: ramp(T, selesai - 1.9, selesai - 1.6),
          }}
        >
          <Sumber T={T} at={selesai - 1.8} teks="UU 1/1974 Pasal 35" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
