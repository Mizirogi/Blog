/*
 * @Description:
 * @Author: Li
 * @Date: 2019-11-25 11:27:45
 * @LastEditors  : Li
 * @LastEditTime : 2020-01-11 20:11:32
 */
import request from '@/utils/request'
import qs from 'qs'

export function getCategory(data) {
  return request({
    url: '/api/category/getList',
    method: 'post',
    data
  })
}
export function create(data) {
  return request({
    url: '/api/category/create',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/api/category/update',
    method: 'post',
    data
  })
}

