import request from '@/utils/request'

/**
 * 查询客户及其分类数
 * @param data
 * @returns {*}
 */
export function getCategoryCustomerPage(data) {
  return request({
    url: '/basics/customer/getCategoryCustomerPage',
    method: 'post',
    data
  })
}

/**
 * 添加客户
 * @param data
 * @returns {*}
 */
export function addCustomer(data) {
  return request({
    url: '/basics/customer/addCustomer',
    method: 'post',
    data
  })
}

/**
 * 修改客户
 * @param data
 * @returns {*}
 */
export function updateCustomer(data) {
  return request({
    url: '/basics/customer/updateCustomer',
    method: 'post',
    data
  })
}

/**
 * 删除客户
 * @param data
 * @returns {*}
 */
export function deleteCustomer(data) {
  return request({
    url: '/basics/customer/deleteCustomer',
    method: 'post',
    data
  })
}
