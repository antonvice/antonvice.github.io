/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        dark: '#0f1216',
        'theme-color': '#e8615a',
        'nav-link': '#2be4ea',
        'nav-active': '#fed33f',
        'sidebar-name': '#e8615a',
        // Original cyberpunk palette
        'accent-cyan': '#2be4ea',
        'accent-yellow': '#fed33f', 
        'accent-coral': '#e8615a',
        // Additional blue tones from original
        'neon-blue': '#0099ff',
        'deep-blue': '#0b232f',
        'electric-blue': '#00ffff',
        'midnight-blue': '#141d2f',
        // Content text colors from original
        'text-coral-light': '#f4908b',
        'neon-magenta': '#ff4c92',
      },
      fontFamily: {
        'cyberpunk': ['Cyberpunk', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'vt323': ['VT323', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%': { transform: 'translateX(-2px)' },
          '20%': { transform: 'translateX(2px)' },
          '30%': { transform: 'translateX(-2px)' },
          '40%': { transform: 'translateX(2px)' },
          '50%': { transform: 'translateX(-2px)' },
        },
        'neon-pulse': {
          '0%, 100%': { textShadow: '0 0 8px currentColor, 0 0 20px currentColor' },
          '50%': { textShadow: '0 0 12px currentColor, 0 0 30px currentColor, 0 0 40px currentColor' },
        },
      },
    },
  },
}
