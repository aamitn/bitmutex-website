// download-seed.ts
// Downloads seed-data.tar.gz into the project root

import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const DEFAULT_FILE_URL =
  "https://github.com/aamitn/bitmutex-website/releases/download/INTERNAL-0/seed-data.tar.gz";

// Allow override via env
const FILE_URL = process.env.SEED_DATA_URL || DEFAULT_FILE_URL;

const OUTPUT_PATH = path.join(process.cwd(), "seed-data.tar.gz");

// Skip download if file already exists
if (fs.existsSync(OUTPUT_PATH)) {
  console.log("✅ seed-data.tar.gz already exists. Skipping download.");
  process.exit(0);
}

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https
      .get(url, (response) => {
        // Handle redirects
        if (
          response.statusCode &&
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          file.close();
          fs.unlink(dest, () => {});

          return download(response.headers.location, dest)
            .then(resolve)
            .catch(reject);
        }

        if (response.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});

          return reject(
            new Error(
              `Download failed: ${response.statusCode} (${url})`
            )
          );
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close(() => {
            console.log(`✅ Downloaded seed data from: ${url}`);
            console.log(`📦 Saved to: ${OUTPUT_PATH}`);
            resolve();
          });
        });
      })
      .on("error", (err) => {
        file.close();
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

console.log(`🌐 Using seed URL: ${FILE_URL}`);

download(FILE_URL, OUTPUT_PATH).catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});