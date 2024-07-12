/** @type {import('next').NextConfig} */


/*
Error: Invalid src prop (https://cryptologos.cc/logos/tether-usdt-logo.png) on `next/image`, hostname "cryptologos.cc" is not configured under images in your `next.config.js`
*/

const nextConfig = {
  // fixes wallet connect dependency issue https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },

  images: {
    domains: ["cryptologos.cc"],
  },
  
};

export default nextConfig;
