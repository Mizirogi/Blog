/*
 * @Description: 
 * @Author: Li
 * @Date: 2019-10-26 15:12:11
 * @LastEditors  : Li
 * @LastEditTime : 2020-01-13 19:39:11
 */
const db = require('./config.js');
const Sequelize = db.sequelize;
const Category = Sequelize.import('./model/category');

Category.sync({ force: false });

class CategoryModel {
    /**
     * @description 创建分类
     * @param data
     * @returns {Promise<*>}
     */
    static async create(data) {
        return await Category.create(data)
    }

    /**
     * @description 获取列表
     * @param {string} author 当前用户
     * @returns {Promise<*>}
     */
    static async list(params) {
        let {page_num, page_size,author } = params;
        if(page_size == 0){
            return await Category.findAll({
                attributes : ['id', 'name'],
                where: {
                    author: author
                },
            })
        }
        else{
        let ret = await Category.findAndCountAll({

            limit: +page_size,
            offset: (page_num - 1) * (+page_size),
            where: {
                author: author
            },
        })
        return {
            data: ret.rows,  
            count: ret.count,
            total: ret.count,
        }}
    }

    /**
     * 更新分类数据
     * @param id 分类ID
     * @param data 分类更新的属性参数
     */
    static async update(id, data) {
        return await Category.update({'name':data}, {
            where: {
               id: id
            },
        });
    }

    /**
     * 删除分类
     * @param id listID
     * @returns {Promise.<boolean>}
     */
    static async delete(id) {
        await Category.destroy({
            where: {
                id,
            }
        })
        return true
    }



}

module.exports = CategoryModel