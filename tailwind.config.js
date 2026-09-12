/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101010',
        charcoal: '#1b1b1b',
        graphite: '#737373',
        mist: '#f5f5f2',
        bone: '#d8d8d3',
        silver: '#ababaa',
      },
      fontFamily: {
        display: ['"Syne"', '"Urbanist"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },
    },
  },
  plugins: [],
}
