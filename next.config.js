/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['socket.io']
  },
  // Отключаем telemetry
  telemetry: false
}

module.exports = nextConfig