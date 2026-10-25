import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Accessibility,
  BadgeCheck,
  Briefcase,
  GraduationCap,
  HandHeart,
  Landmark,
  MessageSquareWarning,
  Monitor,
  Building2,
} from "lucide-react";
import "../../fonts";
import {
  AMAN,
  C,
  CardBG,
  F,
  KataDemiKata,
  Kartu,
  Mark,
  Rise,
  SceneFX,
  Sumber,
  glass,
  ramp,
  springAt,
} from "../../lib";
import { Angka, BarisSyarat, PitaKaca, TeksSapu } from "../../kaca";
import { FotoKaca, KlipKaca, judulKaca } from "../../scenes/kacaFootage";
import { Isi, Pil } from "../../scenes/dasar";
import { KartuCTA, KartuKomentar } from "../../scenes/akhir";
import { Captions } from "../../Captions";
import { buatVo } from "../../vo";
import { Kuota3D } from "./Kuota3D";
import kataJson from "./words.json";
import timeline from "./timeline.json";

const { KATA, kapan } = buatVo(kataJson);
const IK = { size: 40, strokeWidth: 2.4 };

type Adegan = { id: string; mulai: number; selesai: number };
const SCENES = timeline.scenes as Adegan[];

/** Kartu bernomor untuk tiap poin daftar. */
const KartuPoin: React.FC<{
  T: number;
  mulai: number;
  n: number;
  judul: string;
  ikon: React.ReactNode;
}> = ({ T, mulai, n, judul, ikon }) => {
  const pop = springAt(T, mulai + 0.1, 10);
  return (
    <AbsoluteFill>
      <CardBG />
      <Isi>
        <Kartu T={T} at={mulai} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                width: 118,
                height: 118,
                borderRadius: 36,
                background: `linear-gradient(140deg, #F06A43 0%, ${C.aksen} 72%)`,
                color: "#FFFFFF",
                fontFamily: F.sans,
                fontWeight: 800,
                fontSize: 62,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${0.6 + pop * 0.4}) rotate(${(1 - pop) * -10}deg)`,
                boxShadow: "0 14px 30px rgba(217,72,43,0.32)",
              }}
            >
              {n}
            </div>
            <div
              style={{
                fontFamily: F.mono,
                fontWeight: 600,
                fontSize: 28,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.kedua,
                opacity: ramp(T, mulai + 0.2, mulai + 0.5),
              }}
            >
              hal {n} dari 5
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                width: 86,
                height: 86,
                borderRadius: 26,
                background: C.stabilo,
                color: C.aksen,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                opacity: ramp(T, mulai + 0.25, mulai + 0.5),
              }}
            >
              {ikon}
            </div>
            <TeksSapu
              T={T}
              at={mulai + 0.25}
              teks={judul}
              gaya={{
                fontFamily: F.sans,
                fontWeight: 800,
                fontSize: 64,
                lineHeight: 1.1,
                color: C.navy,
                letterSpacing: "-0.015em",
              }}
            />
          </div>
        </Kartu>
      </Isi>
    </AbsoluteFill>
  );
};

/** Kartu daftar isi dengan ikon, dipakai untuk akomodasi dan layanan. */
const KartuDaftar: React.FC<{
  T: number;
  mulai: number;
  pil?: string;
  judul?: string;
  item: { ikon: React.ReactNode; teks: string; at: number }[];
  sumber?: string;
}> = ({ T, mulai, pil, judul, item, sumber }) => (
  <AbsoluteFill>
    <CardBG />
    <Isi>
      <Kartu T={T} at={mulai} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {pil ? <Pil T={T} at={mulai + 0.05} teks={pil} /> : null}
        {judul ? (
          <Rise T={T} at={mulai + 0.15}>
            <div
              style={{
                fontFamily: F.sans,
                fontWeight: 800,
                fontSize: 60,
                lineHeight: 1.14,
                color: C.navy,
                letterSpacing: "-0.015em",
              }}
            >
              {judul}
            </div>
          </Rise>
        ) : null}
        {item.map((b, i) => {
          const m = springAt(T, b.at - 0.15, 12);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                opacity: ramp(T, b.at - 0.2, b.at),
                transform: `translateX(${(1 - m) * 26}px)`,
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 24,
                  background: C.stabilo,
                  color: C.aksen,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {b.ikon}
              </div>
              <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 44, lineHeight: 1.2, color: C.navy }}>
                {b.teks}
              </div>
            </div>
          );
        })}
        {sumber ? <Sumber T={T} at={item[item.length - 1].at + 0.4} teks={sumber} /> : null}
      </Kartu>
    </Isi>
  </AbsoluteFill>
);

/** Dua batang upah yang disamakan tingginya. */
const UpahSama: React.FC<{ T: number; at: number }> = ({ T, at }) => {
  const sama = ramp(T, at, at + 0.9);
  const kiri = 220;
  const kanan = 130 + sama * 90;
  const batang = (tinggi: number, label: string, nyala: boolean) => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ height: 240, display: "flex", alignItems: "flex-end" }}>
        <div
          style={{
            width: 150,
            height: tinggi,
            borderRadius: 24,
            background: nyala ? C.aksen : "rgba(30,38,56,0.16)",
          }}
        />
      </div>
      <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: C.navy }}>{label}</div>
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 24 }}>
      {batang(kiri, "karyawan lain", false)}
      {batang(kanan, "karyawan disabilitas", true)}
    </div>
  );
};

const isiAdegan = (id: string, T: number, s: Adegan): React.ReactNode => {
  switch (id) {
    case "hook1":
      return (
        <KlipKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          clip="ep03/clips/klip-01.mp4"
          srcStart={0}
          rate={0.85}
          zoom={[1.02, 1.08]}
          kacaY={210}
          at={-1}
          anak={
            <>
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 74,
                  lineHeight: 1.08,
                  color: C.navy,
                  letterSpacing: "-0.02em",
                }}
              >
                Lamar kerja ditolak terus?
              </div>
              <div
                style={{
                  marginTop: 22,
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 74,
                  lineHeight: 1.08,
                  color: C.aksen,
                  letterSpacing: "-0.02em",
                }}
              >
                <Mark T={T} at={-1}>
                  Ada kuota yang wajib
                </Mark>
              </div>
            </>
          }
        />
      );
    case "hook1b":
      return (
        <KlipKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          clip="ep03/clips/klip-01.mp4"
          srcStart={3.2}
          rate={0.9}
          zoom={[1.05, 1.12]}
          kacaY={1010}
          at={s.mulai + 0.1}
          anak={judulKaca("Bukan karena kursi roda. Bukan karena Tuli.")}
        />
      );
    case "hook2":
      return (
        <AbsoluteFill>
          <KlipKaca
            T={T}
            mulai={s.mulai}
            selesai={s.selesai}
            clip="ep03/clips/klip-01.mp4"
            srcStart={6}
            rate={0.85}
            zoom={[1.12, 1.03]}
            kacaY={1010}
            at={kapan("Ada aturan")}
            anak={judulKaca("Ada aturan yang wajib dijalankan pemberi kerja")}
          />
        </AbsoluteFill>
      );
    case "dasar":
      return (
        <AbsoluteFill>
          <CardBG />
          <Isi>
            <Kartu T={T} at={s.mulai} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              <Pil T={T} at={s.mulai + 0.05} teks="dasar hukumnya" />
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 92,
                  lineHeight: 1.05,
                  color: C.navy,
                  letterSpacing: "-0.02em",
                }}
              >
                UU 8/
                <span style={{ color: C.aksen }}>
                  <Mark T={T} at={kapan("tahun dua")}>2016</Mark>
                </span>
              </div>
              <Rise T={T} at={s.mulai + 0.6}>
                <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 46, lineHeight: 1.2, color: C.navy }}>
                  Undang-undang penyandang disabilitas
                </div>
              </Rise>
              <Sumber T={T} at={s.mulai + 1.4} teks="UU 8/2016 · Pasal 11, 49, 50, 53" />
            </Kartu>
          </Isi>
        </AbsoluteFill>
      );
    case "judul5":
      return (
        <AbsoluteFill>
          <CardBG />
          <Isi>
            <Kartu T={T} at={s.mulai} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              <Pil T={T} at={s.mulai + 0.05} teks="daftar cek" />
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
                Cek{" "}
                <span style={{ color: C.aksen }}>
                  <Mark T={T} at={s.mulai + 0.25}>
                    5 hal
                  </Mark>
                </span>{" "}
                ini
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 16,
                      borderRadius: 8,
                      background: C.aksen,
                      transformOrigin: "left center",
                      transform: `scaleX(${springAt(T, s.mulai + 0.3 + i * 0.11, 10)})`,
                    }}
                  />
                ))}
              </div>
            </Kartu>
          </Isi>
        </AbsoluteFill>
      );
    case "satu":
      return <KartuPoin T={T} mulai={s.mulai} n={1} judul="Kuota" ikon={<Building2 size={48} strokeWidth={2.3} />} />;
    case "kuota3d":
      return (
        <Kuota3D
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          atDua={kapan("dua persen")}
          atSatu={kapan("satu persen")}
        />
      );
    case "seratus":
      return (
        <AbsoluteFill>
          <CardBG />
          <Isi>
            <Kartu T={T} at={s.mulai} style={{ display: "flex", flexDirection: "column", gap: 34 }}>
              <Pil T={T} at={s.mulai + 0.05} teks="artinya" />
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 70,
                  lineHeight: 1.1,
                  color: C.navy,
                  letterSpacing: "-0.015em",
                }}
              >
                Kantor dengan{" "}
                <span style={{ color: C.aksen }}>
                  <Angka T={T} at={kapan("seratus karyawan") - 0.25} dari={10} sampai={100} lama={0.5} />
                </span>{" "}
                karyawan
              </div>
              <BarisSyarat
                T={T}
                at={kapan("minimal satu")}
                anak={<>Minimal 1 orang karyawan disabilitas</>}
              />
              <Sumber T={T} at={kapan("minimal satu") + 0.6} teks="UU 8/2016 Pasal 53" />
            </Kartu>
          </Isi>
        </AbsoluteFill>
      );
    case "dua":
      return (
        <KlipKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          clip="ep03/clips/klip-02.mp4"
          srcStart={1.6}
          rate={0.9}
          zoom={[1.04, 1.12]}
          kacaY={1000}
          at={s.mulai + 0.05}
          anak={judulKaca("2. Tanpa diskriminasi")}
        />
      );
    case "dua2":
      return (
        <KartuDaftar
          T={T}
          mulai={s.mulai}
          pil="hak dapat pekerjaan"
          judul="Dijamin tanpa diskriminasi"
          item={[
            { ikon: <Landmark {...IK} />, teks: "di pemerintah", at: kapan("di pemerintah") },
            { ikon: <Briefcase {...IK} />, teks: "maupun swasta", at: kapan("maupun swasta") },
          ]}
          sumber="UU 8/2016 Pasal 11 huruf a"
        />
      );
    case "tiga":
      return (
        <KlipKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          clip="ep03/clips/klip-02.mp4"
          srcStart={5.6}
          rate={0.85}
          zoom={[1.06, 1.14]}
          kacaY={830}
          at={s.mulai + 0.05}
          anak={
            <>
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 56,
                  lineHeight: 1.12,
                  color: C.navy,
                  letterSpacing: "-0.015em",
                  marginBottom: 26,
                }}
              >
                3. Kerjaan sama, upahnya wajib sama
              </div>
              <UpahSama T={T} at={kapan("upahnya wajib")} />
              <div style={{ marginTop: 24, fontFamily: F.mono, fontWeight: 500, fontSize: 26, color: C.kedua }}>
                UU 8/2016 Pasal 49
              </div>
            </>
          }
        />
      );
    case "empat":
      return (
        <KlipKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          clip="ep03/clips/klip-02.mp4"
          srcStart={0}
          rate={0.8}
          zoom={[1.1, 1.02]}
          kacaY={1000}
          at={s.mulai + 0.05}
          anak={judulKaca("4. Akomodasi yang layak", "pemberi kerja wajib menyesuaikan")}
        />
      );
    case "akomodasi":
      return (
        <KartuDaftar
          T={T}
          mulai={s.mulai}
          pil="contoh penyesuaian"
          item={[
            { ikon: <Accessibility {...IK} />, teks: "Jalur kursi roda", at: kapan("misalnya jalur") },
            { ikon: <Monitor {...IK} />, teks: "Aplikasi pembaca layar", at: kapan("aplikasi pembaca") },
          ]}
          sumber="UU 8/2016 Pasal 50"
        />
      );
    case "akomodasi2":
      return (
        <KartuDaftar
          T={T}
          mulai={s.mulai}
          pil="kalau hak lo nggak dipenuhi"
          judul="Wajib ada jalur pengaduan"
          item={[
            {
              ikon: <MessageSquareWarning {...IK} />,
              teks: "Mekanisme pengaduan di tempat kerja",
              at: kapan("plus jalur"),
            },
          ]}
          sumber="UU 8/2016 Pasal 50"
        />
      );
    case "lima":
      return (
        <KartuPoin
          T={T}
          mulai={s.mulai}
          n={5}
          judul="Unit Layanan Disabilitas"
          ikon={<BadgeCheck size={48} strokeWidth={2.3} />}
        />
      );
    case "lima2":
      return (
        <KartuDaftar
          T={T}
          mulai={s.mulai}
          pil="wajib ada di tiap daerah"
          judul="Letaknya di Dinas Tenaga Kerja"
          item={[{ ikon: <Landmark {...IK} />, teks: "Pemerintah daerah wajib punya", at: kapan("wajib punya") }]}
          sumber="PP 60/2020"
        />
      );
    case "uld":
      return (
        <KartuDaftar
          T={T}
          mulai={s.mulai}
          pil="isinya"
          item={[
            { ikon: <Briefcase {...IK} />, teks: "Info lowongan", at: kapan("info lowongan") },
            { ikon: <GraduationCap {...IK} />, teks: "Pelatihan", at: kapan("pelatihan") },
            { ikon: <HandHeart {...IK} />, teks: "Pendampingan kerja", at: kapan("pendampingan kerja") },
          ]}
        />
      );
    case "uld2":
      return (
        <AbsoluteFill>
          <CardBG />
          <Isi>
            <Kartu T={T} at={s.mulai} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <KataDemiKata
                T={T}
                at={s.mulai + 0.15}
                teks="Belum ketemu? Tanya langsung ke Disnaker."
                jeda={0.07}
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 68,
                  lineHeight: 1.12,
                  color: C.navy,
                  letterSpacing: "-0.015em",
                }}
              />
            </Kartu>
          </Isi>
        </AbsoluteFill>
      );
    case "penutup":
      return (
        <AbsoluteFill>
          <KlipKaca
            T={T}
            mulai={s.mulai}
            selesai={s.selesai}
            clip="ep03/clips/klip-02.mp4"
            srcStart={6.4}
            rate={0.8}
            zoom={[1.14, 1.04]}
            kacaY={980}
            at={s.mulai + 0.05}
            anak={
              <>
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
                  Lo nggak minta dikasihani.
                </div>
                <div
                  style={{
                    marginTop: 18,
                    fontFamily: F.sans,
                    fontWeight: 800,
                    fontSize: 64,
                    lineHeight: 1.08,
                    color: C.aksen,
                    letterSpacing: "-0.02em",
                  }}
                >
                  <Mark T={T} at={kapan("Lo minta kesempatan")}>
                    Lo minta kesempatan yang sama.
                  </Mark>
                </div>
              </>
            }
          />
        </AbsoluteFill>
      );
    case "komentar":
      return (
        <KartuKomentar
          T={T}
          mulai={s.mulai}
          teks="Kantor di sekitar lo udah ada karyawan disabilitasnya belum?"
        />
      );
    case "cta":
      return (
        <KartuCTA
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          judul="Kirim ke teman atau saudara yang butuh"
          atSimpan={kapan("Simpan,")}
          atKirim={kapan("kirim ke teman")}
          atFollow={kapan("follow akun")}
          sumber={[
            "UU 8/2016 tentang Penyandang Disabilitas",
            "Pasal 11 huruf a · Pasal 49 · Pasal 50 · Pasal 53",
            "PP 60/2020 tentang Unit Layanan Disabilitas",
          ]}
        />
      );
    default:
      return <AbsoluteFill style={{ background: C.bg1 }} />;
  }
};

export const Ep03: React.FC = () => {
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

      {SCENES.filter((s) => ["judul5", "kuota3d", "dua", "empat", "lima"].includes(s.id)).map((s) => (
        <PitaKaca key={s.id} T={T} at={s.mulai - 0.25} />
      ))}

      <Captions T={T} kata={KATA} />

      <Audio src={staticFile("ep03/voice_over.mp3")} />
    </AbsoluteFill>
  );
};
