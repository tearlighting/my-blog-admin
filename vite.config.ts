import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
import Components from "unplugin-vue-components/vite"
import vueJsx from "@vitejs/plugin-vue-jsx"
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [
        // 自动识别 <i-xxx-yyy /> 为图标组件
        IconsResolver({
          prefix: "i", // 默认就是 i，可以改成 icon 之类的
        }),
      ],
    }),
    Icons({
      autoInstall: true, // 自动下载对应图标库，不用手动 import
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      // 匹配到 /api 前缀的请求，转发到目标服务器
      "/api": {
        target: "http://localhost:8888", // 后端地址
        changeOrigin: true, // 修改请求头 origin
        // 如果后端就是 /upload/imgs，就不用改；如果是 /imgs，就写成 path => path.replace(/^\/upload/, "")
      },
      "/uploads": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
    },
  },
})
