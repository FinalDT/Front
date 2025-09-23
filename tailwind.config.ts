import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neo-Brutalism Color Palette
        bg: 'var(--color-bg)',
        ink: 'var(--color-ink)',
        border: 'var(--color-border)',
        'border-light': 'var(--color-border-light)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        'accent-dark': 'var(--color-accent-dark)',
        soft: 'var(--color-soft)',
        'soft-light': 'var(--color-soft-light)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      boxShadow: {
        'brutal-sm': '0 4px 0 rgba(11, 11, 11, 1)',
        'brutal-md': '0 6px 0 rgba(11, 11, 11, 1)',
        'brutal-lg': '0 8px 0 rgba(11, 11, 11, 1)',
        'brutal-xl': '0 12px 0 rgba(11, 11, 11, 1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-gentle': 'pulseGentle 1.5s ease-in-out infinite',
      },
      keyframes: {
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        pulseGentle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
