import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";
import { COMMUNITIES, DESTINATIONS, PROJECTS } from "../../src/web/lib/town/content";

/** GitHub Pages needs physical entry files for direct, successful section requests. */
export default function townPagesPlugin(): Plugin {
  let outputDirectory = "";
  return {
    name: "town-static-pages",
    apply: "build",
    configResolved(config) {
      outputDirectory = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const entry = path.join(outputDirectory, "index.html");
      const routes = [
        ...DESTINATIONS.map((destination) => destination.path),
        ...COMMUNITIES.map((community) => `/communities/${community.id}`),
        ...PROJECTS.map((project) => `/projects/${project.id}`),
        "/play",
      ];
      await Promise.all(
        routes.map(async (route) => {
          const directory = path.join(outputDirectory, route.slice(1));
          await mkdir(directory, { recursive: true });
          await copyFile(entry, path.join(directory, "index.html"));
        }),
      );
      await copyFile(entry, path.join(outputDirectory, "404.html"));
      await writeFile(path.join(outputDirectory, ".nojekyll"), "");
    },
  };
}
