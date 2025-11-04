const nextConfig = {
  /* config options here */
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  },
};

export default nextConfig;
