/*
 * @Description: 
 * @Author: Li
 * @Date: 2019-10-26 15:12:11
 * @LastEditors: Li
 * @LastEditTime: 2019-11-04 21:30:29
 */
const db = require('./config.js');
const Sequelize = db.sequelize;
const Op = Sequelize.Op;
const ArticleComment = Sequelize.import('./model/articleComment');

ArticleComment.sync({ force: false });

class ArticleCommentModel {
    /**
     * 创建
     * @param data
     * @returns {Promise<*>}
     */
    static async create(data) {
        return await ArticleComment.create(data)
    }

    /**
     * 获取列表
     * @returns {Promise<*>}
     */
    static async list(params) {
        const { pageIndex, pageSize, keyword, author, status, aid } = params;
        let ret = await ArticleComment.findAndCountAll({
            limit: +pageSize,
            offset: (pageIndex - 1) * (+pageSize),
            where: {
                aid,
                content: {
                    // 模糊查询
                    [Op.like]: '%' + keyword + '%',
                },
                status: !status ? [1, 2, 3] : [`${status}`], // 1 通过 2 拒绝  3 待审核  '' 全部
            },

            order: [
                ['id', 'DESC']
            ],
        });
        return {
            data: ret.rows,
            pageIndex: +pageIndex,
            pageSize: +pageSize,
            count: ret.count,
            totalCount: ret.count,
            totalPages: Math.ceil(ret.count / +pageSize),
        };
    }


    /**
     * 获取 web博客列表
     * @returns {Promise<*>}
     */
    static async weblist(params) {
        const { id } = params;
        return await ArticleComment.findAll({
            raw: true,
            where: {
                status: 1, // 1 通过 2 拒绝  3 待审核  '' 全部
                // pid: 0,
                aid: +id,
            },
            order: [
                ['createdAt', 'asc']
            ],
        })
    }

    /**
     * 更新数据
     * @param id 分类ID
     * @param data 分类更新的属性参数
     */
    static async update(id, data) {
        return await ArticleComment.update(data, {
            where: {
                id,
                aid: data.aid
            },
            fields: ['username', 'avatar', 'email', 'content']
        });
    }

    /**
     * 删除
     * @param id listID
     * @returns {Promise.<boolean>}
     */
    static async delete(id) {
        await ArticleComment.destroy({
            where: {
                id,
            }
        })
        return true
    }


    /**
     * 获取详情数据
     * @param id  文章ID
     * @returns {Promise<Model>}
     */
    static async detail(id) {
        return await ArticleComment.findOne({
            raw: true,
            where: {
                id,
            },
        });
    }


    /**
     * 通过 ／ 拒绝
     * @param id
     * @param data
     */
    static async hidden(id, data) {
        return await ArticleComment.update(data, {
            where: {
                id,
            },
            fields: ['status'],
        });
    }


}

module.exports = ArticleCommentModel;