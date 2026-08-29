/** @type {import('next').NextConfig} */

const nextConfig = {
  crossOrigin: 'anonymous',
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300
      };
    }
    return config;
  },
};

export default nextConfig;
