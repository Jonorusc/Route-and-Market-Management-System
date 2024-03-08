import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'
import aspectRatio from '@tailwindcss/aspect-ratio'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1054px',
      xl: '1440px'
    },
    colors: {
      primary: '#0e044a',
      secondary: '#7f43ff',
      background: '#f8f8f8',
      backgroundLight: '#dee6f8',
      labels: '#2f4565',
      labelsLight: '#2f456550',
      positive: '#21ba45',
      negative: '#c10015',
      info: '#31ccec',
      warning: '#f2c037'
    },
    extend: {}
  },
  plugins: [typography, forms, aspectRatio]
}
