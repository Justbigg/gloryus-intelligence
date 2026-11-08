/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Dark mode base
        void: '#080B14',
        surface: '#0D1220',
        panel: '#111827',
        border: '#1E293B',
        // Accent system
        signal: '#00D4FF',    // electric cyan - primary accent
        pulse: '#7C3AED',     // deep violet - secondary
        glow: '#10B981',      // emerald - positive/growth
        amber: '#F59E0B',     // amber - warning/neutral
        hot: '#EF4444',       // red - declining/danger
        // Text
        primary: '#F8FAFC',
        secondary: '#94A3B8',
        muted: '#475569',
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 40V0m40 40V0M0 0h40M0 40h40' stroke='%231E293B' stroke-width='0.5'/%3E%3C/svg%3E\")",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fadeUp 0.5s ease forwards',
        'signal': 'signal 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        signal: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      boxShadow: {
        'glow-signal': '0 0 20px rgba(0, 212, 255, 0.15)',
        'glow-pulse': '0 0 20px rgba(124, 58, 237, 0.15)',
        'panel': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
