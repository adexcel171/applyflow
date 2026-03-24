/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    domains: ['images.unsplash.com', 'randomuser.me'],
  },
}

module.exports = nextConfig
