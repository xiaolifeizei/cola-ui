import { asyncRoutes, constantRoutes, componentMap } from '@/router'
import { getLoginButton, getLoginMenu } from '@/api/system/menu/menu'
import { Notification } from 'element-ui'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 *  将后台获取的菜单转换成路由
 * @param menus
 */
function convertMenuToRouters(menus) {
  if (!menus || menus.length === 0) {
    return []
  }
  const dynamicRoutes = []
  menus.forEach(menu => {
    const router = {
      path: menu.path,
      component: componentMap[menu.component],
      name: menu.name,
      meta: { title: menu.title, icon: menu.icon }
    }
    // 有子菜单
    if (menu.children && menu.children.length > 0) {
      router.children = convertMenuToRouters(menu.children)
      router.redirect = router.children[0].path
      router.redirect = 'noRedirect'
    } else {
      delete menu.children
    }
    // path必须有值
    if (menu.path && menu.path.trim().length > 0) {
      dynamicRoutes.push(router)
    }
  })
  return dynamicRoutes
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.alwaysShow = true
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  buttons: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  }
}

const actions = {
  // 生成动态路由
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      // 动态获取路由菜单
      // let dynamicRoutes
      getLoginMenu().then(response => {
        const { data } = response
        if (!data) {
          Notification.error({
            title: '失败',
            message: '网络异常，无法获取到菜单'
          })
          reject('网络异常，无法获取到菜单')
        }

        const { menu } = data
        if (!menu) {
          Notification.error({
            title: '失败',
            message: '菜单获取异常'
          })
          reject('菜单获取异常')
        }
        const dynamicRoutes = convertMenuToRouters(menu)

        const accessedRoutes = filterAsyncRoutes(dynamicRoutes.concat(asyncRoutes), roles)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  },
  getButtons({ commit }) {
    return new Promise((resolve, reject) => {
      getLoginButton().then(response => {
        const { data } = response
        if (!data) {
          Notification.error({
            title: '失败',
            message: '网络异常，无法获取到按钮'
          })
          reject('网络异常，无法获取到按钮')
        }
        const { buttons } = data
        if (!buttons) {
          Notification.error({
            title: '失败',
            message: '按钮获取异常'
          })
          reject('按钮获取异常')
        }
        const button_arr = []
        if (buttons.length > 0) {
          buttons.forEach(item => {
            button_arr.push(item.code)
          })
        }
        commit('SET_BUTTONS', button_arr)
        resolve(button_arr)
      })
    })
  },
  clearRouters({ commit }) {
    // console.log('调用了清空路由方法')
    commit('SET_ROUTES', [])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
