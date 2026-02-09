export default () => ({
  upload: {
    config: {
      // Utilise sharp pour convertir automatiquement les uploads en WebP
      provider: 'local',
      providerOptions: {},
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
      },
      sizeLimit: 50 * 1024 * 1024, // 50 MB
    },
  },
});
