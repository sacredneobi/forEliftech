import * as esbuild from "esbuild";

await esbuild.build({
  minify: true,
  color: true,
  keepNames: true,
  logLevel: "info",
  entryPoints: ["index.js"],
  bundle: true,
  platform: "node",
  metafile: true,
  inject: ["./loaderResolve.js"],
  outfile: "../createPack/index.js",
  legalComments: "none",
  treeShaking: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
