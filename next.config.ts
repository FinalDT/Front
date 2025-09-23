import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 성능 최적화
  compress: true,
  poweredByHeader: false,
  
  // 이미지 최적화
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30일
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 실험적 기능
  experimental: {
    // 향후 PPR(Partial Prerendering) 활성화 고려
    // ppr: true,
    
    // 최적화된 패키지 임포트
    optimizePackageImports: ['@/components/ui', '@/components/features'],
  },
  
  // 헤더 보안 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // 번들 분석을 위한 설정 (개발 시)
  webpack: (config, { dev, isServer }) => {
    // 프로덕션에서 번들 크기 최적화
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // 벤더 라이브러리 분리
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // 공통 컴포넌트 분리
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;
