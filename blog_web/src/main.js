import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './plugins/mavonEditor.js'
import store from './store'
import api from './api/index' // 导入api接口

Vue.prototype.$api = api; // 将api挂载到vue的原型上
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
