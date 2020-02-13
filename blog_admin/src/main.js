/*
 * @Description:
 * @Author: Li
 * @Date: 2019-11-18 13:41:40
 * @LastEditors: Li
 * @LastEditTime: 2019-11-30 19:06:11
 */
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 建立中转站，实现组件与组件之间的传值
const bus = new Vue()
Vue.prototype.bus = bus

Vue.directive('throttle', {
  // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  inserted: function(el, binding) {
    const { callback, time } = binding.value
    el.callback = callback
    el.time = time
    el.addEventListener('click', () => {
      const nowTime = new Date().getTime()
      if (!el.preTime || nowTime - el.preTime > el.time) {
        el.preTime = nowTime
        el.callback()
      }
    })
  },
  update: function(el, binding) {
    const { callback, time } = binding.value
    el.callback = callback
    el.time = time
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
