/** @type {import('next').NextConfig} */


/*
Error: Invalid src prop (/logo-tether.png) on `next/image`, hostname "cryptologos.cc" is not configured under images in your `next.config.js`
*/

const nextConfig = {
  // fixes wallet connect dependency issue https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },

  images: {
    domains: ["cryptologos.cc", "vzrcy5vcsuuocnf3.public.blob.vercel-storage.com"],
  },

  experimental: {
    appDir: true,
  },



  async headers() {
    return [
        {
            // matching all API routes
            source: "/api/:path*",
            headers: [
                { key: "Access-Control-Allow-Credentials", value: "true" },
                { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
            ]
        }
    ]
  }

  
};

export default nextConfig;
