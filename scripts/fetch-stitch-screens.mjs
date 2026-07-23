import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const mcpPath = join(process.env.USERPROFILE || "", ".cursor", "mcp.json");
const mcp = JSON.parse(readFileSync(mcpPath, "utf8"));
const apiKey = mcp.mcpServers.stitch.headers["X-Goog-Api-Key"];
const projectId = "16631126552039360991";

const keyScreens = [
  "3bbe7f809f7642d9b150028e330b57af",
  "710008f5dfb54336ab3738003f95f6b7",
  "b40a6a126b6045f381cb4fd440ab02a8",
  "752245e124a9439b82a70f682ba883b4",
  "3f9a9bf0f2de453181551da39a1fa060",
  "5720607af4934137bf50bb47e32cdfb4",
  "285524d07ebe4be58f7453d94572964e",
  "8ae17002fd82414389dd020deee642b5",
];

async function callTool(name, args = {}) {
  const res = await fetch("https://stitch.googleapis.com/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });
  return res.json();
}

function parseContent(res) {
  const text = res?.result?.content?.[0]?.text;
  if (text) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return res?.result?.structuredContent ?? res?.result;
}

const outDir = join(root, ".stitch-cache", projectId);
mkdirSync(outDir, { recursive: true });

for (const screenId of keyScreens) {
  console.log(`Fetching ${screenId}...`);

  for (const tool of ["get_screen", "fetch_screen_code", "fetch_screen_image"]) {
    try {
      const res = await callTool(tool, {
        name: `projects/${projectId}/screens/${screenId}`,
        projectId,
        screenId,
      });
      writeFileSync(
        join(outDir, `${screenId}.${tool}.json`),
        JSON.stringify(parseContent(res), null, 2)
      );
    } catch (e) {
      console.log(`  ${tool} failed`);
    }
  }
}

const designRes = await callTool("extract_design_context", {
  name: `projects/${projectId}/screens/3bbe7f809f7642d9b150028e330b57af`,
  projectId,
  screenId: "3bbe7f809f7642d9b150028e330b57af",
});
writeFileSync(
  join(outDir, "design-context.json"),
  JSON.stringify(parseContent(designRes), null, 2)
);

console.log("Done");
