/** @type {import('next').NextConfig} */

const appEnv = process.env.APP_ENV || 'dev';

const apiBaseUrl = process.env.API_INTERNAL_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

console.log(`\n[next-config] Running with profile "${appEnv}"`);
console.log(`[next-config] Proxying /api -> ${apiBaseUrl}\n`);

const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${apiBaseUrl}/:path*`
            }
        ];
    }
};

module.exports = nextConfig;
