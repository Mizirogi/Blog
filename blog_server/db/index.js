/*
 * @Description: 
 * @Author: Li
 * @Date: 2019-10-19 14:55:19
 * @LastEditors: Li
 * @LastEditTime: 2019-11-04 21:31:38
 */

const { UserInfo, User } = require('./model/users')

async function getAllUserInfos() {
  return UserInfo.findAndCountAll({
    attributes: ['id', 'name', 'sex', 'fulladdress'],
    order: [
      ['updatedAt', 'DESC']
    ]
  })
}

async function getUserInfoById(id) {
  return UserInfo.findById(id)
}

async function getUserInfoByName(table, name) {
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

async function updateUserInfo(id, UserInfo) {
  const item = await getUserInfoById(id)
  if (item) {
    return item.update(UserInfo)
  } else {
    throw new Error(`the UserInfo with id ${id} is not exist`)
  }
}

async function createUser(auth) {
  let a = User.create(auth)
  console.log(a.data);
  if (a.status == -1) {
    console.log('asdasd');
  }
  return a
}
async function createUserInfo(info, auth) {
  await createUser(auth)
  return UserInfo.create(info)
}

async function deleteUserInfo(id) {
  const UserInfo = await getUserInfoById(id)
  if (UserInfo) {
    return UserInfo.destroy()
  }
}

module.exports = {
  getAllUserInfos,
  getUserInfoById,
  getUserInfoByName,
  createUserInfo,
  updateUserInfo,
  deleteUserInfo
}