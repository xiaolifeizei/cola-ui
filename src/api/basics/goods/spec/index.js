import request from '@/utils/request'

/**
 * 获取规格分页数据
 * @param data
 * @returns {*}
 */
export function getSpecPage(data) {
  return request({
    url: '/basics/goods/spec/getSpecPage',
    method: 'post',
    data
  })
}

/**
 * 添加规格
 * @param data
 * @returns {*}
 */
export function addSpec(data) {
  return request({
    url: '/basics/goods/spec/addSpec',
    method: 'post',
    data
  })
}

/**
 * 修改规格
 * @param data
 * @returns {*}
 */
export function updateSpec(data) {
  return request({
    url: '/basics/goods/spec/updateSpec',
    method: 'post',
    data
  })
}

/**
 * 删除规格
 * @param data
 * @returns {*}
 */
export function deleteSpec(data) {
  return request({
    url: '/basics/goods/spec/deleteSpec',
    method: 'post',
    data
  })
}
