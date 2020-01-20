const db = require('./config.js');
const Sequelize = db.sequelize;
const ArticleToCategory = Sequelize.import('./model/articleTocategory');

class ArticleToCategoryModel {

    /**
     * 获取列表
     * @returns {Promise<*>}
     */
    static async list() {
        return await ArticleToCategory.findAll()
    }

}

module.exports = ArticleToCategoryModel;