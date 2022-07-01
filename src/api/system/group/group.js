import request from '@/utils/request'

/**
 * 获取当前用户的组织机构树
 * @param data
 * @returns {*}
 */
export function getGroupTreeByUser(data) {
  return request({
    url: '/system/group/getGroupTreeByUser',
    method: 'post',
    data
  })
}

/**
 * 获取当前用户的组织机构树
 * @param data
 * @returns {*}
 */
export function getGroupTreeByCurrentUser() {
  return request({
    url: '/system/group/getGroupTreeByCurrentUser',
    method: 'post'
  })
}

/**
 * 获取组织机构列表树
 * @param data
 * @returns {*}
 */
export function getGroupTree(data) {
  return request({
    url: '/system/group/getGroupTree',
    method: 'post',
    data
  })
}

/**
 * 删除机构
 * @param data
 * @returns {*}
 */
export function deleteGroup(data) {
  return request({
    url: '/system/group/deleteGroup',
    method: 'post',
    data
  })
}

/**
 * 修改机构
 * @param data
 * @returns {*}
 */
export function updateGroup(data) {
  return request({
    url: '/system/group/updateGroup',
    method: 'post',
    data
  })
}

/**
 * 添加机构
 * @param data
 * @returns {*}
 */
export function addGroup(data) {
  return request({
    url: '/system/group/addGroup',
    method: 'post',
    data
  })
}
