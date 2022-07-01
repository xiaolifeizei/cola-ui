import request from '@/utils/request'

/**
 * 获取当前登陆用户的菜单
 * @param data
 * @returns {*}
 */
export function getLoginMenu(data) {
  return request({
    url: '/system/login/getMenuTreeByUser',
    method: 'post'
  })
}

/**
 * 获取当前登陆用户的按钮
 * @param data
 * @returns {*}
 */
export function getLoginButton(data) {
  return request({
    url: '/system/login/getButtonsByUser',
    method: 'post'
  })
}

/**
 * 获取菜单列表树
 * @param data
 * @returns {*}
 */
export function getMenuTree(data) {
  return request({
    url: '/system/menu/getMenuTree',
    method: 'post',
    data
  })
}

/**
 * 删除菜单（物理删除）
 * @param data
 * @returns {*}
 */
export function deleteMenu(data) {
  return request({
    url: '/system/menu/deleteMenu',
    method: 'post',
    data
  })
}

/**
 * 修改菜单
 * @param data
 * @returns {*}
 */
export function updateMenu(data) {
  return request({
    url: '/system/menu/updateMenu',
    method: 'post',
    data
  })
}

/**
 * 添加菜单
 * @param data
 * @returns {*}
 */
export function addMenu(data) {
  return request({
    url: '/system/menu/addMenu',
    method: 'post',
    data
  })
}
