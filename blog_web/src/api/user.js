/**
 * user模块接口列表
 * 登录注册等
 */

import base from './base'; // 导入接口域名列表
import axios from '@/http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const user = {    
    // 新闻列表    
    get () {        
        return axios.get(`${base.get}`);    
    },    
    // 新闻详情,演示    
    articleDetail (id, params) {        
        return axios.get(`${base.sq}/topic/${id}`, {            
            params: params        
        });    
    },
    // post提交    
    login (params) {        
        return axios.post(`${base.login}`, qs.stringify(params));    
    },
	register (params) {
	    return axios.post(`${base.register}`, qs.stringify(params));    
	}
    // 其他接口…………
}

export default user;