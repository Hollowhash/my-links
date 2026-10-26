import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { AMAN, C, CardBG, F, Rise, Sumber, glass, ramp } from "../../lib";
import { Angka } from "../../kaca";

const AKSEN = "#D9482B";
const AKSEN_MUDA = "#F0834F";
const DASAR = "#CBD6E2";

const JUMLAH = 12;
const TEBAL = 0.3;

/** Kamera bergeser pelan supaya tumpukan koin terasa punya kedalaman. */
const Rig: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree();
  camera.position.set(Math.sin(t * 0.3) * 1.8, 1.6 + Math.sin(t * 0.24) * 0.3, 13.5);
  camera.lookAt(0, 0.1, 0);
  camera.updateProjectionMatrix();
  return null;
};

/** Satu koin, satu bulan iuran. */
const Koin: React.FC<{ t: number; at: number; i: number }> = ({ t, at, i }) => {
  const p = ramp(t, at, at + 0.42);
  const yAkhir = -2.3 + i * TEBAL;
  // Sebelum gilirannya, koin disimpan jauh di luar layar.
  const y = p === 0 ? 60 : 60 - p * (60 - yAkhir);
  // Mendarat sambil sedikit memantul.
  const pantul = p > 0.9 ? Math.sin((p - 0.9) * 31) * 0.12 : 0;
  return (
    <group position={[0, y + pantul, 0]} rotation={[0, i * 0.5, 0]}>
      <mesh>
        <cylinderGeometry args={[1.7, 1.7, TEBAL, 44]} />
        <meshStandardMaterial color={i % 2 === 0 ? AKSEN : AKSEN_MUDA} />
      </mesh>
    </group>
  );
};

const Panggung: React.FC<{ t: number; mulaiKoin: number; jeda: number }> = ({
  t,
  mulaiKoin,
  jeda,
}) => (
  <>
    <Rig t={t} />
    <ambientLight intensity={1.2} />
    <directionalLight position={[5, 10, 7]} intensity={1.8} />
    <directionalLight position={[-6, 2, 6]} intensity={0.5} color="#C9DAEB" />

    {/* Alas supaya tumpukan terasa berdiri di atas sesuatu */}
    <mesh position={[0, -2.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[4.4, 48]} />
      <meshStandardMaterial color={DASAR} />
    </mesh>

    {Array.from({ length: JUMLAH }).map((_, i) => (
      <Koin key={i} t={t} at={mulaiKoin + i * jeda} i={i} />
    ))}
  </>
);

/**
 * Momen utama episode 4: dua belas koin jatuh satu per satu, satu koin
 * untuk satu bulan iuran, sampai kelihatan jumlah setahunnya.
 */
export const Koin3D: React.FC<{
  T: number;
  mulai: number;
  selesai: number;
  atKali12: number;
}> = ({ T, mulai, selesai, atKali12 }) => {
  const { width, height } = useVideoConfig();
  const t = T - mulai;
  const mulaiKoin = atKali12 - mulai - 0.2;
  const jeda = 0.17;

  return (
    <AbsoluteFill>
      <CardBG />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 58, position: [0, 1.6, 13.5] }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Panggung t={t} mulaiKoin={mulaiKoin} jeda={jeda} />
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
              satu koin, satu bulan
            </div>
            <div
              style={{
                fontFamily: F.sans,
                fontWeight: 800,
                fontSize: 64,
                lineHeight: 1.08,
                color: C.navy,
                letterSpacing: "-0.02em",
              }}
            >
              Rp16.800{" "}
              <span style={{ color: C.aksen }}>
                × <Angka T={T} at={atKali12} dari={1} sampai={12} lama={JUMLAH * jeda} /> bulan
              </span>
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
        <div style={{ ...glass(0.96, 0, false), padding: 36, marginBottom: 18 }}>
          <div
            style={{
              fontFamily: F.sans,
              fontWeight: 800,
              fontSize: 72,
              lineHeight: 1.06,
              color: C.aksen,
              letterSpacing: "-0.02em",
            }}
          >
            Rp
            <Angka
              T={T}
              at={atKali12}
              dari={16800}
              sampai={201600}
              lama={JUMLAH * jeda + 0.3}
              ribuan
              gaya={{ fontVariantNumeric: "tabular-nums" }}
            />
          </div>
          <div style={{ marginTop: 12, fontFamily: F.sans, fontWeight: 700, fontSize: 40, color: C.navy }}>
            setahun
          </div>
        </div>
        <div
          style={{
            ...glass(0.96, 0, false),
            padding: 26,
            opacity: ramp(T, selesai - 2, selesai - 1.7),
          }}
        >
          <Sumber T={T} at={selesai - 1.9} teks="BPJS Ketenagakerjaan · iuran peserta BPU" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
