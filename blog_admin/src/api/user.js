/*
 * @Description:
 * @Author: Li
 * @Date: 2019-11-18 13:41:40
 * @LastEditors: Li
 * @LastEditTime: 2019-11-30 12:06:41
 */
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(data) {
  return request({
    url: '',
    method: 'post',
    data
  })
}
