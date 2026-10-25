import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { AMAN, C, CardBG, F, Rise, Sumber, glass, ramp, springAt } from "../../lib";

const AKSEN = "#D9482B";
const PUTIH = "#FBFCFE";
const ABU = "#AEBCCC";

/** Kamera bergoyang sebentar waktu stempel mendarat. */
const Rig: React.FC<{ t: number; hantam: number }> = ({ t, hantam }) => {
  const { camera } = useThree();
  const d = t - hantam;
  const goyang = d >= 0 && d < 0.45 ? Math.sin(d * 70) * 0.45 * (1 - d / 0.45) : 0;
  camera.position.set(Math.sin(t * 0.32) * 1.1, 0.6 + goyang, 15);
  camera.lookAt(0, -0.6 + goyang * 0.25, 0);
  camera.updateProjectionMatrix();
  return null;
};

/** Cincin debu yang melebar sesaat setelah hantaman. */
const Debu: React.FC<{ t: number; hantam: number }> = ({ t, hantam }) => {
  const p = ramp(t, hantam, hantam + 0.6);
  if (p <= 0 || p >= 1) return null;
  return (
    <mesh position={[0.4, -2.2, 0.6]}>
      <ringGeometry args={[1.2 + p * 3.4, 1.45 + p * 3.8, 48]} />
      <meshBasicMaterial color="#FFFFFF" transparent opacity={(1 - p) * 0.5} />
    </mesh>
  );
};

const Panggung: React.FC<{ t: number; hantam: number }> = ({ t, hantam }) => {
  const turun = ramp(t, hantam - 0.5, hantam);
  const naikLagi = ramp(t, hantam + 0.4, hantam + 1.2);
  // Sebelum waktunya, stempel disimpan jauh di luar layar.
  const yStempel = turun === 0 ? 60 : 60 - turun * (60 - 0.1) + naikLagi * 9;
  const tekan = t >= hantam && t < hantam + 0.12 ? -0.25 : 0;
  const cap = ramp(t, hantam, hantam + 0.3);

  return (
    <>
      <Rig t={t} hantam={hantam} />
      <ambientLight intensity={1.3} />
      <directionalLight position={[5, 9, 8]} intensity={1.9} />
      <directionalLight position={[-6, 1, 6]} intensity={0.55} color="#C9DAEB" />

      {/* Berkas permohonan, berdiri menghadap kamera */}
      <group position={[0, -0.4, 0]} rotation={[-0.12, Math.sin(t * 0.3) * 0.06, 0.03]}>
        <mesh>
          <boxGeometry args={[6.4, 7.6, 0.2]} />
          <meshStandardMaterial color={PUTIH} />
        </mesh>
        {[2.6, 1.9, 1.2, 0.5, -0.2].map((dy, i) => (
          <mesh key={i} position={[-0.3, dy, 0.12]}>
            <boxGeometry args={[4.4 - i * 0.3, 0.2, 0.02]} />
            <meshStandardMaterial color={ABU} />
          </mesh>
        ))}
        {/* Cap yang tertinggal */}
        <group position={[0.4, -1.8, 0.13]} scale={[cap, cap, 1]}>
          <mesh>
            <ringGeometry args={[0.95, 1.25, 42]} />
            <meshBasicMaterial color={AKSEN} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[1.4, 0.24, 0.02]} />
            <meshBasicMaterial color={AKSEN} />
          </mesh>
        </group>
      </group>

      <Debu t={t} hantam={hantam} />

      {/* Stempel turun dari atas */}
      <group position={[0.4, yStempel + tekan, 1.3]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[1.35, 1.35, 0.6, 36]} />
          <meshStandardMaterial color={AKSEN} />
        </mesh>
        <mesh position={[0, 1.45, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 1.3, 24]} />
          <meshStandardMaterial color="#39414F" />
        </mesh>
        <mesh position={[0, 2.35, 0]}>
          <sphereGeometry args={[0.78, 28, 20]} />
          <meshStandardMaterial color="#2A3340" />
        </mesh>
      </group>
    </>
  );
};

/**
 * Momen utama episode 2: berkas yang sudah lengkap diketuk stempel
 * penetapan pengadilan.
 */
export const Stempel3D: React.FC<{
  T: number;
  mulai: number;
  selesai: number;
  hantamAt: number;
  atNegeri: number;
  atAgama: number;
}> = ({ T, mulai, selesai, hantamAt, atNegeri, atAgama }) => {
  const { width, height } = useVideoConfig();
  const t = T - mulai;
  const hantam = hantamAt - mulai;
  const kilat = ramp(T, hantamAt, hantamAt + 0.22);

  const chip = (teks: string, at: number) => {
    const m = springAt(T, at, 11);
    return (
      <div
        style={{
          flex: 1,
          padding: "26px 18px",
          borderRadius: 28,
          background: "rgba(255,255,255,0.96)",
          color: C.navy,
          fontFamily: F.sans,
          fontWeight: 800,
          fontSize: 38,
          textAlign: "center",
          opacity: ramp(T, at, at + 0.2),
          transform: `translateY(${(1 - m) * 26}px)`,
          boxShadow: "0 14px 30px rgba(30,38,56,0.18)",
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
        camera={{ fov: 58, position: [0, 1.4, 15.5] }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Panggung t={t} hantam={hantam} />
      </ThreeCanvas>

      <AbsoluteFill
        style={{ background: "#FFFFFF", opacity: (1 - kilat) * (t > hantam - 0.02 ? 0.55 : 0) }}
      />

      <AbsoluteFill style={{ padding: `${AMAN.atas}px 82px 0`, pointerEvents: "none" }}>
        <Rise T={T} at={mulai + 0.1}>
          <div style={{ ...glass(0.96, 0, false), padding: 42 }}>
            <div
              style={{
                fontFamily: F.sans,
                fontWeight: 800,
                fontSize: 62,
                lineHeight: 1.12,
                color: C.navy,
                letterSpacing: "-0.015em",
              }}
            >
              Ajukan penetapan ke pengadilan
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
        <div style={{ display: "flex", gap: 20, marginBottom: 22 }}>
          {chip("Pengadilan Negeri", atNegeri)}
          {chip("Pengadilan Agama", atAgama)}
        </div>
        <div
          style={{
            ...glass(0.96, 0, false),
            padding: 30,
            opacity: ramp(T, selesai - 1.9, selesai - 1.6),
          }}
        >
          <Sumber T={T} at={selesai - 1.8} teks="PP 54/2007 Pasal 20" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
