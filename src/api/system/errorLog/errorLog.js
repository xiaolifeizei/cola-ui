import request from '@/utils/request'

/**
 * 分页查询错误日志列表
 * @param data
 * @returns {*}
 */
export function getErrorLogPage(data) {
  return request({
    url: '/system/errorlog/getErrorLogPage',
    method: 'post',
    data
  })
}

/**
 * 清空日志
 * @returns {*}
 */
export function clearErrorLog() {
  return request({
    url: '/system/errorlog/clearErrorLog',
    method: 'post'
  })
}
