/*
 * @Description: 
 * @Author: Li
 * @Date: 2019-11-08 18:00:13
 * @LastEditors: Li
 * @LastEditTime: 2019-11-08 18:26:23
 */
var data = {
    "name": "博客",
    "children": [
        {
            "name": "前端",
            "children": [
                { "name": "Vue",},
                {"name": "SCSS",},
                {"name": "Echarts",}
            ]
        },
        {
            "name": "后端",
            "children": [
                { "name": "Node", "value": 8833 },
                { "name": "Koa", "value": 1732 },
                { "name": "ORM", "value": 3623 },
                { "name": "JWT", "value": 10066 }
            ]
        },
        {
            "name": "数据库",
            "children": [
                { "name": "MySQL", "value": 4116 },
                { "name": "Sequlize", "value": 4116 }
            ]
        },
        {
            "name": "部署",
            "children": [
                { "name": "百度云", "value": 1082 },
                { "name": "Hotnode", "value": 1336 },
                { "name": "pm2", "value": 319 },
            ]
        },

    ]
}
module.exports = data
