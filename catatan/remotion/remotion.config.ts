import fs from "node:fs";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setEntryPoint("./src/index.ts");

const chrome = process.env.REMOTION_CHROME ?? "/opt/pw-browsers/chromium";
if (fs.existsSync(chrome)) {
  Config.setBrowserExecutable(chrome);
}
