import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@composables': resolve(__dirname, './src/composables'),
      '@utils': resolve(__dirname, './src/utils'),
      '@data': resolve(__dirname, './src/data')
    }
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  // 构建配置
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    
    // 代码分割
    rollupOptions: {
      output: {
        // 手动代码分割
        manualChunks: {
          // 将 Vue 核心库单独打包
          'vue-vendor': ['vue'],
          // 将图标库单独打包
          'icons': ['lucide-vue-next'],
          // 将工具函数单独打包
          'utils': ['clsx', 'tailwind-merge']
        },
        // 静态资源文件名格式
        assetFileNames: (assetInfo) => {
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/\.(css)$/i.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        // JS 文件输出格式
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    // 源码映射
    sourcemap: false,
    
    // 报告压缩后的大小
    reportCompressedSize: true,
    
    //  chunk 大小警告阈值
    chunkSizeWarningLimit: 1000
  },
  
  // CSS 配置
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js'
  },
  
  // 依赖优化
  optimizeDeps: {
    include: ['vue', 'lucide-vue-next', 'clsx', 'tailwind-merge'],
    exclude: []
  },
  
  // 预览配置
  preview: {
    port: 4173,
    open: true
  },
  
  // 定义全局常量
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
})
