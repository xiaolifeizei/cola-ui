import request from '@/utils/request'

/**
 * 分页查询用户列表
 * @param data
 * @returns {*}
 */
export function getUserPage(data) {
  return request({
    url: '/system/user/getUserPage',
    method: 'post',
    data
  })
}

/**
 * 添加用户
 * @param data
 * @returns {*}
 */
export function addUser(data) {
  return request({
    url: '/system/user/addUser',
    method: 'post',
    data
  })
}

/**
 * 修改用户
 * @param data
 * @returns {*}
 */
export function updateUser(data) {
  return request({
    url: '/system/user/updateUser',
    method: 'post',
    data
  })
}

/**
 * 删除用户
 * @param data
 * @returns {*}
 */
export function deleteUser(data) {
  return request({
    url: '/system/user/deleteUser',
    method: 'post',
    data
  })
}

/**
 * 通过用户查询已经分配的角色
 * @param data
 * @returns {*}
 */
export function getRoleUsersByUser(data) {
  return request({
    url: '/system/user/getRoleUsersByUser',
    method: 'post',
    data
  })
}

/**
 * 给用户添加角色
 * @param data
 * @returns {*}
 */
export function grantRoles(data) {
  return request({
    url: '/system/user/grantRoles',
    method: 'post',
    data
  })
}

/**
 * 重置用户密码
 * @param data
 * @returns {*}
 */
export function resetPassword(data) {
  return request({
    url: '/system/user/resetPassword',
    method: 'post',
    data
  })
}

/**
 * 个人中心修改用户信息，包括修改密码
 * @param data
 * @returns {*}
 */
export function updateUserInfo(data) {
  return request({
    url: '/system/user/updateUserInfo',
    method: 'post',
    data
  })
}

/**
 * 登陆接口
 * @param data
 * @returns {*}
 */
export function login(data) {
  return request({
    url: '/auth/token',
    method: 'post',
    data
  })
}

/**
 * 获取用户详细信息
 * @returns {*}
 */
export function getInfo() {
  return request({
    url: '/system/login/getUserInfo',
    method: 'post'
  })
}

/**
 * 退出登陆
 * @returns {*}
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
