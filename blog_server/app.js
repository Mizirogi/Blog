/*
 * @Description: 
 * @Author: Li
 * @Date: 2019-10-19 14:55:19
 * @LastEditors: Li
 * @LastEditTime: 2019-11-16 10:05:18
 */
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
var cors = require('koa2-cors');

const router = require('./router/router.js')
const serve = require('koa-static');


const public   = serve(__dirname+'/public/');
app.use(cors());
// app.use(async (context, next) => {
//   try {
//     await next()
//   } catch (ex) {
//     context.type = 'application/json'
//     context.body = {
//       status: -1,
//       message: ex.message
//     }
//   }
// })
app.use(public); 
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())
app.listen('4001')