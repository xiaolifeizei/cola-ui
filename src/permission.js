import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getUserRoles } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // 判断是否加载了路由
      const hasRoutes = store.getters.menu_routes && store.getters.menu_routes.length > 0
      if (hasRoutes) {
        next()
      } else {
        try {
          // 生成菜单
          const accessRoutes = await store.dispatch('permission/generateRoutes', getUserRoles())
          // 添加路由
          router.addRoutes(accessRoutes)
          // 获取按钮
          await store.dispatch('permission/getButtons')

          // nex()方法确保addRoutes方法已经完成
          // 设置 replace：true，导航不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 获取路由出错则返回登陆页面
          await store.dispatch('user/resetToken')
          console.log(error)
          // Message.error(error || '获取菜单出错了')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
