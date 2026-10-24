import React from "react";
import { AbsoluteFill } from "remotion";
import { Clip, Foto, Plat } from "../lib";

export const AdeganFoto: React.FC<{
  T: number;
  mulai: number;
  selesai: number;
  file: string;
  zoom?: [number, number];
  geser?: [number, number];
  naik?: [number, number];
  children?: React.ReactNode;
}> = ({ T, mulai, selesai, file, zoom, geser, naik, children }) => (
  <AbsoluteFill>
    <Foto
      file={file}
      dur={selesai - mulai}
      T={T}
      mulai={mulai}
      zoom={zoom}
      geser={geser}
      naik={naik}
    />
    {children}
  </AbsoluteFill>
);

export const AdeganKlip: React.FC<{
  T: number;
  mulai: number;
  selesai: number;
  clip: string;
  srcStart?: number;
  rate?: number;
  zoom?: [number, number];
  geser?: [number, number];
  plates?: Plat[];
  shakeAt?: number[];
  children?: React.ReactNode;
}> = ({ T, mulai, selesai, clip, srcStart, rate, zoom, geser, plates, shakeAt, children }) => (
  <AbsoluteFill>
    <Clip
      clip={clip}
      srcStart={srcStart}
      rate={rate}
      zoom={zoom}
      geser={geser}
      dur={selesai - mulai}
      T={T}
      mulai={mulai}
      plates={plates}
      shakeAt={shakeAt}
    />
    {children}
  </AbsoluteFill>
);
