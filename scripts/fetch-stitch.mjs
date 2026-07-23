import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const mcpPath = join(process.env.USERPROFILE || "", ".cursor", "mcp.json");

const mcp = JSON.parse(readFileSync(mcpPath, "utf8"));
const apiKey = mcp.mcpServers?.stitch?.headers?.["X-Goog-Api-Key"];

if (!apiKey) {
  console.error("No Stitch API key found in ~/.cursor/mcp.json");
  process.exit(1);
}

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

const outDir = join(root, ".stitch-cache");
mkdirSync(outDir, { recursive: true });

const projectsRes = await callTool("list_projects", {});
writeFileSync(join(outDir, "projects.json"), JSON.stringify(projectsRes, null, 2));

const projects =
  projectsRes?.result?.structuredContent?.projects ??
  (projectsRes?.result?.content?.[0]?.text
    ? JSON.parse(projectsRes.result.content[0].text).projects
    : []);

console.log(`Found ${Array.isArray(projects) ? projects.length : 0} projects`);

const projectList = Array.isArray(projects) ? projects : [];
for (const project of projectList) {
  const projectId = String(
    project.name?.replace("projects/", "") || project.projectId || project.id
  );
  const title = project.title || project.displayName || projectId;
  console.log(`- ${title} (${projectId})`);

  const screensRes = await callTool("list_screens", { projectId });
  const screensDir = join(outDir, projectId);
  mkdirSync(screensDir, { recursive: true });
  writeFileSync(
    join(screensDir, "screens.json"),
    JSON.stringify(screensRes, null, 2)
  );

  let screens =
    screensRes?.result?.content?.[0]?.text
      ? JSON.parse(screensRes.result.content[0].text)
      : screensRes?.result?.structuredContent?.screens ||
        screensRes?.result?.screens ||
        [];

  if (!Array.isArray(screens)) screens = [];

  for (const screen of screens) {
    const screenId = String(
      screen.name?.split("/screens/")[1] ||
        screen.screenId ||
        screen.id
    );
    const screenName = screen.title || screen.displayName || screenId;

    const detailRes = await callTool("get_screen", {
      name: `projects/${projectId}/screens/${screenId}`,
      projectId,
      screenId,
    });

    writeFileSync(
      join(screensDir, `${screenId}.json`),
      JSON.stringify(detailRes, null, 2)
    );

    try {
      const codeRes = await callTool("fetch_screen_code", {
        name: `projects/${projectId}/screens/${screenId}`,
        projectId,
        screenId,
      });
      writeFileSync(
        join(screensDir, `${screenId}.code.json`),
        JSON.stringify(codeRes, null, 2)
      );
    } catch {
      /* optional */
    }

    console.log(`  · ${screenName} (${screenId})`);
  }
}

console.log(`\nSaved to ${outDir}`);
