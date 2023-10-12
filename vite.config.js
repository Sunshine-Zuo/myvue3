import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import { VantResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/vite'
import postcsspxtoviewport from 'postcss-px-to-viewport'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    base: './',
    build: {
      outDir: 'dist',//指定输出路径
      assetsDir: 'assets', // 指定生成静态资源的存放路径
      minify: 'terser', // 混淆器，terser构建后文件体积更小
      chunkSizeWarningLimit: 1500,//分块大小警告的限制，默认500，单位kb
      terserOptions: {
        compress: {
          drop_console: env.VITE_ENV === 'prod',
          drop_debugger: env.VITE_ENV === 'prod'
        }
      },
      // rollupOptions: {
      //   // https://rollupjs.org/guide/en/#outputmanualchunks
      //   output: {
      //     //设置chunk合并打包
      //     manualChunks: {
      //       // 'somemini': [
      //       //   '@/views/BasicTest',
      //       //   '@/views/Counter',
      //       //   '@/views/Home',
      //       // ],
      //       lodash: ['lodash']
      //     },
      //   },
      // }
    },
    server: {
      open: false,//启动时自动打开浏览器
      port: 8888,//默认端口3000
      proxy: {
        // '/api': env.VITE_API_URL
        '/apiAdmin': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          // rewrite: path => path.replace(/^\/apiAdmin/, '')
        }
      }
    },
    plugins: [
      vue(),
      ElementPlus({
        // options
      }),
      AutoImport({
        imports: ['vue', 'vue-router', 'vuex'],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [VantResolver(), ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    css: {
      // postcss: {
      //   plugins: [
      //     postcsspxtoviewport({
      //       unitToConvert: "px",
      //       viewportWidth: 1024,
      //       unitPrecision: 5,
      //       propList: ["*"],//指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      //       viewportUnit: "vw",
      //       fontViewportUnit: "vw",
      //       selectorBlackList: ["ignore-"],//指定不转换为视窗单位的类名,ignore-表示类名中含有ignore-则不转换
      //       minPixelValue: 1,// 默认值1，小于或等于1px则不进行转换
      //       mediaQuery: true,//是否在媒体查询的css代码中也进行转换，默认false
      //       replace: true,
      //       //exclude和include是可以一起设置的，将取两者规则的交集。
      //       exclude: [/\/node_modules\//, /\/src\/components\//, /\/src\/views\/Home.vue/, /\/src\/views\/Dashboard.vue/],//设置忽略文件，用正则做目录名匹配
      //       include: [/\/src\/views\/Login.vue/],//如果设置了include，那将只有匹配到的文件才会被转换
      //       landscape: false,//是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
      //       landscapeUnit: "vw",
      //       landscapeWidth: 568,
      //     })
      //   ]
      // },
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/common.scss" as *;'
        }
      }
    }
  })
}
