import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { font } from "./tema";

// Font disimpan di public/fonts supaya render tidak perlu internet.
loadFont({
  family: font.keluarga,
  url: staticFile("fonts/PlusJakartaSans-latin.woff2"),
  weight: "200 800",
});

loadFont({
  family: font.keluarga,
  url: staticFile("fonts/PlusJakartaSans-latin-ext.woff2"),
  weight: "200 800",
  unicodeRange:
    "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F, U+1EF2-1EFF, U+2C60-2C7F, U+A720-A7FF",
});
