import request from '@/utils/request'

/**
 * 分页查询数据日志
 * @param data
 * @returns {*}
 */
export function getDataLogPage(data) {
  return request({
    url: '/system/dataLog/getDataLogPage',
    method: 'post',
    data
  })
}

/**
 * 删除数据日志
 * @param data
 * @returns {*}
 */
export function deleteDataLog(data) {
  return request({
    url: '/system/dataLog/deleteDataLog',
    method: 'post',
    data
  })
}

/**
 * 清空数据日志
 * @param data
 * @returns {*}
 */
export function clearDataLog() {
  return request({
    url: '/system/dataLog/clearDataLog',
    method: 'post'
  })
}
