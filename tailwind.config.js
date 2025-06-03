/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cosmic': {
          'deepest': '#090C15', // Deepest shadow
          'deep': '#0F172A',    // Deep cosmic background
          'medium': '#1E293B',  // Medium cosmic shade
          'light': '#334155',   // Lighter cosmic accent
        },
        'flame': {
          'blue': '#3B82F6',    // Blue flame
          'cyan': '#06B6D4',    // Cyan accent for blue flame
          'orange': '#F59E0B',  // Orange flame
          'red': '#EF4444',     // Red accent for orange flame
        },
        'glyph': {
          'primary': '#E2E8F0',  // Primary glyph color
          'bright': '#F8FAFC',   // Bright glyph highlight
          'accent': '#94A3B8',   // Accent glyph color
        },
        'circuit': {
          'energy': '#8B5CF6',   // Energy circuit
          'magic': '#EC4899',    // Magic circuit
        }
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(circle at 50% 50%, var(--tw-colors-cosmic-medium) 0%, var(--tw-colors-cosmic-deep) 40%, var(--tw-colors-cosmic-deepest) 100%)',
        'flame-gradient': 'linear-gradient(135deg, var(--tw-colors-flame-blue) 0%, var(--tw-colors-flame-cyan) 40%, var(--tw-colors-flame-orange) 60%, var(--tw-colors-flame-red) 100%)',
        'glyph-pattern': 'url("/patterns/glyphs.svg")',
      },
      boxShadow: {
        'flame': '0 0 15px 5px rgba(59, 130, 246, 0.5), 0 0 30px 10px rgba(239, 68, 68, 0.25)',
        'glyph': '0 0 10px 2px rgba(226, 232, 240, 0.3)',
      },
      fontFamily: {
        'serif': ['Cormorant Garamond', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};