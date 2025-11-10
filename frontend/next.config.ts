import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  /* config options here */
  output: 'standalone' as const,
  env: {
    NEXT_PUBLIC_API_URL: process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
    NEXT_ENV: process?.env?.NEXT_ENV || 'development',
  },
};

export default withNextIntl(nextConfig);
