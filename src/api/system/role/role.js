import request from '@/utils/request'

/**
 * 获取菜单列表树
 * @param data
 * @returns {*}
 */
export function getRoleTree(data) {
  return request({
    url: '/system/role/getRoleTree',
    method: 'post',
    data
  })
}

/**
 * 通过角色查询已分配的菜单
 * @param data
 * @returns {*}
 */
export function getRoleMenusByRole(data) {
  return request({
    url: '/system/role/getRoleMenusByRole',
    method: 'post',
    data
  })
}

/**
 * 删除角色
 * @param data
 * @returns {*}
 */
export function deleteRole(data) {
  return request({
    url: '/system/role/deleteRole',
    method: 'post',
    data
  })
}

/**
 * 修改角色
 * @param data
 * @returns {*}
 */
export function updateRole(data) {
  return request({
    url: '/system/role/updateRole',
    method: 'post',
    data
  })
}

/**
 * 添加角色
 * @param data
 * @returns {*}
 */
export function addRole(data) {
  return request({
    url: '/system/role/addRole',
    method: 'post',
    data
  })
}

/**
 * 给角色分配菜单
 * @param data
 * @returns {*}
 */
export function grantMenus(data) {
  return request({
    url: '/system/role/grantMenus',
    method: 'post',
    data
  })
}
