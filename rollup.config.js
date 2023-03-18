import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'

const extensions = ['.ts']

export default {
  input: './src/index.ts',
  output: {
    file: './dist/lovelace-sun-card.js',
    format: 'cjs'
  },
  plugins: [
    resolve({ extensions }),
    commonjs(),
    json(),
    babel({ extensions, include: ['src/**/*'], babelHelpers: 'bundled' })
  ]
}
