import path from 'path'
import type { PluginOption } from 'vite'
// 导入 Vite 的环境变量加载函数和类型
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

function setupPlugins(env: ImportMetaEnv): PluginOption[] {
  return [
    vue(),
    env.VITE_GLOB_APP_PWA === 'true' && VitePWA({
      injectRegister: 'auto',
      manifest: {
        name: 'AIChatbot',
        short_name: 'AIChatbot',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ]
}

export default defineConfig((env) => {
  // 通过 Vite 的环境变量加载函数 loadEnv 获取当前环境的配置，
  // env.mode 表示当前的构建模式（'development' 或 'production'），
  // process.cwd() 返回当前 Node.js 进程的工作目录路径。
  // 这样可以根据构建模式和工作目录的不同加载相应的环境变量配置。
  const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv

  return {
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    plugins: setupPlugins(viteEnv),
    server: {
      host: '0.0.0.0',
      port: 1002,
      open: false,
      proxy: {
        '/api': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, // 允许跨域
          rewrite: path => path.replace('/api/', '/'),
        },
      },
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
    optimizeDeps: {
      exclude: ['vue-toy-face']
    }
  }
})
