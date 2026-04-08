import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Souul design tokens — warm, calm, accessible
        brand: {
          50:  '#f0f9f4',
          100: '#dcf1e6',
          200: '#b9e2ce',
          300: '#8acbaf',
          400: '#57af8a',
          500: '#35926f',  // primary brand
          600: '#277559',
          700: '#215e48',
          800: '#1d4b3a',
          900: '#193e30',
        },
        calm: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',  // calm/break accent
        },
        warm: {
          50:  '#fff8f1',
          100: '#fef0dd',
          200: '#fcddb0',
          300: '#fac57a',
          400: '#f8a543',
          500: '#f68b1f',  // celebration accent
        },
        // Semantic
        surface: '#fafaf9',
        'surface-raised': '#ffffff',
        'surface-subtle': '#f5f5f4',
        border: '#e7e5e4',
        'text-primary': '#1c1917',
        'text-secondary': '#57534e',
        'text-muted': '#a8a29e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Child player specific — oversized for accessibility
        'player-step': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'player-action': ['1.125rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        player: '1.5rem',  // large rounded corners for child buttons
      },
      spacing: {
        'touch-min': '44px',   // WCAG minimum touch target
        'player-btn': '64px',  // Child mode button height
      },
    },
  },
  plugins: [],
}

export default config
