import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cherry-rose': {
          DEFAULT: '#B5185F',
          dark: '#93124C',
          light: '#CE2A75',
        },
        'light-yellow': {
          DEFAULT: '#FEFFE0',
          dark: '#F5F7C4',
        },
        'lime-cream': {
          DEFAULT: '#D0E86E',
          dark: '#B7D052',
        },
        'strong-cyan': {
          DEFAULT: '#35C1C2',
          dark: '#2AA5A6',
        },
        'plum-ink': {
          DEFAULT: '#241B21',
          light: '#3C2F38',
          muted: '#62535E',
        },
        'soft-neutral': {
          DEFAULT: '#E7DDE2',
          light: '#F5EFF2',
          dark: '#D4C7CD',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      boxShadow: {
        retro: '4px 4px 0px 0px #241B21',
        'retro-sm': '2px 2px 0px 0px #241B21',
        'retro-lg': '6px 6px 0px 0px #241B21',
        'retro-rose': '4px 4px 0px 0px #B5185F',
      },
      borderRadius: {
        retro: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
