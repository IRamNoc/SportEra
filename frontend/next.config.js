/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:3000/api/:path*', // Proxy vers le backend
      },
    ];
  },
}

module.exports = nextConfig
