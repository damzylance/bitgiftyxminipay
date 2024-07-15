/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false
    }
    return config
  },
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pretium.africa',
        port: '',
        pathname: '/icons/**',
      },
    ],
  },
}

module.exports = nextConfig
