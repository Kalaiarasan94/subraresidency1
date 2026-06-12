/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        templeGold: '#D4AF37',   // Classic Gold
        sandstone: '#D2B48C',    // Warm Stone
        sacredMaroon: '#800000', // Deep Temple Maroon
        bronzeGlow: '#CD7F32',   // Bronze Accent
        ivoryMist: '#FDF5E6',    // Soft Creamy Ivory
        templeBlack: '#1A1A1A',  // Deep Shadow
        brand: {
          emerald: '#0B4D46', // Royal Emerald Green
          gold: '#C89B3C',    // Luxury Gold
          cream: '#F8F4EB',   // Ivory Cream
          charcoal: '#1C1C1C', // Deep Charcoal
          sand: '#EDE4D3',    // Soft Sand
        },
        hospitality: {
          navy: '#0B4D46',      // Reusing emerald for legacy
          gold: '#C89B3C',      // Reusing gold for legacy
          emerald: '#0B4D46',
          cream: '#F8F4EB',
          muted: '#64748B',
        },
        catalogue: {
          cream: '#FFF9F0', // Lighter tone for cards
          gold: '#C89B3C',
          green: '#0B4D46',
          tan: '#D2B48C',
          ivory: '#F5E6CA', // Warmer tone for background
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        'hms': '12px',
        'luxury': '24px',
      }
    },
  },
  plugins: [],
}
