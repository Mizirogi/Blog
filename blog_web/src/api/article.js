/*
 * @Description: 
 * @Author: Li
 * @Date: 2019-11-04 17:25:47
 * @LastEditors  : Li
 * @LastEditTime : 2020-01-13 18:53:58
 */
/**
* @fileOverview 简单的方法标注示例
* @author <a href=”llying.javaeye.com”>ly</a>
* @version 0.1
*/

import base from './base'; // 导入接口域名列表
import axios from '@/http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const article = {      
	/**
	* @description 获取列表
	* @param {Obj} params 参数
	* @returns 查询结果
	*/
    getList (params) {        
        return axios.post(`${base.article}/getList`,qs.stringify(params));    
	},
	getArticleList (params) {        
        return axios.post(`${base.article}/getArticleList`,qs.stringify(params));    
	},
	/**
  * @description: 创建文章 
  * @param {Object} 参数
  * @return: 
  */    
	create(params){
		return axios.post(`${base.article}/create`,qs.stringify(params));  
	},
    // 新闻详情,演示    
    articleDetail (id, params) {        
        return axios.get(`${base.sq}/topic/${id}`, {            
            params: params        
        });    
    },
	/**
	* @description 获取分类列表
	* @param {Object} params 参数 	
	* @returns 查询结果
	*/
	getCategory (params) {
	    return axios.post(`${base.category}/getList`,qs.stringify(params));
	},
    // post提交    
    getArticleDetail(id){
		return axios.get(`${base.article}/detail/${id}`);
	}
    // 其他接口…………
}

export default article;