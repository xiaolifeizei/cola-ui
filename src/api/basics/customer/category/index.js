import request from '@/utils/request'

export function getCategoryTree(data) {
  return request({
    url: '/basics/customer/category/getCategoryTree',
    method: 'post',
    data
  })
}

export function addCategory(data) {
  return request({
    url: '/basics/customer/category/addCategory',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/basics/customer/category/updateCategory',
    method: 'post',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/basics/customer/category/deleteCategory',
    method: 'post',
    data
  })
}

export function getCategoryByCustomerId(data) {
  return request({
    url: '/basics/customer/category/getCategoryByCustomerId',
    method: 'post',
    data: 'customerId=' + data
  })
}
