import request from '@/utils/request'

/**
 * 分页查询通知列表
 * @param data
 * @returns {*}
 */
export function getNoticePage(data) {
  return request({
    url: '/system/notice/getNoticePage',
    method: 'post',
    data
  })
}

/**
 * 添加通知
 * @param data
 * @returns {*}
 */
export function addNotice(data) {
  return request({
    url: '/system/notice/addNotice',
    method: 'post',
    data
  })
}

/**
 * 修改通知
 * @param data
 * @returns {*}
 */
export function updateNotice(data) {
  return request({
    url: '/system/notice/updateNotice',
    method: 'post',
    data
  })
}

/**
 * 删除通知
 * @param data
 * @returns {*}
 */
export function deleteNotice(data) {
  return request({
    url: '/system/notice/deleteNotice',
    method: 'post',
    data
  })
}

