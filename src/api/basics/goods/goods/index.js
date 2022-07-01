import request from '@/utils/request'

/**
 * 查询物资及其分类数
 * @param data
 * @returns {*}
 */
export function getCategoryGoodsPage(data) {
  return request({
    url: '/basics/goods/getCategoryGoodsPage',
    method: 'post',
    data
  })
}

/**
 * 添加物资
 * @param data
 * @returns {*}
 */
export function addGoods(data) {
  return request({
    url: '/basics/goods/addGoods',
    method: 'post',
    data
  })
}

/**
 * 修改物资
 * @param data
 * @returns {*}
 */
export function updateGoods(data) {
  return request({
    url: '/basics/goods/updateGoods',
    method: 'post',
    data
  })
}

/**
 * 删除物资
 * @param data
 * @returns {*}
 */
export function deleteGoods(data) {
  return request({
    url: '/basics/goods/deleteGoods',
    method: 'post',
    data
  })
}
