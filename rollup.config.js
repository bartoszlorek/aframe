import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

export default {
    entry: 'src/index.js',
    output: {
        file: './dist/aframe.min.js',
        format: 'umd',
        name: 'aframe'
    },
    plugins: [
        resolve(),
        commonjs(),
        uglify(),
        babel({
            exclude: ['node_modules/**']
        })
    ],
    external: []
}
