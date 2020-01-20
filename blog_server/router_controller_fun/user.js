/*
 * @Description: 
 * @Author: Li
 * @Date: 2019-11-04 21:48:21
 * @LastEditors: Li
 * @LastEditTime: 2019-11-05 17:44:15
 */
const UserModel = require('../db/UserModel')
class User {
    /**
     * @description: 用户注册函数
     * @param {json}  ctx 用户注册信息
     * @return: 
     */
    static async register(ctx) {
        let UserInfo = ctx.request.body
        let UserAuth = { name: UserInfo.name, pwd: UserInfo.pwd }
        delete UserInfo.pwd
        try {
            await UserModel.createUser(UserInfo, UserAuth)
            ctx.body = {
                status: 200,
                msg: "注册成功"
            }
        } catch (error) {
            ctx.body = {
                status: -1,
                msg: error.message
            }
        }
    }
    /**
     * @description: 登陆函数
     * @param {json} ctx 登录信息上下文
     * @return: 
     */
    static async login(cxt) {
        let UserAuth = cxt.request.body
        console.log(UserAuth);
        let a = await getUserInfoByName('login', UserAuth.name)
        console.log(a);
        if (!a[0]) {
            cxt.body = {
                status: -1,
                msg: '用户名不存在',
                data: a
            }
        } else {
            if (UserAuth.pwd == a[0].pwd) {

                if (UserAuth && UserAuth.name) {
                    const token = sign({ username: UserAuth.name }, secret, { expiresIn: '0.1h' })
                    cxt.response.body = {
                        status: 200,
                        msg: '登陆成功',
                        token: token
                    }
                }

            } else {
                cxt.body = {
                    status: -2,
                    msg: '密码错误',
                }
            }
        }
    }
}
module.exports = User;