import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * 定义组件名称和组件对象的map
 */
export const componentMap = {
  'Layout': Layout,
  'SubLayout': () => import('@/components/SubLayout'),
  'basics_goods_index': () => import('@/views/basics/goods/goods'),
  'basics_goods_spec': () => import('@/views/basics/goods/spec'),
  'basics_goods_category': () => import('@/views/basics/goods/category'),
  'basics_customer_index': () => import('@/views/basics/customer/customer'),
  'basics_customer_category': () => import('@/views/basics/customer/category'),
  'system_menu': () => import('@/views/system/menu'),
  'system_dict': () => import('@/views/system/dict'),
  'system_user': () => import('@/views/system/user'),
  'system_group': () => import('@/views/system/group'),
  'system_notice': () => import('@/views/system/notice'),
  'permission_role': () => import('@/views/system/role'),
  'permission_dataScope': () => import('@/views/system/dataScope'),
  'operation_errorLog': () => import('@/views/system/errorLog'),
  'operation_dataLog': () => import('@/views/system/dataLog'),
  'operation_monitor': () => import('@/views/system/monitor')
}

/**
 * 提示: 子菜单只会在children.length >=1 时出现
 * 详细信息请查看: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，将不会出现在侧边栏中，默认为 false
 *
 * alwaysShow: true               当一个路由下面的 children 大于1个时，自动会变成嵌套的模式
 *                                只有一个时，会将那个子路由当做根路由显示在侧边栏
 *                                若你想不想这样
 *                                你可以设置 alwaysShow: true，这样它就会一直显示根路由，默认为 false
 *
 * redirect: noRedirect           重定向地址，在面包屑中点击会重定向去的地址，如果设置了'noRedirect'，该路由在面包屑导航中不可被点击
 * name:'router-name'             用在 <keep-alive> 中用的，必须要设置，不然会出各种问题
 * meta : {
    roles: ['admin','editor']     设置路由的权限，可以设置多个，必须是数组
    title: 'title'                在侧边栏和面包屑上显示的名称（推荐设置）
    icon: 'svg-name'/'el-icon-x'  侧边栏上显示的图标
    noCache: true                 如果设置为true，页面将不会被缓存，默认为 false
    affix: true                   如果设置为true，它则会固定在tags-view中(默认 false)
    breadcrumb: false             如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    activeMenu: '/example/list'   当路由设置了该属性，则会高亮相对应的侧边栏
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'el-icon-s-home', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: '修改密码',
        meta: { title: '修改密码', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
  // 清空动态路由
  store.dispatch('permission/clearRouters')
}

export default router
