const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["dg-ui", "dg-utils"],
  images: {
    remotePatterns: [
      {
        hostname: process.env.NEXT_IMAGE_DOMAIN,
      },
    ],
  },
}

module.exports = withNextIntl(nextConfig);
