import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import notify from 'rollup-plugin-notify';
import dotenv from 'dotenv';
import svelteSVG from 'rollup-plugin-svelte-svg';
// const sapperEnv = require('sapper-environment');
//require('dotenv').config();

dotenv.config();

const {
  NODE_ENV,
  CART_EMPTY = true,
  BACKEND_URL,
  SESSION_SECRET,
  SAPPER_LEGACY_BUILD,
  LOCAL_PORT,
} = process.env;

const dev = NODE_ENV === 'development';
const legacy = !!SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) => {
  return (
    (warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
    (warning.code === 'CIRCULAR_DEPENDENCY' &&
      /[/\\]@sapper[/\\]/.test(warning.message)) ||
    onwarn(warning)
  );
};

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      notify(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify({
          NODE_ENV,
          SESSION_SECRET,
          BACKEND_URL,
          CART_EMPTY,
        }),
        'process.env.CART_EMPTY': CART_EMPTY !== 'false',
        'process.env.BACKEND_URL': JSON.stringify(BACKEND_URL),
        'process.env.SESSION_SECRET': JSON.stringify(SESSION_SECRET),
        'process.env.LOCAL_PORT': JSON.stringify(LOCAL_PORT),
      }),
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
      }),
      resolve({
        browser: true,
        dedupe: ['svelte'],
        mainFields: ['svelte', 'module', 'browser', 'main'],
      }),
      commonjs(),

      legacy &&
        babel({
          extensions: ['.js', '.mjs', '.html', 'php', '.svelte'],
          babelHelpers: 'runtime',
          exclude: ['node_modules/@babel/**'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 0.25%, not dead',
              },
            ],
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            [
              '@babel/plugin-transform-runtime',
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
      svelteSVG({ dev }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      notify(),
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify({
          NODE_ENV,
          SESSION_SECRET,
          BACKEND_URL,
          CART_EMPTY,
        }),
        'process.env.CART_EMPTY': CART_EMPTY !== 'false',
        'process.env.BACKEND_URL': JSON.stringify(BACKEND_URL),
        'process.env.SESSION_SECRET': JSON.stringify(SESSION_SECRET),
        'process.env.LOCAL_PORT': JSON.stringify(LOCAL_PORT),
      }),
      svelte({
        generate: 'ssr',
        hydratable: true,
        dev,
      }),
      resolve({
        dedupe: ['svelte'],
        mainFields: ['svelte', 'module', 'browser', 'main'],
      }),
      commonjs(),
      svelteSVG({ generate: 'ssr', dev }),
    ],
    external: /* externals */ Object.keys(pkg.dependencies).concat(
      require('module').builtinModules
    ),

    preserveEntrySignatures: 'strict',
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      notify(),
      resolve(),
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify({
          NODE_ENV,
          SESSION_SECRET,
          BACKEND_URL,
          CART_EMPTY,
        }),
        'process.env.CART_EMPTY': CART_EMPTY !== 'false',
        'process.env.BACKEND_URL': JSON.stringify(BACKEND_URL),
        'process.env.SESSION_SECRET': JSON.stringify(SESSION_SECRET),
        'process.env.LOCAL_PORT': JSON.stringify(LOCAL_PORT),
      }),
      commonjs(),
      !dev && terser(),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },
};
