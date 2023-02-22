import typescript from '@rollup/plugin-typescript';
import terser from "@rollup/plugin-terser";

const plugins = [
    typescript({ tsconfig: './tsconfig.json' }),
    terser({ format: { comments: false } })
];

export default [
    {
        input: 'src/index.ts',
        output: {
            format: 'iife',
            file: './dist/index.browser.js',
            name: 'LanyardWrapper'
        },
        plugins,
    },
    {
        input: 'src/index.esm.ts',
        output: {
            format: 'es',
            file: './dist/index.esm.js'
        },
        plugins,
    },
    {
        input: 'src/index.ts',
        output: {
            format: 'commonjs',
            file: './dist/index.js'
        },
        plugins,
    }
];
