import crypto from "crypto";
import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

/**
 * Restores binary public assets listed in `assets-src/assets.json`.
 *
 * Why this exists: this site deploys from a repo that can only receive text
 * file commits, so binary assets cannot be committed directly. Instead the
 * manifest records a URL and a sha256 for each binary, and the build fetches
 * and verifies them into `public/` before Vite copies that folder.
 *
 * A file is only downloaded when it is missing or its hash does not match, so
 * local builds do no network work. A missing download or a hash mismatch fails
 * the build rather than shipping a stale asset.
 */

type AssetEntry = {
  file: string;
  url: string;
  sha256: string;
};

function sha256(bytes: Buffer) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

export default function decodeAssetsPlugin(): Plugin {
  const manifestPath = path.resolve(__dirname, "../../assets-src/assets.json");
  const outDir = path.resolve(__dirname, "../../public");

  async function restoreAll() {
    if (!fs.existsSync(manifestPath)) return;

    const entries: AssetEntry[] = JSON.parse(
      fs.readFileSync(manifestPath, "utf8"),
    ).assets;

    for (const entry of entries) {
      const target = path.join(outDir, entry.file);

      if (
        fs.existsSync(target) &&
        sha256(fs.readFileSync(target)) === entry.sha256
      ) {
        continue;
      }

      const response = await fetch(entry.url);
      if (!response.ok) {
        throw new Error(
          `decode-assets: failed to fetch ${entry.file} (HTTP ${response.status})`,
        );
      }

      const bytes = Buffer.from(await response.arrayBuffer());
      const actual = sha256(bytes);
      if (actual !== entry.sha256) {
        throw new Error(
          `decode-assets: hash mismatch for ${entry.file}. Expected ${entry.sha256}, got ${actual}.`,
        );
      }

      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, bytes);
    }
  }

  return {
    name: "decode-assets",
    async buildStart() {
      await restoreAll();
    },
    async configureServer() {
      await restoreAll();
    },
  };
}
