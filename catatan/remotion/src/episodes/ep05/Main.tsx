import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Building2, FileSignature, Store, UserCheck, Users } from "lucide-react";
import "../../fonts";
import {
  AMAN,
  C,
  CardBG,
  F,
  Kartu,
  Mark,
  Rise,
  SceneFX,
  Sumber,
  ramp,
  springAt,
} from "../../lib";
import { BarisSyarat, GarisWaktu, PitaKaca, TeksSapu } from "../../kaca";
import { FotoKaca, KlipKaca, judulKaca } from "../../scenes/kacaFootage";
import { Isi, KartuMitos, Pil } from "../../scenes/dasar";
import { KartuCTA, KartuKomentar } from "../../scenes/akhir";
import { Captions } from "../../Captions";
import { buatVo } from "../../vo";
import { Venn3D } from "./Venn3D";
import kataJson from "./words.json";
import timeline from "./timeline.json";

const { KATA, kapan } = buatVo(kataJson);
const IK = { size: 40, strokeWidth: 2.4 };

type Adegan = { id: string; mulai: number; selesai: number };
const SCENES = timeline.scenes as Adegan[];

const judulGaya = (ukuran = 62): React.CSSProperties => ({
  fontFamily: F.sans,
  fontWeight: 800,
  fontSize: ukuran,
  lineHeight: 1.12,
  color: C.navy,
  letterSpacing: "-0.015em",
});

/** Kartu putih dengan pil label di atasnya. */
const KartuIsi: React.FC<{
  T: number;
  mulai: number;
  pil?: string;
  anak: React.ReactNode;
}> = ({ T, mulai, pil, anak }) => (
  <AbsoluteFill>
    <CardBG />
    <Isi>
      <Kartu T={T} at={mulai} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {pil ? <Pil T={T} at={mulai + 0.05} teks={pil} /> : null}
        {anak}
      </Kartu>
    </Isi>
  </AbsoluteFill>
);

/** Baris berikon untuk langkah pengesahan. */
const BarisIkon: React.FC<{
  T: number;
  at: number;
  ikon: React.ReactNode;
  teks: string;
}> = ({ T, at, ikon, teks }) => {
  const m = springAt(T, at - 0.15, 12);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: ramp(T, at - 0.2, at),
        transform: `translateX(${(1 - m) * 24}px)`,
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
        {ikon}
      </div>
      <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 44, lineHeight: 1.2, color: C.navy }}>
        {teks}
      </div>
    </div>
  );
};

const isiAdegan = (id: string, T: number, s: Adegan): React.ReactNode => {
  switch (id) {
    case "hook1":
      return (
        <FotoKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          file="ep05/photos/foto-01.jpg"
          zoom={[1.04, 1.12]}
          naik={[0, -12]}
          kacaY={210}
          at={-1}
          anak={
            <>
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 72,
                  lineHeight: 1.08,
                  color: C.navy,
                  letterSpacing: "-0.02em",
                }}
              >
                Pisah harta itu tanda nggak percaya?
              </div>
              <div
                style={{
                  marginTop: 22,
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 72,
                  lineHeight: 1.08,
                  color: C.aksen,
                  letterSpacing: "-0.02em",
                }}
              >
                <Mark T={T} at={-1}>
                  Cek 4 mitosnya
                </Mark>
              </div>
            </>
          }
        />
      );
    case "hook2":
      return (
        <KlipKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          clip="ep05/clips/klip-01.mp4"
          srcStart={0.4}
          rate={0.85}
          zoom={[1.05, 1.13]}
          kacaY={1000}
          at={s.mulai + 0.1}
          anak={
            <div
              style={{
                fontFamily: F.sans,
                fontWeight: 800,
                fontSize: 56,
                lineHeight: 1.16,
                color: C.navy,
                letterSpacing: "-0.015em",
              }}
            >
              <span style={{ color: C.aksen, fontSize: 72 }}>&ldquo;</span>
              Perjanjian pisah harta itu tanda nggak percaya
              <span style={{ color: C.aksen, fontSize: 72 }}>&rdquo;</span>
            </div>
          }
        />
      );
    case "judul4":
      return (
        <KartuIsi
          T={T}
          mulai={s.mulai}
          pil="mitos atau fakta"
          anak={
            <>
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
                Kita cek{" "}
                <span style={{ color: C.aksen }}>
                  <Mark T={T} at={s.mulai + 0.25}>
                    4 mitosnya
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
                      transform: `scaleX(${springAt(T, s.mulai + 0.3 + i * 0.12, 10)})`,
                    }}
                  />
                ))}
              </div>
            </>
          }
        />
      );
    case "mitos1":
      return (
        <KartuMitos
          T={T}
          mulai={s.mulai}
          n={1}
          dari={4}
          teks="Kalau nggak bikin perjanjian, harta tetap punya masing-masing."
          coretAt={s.mulai + 3}
        />
      );
    case "venn3d":
      return (
        <Venn3D
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          atBersama={kapan("jadi harta")}
          atMasingMasing={kapan("itu harta bawaan")}
        />
      );
    case "mitos2":
      return (
        <KartuMitos
          T={T}
          mulai={s.mulai}
          n={2}
          dari={4}
          teks="Perjanjian kawin cuma bisa dibuat sebelum nikah."
          coretAt={s.mulai + 2.4}
        />
      );
    case "mk":
      return (
        <KartuIsi
          T={T}
          mulai={s.mulai}
          pil="faktanya"
          anak={
            <>
              <div style={judulGaya(56)}>Bisa dibuat kapan saja</div>
              <GarisWaktu
                T={T}
                at={s.mulai + 0.3}
                titik={[
                  { label: "sebelum nikah", at: kapan("bisa dibuat sebelum", s.mulai) },
                  { label: "saat nikah", at: kapan("saat", s.mulai + 2) },
                  { label: "selama nikah", at: kapan("atau selama", s.mulai) },
                ]}
              />
              <Sumber T={T} at={s.mulai + 2.6} teks={"Putusan MK 69/PUU-XIII/2015 yang memaknai Pasal 29 UU Perkawinan"} />
            </>
          }
        />
      );
    case "mitos3":
      return (
        <KartuMitos
          T={T}
          mulai={s.mulai}
          n={3}
          dari={4}
          teks="Cukup ditulis berdua, tempel meterai."
          coretAt={s.mulai + 2.3}
        />
      );
    case "sah":
      return (
        <FotoKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          file="ep05/photos/foto-02.jpg"
          zoom={[1.08, 1.18]}
          geser={[-30, 20]}
          kacaY={990}
          at={s.mulai + 0.1}
          anak={judulKaca("Harus disahkan pegawai pencatat perkawinan atau notaris")}
        />
      );
    case "catat":
      return (
        <KartuIsi
          T={T}
          mulai={s.mulai}
          pil="urutannya"
          anak={
            <>
              <BarisIkon
                T={T}
                at={kapan("akta notaris")}
                ikon={<FileSignature {...IK} />}
                teks="Dibuat dengan akta notaris"
              />
              <BarisIkon
                T={T}
                at={kapan("dicatat di")}
                ikon={<Building2 {...IK} />}
                teks="Dicatat di KUA atau Dukcapil"
              />
            </>
          }
        />
      );
    case "terikat":
      return (
        <KartuIsi
          T={T}
          mulai={s.mulai}
          pil="kalau dilewat"
          anak={
            <>
              <div style={judulGaya(58)}>Perjanjian yang nggak dicatat</div>
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 64,
                  lineHeight: 1.1,
                  color: C.aksen,
                  letterSpacing: "-0.02em",
                }}
              >
                <Mark T={T} at={kapan("pihak ketiga bisa")}>
                  Pihak ketiga bisa nggak terikat
                </Mark>
              </div>
              <Sumber T={T} at={s.mulai + 2.2} teks="kalau belum dicatat, mengikat suami-istri saja" />
            </>
          }
        />
      );
    case "mitos4":
      return (
        <KartuMitos
          T={T}
          mulai={s.mulai}
          n={4}
          dari={4}
          teks="Sekali dibuat, nggak bisa diubah."
          coretAt={s.mulai + 2}
        />
      );
    case "ubah":
      return (
        <KartuIsi
          T={T}
          mulai={s.mulai}
          pil="faktanya"
          anak={
            <>
              <div style={judulGaya(58)}>Bisa diubah atau dicabut</div>
              <BarisSyarat T={T} at={kapan("kalian berdua setuju")} anak={<>Kalian berdua setuju</>} />
              <BarisSyarat T={T} at={kapan("nggak merugikan")} anak={<>Nggak merugikan pihak ketiga</>} />
            </>
          }
        />
      );
    case "usaha":
      return (
        <KartuIsi
          T={T}
          mulai={s.mulai}
          pil="kalau buka usaha"
          anak={
            <>
              <BarisIkon T={T} at={s.mulai + 0.3} ikon={<Store {...IK} />} teks="Salah satu buka usaha" />
              <TeksSapu
                T={T}
                at={kapan("bisa jadi pagar")}
                teks="Perjanjian ini bisa jadi pagar buat harta keluarga"
                lama={0.9}
                gaya={judulGaya(56)}
              />
            </>
          }
        />
      );
    case "penutup":
      return (
        <KlipKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          clip="ep05/clips/klip-02.mp4"
          srcStart={1}
          rate={0.85}
          zoom={[1.12, 1.02]}
          kacaY={220}
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
                Ini bukan soal nggak percaya.
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
                <Mark T={T} at={kapan("Ini soal ngobrol")}>
                  Ini soal ngobrol jujur.
                </Mark>
              </div>
            </>
          }
        />
      );
    case "tanya":
      return (
        <FotoKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          file="ep05/photos/foto-03.jpg"
          zoom={[1.24, 1.06]}
          kacaY={1000}
          at={s.mulai + 0.1}
          anak={
            <>
              <div style={{ ...judulGaya(50), marginBottom: 6 }}>Detailnya tanya ke</div>
              <BarisIkon T={T} at={kapan("tanya ke notaris")} ikon={<UserCheck {...IK} />} teks="Notaris" />
              <div style={{ height: 18 }} />
              <BarisIkon T={T} at={kapan("atau K")} ikon={<Users {...IK} />} teks="Atau KUA setempat" />
            </>
          }
        />
      );
    case "komentar":
      return <KartuKomentar T={T} mulai={s.mulai} teks="Lo sama pasangan pernah ngobrolin ini?" />;
    case "cta":
      return (
        <KartuCTA
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          judul="Kirim ke pasangan lo"
          atSimpan={kapan("simpan videonya")}
          atKirim={kapan("kirim ke pasangan")}
          atFollow={kapan("Follow akun")}
          sumber={[
            "UU 1/1974 Pasal 35 dan Pasal 29",
            "Putusan MK 69/PUU-XIII/2015",
            "Pencatatan di KUA atau Dukcapil",
          ]}
        />
      );
    default:
      return <AbsoluteFill style={{ background: C.bg1 }} />;
  }
};

export const Ep05: React.FC = () => {
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

      {SCENES.filter((s) => ["judul4", "venn3d", "mitos2", "mitos3", "mitos4"].includes(s.id)).map((s) => (
        <PitaKaca key={s.id} T={T} at={s.mulai - 0.25} />
      ))}

      <Captions T={T} kata={KATA} />

      <Audio src={staticFile("ep05/voice_over.mp3")} />
    </AbsoluteFill>
  );
};
