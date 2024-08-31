/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: undefined,
    experimental: {
        missingSuspenseWithCSRBailout: false,
    }
};

export default nextConfig;
