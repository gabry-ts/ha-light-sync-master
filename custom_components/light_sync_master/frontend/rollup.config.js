import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

const dev = process.env.ROLLUP_WATCH;

const plugins = [
  resolve({
    browser: true,
    preferBuiltins: false,
  }),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: false,
  }),
  json(),
  !dev && terser({
    format: {
      comments: false,
    },
  }),
].filter(Boolean);

export default [
  {
    input: 'src/panel/light-sync-panel.ts',
    output: {
      file: '../www/light-sync-panel.js',
      format: 'es',
      sourcemap: dev,
    },
    plugins,
    external: [],
  },
  {
    input: 'src/card/light-sync-card.ts',
    output: {
      file: '../www/light-sync-card.js',
      format: 'es',
      sourcemap: dev,
    },
    plugins,
    external: [],
  },
];
