/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#2D1B69',
          'purple-mid': '#5340B0',
          'purple-light': '#F5F3FF',
          orange: '#E8521A',
          'orange-light': '#F57C46',
          'orange-bg': '#FEF0E7',
        },
        'text-primary': 'rgb(var(--color-text-primary-rgb) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted-rgb) / <alpha-value>)',
        'bg-primary': 'rgb(var(--color-bg-primary-rgb) / <alpha-value>)',
        'bg-surface': 'rgb(var(--color-bg-surface-rgb) / <alpha-value>)',
        'border-color': 'rgb(var(--color-border-color-rgb) / <alpha-value>)',
        border: 'rgb(var(--color-border-color-rgb) / <alpha-value>)',
        input: 'rgb(var(--color-bg-surface-rgb) / <alpha-value>)',
        ring: 'rgb(var(--color-brand-purple-rgb) / <alpha-value>)',
        background: 'rgb(var(--color-bg-primary-rgb) / <alpha-value>)',
        foreground: 'rgb(var(--color-text-primary-rgb) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--color-brand-purple-rgb) / <alpha-value>)',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-brand-purple-mid-rgb) / <alpha-value>)',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: 'rgb(var(--color-bg-surface-rgb) / <alpha-value>)',
          foreground: 'rgb(var(--color-text-muted-rgb) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-brand-orange-rgb) / <alpha-value>)',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: 'rgb(var(--color-bg-primary-rgb) / <alpha-value>)',
          foreground: 'rgb(var(--color-text-primary-rgb) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--color-bg-primary-rgb) / <alpha-value>)',
          foreground: 'rgb(var(--color-text-primary-rgb) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
