/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta femenina para pijamas - rosados suaves y lavandas
        primary: {
          50: '#fdf2f8', // Rosa muy claro
          100: '#fce7f3', // Rosa pastel
          200: '#fbcfe8', // Rosa suave
          300: '#f9a8d4', // Rosa medio
          400: '#f472b6', // Rosa vibrante
          500: '#ec4899', // Rosa principal
          600: '#db2777', // Rosa intenso
          700: '#be185d', // Rosa oscuro
          800: '#9d174d', // Rosa muy oscuro
          900: '#831843', // Rosa profundo
        },
        secondary: {
          50: '#f8fafc', // Lavanda muy claro
          100: '#f1f5f9', // Lavanda pastel
          200: '#e2e8f0', // Lavanda suave
          300: '#cbd5e1', // Lavanda medio
          400: '#94a3b8', // Lavanda vibrante
          500: '#64748b', // Lavanda principal
          600: '#475569', // Lavanda intenso
          700: '#334155', // Lavanda oscuro
          800: '#1e293b', // Lavanda muy oscuro
          900: '#0f172a', // Lavanda profundo
        },
        accent: {
          50: '#fefce8', // Amarillo muy claro
          100: '#fef9c3', // Amarillo pastel
          200: '#fef08a', // Amarillo suave
          300: '#fde047', // Amarillo medio
          400: '#facc15', // Amarillo vibrante
          500: '#eab308', // Amarillo principal
          600: '#ca8a04', // Amarillo intenso
          700: '#a16207', // Amarillo oscuro
          800: '#854d0e', // Amarillo muy oscuro
          900: '#713f12', // Amarillo profundo
        },
        // Mantener colores originales con nuevos nombres
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#F28C38',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
