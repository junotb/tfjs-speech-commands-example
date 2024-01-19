/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // plugin config, etc
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;
