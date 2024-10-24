import preact from '@preact/preset-vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default {
  // Allowing the use of environment variables in the frontend,
  // but only the white-listed variables; those starting with 'MF_'.
  envPrefix: 'MF_',

  // Development server.
  server: {
    port: 3000,
  },

  plugins: [
    preact(),
    tsconfigPaths({
      // When this plugin is crawling for tsconfig.json files it will also find the one in 'scripts/scaffold/frontend'
      // and this will cause an error because it's not a valid tsconfig.json file, only after the file is scaffolded.
      ignoreConfigErrors: true,
    }),
  ],
};
