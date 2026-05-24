import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships WASM that breaks when bundled by Turbopack/Webpack.
  // Keep it external so its own runtime file resolution works.
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
