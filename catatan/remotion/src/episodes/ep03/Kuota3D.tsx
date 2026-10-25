import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { AMAN, C, CardBG, F, Rise, Sumber, glass, ramp, springAt } from "../../lib";

const AKSEN = "#D9482B";
const ABU = "#B9C5D4";
const ABU_TUA = "#93A2B5";

const BARIS = 10;
const KOLOM = 10;
const JARAK = 0.68;

/** Kamera bergeser pelan supaya barisan orang terasa punya kedalaman. */
const Rig: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree();
  camera.position.set(Math.sin(t * 0.3) * 1.6, 0.9 + Math.sin(t * 0.22) * 0.25, 14);
  camera.lookAt(0, -0.2, 0);
  camera.updateProjectionMatrix();
  return null;
};

/** Satu karyawan. Yang masuk hitungan kuota berdiri lebih tinggi dan berwarna. */
const Orang: React.FC<{
  x: number;
  y: number;
  muncul: number;
  nyala: number;
}> = ({ x, y, muncul, nyala }) => {
  // Sebelum gilirannya, orangnya disimpan jauh di luar layar.
  const yPakai = muncul === 0 ? 60 : y - (1 - muncul) * 4;
  const warna = nyala > 0.5 ? AKSEN : ABU;
  const angkat = nyala * 0.34;
  return (
    <group position={[x, yPakai + angkat, nyala * 0.5]} scale={[1, 1, 1]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.21, 0.42, 10]} />
        <meshStandardMaterial color={warna} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <sphereGeometry args={[0.16, 14, 10]} />
        <meshStandardMaterial color={nyala > 0.5 ? AKSEN : ABU_TUA} />
      </mesh>
    </group>
  );
};

const Panggung: React.FC<{ t: number; dua: number; satu: number }> = ({ t, dua, satu }) => {
  const orang = [];
  for (let r = 0; r < BARIS; r++) {
    for (let c = 0; c < KOLOM; c++) {
      const i = r * KOLOM + c;
      const x = (c - (KOLOM - 1) / 2) * JARAK;
      const y = -0.5 + ((BARIS - 1) / 2 - r) * JARAK;
      const muncul = ramp(t, 0.15 + (r + c) * 0.035, 0.5 + (r + c) * 0.035);
      // Dua orang di tengah dipakai untuk menunjukkan dua persen,
      // lalu satu di antaranya padam waktu giliran satu persen.
      let nyala = 0;
      if (i === 44) nyala = Math.max(dua, satu);
      if (i === 45) nyala = Math.max(0, dua - satu);
      orang.push(<Orang key={i} x={x} y={y} muncul={muncul} nyala={nyala} />);
    }
  }

  return (
    <>
      <Rig t={t} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[5, 9, 8]} intensity={1.6} />
      <directionalLight position={[-6, 2, 6]} intensity={0.5} color="#C9DAEB" />
      {orang}
    </>
  );
};

/**
 * Momen utama episode 3: seratus karyawan berdiri sebagai barisan,
 * lalu yang masuk hitungan kuota menyala.
 */
export const Kuota3D: React.FC<{
  T: number;
  mulai: number;
  selesai: number;
  atDua: number;
  atSatu: number;
}> = ({ T, mulai, selesai, atDua, atSatu }) => {
  const { width, height } = useVideoConfig();
  const t = T - mulai;
  const dua = ramp(T, atDua, atDua + 0.4);
  const satu = ramp(T, atSatu, atSatu + 0.4);

  const chip = (judul: string, nilai: string, at: number, aktif: boolean) => {
    const m = springAt(T, at, 11);
    return (
      <div
        style={{
          flex: 1,
          padding: "22px 18px",
          borderRadius: 30,
          background: aktif ? C.aksen : "rgba(255,255,255,0.96)",
          color: aktif ? "#FFFFFF" : C.navy,
          textAlign: "center",
          opacity: ramp(T, at, at + 0.2),
          transform: `translateY(${(1 - m) * 26}px)`,
          boxShadow: "0 14px 30px rgba(30,38,56,0.18)",
        }}
      >
        <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 52 }}>{nilai}</div>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginTop: 8,
            opacity: 0.85,
          }}
        >
          {judul}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <CardBG />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 58, position: [0, 0.9, 14] }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Panggung t={t} dua={dua} satu={satu} />
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
              dari tiap 100 karyawan
            </div>
            <div
              style={{
                fontFamily: F.sans,
                fontWeight: 800,
                fontSize: 62,
                lineHeight: 1.1,
                color: C.navy,
                letterSpacing: "-0.015em",
              }}
            >
              Wajib ada karyawan disabilitas
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
        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          {chip("pemerintah, BUMN, BUMD", "2%", atDua, satu < 0.5)}
          {chip("swasta", "1%", atSatu, satu >= 0.5)}
        </div>
        <div
          style={{
            ...glass(0.96, 0, false),
            padding: 28,
            opacity: ramp(T, selesai - 2.2, selesai - 1.9),
          }}
        >
          <Sumber T={T} at={selesai - 2.1} teks="UU 8/2016 Pasal 53" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
