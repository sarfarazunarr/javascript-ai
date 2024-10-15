module.exports = {
  mode: 'jit',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
}
