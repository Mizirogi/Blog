const Router = require('koa-router')
const router = new Router({
  prefix: '/api'
})
// const { getAllUserInfos, getUserInfoById, getUserInfoByName, createUser, createUserInfo, updateUserInfo, deleteUserInfo } = require('../db/UserModel')

const jsonMIME = 'application/json'

const { sign } = require('jsonwebtoken')
const secret = 'demo'
const jwt = require('koa-jwt')({ secret })

const User = require('../router_controller_fun/user')
const Article = require('../router_controller_fun/article');
const Category = require('../router_controller_fun/category');
// const UploadToken = require('../db/UploadToken')
const ArticleToCategory = require('../db/ArticleToCategoryModel')
const Comment = require('../db/CommentModel');
const ArticleComment = require('../db/ArticleCommentModel');

router.get('/hello', async (context) => {
  const UserInfos = await UserModel.getAllUserInfos()
  context.type = jsonMIME
  context.body = {
    status: 0,
    data: UserInfos
  }
})

router.get('/test', async (context) => {
  const UserInfos = await UserModel.getAllUserInfos()
  context.type = jsonMIME
  context.body = {
    status: 0,
    data: UserInfos
  }
})

router.get('/userinfo/:id', async context => {
  const UserInfo = await getUserInfoById(context.params.id)
  context.type = jsonMIME
  context.body = {
    status: 0,
    data: UserInfo
  }
})

router.get('/UserInfo/name/:name', async context => {
  const UserInfo = await getUserInfoByName(context.params.name)
  context.type = jsonMIME
  context.body = {
    status: 0,
    data: UserInfo
  }
})

router.post('/article/create', Article.create )
router.post('/article/update', Article.update )
router.post('/article/hidden', Article.hidden )
router.post('/article/getList', Article.list )
//前端获取博客
router.post('/article/getArticleList', Article.list_web )
router.get('/article/detail/:id', Article.detail )

router.post('/category/getList', Category.list)
router.post('/category/create', Category.create)
router.post('/category/update', Category.update)

// router.post('/nameValidate', async context => {
//   let UserInfo = context.request.body
//   let UserAuth = { name: UserInfo.name, pwd: UserInfo.pwd }
//   await getUserInfoByName(UserInfo.name)
//   delete UserInfo.name
//   delete UserInfo.pwd
//   await createUserInfo(UserInfo, UserAuth)
//   context.type = jsonMIME
//   context.body = {
//     status: 201,
//     msg: "注册成功"
//   }
// })

router.post('/register', User.register )
router.post('/login',User.login)


router.get('/articleLst', async context => {
  let UserAuth = context.request.body
  console.log(UserAuth);
  let a = await getUserInfoByName('login', UserAuth.name)
  console.log(a);
  if (!a[0]) {
    context.body = {
      status: -1,
      msg: '用户名不存在',
      data: a
    }
  } else {
    if (UserAuth.pwd == a[0].pwd) {

      if (UserAuth && UserAuth.name) {
        const token = sign({ username: UserAuth.name }, secret, { expiresIn: '0.04h' })
        context.response.body = {
          status: 200,
          msg: '登陆成功',
          token: token
        }
      }

    } else {
      context.body = {
        status: -2,
        msg: '密码错误',
      }
    }
  }
  context.type = jsonMIME
})
router.get('/api/get', jwt, async ctx => {

  let a = await getUserInfoByName('info', ctx.state.user.username)
  ctx.body = {
    status: '验证成功',
    username: ctx.state.user.username,
    userinfo: a[0]
  }
  console.log(ctx.body);
  console.log(ctx.state);
})
// router.get('/api/get', jwt,async ctx => {
//   console.log('sd');
//   console.log(ctx);
//   ctx.body={
//     asd:'asd'
//   }
//   // ctx.response.status=401
//   })

router.put('/UserInfo/:id', async context => {
  const id = context.params.id
  const UserInfo = context.body
  await updateUserInfo(id, UserInfo)
  context.type = jsonMIME
  context.body = {
    status: 0
  }
})

router.delete('/UserInfo/:id', async context => {
  await deleteUserInfo(context.params.id)
  context.type = jsonMIME
  context.body = {
    status: 0
  }
})



module.exports = router