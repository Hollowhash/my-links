import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { AMAN, C, CardBG, F, Mark, Rise, Sumber, glass, ramp } from "../lib";

const AKSEN = "#D9482B";
const PUTIH = "#FBFCFE";
const KERTAS = "#EEF2F7";
const ABU = "#AEBCCC";

/**
 * Kamera bergerak pelan ke kiri dan kanan. Pergeseran kecil ini yang
 * membuat benda terasa benar-benar tiga dimensi.
 */
const Rig: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree();
  const sudut = Math.sin(t * 0.42) * 0.14;
  camera.position.set(Math.sin(sudut) * 14, 0.4 + Math.sin(t * 0.3) * 0.3, Math.cos(sudut) * 14);
  camera.lookAt(0, 0.9, 0);
  camera.updateProjectionMatrix();
  return null;
};

/** Lembar kalender yang terkelupas ke belakang, satu per bulan. */
const Lembar: React.FC<{ t: number; at: number; i: number }> = ({ t, at, i }) => {
  const p = ramp(t, at, at + 0.8);
  if (p >= 1) return null;
  return (
    <group position={[0, 2.3, 0.3 + i * 0.06]}>
      <group rotation={[p * 2.6, 0, p * 0.26]} position={[0, 0, p * 5]}>
        <mesh position={[0, -2.3, 0]}>
          <boxGeometry args={[4.9, 4.6, 0.05]} />
          <meshStandardMaterial color={PUTIH} transparent opacity={1 - p * 0.75} />
        </mesh>
      </group>
    </group>
  );
};

/** Bukti biaya yang jatuh lalu menumpuk jadi satu berkas. */
const Bukti: React.FC<{ t: number; at: number; i: number }> = ({ t, at, i }) => {
  const p = ramp(t, at, at + 0.6);
  const yAkhir = -3.1 + i * 0.26;
  // Sebelum waktunya, benda disimpan jauh di luar layar.
  const y = p === 0 ? 60 : 60 - p * (60 - yAkhir);
  const miring = (i % 2 === 0 ? 1 : -1) * (0.04 + (i % 3) * 0.03);
  const x = (i % 2 === 0 ? -0.5 : 0.45) * (1 - p * 0.55);
  return (
    <group position={[x, y, i * 0.05]} rotation={[0, 0, miring * p]}>
      <mesh>
        <boxGeometry args={[5, 2.7, 0.1]} />
        <meshStandardMaterial color={PUTIH} />
      </mesh>
      <mesh position={[-1.7, 0.82, 0.07]}>
        <boxGeometry args={[1.4, 0.3, 0.03]} />
        <meshStandardMaterial color={AKSEN} />
      </mesh>
      {[0.25, -0.2, -0.62].map((dy, k) => (
        <mesh key={k} position={[0.15, dy, 0.07]}>
          <boxGeometry args={[3.7 - k * 0.6, 0.16, 0.03]} />
          <meshStandardMaterial color={ABU} />
        </mesh>
      ))}
    </group>
  );
};

const Panggung: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Rig t={t} />
    <ambientLight intensity={1.3} />
    <directionalLight position={[6, 10, 8]} intensity={1.9} />
    <directionalLight position={[-7, 1, 5]} intensity={0.6} color="#C9DAEB" />

    {/* Kalender */}
    <group position={[0, 3.3, 0]} rotation={[0, -0.16, 0]}>
      <mesh>
        <boxGeometry args={[5, 4.8, 0.36]} />
        <meshStandardMaterial color={KERTAS} />
      </mesh>
      <mesh position={[0, 1.95, 0.2]}>
        <boxGeometry args={[5, 0.95, 0.08]} />
        <meshStandardMaterial color={AKSEN} />
      </mesh>
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <mesh key={`${r}-${c}`} position={[-1.65 + c * 1.1, 0.75 - r * 1, 0.2]}>
            <boxGeometry args={[0.72, 0.6, 0.04]} />
            <meshStandardMaterial color={ABU} transparent opacity={0.7} />
          </mesh>
        )),
      )}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Lembar key={i} t={t} at={0.5 + i * 0.42} i={i} />
      ))}
    </group>

    {/* Tumpukan bukti */}
    <group position={[0, -0.9, 0]}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Bukti key={i} t={t} at={1.3 + i * 0.4} i={i} />
      ))}
    </group>
  </>
);

/**
 * Momen utama: kalender mundur bulan demi bulan sementara bukti biaya
 * menumpuk sendiri. Pesannya, nafkah yang dulu tidak hilang.
 */
export const Wow3D: React.FC<{ T: number; mulai: number; selesai: number }> = ({
  T,
  mulai,
  selesai,
}) => {
  const { width, height } = useVideoConfig();
  const t = T - mulai;

  return (
    <AbsoluteFill>
      <CardBG />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 58, position: [0, 0, 14] }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Panggung t={t} />
      </ThreeCanvas>

      <AbsoluteFill style={{ padding: `${AMAN.atas}px 82px 0`, pointerEvents: "none" }}>
        <Rise T={T} at={mulai + 0.1}>
          <div style={{ ...glass(0.96, 0, false), padding: 44 }}>
            <div
              style={{
                fontFamily: F.sans,
                fontWeight: 800,
                fontSize: 64,
                lineHeight: 1.12,
                color: C.navy,
                letterSpacing: "-0.015em",
              }}
            >
              Nafkah yang dulu{" "}
              <span style={{ color: C.aksen }}>
                <Mark T={T} at={mulai + 1.1}>
                  nggak hangus
                </Mark>
              </span>
            </div>
          </div>
        </Rise>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: `0 82px ${1920 - AMAN.bawah + 30}px`,
          pointerEvents: "none",
          opacity: ramp(T, selesai - 2.6, selesai - 2.2),
        }}
      >
        <div style={{ ...glass(0.96, 0, false), padding: 38 }}>
          <div
            style={{
              fontFamily: F.sans,
              fontWeight: 700,
              fontSize: 46,
              color: C.navy,
              marginBottom: 20,
            }}
          >
            Nafkah lampau bisa digugat
          </div>
          <Sumber T={T} at={selesai - 2.3} teks="SEMA 2/2019 · Mahkamah Agung" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
