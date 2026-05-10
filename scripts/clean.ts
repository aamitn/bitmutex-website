import fs from "node:fs";
import path from "node:path";

const pathsToDelete = [
  "node_modules",
  "bun.lock",

  "client/node_modules",
  "client/.next",
  "client/dist",
  "client/build",
  "client/.turbo",

  "server/node_modules",
  "server/dist",
  "server/build",
  "server/.cache",
  "server/.strapi",
  "server/.turbo",
];

function remove(targetPath: string) {
  const fullPath = path.resolve(targetPath);

  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, {
      recursive: true,
      force: true,
    });

    console.log(`Deleted: ${targetPath}`);
  }
}

for (const target of pathsToDelete) {
  remove(target);
}

function removeTsBuildInfo(dir: string) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".git"
      ) {
        continue;
      }

      removeTsBuildInfo(fullPath);
    } else if (entry.name.endsWith(".tsbuildinfo")) {
      fs.rmSync(fullPath, {
        force: true,
      });

      console.log(`Deleted: ${fullPath}`);
    }
  }
}

removeTsBuildInfo(process.cwd());

console.log("Cleanup complete.");