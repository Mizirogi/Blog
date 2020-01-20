/*
 * @Description: 文章分类函数
 * @Author: Li
 * @Date: 2019-11-04 21:41:17
 * @LastEditors  : Li
 * @LastEditTime : 2020-01-11 14:20:29
 */
const CategoryModel = require('../db/CategoryModel.js');
class Category {
    /**
     * 创建分类
     * @param ctx name        分类名称
     *
     * @returns 成功创建分类返回分类详情数据，失败返回错误信息
     */
    static async create(ctx) {
        let params = ctx.request.body;
        // 检测参数是否存在为空
        let errors = [];
        for (let item in params) {
            if (!params[item]) {
                let index = errors.length + 1;
                errors.push('错误' + index + ': 参数: ' + item + '不能为空');
            }
        }
        if (errors.length > 0) {
            ctx.response.status = 412;
            ctx.body = {
                code: 412,
                message: errors,
            };
            return false;
        }
        try {
            await CategoryModel.create(params);
            // const data = await CategoryModel.detail(id);
            ctx.response.status = 200;
            ctx.body = {
                code: 200,
                message: `创建分类成功`,
                // data,
            };
        } catch (err) {
            ctx.response.status = 500;
            ctx.body = {
                code: 500,
                message: `创建分类失败`,
                data: err,
            };
        }
    }
    /**
     * @description: 展示分类
     * @param {type} ctx 参数（上下文）
     * @return: 结果
     */
    //
    static async list(ctx) {
        let param = ctx.request.body
        try {
            let data = await CategoryModel.list(param)
            ctx.response.status = 200;
            ctx.body = {
                code: 200,
                message: `查询分类成功`,
                data: data
            };
        } catch (err) {
            ctx.response.status = 500;
            ctx.body = {
                code: 500,
                message: `查询分类失败`,
                data: err.message,
            };
        }
    }
    /**
     * 更新分类
     * @param ctx name        分类名称
     *
     * @returns 成功创建分类返回分类详情数据，失败返回错误信息
     */
    static async update(ctx) {
        let {id,name} = ctx.request.body;
        console.log(id + name );
        
        // 检测参数是否存在为空
        try {
            await CategoryModel.update(id,name);
            // const data = await CategoryModel.detail(id);
            ctx.response.status = 200;
            ctx.body = {
                code: 200,
                message: `更新分类成功`,
                // data,
            };
        } catch (err) {
            ctx.response.status = 500;
            ctx.body = {
                code: 500,
                message: `更新分类失败`,
                data: err,
            };
        }
    }

}
module.exports = Category