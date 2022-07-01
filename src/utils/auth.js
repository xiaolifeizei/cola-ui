import Cookies from 'js-cookie'
import request from '@/utils/request'

const TokenKey = 'Admin-Token'

const UserRolesKey = 'User-Roles'

const UserNameKey = 'User-Name'

const UserInfoKey = 'User-Info'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserRoles() {
  const userRolesKey = localStorage.getItem(UserRolesKey)
  if (userRolesKey) {
    return JSON.parse(userRolesKey)
  }
  return []
}

export function setUserRoles(userRoles) {
  localStorage.setItem(UserRolesKey, JSON.stringify(userRoles))
}

export function removeUserRoles() {
  return Cookies.remove(UserRolesKey)
}

export function getUserName() {
  return Cookies.get(UserNameKey)
}

export function setUserName(userName) {
  return Cookies.set(UserNameKey, userName)
}

export function removeUserName() {
  return Cookies.remove(UserNameKey)
}

export function setUserInfo(userInfo) {
  localStorage.setItem(UserInfoKey, JSON.stringify(userInfo))
}

export function getUserInfo() {
  const userInfo = localStorage.getItem(UserInfoKey)
  if (userInfo) {
    return JSON.parse(userInfo)
  }
  return {
    loginName: '',
    phone: '',
    createtime: ''
  }
}

export function removeUserInfo() {
  localStorage.removeItem(UserInfoKey)
}

/**
 * 刷新Token
 * @param data
 * @returns {*}
 */
export function refreshToken() {
  return request({
    url: '/system/login/refreshToken',
    method: 'post'
  })
}
