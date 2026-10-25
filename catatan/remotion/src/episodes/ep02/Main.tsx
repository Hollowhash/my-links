import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FileText, HeartHandshake, Stethoscope, TriangleAlert, Wallet } from "lucide-react";
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
import { Angka, BarisSyarat, GarisWaktu, PitaKaca, TeksSapu } from "../../kaca";
import { FotoKaca, KlipKaca, judulKaca } from "../../scenes/kacaFootage";
import { Isi, Pil } from "../../scenes/dasar";
import { KartuCTA, KartuKomentar } from "../../scenes/akhir";
import { Captions } from "../../Captions";
import { buatVo } from "../../vo";
import { Stempel3D } from "./Stempel3D";
import kataJson from "./words.json";
import timeline from "./timeline.json";

const { KATA, kapan } = buatVo(kataJson);
const IK = { size: 40, strokeWidth: 2.4 };

type Adegan = { id: string; mulai: number; selesai: number };
const SCENES = timeline.scenes as Adegan[];

/** Kartu langkah: nomor besar, judul langkah, isi menyusul. */
const KartuLangkah: React.FC<{
  T: number;
  mulai: number;
  n: number;
  judul: string;
}> = ({ T, mulai, n, judul }) => {
  const pop = springAt(T, mulai + 0.1, 10);
  return (
    <AbsoluteFill>
      <CardBG />
      <Isi>
        <Kartu T={T} at={mulai} style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 36,
                background: `linear-gradient(140deg, #F06A43 0%, ${C.aksen} 72%)`,
                color: "#FFFFFF",
                fontFamily: F.sans,
                fontWeight: 800,
                fontSize: 64,
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
                fontSize: 30,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.kedua,
                opacity: ramp(T, mulai + 0.2, mulai + 0.5),
              }}
            >
              langkah {n} dari 4
            </div>
          </div>
          <TeksSapu
            T={T}
            at={mulai + 0.25}
            teks={judul}
            gaya={{
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
};

const KartuSyarat: React.FC<{
  T: number;
  mulai: number;
  baris: { at: number; isi: React.ReactNode }[];
  sumber?: string;
}> = ({ T, mulai, baris, sumber }) => (
  <AbsoluteFill>
    <CardBG />
    <Isi>
      <Kartu T={T} at={mulai} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        <Pil T={T} at={mulai + 0.05} teks="syarat orang tua angkat" />
        {baris.map((b, i) => (
          <BarisSyarat key={i} T={T} at={b.at} anak={b.isi} />
        ))}
        {sumber ? <Sumber T={T} at={baris[baris.length - 1].at + 0.4} teks={sumber} /> : null}
      </Kartu>
    </Isi>
  </AbsoluteFill>
);

const isiAdegan = (id: string, T: number, s: Adegan): React.ReactNode => {
  switch (id) {
    case "hook1":
      return (
        <FotoKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          file="ep02/photos/foto-01.jpg"
          zoom={[1.04, 1.12]}
          naik={[0, -16]}
          kacaY={210}
          at={-1}
          anak={
            <>
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 78,
                  lineHeight: 1.08,
                  color: C.navy,
                  letterSpacing: "-0.02em",
                }}
              >
                Mau adopsi anak?
              </div>
              <div
                style={{
                  marginTop: 22,
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 78,
                  lineHeight: 1.08,
                  color: C.aksen,
                  letterSpacing: "-0.02em",
                }}
              >
                <Mark T={T} at={-1}>
                  Ini jalur resminya
                </Mark>
              </div>
            </>
          }
        />
      );
    case "hook2":
      return (
        <FotoKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          file="ep02/photos/foto-03.jpg"
          zoom={[1.85, 1.6]}
          geser={[-76, -60]}
          naik={[-154, -140]}
          kacaY={1010}
          at={kapan("Tapi kalau cuma")}
          anak={judulKaca("Kalau cuma pindah tangan, status anaknya bisa bermasalah")}
        />
      );
    case "judul":
      return (
        <AbsoluteFill>
          <CardBG />
          <Isi>
            <Kartu T={T} at={s.mulai} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <Pil T={T} at={s.mulai + 0.05} teks="urutan langkah" />
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
                Adopsi resmi:{" "}
                <span style={{ color: C.aksen }}>
                  <Mark T={T} at={s.mulai + 0.3}>
                    4 langkah
                  </Mark>
                </span>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 16,
                      borderRadius: 8,
                      background: C.aksen,
                      transformOrigin: "left center",
                      transform: `scaleX(${springAt(T, s.mulai + 0.35 + i * 0.13, 10)})`,
                    }}
                  />
                ))}
              </div>
            </Kartu>
          </Isi>
        </AbsoluteFill>
      );
    case "langkah1":
      return <KartuLangkah T={T} mulai={s.mulai} n={1} judul="Cek syarat calon orang tua angkat" />;
    case "syarat1":
      return (
        <KartuSyarat
          T={T}
          mulai={s.mulai}
          baris={[
            {
              at: kapan("Umur tiga puluh"),
              isi: (
                <>
                  Umur{" "}
                  <span style={{ color: C.aksen }}>
                    <Angka T={T} at={kapan("Umur tiga puluh")} dari={18} sampai={30} />
                  </span>{" "}
                  sampai{" "}
                  <span style={{ color: C.aksen }}>
                    <Angka T={T} at={kapan("sampai lima")} dari={30} sampai={55} />
                  </span>{" "}
                  tahun
                </>
              ),
            },
            {
              at: kapan("menikah minimal"),
              isi: (
                <>
                  Menikah minimal{" "}
                  <span style={{ color: C.aksen }}>
                    <Angka T={T} at={kapan("menikah minimal")} dari={0} sampai={5} />
                  </span>{" "}
                  tahun
                </>
              ),
            },
            { at: kapan("sehat"), isi: <>Sehat jasmani dan rohani</> },
          ]}
          sumber="PP 54/2007 Pasal 13"
        />
      );
    case "syarat2":
      return (
        <KartuSyarat
          T={T}
          mulai={s.mulai}
          baris={[
            { at: kapan("mampu secara"), isi: <>Mampu secara ekonomi dan sosial</> },
            { at: kapan("seagama dengan"), isi: <>Seagama dengan calon anak</> },
            { at: kapan("belum punya anak"), isi: <>Belum punya anak, atau baru punya satu</> },
          ]}
          sumber="PP 54/2007 Pasal 13"
        />
      );
    case "langkah2":
      return (
        <FotoKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          file="ep02/photos/foto-02.jpg"
          zoom={[1.06, 1.16]}
          geser={[0, -24]}
          kacaY={1000}
          at={s.mulai + 0.15}
          anak={judulKaca("Langkah 2: ajukan permohonan ke Dinas Sosial kabupaten atau kota")}
        />
      );
    case "berkas":
      return (
        <FotoKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          file="ep02/photos/foto-02.jpg"
          zoom={[1.9, 1.75]}
          geser={[32, 20]}
          naik={[-154, -140]}
          kacaY={880}
          at={s.mulai + 0.1}
          anak={
            <>
              <div
                style={{
                  fontFamily: F.mono,
                  fontWeight: 600,
                  fontSize: 28,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.kedua,
                  marginBottom: 24,
                }}
              >
                berkas yang dibawa
              </div>
              {[
                { ikon: <FileText {...IK} />, teks: "Surat penyerahan anak dari orang tua kandung", at: kapan("surat penyerahan") },
                { ikon: <Stethoscope {...IK} />, teks: "Surat keterangan sehat", at: kapan("keterangan sehat") },
                { ikon: <Wallet {...IK} />, teks: "Surat keterangan penghasilan", at: kapan("keterangan penghasilan") },
              ].map((b, i) => {
                const m = springAt(T, b.at - 0.15, 12);
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      marginBottom: i < 2 ? 22 : 0,
                      opacity: ramp(T, b.at - 0.2, b.at),
                      transform: `translateX(${(1 - m) * 26}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 22,
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
                    <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 40, lineHeight: 1.2, color: C.navy }}>
                      {b.teks}
                    </div>
                  </div>
                );
              })}
            </>
          }
        />
      );
    case "langkah3":
      return (
        <KlipKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          clip="ep02/clips/klip-01.mp4"
          srcStart={0.4}
          rate={0.9}
          zoom={[1.05, 1.13]}
          kacaY={980}
          at={s.mulai + 0.1}
          anak={judulKaca("Langkah 3: jalani masa pengasuhan")}
        />
      );
    case "masa":
      return (
        <AbsoluteFill>
          <CardBG />
          <Isi>
            <Kartu T={T} at={s.mulai} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
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
                Paling singkat{" "}
                <span style={{ color: C.aksen }}>
                  <Angka T={T} at={kapan("paling singkat enam")} dari={0} sampai={6} /> bulan
                </span>
              </div>
              <GarisWaktu
                T={T}
                at={s.mulai + 0.3}
                titik={[
                  { label: "izin pengasuhan", at: s.mulai + 0.4 },
                  { label: "6 bulan diasuh", at: kapan("paling singkat enam") },
                  { label: "dinilai layak", at: kapan("sambil dinilai") },
                ]}
              />
              <Sumber T={T} at={s.mulai + 1.6} teks="Alur Dinas Sosial · PP 54/2007" />
            </Kartu>
          </Isi>
        </AbsoluteFill>
      );
    case "langkah4":
      return <KartuLangkah T={T} mulai={s.mulai} n={4} judul="Kalau dinyatakan layak" />;
    case "stempel":
      return (
        <Stempel3D
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          hantamAt={kapan("ke pengadilan") + 0.35}
          atNegeri={kapan("Pengadilan Negeri")}
          atAgama={kapan("Pengadilan Agama")}
        />
      );
    case "penting":
      return (
        <AbsoluteFill>
          <CardBG />
          <Isi>
            <Kartu T={T} at={s.mulai} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              <Pil T={T} at={s.mulai + 0.05} teks="satu hal penting" />
              <TeksSapu
                T={T}
                at={kapan("Adopsi nggak memutus")}
                teks="Adopsi nggak memutus hubungan darah"
                lama={0.9}
                gaya={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 70,
                  lineHeight: 1.12,
                  color: C.navy,
                  letterSpacing: "-0.015em",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: ramp(T, s.mulai + 1.6, s.mulai + 2) }}>
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
                  }}
                >
                  <HeartHandshake size={44} strokeWidth={2.3} />
                </div>
                <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 42, color: C.navy }}>
                  Anak tetap punya orang tua kandung
                </div>
              </div>
            </Kartu>
          </Isi>
        </AbsoluteFill>
      );
    case "asalusul":
      return (
        <AbsoluteFill>
          <CardBG />
          <Isi>
            <Kartu T={T} at={s.mulai} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              <KataDemiKata
                T={T}
                at={s.mulai + 0.15}
                teks="Orang tua angkat wajib cerita ke anak soal asal-usulnya"
                jeda={0.06}
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 64,
                  lineHeight: 1.14,
                  color: C.navy,
                  letterSpacing: "-0.015em",
                }}
              />
              <Sumber T={T} at={s.mulai + 1.8} teks={"PP 54/2007 Pasal 4 dan Pasal 6"} />
            </Kartu>
          </Isi>
        </AbsoluteFill>
      );
    case "hatihati":
      return (
        <AbsoluteFill>
          <CardBG />
          <Isi>
            <Kartu T={T} at={s.mulai} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              <div
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "16px 30px",
                  borderRadius: 999,
                  background: C.aksen,
                  color: "#FFFFFF",
                  transform: `scale(${0.85 + springAt(T, s.mulai + 0.1, 11) * 0.15})`,
                }}
              >
                <TriangleAlert size={36} strokeWidth={2.6} />
                <span
                  style={{
                    fontFamily: F.mono,
                    fontWeight: 600,
                    fontSize: 30,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  hati-hati
                </span>
              </div>
              <KataDemiKata
                T={T}
                at={kapan("Kalau ada yang nawarin")}
                teks="Kalau ada yang nawarin bayi pakai bayaran"
                jeda={0.07}
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 70,
                  lineHeight: 1.12,
                  color: C.navy,
                  letterSpacing: "-0.015em",
                }}
              />
            </Kartu>
          </Isi>
        </AbsoluteFill>
      );
    case "tolak":
      return (
        <AbsoluteFill>
          <CardBG />
          <Isi>
            <Kartu T={T} at={s.mulai} style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 82,
                  lineHeight: 1.08,
                  color: C.aksen,
                  letterSpacing: "-0.02em",
                }}
              >
                <Mark T={T} at={kapan("itu bukan adopsi")}>
                  Itu bukan adopsi
                </Mark>
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                {[
                  { teks: "Tolak", at: kapan("Tolak,") },
                  { teks: "Laporkan", at: kapan("dan laporkan") },
                ].map((b, i) => {
                  const m = springAt(T, b.at, 11);
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        padding: "34px 18px",
                        borderRadius: 32,
                        background: C.stabilo,
                        color: C.navy,
                        fontFamily: F.sans,
                        fontWeight: 800,
                        fontSize: 46,
                        textAlign: "center",
                        opacity: ramp(T, b.at, b.at + 0.2),
                        transform: `translateY(${(1 - m) * 30}px) scale(${0.92 + m * 0.08})`,
                      }}
                    >
                      {b.teks}
                    </div>
                  );
                })}
              </div>
            </Kartu>
          </Isi>
        </AbsoluteFill>
      );
    case "tanya":
      return (
        <FotoKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          file="ep02/photos/foto-03.jpg"
          zoom={[1.14, 1.04]}
          naik={[-30, 0]}
          kacaY={1010}
          at={s.mulai + 0.1}
          anak={judulKaca("Syarat detail beda tiap daerah", "tanya langsung ke Dinas Sosial setempat")}
        />
      );
    case "komentar":
      return (
        <KartuKomentar
          T={T}
          mulai={s.mulai}
          teks="Menurut lo, kenapa banyak orang milih jalur dikasih aja?"
        />
      );
    case "cta":
      return (
        <KartuCTA
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          judul="Kirim ke yang lagi nunggu momongan"
          atSimpan={kapan("Simpan,")}
          atKirim={kapan("kirim ke yang")}
          atFollow={kapan("follow akun")}
          sumber={[
            "PP 54/2007 tentang Pelaksanaan Pengangkatan Anak",
            "Pasal 4 · Pasal 6 · Pasal 12 · Pasal 13 · Pasal 20",
            "Alur Dinas Sosial kabupaten atau kota",
          ]}
        />
      );
    default:
      return <AbsoluteFill style={{ background: C.bg1 }} />;
  }
};

export const Ep02: React.FC = () => {
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

      {/* Pita kaca menyapu di tiap pergantian bagian besar */}
      {SCENES.filter((s) => ["judul", "langkah2", "langkah3", "langkah4", "hatihati"].includes(s.id)).map((s) => (
        <PitaKaca key={s.id} T={T} at={s.mulai - 0.25} />
      ))}

      <Captions T={T} kata={KATA} />

      <Audio src={staticFile("ep02/voice_over.mp3")} />
    </AbsoluteFill>
  );
};
