/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#050816',
        'background-elevated': '#0B1024',
        surface: 'rgba(255, 255, 255, 0.04)',
        'surface-elevated': 'rgba(255, 255, 255, 0.07)',
        border: 'rgba(255, 255, 255, 0.1)',
        'border-glow': 'rgba(99, 102, 241, 0.35)',
        muted: '#94A3B8',
        accent: '#F8FAFC',
        'accent-foreground': '#050816',
        primary: '#6366F1',
        violet: '#9333EA',
        cyan: '#22D3EE',
        destructive: '#F87171',
        amber: '#FBBF24',
      },
      boxShadow: {
        glow: '0 0 24px rgba(99, 102, 241, 0.45)',
        'glow-violet': '0 0 28px rgba(147, 51, 234, 0.4)',
      },
    },
  },
  plugins: [],
};
