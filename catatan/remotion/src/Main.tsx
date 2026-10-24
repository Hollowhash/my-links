import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BadgePercent,
  Gavel,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  Landmark,
  MessageSquare,
  Scale,
  Stethoscope,
  Wallet,
} from "lucide-react";
import "./fonts";
import { AMAN, C, CardBG, F, KataDemiKata, Kartu, Mark, Rise, SceneFX, glass, ramp, springAt } from "./lib";
import { Isi, KartuFakta, KartuMitos, Pil } from "./scenes/dasar";
import { AdeganFoto, AdeganKlip } from "./scenes/Footage";
import { Hook1, Hook2 } from "./scenes/Hook";
import { Wow3D } from "./scenes/Wow3D";
import { CTA, Komentar, Penutup } from "./scenes/Penutup";
import { Captions } from "./Captions";
import { kapan } from "./vo";
import timeline from "./timeline.json";

const IK = { size: 40, strokeWidth: 2.4 };

type Adegan = { id: string; mulai: number; selesai: number };
const SCENES = timeline.scenes as Adegan[];
const ambil = (id: string) => SCENES.find((s) => s.id === id) as Adegan;

/** Kartu kecil yang menumpang di atas footage. */
const KartuAtasFootage: React.FC<{
  T: number;
  at: number;
  judul: string;
  catatan?: string;
  bawah?: boolean;
}> = ({ T, at, judul, catatan, bawah = true }) => (
  <AbsoluteFill
    style={{
      justifyContent: bawah ? "flex-end" : "flex-start",
      padding: bawah ? `0 82px ${1920 - AMAN.bawah + 30}px` : `${AMAN.atas}px 82px 0`,
    }}
  >
    <Rise T={T} at={at}>
      <div style={{ ...glass(0.96, 0, false), padding: 42 }}>
        <div
          style={{
            fontFamily: F.sans,
            fontWeight: 800,
            fontSize: 58,
            lineHeight: 1.14,
            color: C.navy,
            letterSpacing: "-0.015em",
          }}
        >
          {judul}
        </div>
        {catatan ? (
          <div
            style={{
              marginTop: 18,
              fontFamily: F.mono,
              fontWeight: 500,
              fontSize: 28,
              color: C.kedua,
            }}
          >
            {catatan}
          </div>
        ) : null}
      </div>
    </Rise>
  </AbsoluteFill>
);

/** Kartu judul: empat mitos yang mau diluruskan. */
const Judul4: React.FC<{ T: number; mulai: number }> = ({ T, mulai }) => (
  <AbsoluteFill>
    <CardBG />
    <Isi>
      <Kartu T={T} at={mulai} style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        <Pil T={T} at={mulai + 0.05} teks="mitos atau fakta" />
        <div
          style={{
            fontFamily: F.sans,
            fontWeight: 800,
            fontSize: 78,
            lineHeight: 1.1,
            color: C.navy,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: C.aksen }}>
            <Mark T={T} at={mulai + 0.2}>
              4 mitos
            </Mark>
          </span>{" "}
          soal nafkah anak
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[0, 1, 2, 3].map((i) => {
            const m = springAt(T, mulai + 0.35 + i * 0.13, 10);
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 16,
                  borderRadius: 8,
                  background: C.aksen,
                  transformOrigin: "left center",
                  transform: `scaleX(${m})`,
                }}
              />
            );
          })}
        </div>
      </Kartu>
    </Isi>
  </AbsoluteFill>
);

/** Dua jalan kalau putusan tidak dijalankan. */
const Eksekusi: React.FC<{ T: number; mulai: number }> = ({ T, mulai }) => {
  const pilihan = [
    { ikon: <Landmark size={62} strokeWidth={2.2} />, teks: "Sita harta", at: kapan("bisa sita") - 0.15 },
    { ikon: <Wallet size={62} strokeWidth={2.2} />, teks: "Potong gaji", at: kapan("atau potong") - 0.15 },
  ];
  return (
    <AbsoluteFill>
      <CardBG />
      <Isi>
        <Kartu T={T} at={mulai} style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <Pil T={T} at={mulai + 0.05} teks="kalau tetap nggak bayar" />
          <div
            style={{
              fontFamily: F.sans,
              fontWeight: 800,
              fontSize: 62,
              lineHeight: 1.14,
              color: C.navy,
              letterSpacing: "-0.015em",
            }}
          >
            Minta eksekusi ke pengadilan yang memutus
          </div>
          <div style={{ display: "flex", gap: 22 }}>
            {pilihan.map((p, i) => {
              const m = springAt(T, p.at, 11);
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: "38px 24px",
                    borderRadius: 34,
                    background: C.stabilo,
                    color: C.aksen,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18,
                    opacity: ramp(T, p.at, p.at + 0.2),
                    transform: `translateY(${(1 - m) * 34}px) scale(${0.92 + m * 0.08})`,
                  }}
                >
                  {p.ikon}
                  <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 42, color: C.navy }}>
                    {p.teks}
                  </div>
                </div>
              );
            })}
          </div>
        </Kartu>
      </Isi>
    </AbsoluteFill>
  );
};

/** Tiga bukti yang perlu disimpan, muncul di atas klip petugas membaca berkas. */
const Bukti: React.FC<{ T: number; mulai: number; selesai: number }> = ({ T, mulai, selesai }) => {
  const item = [
    { ikon: <GraduationCap {...IK} />, teks: "biaya sekolah", at: kapan("sekolah") },
    { ikon: <Stethoscope {...IK} />, teks: "biaya berobat", at: kapan("berobat") },
    { ikon: <MessageSquare {...IK} />, teks: "riwayat chat", at: kapan("chat") },
  ];
  return (
    <AdeganKlip
      T={T}
      mulai={mulai}
      selesai={selesai}
      clip="klip-02.mp4"
      srcStart={0.2}
      rate={0.9}
      zoom={[1.04, 1.12]}
    >
      <AbsoluteFill style={{ padding: `${AMAN.atas}px 82px 0`, gap: 20, flexDirection: "column" }}>
        <Rise T={T} at={mulai + 0.05}>
          <div
            style={{
              fontFamily: F.sans,
              fontWeight: 800,
              fontSize: 62,
              color: C.putih,
              letterSpacing: "-0.015em",
              textShadow: "0 10px 30px rgba(30,38,56,0.6)",
            }}
          >
            Simpan buktinya
          </div>
        </Rise>
        {item.map((p, i) => {
          const m = springAt(T, p.at, 11);
          return (
            <div
              key={i}
              style={{
                alignSelf: "flex-start",
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "18px 30px",
                borderRadius: 999,
                background: C.putih,
                color: C.aksen,
                opacity: ramp(T, p.at, p.at + 0.18),
                transform: `translateX(${(1 - m) * -40}px)`,
                boxShadow: "0 14px 30px rgba(30,38,56,0.2)",
              }}
            >
              {p.ikon}
              <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 44, color: C.navy }}>
                {p.teks}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AdeganKlip>
  );
};

const isiAdegan = (id: string, T: number, s: Adegan): React.ReactNode => {
  switch (id) {
    case "hook1":
      return <Hook1 T={T} mulai={s.mulai} selesai={s.selesai} />;
    case "hook2":
      return <Hook2 T={T} mulai={s.mulai} selesai={s.selesai} tegasAt={kapan("Padahal itu hak")} />;
    case "judul4":
      return <Judul4 T={T} mulai={s.mulai} />;
    case "mitos1":
      return (
        <KartuMitos
          T={T}
          mulai={s.mulai}
          n={1}
          dari={4}
          teks="Udah cerai, kewajiban ayah selesai."
          coretAt={s.mulai + 2.5}
        />
      );
    case "fakta1":
      return (
        <KartuFakta
          T={T}
          mulai={s.mulai}
          judul="Ayah tetap menanggung:"
          poin={[
            { ikon: <HandCoins {...IK} />, teks: "biaya pemeliharaan", at: kapan("menanggung biaya") - 0.1 },
            { ikon: <GraduationCap {...IK} />, teks: "biaya pendidikan", at: kapan("dan pendidikan") - 0.15 },
          ]}
          sumber={"UU 1/1974 Pasal 41 huruf b\nUU Perlindungan Anak Pasal 26"}
        />
      );
    case "fakta1b":
      return (
        <AdeganFoto
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          file="foto-01.jpg"
          zoom={[1.55, 1.8]}
          geser={[300, 286]}
          naik={[-320, -300]}
        >
          <KartuAtasFootage
            T={T}
            at={s.mulai + 0.15}
            judul="Sesuai kemampuannya, sampai anak dewasa dan bisa mandiri"
            catatan="KHI Pasal 105 huruf c · Pasal 156 huruf d"
          />
        </AdeganFoto>
      );
    case "mitos2":
      return (
        <KartuMitos
          T={T}
          mulai={s.mulai}
          n={2}
          dari={4}
          teks="Nggak diminta waktu sidang cerai, berarti hilang."
          coretAt={s.mulai + 2.3}
        />
      );
    case "fakta2":
      return (
        <KartuFakta
          T={T}
          mulai={s.mulai}
          judul="Hakim pengadilan agama bisa menetapkan nafkah anak"
          poin={[
            { ikon: <Gavel {...IK} />, teks: "walau nggak diminta", at: kapan("menetapkan nafkah") - 0.2 },
            { ikon: <HeartHandshake {...IK} />, teks: "asal anak terbukti diasuh ibunya", at: kapan("asal anaknya") - 0.2 },
          ]}
          sumber={"SEMA 4/2016 · KHI Pasal 156 huruf f"}
        />
      );
    case "foto2":
      return (
        <AdeganFoto
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          file="foto-02.jpg"
          zoom={[1.08, 1.2]}
          geser={[0, -26]}
        >
          <KartuAtasFootage
            T={T}
            at={s.mulai + 0.15}
            judul="Putusan udah lewat? Nafkah anak bisa digugat terpisah."
          />
        </AdeganFoto>
      );
    case "mitos3":
      return (
        <KartuMitos
          T={T}
          mulai={s.mulai}
          n={3}
          dari={4}
          teks="Nafkah yang dulu nggak dibayar udah hangus."
          coretAt={s.mulai + 2.2}
        />
      );
    case "wow3d":
      return <Wow3D T={T} mulai={s.mulai} selesai={s.selesai} />;
    case "bukti":
      return <Bukti T={T} mulai={s.mulai} selesai={s.selesai} />;
    case "mitos4":
      return (
        <KartuMitos
          T={T}
          mulai={s.mulai}
          n={4}
          dari={4}
          teks="Udah ada putusan tapi dia nggak bayar, ya udah, pasrah."
          coretAt={s.mulai + 3.1}
        />
      );
    case "klip2":
      return (
        <AdeganKlip
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          clip="klip-02.mp4"
          srcStart={2.3}
          rate={0.95}
          zoom={[1.06, 1.14]}
        >
          <KartuAtasFootage
            T={T}
            at={s.mulai + 0.2}
            judul="Lo bisa minta eksekusi putusannya"
            bawah={false}
          />
        </AdeganKlip>
      );
    case "eksekusi":
      return <Eksekusi T={T} mulai={s.mulai} />;
    case "posbakum":
      return (
        <KartuFakta
          T={T}
          mulai={s.mulai}
          pil="kalau nggak mampu"
          judul="Biaya perkara bukan penghalang"
          poin={[
            { ikon: <BadgePercent {...IK} />, teks: "minta bebas biaya perkara", at: kapan("bisa minta bebas") - 0.25 },
            { ikon: <Scale {...IK} />, teks: "dibantu Pos Bantuan Hukum", at: kapan("dan dibantu") - 0.2 },
          ]}
          sumber="Perma 1/2014"
        />
      );
    case "penutup":
      return <Penutup T={T} mulai={s.mulai} selesai={s.selesai} />;
    case "komentar":
      return <Komentar T={T} mulai={s.mulai} />;
    case "cta":
      return <CTA T={T} mulai={s.mulai} selesai={s.selesai} />;
    default:
      return null;
  }
};

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;

  return (
    <AbsoluteFill style={{ background: C.bg1 }}>
      {SCENES.map((s) => (
        <Sequence
          key={s.id}
          from={Math.round(s.mulai * fps)}
          durationInFrames={Math.max(1, Math.round((s.selesai - s.mulai) * fps))}
          name={s.id}
          layout="none"
        >
          <SceneFX T={T} mulai={s.mulai} selesai={s.selesai}>
            {isiAdegan(s.id, T, s)}
          </SceneFX>
        </Sequence>
      ))}

      <Captions T={T} />

      <Audio src={staticFile("voice_over.mp3")} />
    </AbsoluteFill>
  );
};
