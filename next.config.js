/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        pathname: '/img/wn/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.weatherapi.com',
        pathname: '/weather/**'
      }
    ]
  }
};

module.exports = nextConfig;
