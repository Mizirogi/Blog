/*
 * @Description: 
 * @Author: Li
 * @Date: 2019-11-29 15:52:27
 * @LastEditors: Li
 * @LastEditTime: 2019-11-29 16:01:09
 */
import throttle from './throttle'

const install = function(Vue) {
  Vue.directive('throttle', throttle)
}

if (window.Vue) {
  window['throttle'] = throttle
  Vue.use(install); // eslint-disable-line
}

throttle.install = install
export default throttle
