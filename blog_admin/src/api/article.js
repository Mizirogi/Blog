/*
 * @Description:
 * @Author: Li
 * @Date: 2019-11-25 11:27:45
 * @LastEditors  : Li
 * @LastEditTime : 2020-01-11 21:29:52
 */
import request from '@/utils/request'
import qs from 'qs'

export function getList(data) {
  return request({
    url: '/api/article/getList',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/api/article/create',
    method: 'post',
    data
  })
}
export function detail(id) {
  let url = '/api/article/detail/'+id
  return request({
    url: url,
    method: 'get',
  })
}

export function update(data) {
  return request({
    url: '/api/article/update',
    method: 'post',
    data
  })
}

export function softDelete(data) {
  return request({
    url: '/api/article/hidden',
    method: 'post',
    data
  })
}