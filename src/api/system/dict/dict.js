import request from '@/utils/request'

/**
 * 获取字典列表
 * @param data
 * @returns {*}
 */
export function getDictTree(data) {
  return request({
    url: '/system/dict/getDictTree',
    method: 'post',
    data
  })
}

/**
 * 删除一条字典
 * @param data
 * @returns {*}
 */
export function deleteDict(data) {
  return request({
    url: '/system/dict/deleteDict',
    method: 'post',
    data
  })
}

/**
 * 添加字典
 * @param data
 * @returns {*}
 */
export function addDict(data) {
  return request({
    url: '/system/dict/addDict',
    method: 'post',
    data
  })
}

/**
 * 修改字典
 * @param data
 * @returns {*}
 */
export function updateDict(data) {
  return request({
    url: '/system/dict/updateDict',
    method: 'post',
    data
  })
}

/**
 * 查询字典列表
 * @param data
 * @returns {*}
 */
export function getDictList(data) {
  return request({
    url: '/system/dict/getDictList',
    method: 'post',
    data
  })
}

/**
 * 从缓存中获取字典
 */
export function getDictFromLocalStorage() {
  const dicts = localStorage.getItem('Dict-Key')
  if (dicts) {
    return JSON.parse(dicts)
  }
  return {}
}

/**
 * 将字典添加到缓存中
 * @param dicts
 */
export function setDictToLocalStorage(dicts) {
  localStorage.setItem('Dict-Key', JSON.stringify(dicts))
}
