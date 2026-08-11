/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // asset-hub isolated module palette (green/gold). Single source of truth for module colors.
        ah: {
          green: '#00693E',
          'green-d': '#004C2E',
          'green-br': '#0A7A48', // forest xanh dịu — stop sáng-vừa cho gradient brand (rõ chuyển màu nhưng không chói)
          'green-l': '#E9F3EE',
          gold: '#C59C37',
          ink: '#1d2521',
          muted: '#6a7873',
          line: '#dde5e1',
          bg: '#f0f4f2',
          card: '#ffffff',
          // env-chip + search-pill accents (header). Sync with theme/colors.ts.
          pale: '#F4F7F5',
          amber: '#B8860B',
          'amber-l': '#FEF9EC', // pale amber wash — warning banners / pending badge
          red: '#7A1F2B',
          'red-l': '#FDF2F3', // pale red wash — error banners / rejected badge / diff-removed rows
        },
      },
      // Shimmer sweep cho AssetHubBrand (dải sáng chéo lướt qua nền gradient xanh).
      // Sweep nhanh trong ~55% chu kỳ rồi nghỉ off-screen → hiệu ứng lấp lánh tinh tế, không rối.
      keyframes: {
        'ah-shimmer': {
          '0%': { transform: 'translateX(-160%) skewX(-14deg)' },
          '55%, 100%': { transform: 'translateX(260%) skewX(-14deg)' },
        },
      },
      animation: {
        'ah-shimmer': 'ah-shimmer 4.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
