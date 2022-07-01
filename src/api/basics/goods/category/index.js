import request from '@/utils/request'

export function getCategoryTree(data) {
  return request({
    url: '/basics/goods/category/getCategoryTree',
    method: 'post',
    data
  })
}

export function addCategory(data) {
  return request({
    url: '/basics/goods/category/addCategory',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/basics/goods/category/updateCategory',
    method: 'post',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/basics/goods/category/deleteCategory',
    method: 'post',
    data
  })
}

export function getCategoryByGoodsId(data) {
  return request({
    url: '/basics/goods/category/getCategoryByGoodsId',
    method: 'post',
    data: 'goodsId=' + data
  })
}
