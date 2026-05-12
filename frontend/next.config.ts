import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Génère un serveur standalone pour Docker (image prod légère)
  output: "standalone",
};

export default nextConfig;
