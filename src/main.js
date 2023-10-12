import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './assets/test.css'
import './assets/scss/element.scss'

const app = createApp(App)
app.use(router).use(store).mount('#app')

//全局引用element-plus，已改为按需引入
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// app.use(ElementPlus)

//全局引用vant，已改为按需引入
// import Vant from 'vant';
// import 'vant/lib/index.css';
// app.use(Vant);
//注意，下面四个vant中的函数式组件需要在使用时手动引入样式，如下：
// // Toast
// import { Toast } from 'vant';
// import 'vant/es/toast/style';

// // Dialog
// import { Dialog } from 'vant';
// import 'vant/es/dialog/style';

// // Notify
// import { Notify } from 'vant';
// import 'vant/es/notify/style';

// // ImagePreview
// import { ImagePreview } from 'vant';
// import 'vant/es/image-preview/style';
