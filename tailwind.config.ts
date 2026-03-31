import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:    '#1a1a2e',
        'navy-dark': '#16213e',
        blue:    '#2d4aa8',
        accent:  '#7eceff',
        emerald: '#10b981',
      },
      fontFamily: {
        sans:   ['var(--font-jakarta)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        bebas:  ['var(--font-bebas)', 'cursive'],
      },
    },
  },
  plugins: [],
}

export default config
