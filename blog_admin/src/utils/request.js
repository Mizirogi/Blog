/*
 * @Description:
 * @Author: Li
 * @Date: 2019-11-18 13:41:41
 * @LastEditors  : Li
 * @LastEditTime : 2020-01-10 15:20:08
 */
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000, // request timeout
  headers: { 'content-type': 'application/x-www-form-urlencoded' }, // 请求头设置
  // transformRequest: [function(data) {
  //   // 向服务器发送前修改请求数据
  //   // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  //   // if(data.username !== 'admin'){
  //   return qs.stringify(data)
  // // }
  // }]
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */
 
  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    
    //全局拦截500 
    if (response.code == 500) {
      // to re-login
      console.log('拦截HTTP');
      MessageBox.confirm('您已登出', '提示', {
        confirmButtonText: '重新登陆',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    
    if (res.code !== 200 && res.code !== 101) {
      Message({
        message: res.message ||res.msg || '错误',
        type: 'error',
        duration: 2 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 500 || res.code === 50012 || res.code === 50014 || res.code === 102) {
        // to re-login
        MessageBox.confirm('您已登出', '提示', {
          confirmButtonText: '重新登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error('错误' || '错误'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: '网络错误，请刷新',
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
