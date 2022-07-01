import axios from 'axios'
import { MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { getToken, refreshToken, setToken } from '@/utils/auth'
import jwt_decode from 'jwt-decode'

let refreshing = false

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    if (!config.data) {
      config.data = {}
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    const token = getToken()
    if (token && !refreshing) {
      const tokenObj = jwt_decode(token)
      if (tokenObj) {
        const sub = (tokenObj.exp - tokenObj.iat) / 2
        // 超时一半刷新token
        if (tokenObj.exp - Date.now() < sub) {
          refreshing = true
          refreshToken().then(res => {
            if (res.data.token) {
              setToken(res.data.token)
            }
            refreshing = false
          })
        }
      }
    }

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      // 508: 非法 token; 512: 在其他地方登陆; 514: Token 超时;
      if (res.code === 508 || res.code === 512 || res.code === 514) {
        // to re-login
        MessageBox.confirm('登陆超时，您可以点击取消留在此页面，或重新登入', '是否退出登陆', {
          confirmButtonText: '重新登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除Token
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        Notification.error({
          title: '操作失败',
          message: res.msg
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.warn('err' + error) // for debug
    Notification.error({
      title: '操作失败',
      message: '网络异常，服务器无法访问'
    })
    return Promise.reject(error)
  }
)

export default service
