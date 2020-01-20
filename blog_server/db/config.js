/*
 * @Description: 配置文件
 * @Author: Li
 * @Date: 2019-10-26 15:06:39
 * @LastEditors: Li
 * @LastEditTime: 2019-12-28 12:59:16
 */
const Sequelize = require('sequelize');

const sequelize = new Sequelize('blog', 'root', 'ly6770928', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize.authenticate().then(() => {
  console.log('Connected')
}).catch(err => {
  console.error('Connect failed')
});

module.exports = {
    sequelize
}