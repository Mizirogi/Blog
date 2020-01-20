const db = require('./config.js')
const Sequelize = db.sequelize
const User = Sequelize.import('./model/user.js')
const UserInfo = Sequelize.import('./model/userinfo.js')

User.sync({ force: false }); //?
UserInfo.sync({ force: false })
class UserModel {
    /**
     * @description:创建用户
     * @param {json} info 用户基本信息
     * @param {json} auth 用户认证信息
     * @returns {Promise<boolean>} 结果或错误
     */

    static async createUser(info, auth) {
        // try {
        //     await User.create(auth)
        //     await UserInfo.create(info)
        //     return 1
        // } catch (error) {
        //     return -1
        // }
        return Sequelize.transaction(function (t) {
            // 创建账户认证信息
            return User.create(auth, 
                { transaction: t })
                .then(function (res) {
                    console.log(res);
                    return UserInfo.create(info, 
                        { transaction: t });
                });

        }).then(function (result) {
            return result
            // 事务已被提交
        }).catch(function (err) {
            console.log(err.message);
            throw err
            // 事务已被回滚
            // 扔出错误
        });
    }


    /**
     * 查询用户信息
     * @param username  姓名
     * @returns {Promise.<*>}
     */
    static async getAllUserInfos() {
        return UserInfo.findAndCountAll({
            attributes: ['id', 'name', 'sex'],

        })
    }

    static async username(username) {
        return await User.findOne({
            where: {
                username
            }
        })
    }

    /**
     * 删除用户
     * @param id listID
     * @returns {Promise.<boolean>}
     */
    static async delete(id) {
        await User.destroy({
            where: {
                id,
            }
        })
        return true
    }

    /**
     * 查询用户列表
     * @returns {Promise<*>}
     */
    static async findAllUserList(params) {
        return await User.findAll({
            // attributes: ['id', 'username', 'email'] // 指定返回那些字段
        })
    }

    async getUserInfoByName(table, name) {
        switch (table) {
            case 'info':
                return UserInfo.findAll({
                    where: {
                        name: name
                    },
                    raw: true
                })
                break;
            case 'login':
                return User.findAll({
                    where: {
                        name: name
                    },
                    raw: true
                })
                break;
            default:
                break;
        }

    }

}




// async function getUserInfoByName(table, name) {
//     switch (table) {
//         case 'info':
//             return UserInfo.findAll({
//                 where: {
//                     name: name
//                 },
//                 raw: true
//             })
//             break;
//         case 'login':
//             return User.findAll({
//                 where: {
//                     name: name
//                 },
//                 raw: true
//             })
//             break;
//         default:
//             break;
//     }

// }


// async function createUser(auth) {
//     let a = User.create(auth)
//     console.log(a.data);
//     if (a.status == -1) {
//         console.log('asdasd');
//     }
//     return a
// }
// async function createUserInfo(info, auth) {
//     await createUser(auth)
//     return UserInfo.create(info)
// }


// module.exports = {
//     getAllUserInfos,
//     getUserInfoById,
//     getUserInfoByName,
//     createUserInfo,
//     updateUserInfo,
//     deleteUserInfo
// }

module.exports = UserModel