/*
 * @Description: 文章表数据库相关操作
 * @Author: Li
 * @Date: 2019-10-26 15:12:11
 * @LastEditors  : Li
 * @LastEditTime : 2020-01-14 15:08:10
 */

const db = require('./config.js');
const Sequelize = db.sequelize;
const Op = Sequelize.Op;
const Article = Sequelize.import('./model/article.js');
const Category = Sequelize.import('./model/category');
const ArticleToCategory = Sequelize.import('./model/articleTocategory');


Category.belongsToMany(Article, {
    through: {
        model: ArticleToCategory,
    },
    foreignKey: 'categoryId',
})
Article.belongsToMany(Category, {
    through: {
        model: ArticleToCategory,
    },
    foreignKey: 'articleId',
})

Article.sync({ force: false });
ArticleToCategory.sync({ force: false });

class ArticleModel {
    /**
     * 创建文章
     * @param data 创建文章的参数
     * @returns {Promise<void>}
     */
    static async create(data) {
        let params = {
            ...data,
            //tag: data.tag.join(',')
        }
        let result = await Article.create(params);
        //添加关联表信息
        await result.addCategories(data.categories)
       
        return result
    }

    /**
     * 获取文章详情数据
     * @param id  文章ID
     * @returns {Promise<Model>}
     */
    static async detail(id) {
        return await Article.findOne({
            where: id,
            raw: true
        });
    }

    /**
     * 管理端获取文章列表
     * @returns {Promise<*>}
     */
    static async list(params) {
        let { author, pageIndex, pageSize, keyword, articleId = null, is_del = 10 } = params;

        // 动态搜索字段
        let newWhere = {
            author,
            is_del: is_del == 10 ? [0, 1] : [`${is_del}`],
            title: {
                // 模糊查询
                [Op.like]: '%' + keyword + '%',
            },
        }
        if (articleId) {
            newWhere = {
                ...newWhere,
                id: articleId.split(',')
            }
        }
        let ret = await Article.findAndCountAll({
            attributes: ['id', 'title', 'browser', 'author', 'introduction', 'status',
                ['created_at', 'createdAt'], ['updated_at', 'updatedAt']],
            limit: +pageSize,
            offset: (pageIndex - 1) * (+pageSize),
            where: newWhere,
            // 关联查询
            include: [{
                model: Category,
                through: {
                    as: 'atc',
                    attributes: []
                },
                attributes: ['name', 'id'],
            }],
            order: [
                ['id', 'DESC']
            ],
            //raw:true
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
     * 博客web页面获取文章列表
     * @returns {Promise<*>}
     */
    static async list_web(params) {
        let { author, pageIndex, pageSize, keyword, articleId = null,categoryId } = params;
        // 动态搜索字段
        let newWhere = {
            author,
            status:'Published',
            title: {
                // 模糊查询
                [Op.like]: '%' + keyword + '%',
            },
        }
        if (categoryId) {
            // let ret = await Category.findAndCountAll({
            //     attributes: ['id', 'name',],
            //     //group:'name',
            //     limit: +pageSize,
            //     where: {id:categoryId},
            //     // 关联查询
            //     include: [{
            //         model: Article,
            //         through: {
            //             as: 'atc',
            //             attributes: []
            //         },
            //         attributes: ['id', 'title', 'browser', 'author', 'introduction', 'status',
            //         ['created_at', 'createdAt'], ['updated_at', 'updatedAt']],
            //         required:true,
            //         include: [{
            //             model: Category,
            //             through: {
            //                 as: 'atc',
            //                 attributes: []
            //             },
            //             attributes: ['name', 'id'],
            //         }],
            //     }],
            //     order: [
            //         ['id', 'DESC']
            //     ],
            //     //distinct:true
            //     //raw:true
            // });        
            let ret = await Article.findAndCountAll({
                attributes: ['id', 'title', 'browser', 'author', 'introduction', 'status',
                    ['created_at', 'createdAt'], ['updated_at', 'updatedAt']],
                limit: +pageSize,
                offset: (pageIndex - 1) * (+pageSize),
                where: newWhere,
                //关联查询
                include: [{
                    model: Category,
                    through: {
                        as: 'atc',
                        attributes: []
                    },
                    attributes: [],
                    where: {id:categoryId},
                    required:true
                }],     
                order: [
                    ['id', 'DESC']
                ],
                //distinct:true
                //raw:true
            });     
            //console.log(ret);
          // await ret.getCategories() 
            
            // ret.getCa
            // await ret.rows.forEach(function(r) {
            //     r.getCategories()
            //     // note的tags可以通过note.tags访问，关系模型通过note.tags[0].tagging访问
            //     console.log('aaaaaaaaaaa'+r);
            // });
            // console.log(ret);
        return {
            data: ret.rows,
            totalCount: ret.count,
        };
        } else {
            let ret = await Article.findAndCountAll({
                attributes: ['id', 'title', 'browser', 'author', 'introduction', 'status',
                    ['created_at', 'createdAt'], ['updated_at', 'updatedAt']],
                limit: +pageSize,
                offset: (pageIndex - 1) * (+pageSize),
                where: newWhere,
                // 关联查询
                include: [{
                    model: Category,
                    through: {
                        as: 'atc',
                        attributes: []
                    },
                    attributes: ['name', 'id'],
                }],
                order: [
                    ['id', 'DESC']
                ],
                distinct:true
                //raw:true
            });
            return {
                data: ret.rows,
                pageIndex: +pageIndex,
                pageSize: +pageSize,
                totalCount: ret.count,
            };
        }
   
        
    }

    /**
     * 获取热门文章列表
     * @returns {Promise<*>}
     */
    static async webhotlist() {
        let ret = await Article.findAndCountAll({
            raw: true,
            where: {
                // author,
                is_del: 0,
                browser: {
                    // 浏览量 大于 100
                    [Op.gte]: 100
                }
            },
            order: [
                ['id', 'DESC']
            ],
        });
        return {
            data: ret.rows,
        };
    }


    /**
     * 获取文章详情数据
     * @param id  文章ID
     * @returns {Promise<Model>}
     */
    static async detail(id) {
        return await Article.findOne({
            where: {
                id,
                // is_del: 0,
            },
            include: [{
                model: Category,
                through: {
                    // as: 'tagsId',
                    attributes: []
                },
                attributes: {
                    // exclude: ['author'],
                }
            }],
        });
    }

    /**
     * 更新文章 访问量 数据
     * @param id 文章ID
     * @param browser 文章更新的属性参数
     */
    static async updateBrowser(id, browser) {
        await Article.update({ browser }, {
            where: {
                id
            },
            fields: ['browser']
        })
        return true;
    }

    /**
     * 更新文章数据
     * @param id 文章ID
     * @param data 文章更新的属性参数
     */
    static async update(id, data) {
        await Article.update(data, {
            where: {
                id
            },
            fields: ['title', 'browser', 'introduction', 'status', 'content']
        })
        console.log(data);
        this.associationTable(id, data.categories)
        return true;
    }

    // 关联表更新
    static async associationTable(id, cid) {
        // 全删除 （速度快）
        await ArticleToCategory.destroy({
            where: {
                article_id: id
            }
        });
        // 关联表 添加
        let result = await Article.findOne({
            where: {
                id,
            }
        });
        result.addCategories(cid)
        // let tags = await Category.findAll({ where: { id: tagid } });
        // result.setCategories(tags)
    }

    /**
     * 删除文章
     * @param id listID
     * @returns {Promise.<boolean>}
     */
    static async delete(id) {
        await Article.destroy({
            where: {
                id,
            }
        })
        this.associationTable(id, [])
        return true
    }

    /**
     * 上下架文章
     * @param id 文章ID
     * @param data 文章
     */
    static async hidden(id, data) {
        console.log(data);
        return await Article.update(data, {
            where: {
                id,
            },
            fields: ['status'],
        });
    }
}

module.exports = ArticleModel;