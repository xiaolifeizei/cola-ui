import request from '@/utils/request'

/**
 * 获取服务器信息
 * @param data
 * @returns {*}
 */
export function getSystemMonitor(data) {
  return request({
    url: '/system/monitor/getSystemMonitor',
    method: 'post',
    data
  })
}

/**
 * 获取所有的dubbo服务名
 * @returns {*}
 */
export function getApplicationNames() {
  return request({
    url: '/system/monitor/getApplicationNames',
    method: 'post'
  })
}
