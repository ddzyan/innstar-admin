import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import svgLoader from 'vite-svg-loader'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    // 处理import .css 文件打包的charset警告
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            },
          },
        },
      ],
    },
  },
  build: {
    // 消除打包大小超过500kb警告
    chunkSizeWarningLimit: 2000,
  },
  plugins: [
    vue(),
    svgLoader(),
    viteCompression({
      ext: '.gz', //gz br
      algorithm: 'gzip', //brotliCompress gzip
    }),
  ],
})
