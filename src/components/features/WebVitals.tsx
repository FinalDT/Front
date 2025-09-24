'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

export function WebVitals() {
  useEffect(() => {
    // Core Web Vitals 측정 및 전송
    onCLS((metric: Metric) => {
      // Cumulative Layout Shift
      sendToAnalytics('CLS', metric);
    });

    onINP((metric: Metric) => {
      // Interaction to Next Paint (새로운 표준 지표)
      sendToAnalytics('INP', metric);
    });

    onLCP((metric: Metric) => {
      // Largest Contentful Paint (가장 중요한 지표)
      sendToAnalytics('LCP', metric);
    });

    // 추가 유용한 지표들
    onFCP((metric: Metric) => {
      // First Contentful Paint
      sendToAnalytics('FCP', metric);
    });

    onTTFB((metric: Metric) => {
      // Time to First Byte
      sendToAnalytics('TTFB', metric);
    });

    // INP (Interaction to Next Paint) - 최신 브라우저에서 지원
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'event') {
              // INP 유사 측정
              sendToAnalytics('INP', {
                name: 'INP',
                value: entry.duration,
                id: entry.name,
                rating: 'good',
                delta: entry.duration,
                entries: [entry],
                navigationType: 'navigate'
              });
            }
          }
        });
        observer.observe({ type: 'event', buffered: true });
      } catch (e) {
        // 지원하지 않는 브라우저에서는 무시
        console.debug('INP measurement not supported');
      }
    }
  }, []);

  return null; // 렌더링할 UI 없음
}

// 분석 서비스로 메트릭 전송
function sendToAnalytics(metricName: string, metric: Metric) {
  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Web Vital - ${metricName}:`, {
      ...metric,
    });
    return;
  }

  // 프로덕션에서는 실제 분석 서비스로 전송
  try {
    // Google Analytics 4 예시 (gtag가 있을 때만)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as { gtag: (command: string, action: string, params: Record<string, unknown>) => void }).gtag('event', metricName, {
        custom_map: { metric_value: 'value' },
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_delta: metric.delta,
      });
    }

    // 커스텀 분석 API로 전송
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: metricName,
        value: metric.value,
        id: metric.id,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        rating: getMetricRating(metricName, metric.value),
      }),
    }).catch((error) => {
      // 분석 전송 실패는 사용자 경험에 영향주지 않도록 조용히 처리
      console.debug('Analytics sending failed:', error);
    });
  } catch (error) {
    console.debug('Analytics error:', error);
  }
}

// Web Vitals 점수 등급 판정
function getMetricRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, { good: number; poor: number }> = {
    LCP: { good: 2500, poor: 4000 },     // ms
    INP: { good: 200, poor: 500 },       // ms
    CLS: { good: 0.1, poor: 0.25 },      // score
    FCP: { good: 1800, poor: 3000 },     // ms
    TTFB: { good: 800, poor: 1800 },     // ms
  };

  const threshold = thresholds[name];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// 개발 도구용 성능 리포트 생성
export function generatePerformanceReport() {
  if (process.env.NODE_ENV !== 'development') return;

  const report = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    metrics: {} as Record<string, Metric>,
  };

  // 모든 Web Vitals 한 번에 수집
  onCLS((metric: Metric) => { report.metrics.CLS = metric; });
  onINP((metric: Metric) => { report.metrics.INP = metric; });
  onLCP((metric: Metric) => { report.metrics.LCP = metric; });
  onFCP((metric: Metric) => { report.metrics.FCP = metric; });
  onTTFB((metric: Metric) => { report.metrics.TTFB = metric; });

  setTimeout(() => {
    console.table(
      Object.entries(report.metrics).map(([name, metric]) => ({
        Metric: name,
        Value: `${metric.value.toFixed(2)}${name === 'CLS' ? '' : 'ms'}`,
        Rating: getMetricRating(name, metric.value),
        Delta: metric.delta?.toFixed(2) || 'N/A',
      }))
    );
  }, 2000); // 충분한 시간 후 리포트 생성
}
