import { login, logout, getInfo } from '@/api/system/user/user'
import {
  getToken,
  setToken,
  removeToken,
  getUserRoles,
  setUserRoles,
  removeUserRoles,
  getUserName,
  setUserName,
  removeUserName,
  getUserInfo, setUserInfo, removeUserInfo
} from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: getUserName() || '',
  avatar: '',
  introduction: '',
  roles: getUserRoles() || [],
  userInfo: getUserInfo() || {
    id: '',
    ids: '',
    loginName: '',
    phone: '',
    createTime: ''
  }
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
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { loginName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginName: loginName.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('验证失败，请重新登录。')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('角色不能为空')
        }
        const user = {
          id: data.user.id,
          ids: data.user.ids,
          phone: data.user.phone,
          loginName: data.user.loginName,
          createTime: data.user.createTime
        }
        setUserInfo(user)
        commit('SET_USERINFO', user)

        commit('SET_ROLES', roles)
        setUserRoles(roles)
        commit('SET_NAME', name)
        setUserName(name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeUserRoles()
        removeUserName()
        removeUserInfo()
        commit('SET_USERINFO', getUserInfo())
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeUserRoles()
      removeUserName()
      removeUserInfo()
      commit('SET_USERINFO', getUserInfo())
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')
    setUserRoles(roles)
    resetRouter()

    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
