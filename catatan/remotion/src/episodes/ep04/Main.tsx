import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Building2, GraduationCap, Globe, HandCoins, Handshake, HeartPulse, PiggyBank } from "lucide-react";
import "../../fonts";
import {
  AMAN,
  C,
  CardBG,
  CatatanLabel,
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
import { Koin3D } from "./Koin3D";
import kataJson from "./words.json";
import timeline from "./timeline.json";

const { KATA, kapan } = buatVo(kataJson);
const IK = { size: 40, strokeWidth: 2.4 };

type Adegan = { id: string; mulai: number; selesai: number };
const SCENES = timeline.scenes as Adegan[];

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

/** Baris iuran: nama program di kiri, angkanya tumbuh di kanan. */
const BarisIuran: React.FC<{
  T: number;
  at: number;
  ikon: React.ReactNode;
  nama: string;
  nilai: number;
  besar?: boolean;
}> = ({ T, at, ikon, nama, nilai, besar = false }) => {
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
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 38, lineHeight: 1.2, color: C.navy }}>
          {nama}
        </div>
        <div
          style={{
            fontFamily: F.sans,
            fontWeight: 800,
            fontSize: besar ? 76 : 56,
            lineHeight: 1.1,
            color: C.aksen,
            letterSpacing: "-0.02em",
          }}
        >
          Rp
          <Angka T={T} at={at} dari={0} sampai={nilai} lama={0.6} ribuan />
          <span style={{ fontSize: 30, color: C.kedua, fontWeight: 600 }}> / bulan</span>
        </div>
      </div>
    </div>
  );
};

/** Kartu putih biasa dengan label catatan N dari 3. */
const KartuCatatan: React.FC<{
  T: number;
  mulai: number;
  n?: number;
  pil?: string;
  anak: React.ReactNode;
}> = ({ T, mulai, n, pil, anak }) => (
  <AbsoluteFill>
    <CardBG />
    <Isi>
      <Kartu T={T} at={mulai} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {n ? <CatatanLabel T={T} at={mulai + 0.1} n={n} dari={3} /> : null}
        {pil ? <Pil T={T} at={mulai + 0.05} teks={pil} /> : null}
        {anak}
      </Kartu>
    </Isi>
  </AbsoluteFill>
);

const judulBesar = (teks: string, ukuran = 64): React.CSSProperties => ({
  fontFamily: F.sans,
  fontWeight: 800,
  fontSize: ukuran,
  lineHeight: 1.12,
  color: C.navy,
  letterSpacing: "-0.015em",
});

const isiAdegan = (id: string, T: number, s: Adegan): React.ReactNode => {
  switch (id) {
    case "hook1":
      return (
        <FotoKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          file="ep04/photos/foto-01.jpg"
          zoom={[1.04, 1.12]}
          naik={[0, -14]}
          kacaY={210}
          at={-1}
          anak={
            <>
              <div style={judulBesar("", 70)}>
                <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 70, lineHeight: 1.08, color: C.navy, letterSpacing: "-0.02em" }}>
                  Kerja sendiri, nggak ada kantor?
                </div>
              </div>
              <div
                style={{
                  marginTop: 22,
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 70,
                  lineHeight: 1.08,
                  color: C.aksen,
                  letterSpacing: "-0.02em",
                }}
              >
                <Mark T={T} at={-1}>
                  Mulai Rp16.800
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
          file="ep04/photos/foto-01.jpg"
          zoom={[1.5, 1.75]}
          geser={[-54, -40]}
          naik={[-307, -290]}
          kacaY={1000}
          at={s.mulai + 0.1}
          anak={judulKaca("Nggak ada kantor yang bayarin BPJS Ketenagakerjaan lo")}
        />
      );
    case "bpu":
      return (
        <KlipKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          clip="ep04/clips/klip-01.mp4"
          srcStart={2.2}
          rate={0.85}
          zoom={[1.05, 1.13]}
          kacaY={990}
          at={s.mulai + 0.1}
          anak={judulKaca("Padahal lo bisa daftar sendiri", "namanya peserta Bukan Penerima Upah")}
        />
      );
    case "hitung":
      return (
        <AbsoluteFill>
          <CardBG />
          <Isi>
            <Kartu T={T} at={s.mulai} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              <Pil T={T} at={s.mulai + 0.05} teks="hitung bareng" />
              <div style={judulBesar("", 72)}>
                <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 72, lineHeight: 1.1, color: C.navy, letterSpacing: "-0.02em" }}>
                  Peserta{" "}
                  <span style={{ color: C.aksen }}>
                    <Mark T={T} at={s.mulai + 0.3}>
                      Bukan Penerima Upah
                    </Mark>
                  </span>
                </div>
              </div>
              <Rise T={T} at={kapan("Ambil penghasilan")} jauh={16}>
                <div
                  style={{
                    fontFamily: F.mono,
                    fontWeight: 500,
                    fontSize: 30,
                    color: C.kedua,
                    borderLeft: `4px solid ${C.aksen}`,
                    paddingLeft: 18,
                  }}
                >
                  pakai penghasilan dasar Rp1.000.000 per bulan
                </div>
              </Rise>
            </Kartu>
          </Isi>
        </AbsoluteFill>
      );
    case "iuran":
      return (
        <KartuCatatan
          T={T}
          mulai={s.mulai}
          n={1}
          anak={
            <BarisIuran
              T={T}
              at={kapan("sepuluh ribu")}
              ikon={<HeartPulse {...IK} />}
              nama="Jaminan Kecelakaan Kerja"
              nilai={10000}
            />
          }
        />
      );
    case "jkm":
      return (
        <KartuCatatan
          T={T}
          mulai={s.mulai}
          n={1}
          anak={
            <>
              <BarisIuran
                T={T}
                at={s.mulai - 1}
                ikon={<HeartPulse {...IK} />}
                nama="Jaminan Kecelakaan Kerja"
                nilai={10000}
              />
              <BarisIuran
                T={T}
                at={kapan("enam ribu")}
                ikon={<HandCoins {...IK} />}
                nama="Jaminan Kematian"
                nilai={6800}
              />
            </>
          }
        />
      );
    case "total":
      return (
        <KartuCatatan
          T={T}
          mulai={s.mulai}
          n={1}
          anak={
            <>
              <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 40, color: C.kedua }}>
                Rp10.000 + Rp6.800
              </div>
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 96,
                  lineHeight: 1.05,
                  color: C.aksen,
                  letterSpacing: "-0.02em",
                }}
              >
                <Mark T={T} at={kapan("enam belas")}>
                  Rp
                  <Angka T={T} at={kapan("enam belas")} dari={0} sampai={16800} lama={0.7} ribuan />
                </Mark>
              </div>
              <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 42, color: C.navy }}>
                per bulan
              </div>
              <Sumber T={T} at={s.mulai + 1.6} teks="BPJS Ketenagakerjaan · iuran peserta BPU" />
            </>
          }
        />
      );
    case "koin3d":
      return (
        <Koin3D T={T} mulai={s.mulai} selesai={s.selesai} atKali12={kapan("Kali dua belas")} />
      );
    case "dapat":
      return (
        <FotoKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          file="ep04/photos/foto-02.jpg"
          zoom={[1.08, 1.16]}
          geser={[40, -40]}
          kacaY={1000}
          at={s.mulai + 0.05}
          anak={judulKaca("Terus lo dapat apa?")}
        />
      );
    case "manfaat1":
      return (
        <KartuCatatan
          T={T}
          mulai={s.mulai}
          n={2}
          anak={
            <>
              <div style={judulBesar("", 58)}>
                <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 58, lineHeight: 1.12, color: C.navy, letterSpacing: "-0.015em" }}>
                  Kecelakaan pas kerja
                </div>
              </div>
              <BarisSyarat
                T={T}
                at={kapan("biaya pengobatannya")}
                anak={<>Biaya pengobatan ditanggung sesuai kebutuhan medis</>}
              />
              <Sumber T={T} at={kapan("sesuai kebutuhan") + 0.5} teks="Manfaat JKK peserta BPU" />
            </>
          }
        />
      );
    case "manfaat2":
      return (
        <KartuCatatan
          T={T}
          mulai={s.mulai}
          n={2}
          anak={
            <>
              <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 56, lineHeight: 1.12, color: C.navy, letterSpacing: "-0.015em" }}>
                Kalau lo meninggal dunia
              </div>
              <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 38, color: C.kedua }}>
                keluarga dapat santunan total
              </div>
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 92,
                  lineHeight: 1.05,
                  color: C.aksen,
                  letterSpacing: "-0.02em",
                }}
              >
                <Mark T={T} at={kapan("empat puluh dua")}>
                  Rp42 juta
                </Mark>
              </div>
              <Sumber T={T} at={s.mulai + 2.4} teks="Manfaat JKM peserta BPU" />
            </>
          }
        />
      );
    case "beasiswa":
      return (
        <KartuCatatan
          T={T}
          mulai={s.mulai}
          n={2}
          anak={
            <>
              <BarisSyarat
                T={T}
                at={kapan("Ada juga beasiswa")}
                anak={<>Beasiswa untuk maksimal 2 anak</>}
              />
              <Rise T={T} at={kapan("dengan syarat")} jauh={14}>
                <div
                  style={{
                    fontFamily: F.mono,
                    fontWeight: 500,
                    fontSize: 30,
                    color: C.kedua,
                    borderLeft: `4px solid ${C.aksen}`,
                    paddingLeft: 18,
                  }}
                >
                  ada syaratnya, termasuk lama masa iuran
                </div>
              </Rise>
            </>
          }
        />
      );
    case "jht":
      return (
        <KartuCatatan
          T={T}
          mulai={s.mulai}
          n={3}
          anak={
            <>
              <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 58, lineHeight: 1.12, color: C.navy, letterSpacing: "-0.015em" }}>
                Mau sekalian nabung hari tua?
              </div>
              <BarisIuran
                T={T}
                at={kapan("dua puluh ribu")}
                ikon={<PiggyBank {...IK} />}
                nama="Tambah JHT, opsional"
                nilai={20000}
              />
            </>
          }
        />
      );
    case "jht2":
      return (
        <KartuCatatan
          T={T}
          mulai={s.mulai}
          n={3}
          anak={
            <>
              <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 40, color: C.kedua }}>
                Rp16.800 + Rp20.000
              </div>
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 92,
                  lineHeight: 1.05,
                  color: C.aksen,
                  letterSpacing: "-0.02em",
                }}
              >
                <Mark T={T} at={kapan("Jadi tiga puluh")}>
                  {rupiah(36800)}
                </Mark>
              </div>
              <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 42, color: C.navy }}>
                per bulan
              </div>
            </>
          }
        />
      );
    case "daftar":
      return (
        <KartuCatatan
          T={T}
          mulai={s.mulai}
          n={3}
          anak={
            <>
              <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: C.navy, letterSpacing: "-0.015em" }}>
                Daftarnya lewat
              </div>
              {[
                { ikon: <Globe {...IK} />, teks: "Situs resmi", at: kapan("situs resmi") },
                { ikon: <Building2 {...IK} />, teks: "Kantor cabang", at: kapan("kantor cabang") },
                { ikon: <Handshake {...IK} />, teks: "Mitra resmi", at: kapan("mitra resmi") },
              ].map((b, i) => {
                const m = springAt(T, b.at - 0.15, 12);
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 22,
                      opacity: ramp(T, b.at - 0.2, b.at),
                      transform: `translateX(${(1 - m) * 24}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 72,
                        height: 72,
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
                    <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 44, color: C.navy }}>
                      {b.teks}
                    </div>
                  </div>
                );
              })}
            </>
          }
        />
      );
    case "naik":
      return (
        <KartuCatatan
          T={T}
          mulai={s.mulai}
          pil="catatan penting"
          anak={
            <>
              <TeksSapu
                T={T}
                at={s.mulai + 0.2}
                teks="Iuran naik kalau penghasilan yang lo laporin lebih besar"
                lama={0.9}
                gaya={judulBesar("", 58)}
              />
              <Sumber T={T} at={s.mulai + 1.4} teks="Rp16.800 dipakai untuk penghasilan dasar Rp1 juta" />
            </>
          }
        />
      );
    case "rutin":
      return (
        <KlipKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          clip="ep04/clips/klip-02.mp4"
          srcStart={0.2}
          rate={0.85}
          zoom={[1.06, 1.14]}
          kacaY={1000}
          at={s.mulai + 0.05}
          anak={judulKaca("Bayar rutin biar perlindungannya tetap aktif")}
        />
      );
    case "penutup":
      return (
        <FotoKaca
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          file="ep04/photos/foto-03.jpg"
          zoom={[1.2, 1.02]}
          kacaY={220}
          at={s.mulai + 0.05}
          anak={
            <>
              <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 62, lineHeight: 1.08, color: C.navy, letterSpacing: "-0.02em" }}>
                Lo kerja buat keluarga.
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 62,
                  lineHeight: 1.08,
                  color: C.aksen,
                  letterSpacing: "-0.02em",
                }}
              >
                <Mark T={T} at={kapan("nggak ikut jatuh")}>
                  Biar keluarga nggak ikut jatuh.
                </Mark>
              </div>
            </>
          }
        />
      );
    case "komentar":
      return (
        <KartuKomentar
          T={T}
          mulai={s.mulai}
          teks="Lo udah punya BPJS Ketenagakerjaan, atau belum?"
        />
      );
    case "cta":
      return (
        <KartuCTA
          T={T}
          mulai={s.mulai}
          selesai={s.selesai}
          judul="Kirim ke temen yang kerja sendiri"
          atSimpan={kapan("simpan videonya")}
          atKirim={kapan("kirim ke temen")}
          atFollow={kapan("Follow akun")}
          sumber={[
            "BPJS Ketenagakerjaan · iuran dan manfaat peserta BPU",
            "JKK Rp10.000 · JKM Rp6.800 · JHT opsional Rp20.000",
            "Angka untuk penghasilan dasar Rp1.000.000 per bulan",
          ]}
        />
      );
    default:
      return <AbsoluteFill style={{ background: C.bg1 }} />;
  }
};

export const Ep04: React.FC = () => {
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

      {SCENES.filter((s) => ["hitung", "koin3d", "dapat", "jht", "rutin"].includes(s.id)).map((s) => (
        <PitaKaca key={s.id} T={T} at={s.mulai - 0.25} />
      ))}

      <Captions T={T} kata={KATA} />

      <Audio src={staticFile("ep04/voice_over.mp3")} />
    </AbsoluteFill>
  );
};
