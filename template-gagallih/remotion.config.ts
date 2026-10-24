import fs from "node:fs";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setEntryPoint("./src/index.ts");

// Di mesin cloud, Chromium sudah terpasang. Kalau tidak ada, Remotion pakai
// browser bawaannya sendiri.
const chromium = "/opt/pw-browsers/chromium";
if (fs.existsSync(chromium)) {
  Config.setBrowserExecutable(chromium);
}
