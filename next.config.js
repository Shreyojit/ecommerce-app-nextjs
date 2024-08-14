/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
        },
      ],
    },
    env: {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    },
  }
  
  module.exports = nextConfig
  