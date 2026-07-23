import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cacheDir = join(__dirname, "..", ".stitch-cache", "16631126552039360991");
const htmlDir = join(cacheDir, "html");
mkdirSync(htmlDir, { recursive: true });

const screensData = JSON.parse(
  readFileSync(join(cacheDir, "screens.json"), "utf8")
);
const screens =
  screensData?.result?.structuredContent?.screens ??
  JSON.parse(screensData.result.content[0].text).screens;

for (const screen of screens) {
  const id = screen.name.split("/screens/")[1];
  const url = screen.htmlCode?.downloadUrl;
  const title = screen.title || id;
  if (!url || screen.htmlCode?.mimeType !== "text/html") continue;
  if (screen.deviceType && screen.deviceType !== "MOBILE") continue;

  const res = await fetch(url);
  const html = await res.text();
  const safeName = title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  writeFileSync(join(htmlDir, `${id}.html`), html);
  writeFileSync(
    join(htmlDir, `${id}.meta.json`),
    JSON.stringify(
      { id, title, width: screen.width, height: screen.height },
      null,
      2
    )
  );
  console.log(`Saved: ${title}`);
}
