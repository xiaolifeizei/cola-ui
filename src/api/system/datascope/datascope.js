import request from '@/utils/request'

/**
 * 查询数据权限
 * @param data
 * @returns {*}
 */
export function getDataScopeList(data) {
  return request({
    url: '/system/datascope/getDataScopeList',
    method: 'post',
    data
  })
}

/**
 * 添加数据权限
 * @param data
 * @returns {*}
 */
export function addDataScope(data) {
  return request({
    url: '/system/datascope/addDataScope',
    method: 'post',
    data
  })
}

/**
 * 修改数据权限
 * @param data
 * @returns {*}
 */
export function updateDataScope(data) {
  return request({
    url: '/system/datascope/updateDataScope',
    method: 'post',
    data
  })
}

/**
 * 删除数据权限
 * @param data
 * @returns {*}
 */
export function deleteDataScope(data) {
  return request({
    url: '/system/datascope/deleteDataScope',
    method: 'post',
    data
  })
}
