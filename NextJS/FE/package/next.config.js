/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  // Ensure Fast Refresh works in Docker by using polling
  webpack: (config, { isServer, dev }) => {
    if (dev && !isServer) {
      // Use polling for file system events in development
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
      }
    }
    return config
  },
  // Environment variables accessible from browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/token',
  },
}

module.exports = nextConfig
