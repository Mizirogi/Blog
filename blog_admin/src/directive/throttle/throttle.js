/*
 * @Description: 
 * @Author: Li
 * @Date: 2019-11-29 15:52:35
 * @LastEditors: Li
 * @LastEditTime: 2019-11-29 15:56:26
 */
import store from '@/store'

export default {
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
    console.log('update')
    const { callback, time } = binding.value
    el.callback = callback
    el.time = time
  }
}
