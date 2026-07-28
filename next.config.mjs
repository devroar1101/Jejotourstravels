/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static export — required for Cloudflare Pages. No server code.
  output: 'export',

  // The next/image optimizer does NOT run on a Pages static export.
  // Leaving this off is the #1 first-push failure. Keep it on.
  images: {
    unoptimized: true,
  },

  // Emit /out/<route>/index.html so clean URLs resolve on Pages.
  trailingSlash: true,

  reactStrictMode: true,

  // Do not fail the production build on lint/type noise — Pages must build green.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
