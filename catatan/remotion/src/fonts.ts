import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const SANS = "Plus Jakarta Sans";
export const MONO = "IBM Plex Mono";

loadFont({ family: SANS, url: staticFile("fonts/PlusJakartaSans-latin.woff2"), weight: "200 800" });
loadFont({
  family: SANS,
  url: staticFile("fonts/PlusJakartaSans-latin-ext.woff2"),
  weight: "200 800",
  unicodeRange: "U+0100-02BA, U+1E00-1E9F, U+2C60-2C7F, U+A720-A7FF",
});
loadFont({ family: MONO, url: staticFile("fonts/IBMPlexMono-500.woff2"), weight: "500" });
loadFont({ family: MONO, url: staticFile("fonts/IBMPlexMono-600.woff2"), weight: "600" });
