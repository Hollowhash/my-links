import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MONO, SANS } from "./fonts";

// ---------------------------------------------------------------- warna, font

export const C = {
  bg1: "#E6ECF2",
  bg2: "#DCE4EC",
  navy: "#1E2638",
  putih: "#FFFFFF",
  aksen: "#D9482B",
  stabilo: "#FCE3DD",
  kedua: "#5B667D",
};

export const F = { sans: SANS, mono: MONO };

/** Area aman layar HP. Konten di y 130 sampai 1400, sisanya untuk caption dan tombol. */
export const AMAN = { atas: 130, bawah: 1400, capPad: 395, kananBawah: 120 };

// ------------------------------------------------------------------- waktu

/** Detik absolut di dalam sebuah scene yang dimulai pada detik `start`. */
export const useT = (start: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return start + frame / fps;
};

/** 0 sampai 1 antara detik a dan b, pelan di ujung. */
export const ramp = (T: number, a: number, b: number) =>
  interpolate(T, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

/** Pantulan lembut yang mulai pada detik `at`. */
export const springAt = (T: number, at: number, damping = 14) => {
  const fps = 30;
  return spring({
    frame: Math.max(0, (T - at) * fps),
    fps,
    config: { damping, mass: 0.6 },
  });
};

// ------------------------------------------------------------------ bahan

export const glass = (alpha = 0.9, blur = 0, backdrop = false): React.CSSProperties => ({
  background: `rgba(255,255,255,${alpha})`,
  ...(backdrop ? { backdropFilter: `blur(${blur}px)` } : {}),
  borderRadius: 48,
  boxShadow: "0 30px 70px rgba(30,38,56,0.16), 0 4px 14px rgba(30,38,56,0.06)",
});

/** Latar terang statis. Kartu diletakkan di atas ini, bukan memakai backdrop-filter. */
export const CardBG: React.FC = () => (
  <AbsoluteFill
    style={{ background: `linear-gradient(160deg, ${C.bg1} 0%, ${C.bg2} 100%)` }}
  />
);

/** Butiran film tipis supaya gambar tidak terasa datar. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => {
  const frame = useCurrentFrame();
  const geser = Math.floor(random(`g${Math.floor(frame / 2)}`) * 100);
  return (
    <AbsoluteFill
      style={{
        opacity,
        pointerEvents: "none",
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>\")",
        backgroundPosition: `${geser}px ${geser * 1.7}px`,
        mixBlendMode: "overlay",
      }}
    />
  );
};

// ------------------------------------------------------------------- teks

/** Stabilo peach yang menyapu di belakang kata. */
export const Mark: React.FC<{
  T: number;
  at: number;
  children: React.ReactNode;
  warna?: string;
}> = ({ T, at, children, warna = C.stabilo }) => {
  const sapu = ramp(T, at, at + 0.42);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          left: "-0.09em",
          right: "-0.09em",
          bottom: "0.02em",
          height: "0.56em",
          background: warna,
          borderRadius: 8,
          transform: `scaleX(${sapu}) rotate(-0.8deg)`,
          transformOrigin: "left center",
        }}
      />
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
};

/** Coretan untuk kata yang dibatalkan, misalnya label MITOS. */
export const Strike: React.FC<{
  T: number;
  at: number;
  children: string;
  tebal?: number;
}> = ({ T, at, children, tebal = 8 }) => {
  const kata = children.split(" ");
  return (
    <>
      {kata.map((k, i) => {
        const garis = ramp(T, at + i * 0.045, at + i * 0.045 + 0.26);
        return (
          <span key={i} style={{ position: "relative", display: "inline-block" }}>
            <span>{k}</span>
            <span
              style={{
                position: "absolute",
                left: "-0.04em",
                right: "-0.04em",
                top: "54%",
                height: tebal,
                borderRadius: tebal,
                background: C.aksen,
                transform: `scaleX(${garis}) rotate(-1deg)`,
                transformOrigin: "left center",
              }}
            />
            {i < kata.length - 1 ? "\u00A0" : null}
          </span>
        );
      })}
    </>
  );
};

/** Muncul sambil naik sedikit. */
export const Rise: React.FC<{
  T: number;
  at: number;
  lama?: number;
  jauh?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ T, at, lama = 0.45, jauh = 34, children, style }) => {
  const m = ramp(T, at, at + lama);
  return (
    <div style={{ ...style, opacity: m, transform: `translateY(${(1 - m) * jauh}px)` }}>
      {children}
    </div>
  );
};

/** Teks besar yang muncul kata demi kata. */
export const KataDemiKata: React.FC<{
  T: number;
  at: number;
  teks: string;
  jeda?: number;
  style?: React.CSSProperties;
}> = ({ T, at, teks, jeda = 0.07, style }) => (
  <div style={style}>
    {teks.split(" ").map((kata, i) => {
      const m = ramp(T, at + i * jeda, at + i * jeda + 0.34);
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: m,
            transform: `translateY(${(1 - m) * 26}px)`,
          }}
        >
          {kata}
          {i < teks.split(" ").length - 1 ? " " : null}
        </span>
      );
    })}
  </div>
);

/** Label "catatan N dari M" dengan lingkaran nomor dan titik progres. */
export const CatatanLabel: React.FC<{
  T: number;
  at: number;
  n: number;
  dari: number;
  judul?: string;
}> = ({ T, at, n, dari, judul = "catatan" }) => {
  const pop = springAt(T, at, 11);
  const label = ramp(T, at + 0.12, at + 0.5);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: `linear-gradient(140deg, #F06A43 0%, ${C.aksen} 72%)`,
          color: C.putih,
          fontFamily: F.sans,
          fontWeight: 800,
          fontSize: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 26px rgba(217,72,43,0.3)",
          transform: `scale(${0.55 + pop * 0.45})`,
        }}
      >
        {n}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: label,
          transform: `translateX(${(1 - label) * -16}px)`,
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.kedua,
          }}
        >
          {judul} {n} dari {dari}
        </div>
        <div style={{ display: "flex", gap: 9 }}>
          {Array.from({ length: dari }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i + 1 === n ? 18 + ramp(T, at + 0.2, at + 0.7) * 26 : 18,
                height: 9,
                borderRadius: 5,
                background: i + 1 === n ? C.aksen : "rgba(30,38,56,0.14)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/** Sumber dalam huruf mono, kecil tapi masih terbaca di HP. */
export const Sumber: React.FC<{ T: number; at: number; teks: string }> = ({ T, at, teks }) => (
  <Rise T={T} at={at} jauh={14}>
    <div
      style={{
        fontFamily: F.mono,
        fontWeight: 500,
        fontSize: 28,
        lineHeight: 1.35,
        color: C.kedua,
        borderLeft: `4px solid ${C.aksen}`,
        paddingLeft: 18,
      }}
    >
      {teks}
    </div>
  </Rise>
);

// ----------------------------------------------------------------- footage

export type Plat = { t0: number; t1: number; x: number; y: number; w: number; h: number };

const gradeFootage = "contrast(1.06) saturate(0.92)";

/** Lapisan gelap di atas dan bawah plus vignette, supaya teks tetap terbaca. */
const TutupFootage: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(30,38,56,0.42) 0%, rgba(30,38,56,0) 26%, rgba(30,38,56,0) 58%, rgba(30,38,56,0.58) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, rgba(30,38,56,0) 52%, rgba(30,38,56,0.34) 100%)",
      }}
    />
  </>
);

/**
 * Potongan klip Google Flow. Selalu dibisukan: klip kadang punya suara orang.
 * `plates` menutup plat nomor atau tulisan dengan salinan video yang diburamkan.
 */
export const Clip: React.FC<{
  clip: string;
  srcStart?: number;
  rate?: number;
  zoom?: [number, number];
  geser?: [number, number];
  dur: number;
  T: number;
  mulai: number;
  plates?: Plat[];
  shakeAt?: number[];
  blur?: number;
}> = ({ clip, srcStart = 0, rate = 1, zoom = [1.06, 1.14], geser = [0, 0], dur, T, mulai, plates, shakeAt, blur = 0 }) => {
  const { fps } = useVideoConfig();
  const t = T - mulai;
  const z = interpolate(t, [0, dur], zoom, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gx = interpolate(t, [0, dur], geser, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let guncang = 0;
  for (const s of shakeAt ?? []) {
    const d = t - s;
    if (d >= 0 && d < 0.42) guncang += Math.sin(d * 58) * 16 * (1 - d / 0.42);
  }

  const src = staticFile(`clips/${clip}`);
  const isi: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: `${gradeFootage}${blur ? ` blur(${blur}px)` : ""}`,
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.navy }}>
      <AbsoluteFill
        style={{ transform: `scale(${z}) translateX(${gx + guncang}px)` }}
      >
        <OffthreadVideo
          src={src}
          trimBefore={Math.round(srcStart * fps)}
          playbackRate={rate}
          muted
          style={isi}
        />
        {(plates ?? []).map((p, i) => {
          const tampil = t >= p.t0 && t <= p.t1;
          if (!tampil) return null;
          // Salinan video yang diburamkan, dipotong tepat di kotak plat.
          const kiri = (p.x / 720) * 100;
          const atas = (p.y / 1280) * 100;
          const lebar = (p.w / 720) * 100;
          const tinggi = (p.h / 1280) * 100;
          return (
            <AbsoluteFill
              key={i}
              style={{
                clipPath: `inset(${atas}% ${100 - kiri - lebar}% ${100 - atas - tinggi}% ${kiri}%)`,
              }}
            >
              <OffthreadVideo
                src={src}
                trimBefore={Math.round(srcStart * fps)}
                playbackRate={rate}
                muted
                style={{ ...isi, filter: `${gradeFootage} blur(18px)` }}
              />
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>
      <TutupFootage />
      <Grain opacity={0.07} />
    </AbsoluteFill>
  );
};

/** Foto diam dengan gerak kamera pelan. */
export const Foto: React.FC<{
  file: string;
  dur: number;
  T: number;
  mulai: number;
  zoom?: [number, number];
  geser?: [number, number];
  naik?: [number, number];
  tutup?: boolean;
}> = ({ file, dur, T, mulai, zoom = [1.05, 1.16], geser = [0, 0], naik = [0, 0], tutup = true }) => {
  const t = T - mulai;
  const opsi = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const z = interpolate(t, [0, dur], zoom, opsi);
  const gx = interpolate(t, [0, dur], geser, opsi);
  const gy = interpolate(t, [0, dur], naik, opsi);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.navy }}>
      <AbsoluteFill style={{ transform: `scale(${z}) translate(${gx}px, ${gy}px)` }}>
        <Img
          src={staticFile(`photos/${file}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: gradeFootage }}
        />
      </AbsoluteFill>
      {tutup ? <TutupFootage /> : null}
      <Grain opacity={0.07} />
    </AbsoluteFill>
  );
};

/** Zoom-blur singkat di batas scene. */
export const SceneFX: React.FC<{
  T: number;
  mulai: number;
  selesai: number;
  children: React.ReactNode;
}> = ({ T, mulai, selesai, children }) => {
  // Scene pertama langsung tajam di frame 0, supaya bisa dipakai jadi sampul.
  const masuk = mulai <= 0.001 ? 1 : ramp(T, mulai, mulai + 0.3);
  const keluar = ramp(T, selesai - 0.3, selesai);
  const skala = 1 + (1 - masuk) * 0.045 + keluar * 0.035;
  const buram = (1 - masuk) * 10 + keluar * 8;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${skala})`,
        filter: buram > 0.3 ? `blur(${buram}px)` : undefined,
        opacity: Math.min(masuk + 0.15, 1) * (1 - keluar * 0.9),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Kartu putih standar "Catatan". */
export const Kartu: React.FC<{
  T: number;
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  pad?: number;
}> = ({ T, at, children, style, pad = 56 }) => {
  const m = springAt(T, at, 18);
  return (
    <div
      style={{
        ...glass(1, 0, false),
        padding: pad,
        transform: `translateY(${(1 - m) * 46}px) scale(${0.97 + m * 0.03})`,
        opacity: ramp(T, at, at + 0.3),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
