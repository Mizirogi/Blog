import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  login({ commit }, userInfo) {
    console.log(userInfo)
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', 'admin-token')
          setToken('admin-token')
          resolve()
      // login(userInfo).then(response => {
      //   if (response.code === 200) {
      //     commit('SET_TOKEN', 'admin-token')
      //     setToken('admin-token')
      //     resolve()
      //   } else {
      //     const exception = {
      //       message: '登录失败',
      //       code: -1
      //     }
      //     throw exception
      //   }
      // }).catch(error => {
      //   console.log(error)
      //   reject(error)
      // })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const data = {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
      }
      commit('SET_ROLES', ['admin'])
      commit('SET_NAME', 'name')
      commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
      commit('SET_INTRODUCTION', 'introduction')
      resolve(data)
    })
  },
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {

  //     // let data = {
  //     //   roles: ['admin'],
  //     //   introduction: 'I am a super administrator',
  //     //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  //     //   name: 'Super Admin'
  //     // },

  //     // // if (!data) {
  //     // //   reject('Verification failed, please Login again.')
  //     // // }

  //     // const { roles, name, avatar, introduction } = data

  //     // // roles must be a non-empty array
  //     // if (!roles || roles.length <= 0) {
  //     //   reject('getInfo: roles must be a non-null array!')
  //     // }

  //     commit('SET_ROLES', 'admin')
  //     commit('SET_NAME', 'name')
  //     commit('SET_AVATAR', 'avatar')
  //     commit('SET_INTRODUCTION', 'introduction')
  //     resolve()

  //   })
  // },

  // user logout
  logout({ commit, state, dispatch }, params) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    removeToken()
    resetRouter()
    return new Promise((resolve, reject) => {
      logout(params).then(response => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
