import { type EsbuildTransformOptions, defineConfig } from 'vite';

import packageJSON from './package.json' assert { type: 'json' };
import tsConfigJSON from './tsconfig.base.json' assert { type: 'json' };

export default defineConfig({
  build: {
    outDir: 'build',
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: Object.keys(packageJSON.dependencies).concat(
        Object.keys(packageJSON.peerDependencies)
      ),
    },
  },
  esbuild: {
    tsconfigRaw: tsConfigJSON as EsbuildTransformOptions['tsconfigRaw'],
  },
});
