/*
 * @Description:
 * @Author: Li
 * @Date: 2019-11-20 14:20:59
 * @LastEditors: Li
 * @LastEditTime: 2019-11-26 16:57:42
 */
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/settings/list ',
    method: 'get',
    params: query
  })
}
// export function fetchRuleList(query) {
//   return request({
//     url: '/settings/rulelist',
//     method: 'get',
//     params: query
//   })
// }

// export function fetchSettings(id) {
//   return request({
//     url: '/settings/detail',
//     method: 'get',
//     params: { id }
//   })
// }

// export function fetchPv(pv) {
//   return request({
//     url: '/settings/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

// export function createSettings(data) {
//   return request({
//     url: '/settings/create',
//     method: 'post',
//     data
//   })
// }

// export function updateSettings(data) {
//   return request({
//     url: '/settings/update',
//     method: 'post',
//     data
//   })
// }

export function keyWordList(query) {
  return request({
    url: 'http://101.200.122.135/yuqing4.0/api/web/api.php',
    method: 'post',
    params: query
  })
}
