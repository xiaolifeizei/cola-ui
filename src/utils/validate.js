/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

// ===================================create by cui_feng==================================================

/**
 * 支持15位一代身份证和18位的二代身份证
 * @param idCard 省份证号
 * @returns {boolean} 合法返回true，否则false
 */
export function validateIdCard(idCard) {
  const vcity = {
    11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古',
    21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏',
    33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南',
    42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆',
    51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃',
    63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外'
  }
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  const reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/
  if (!reg.test(idCard)) {
    return false
  }
  // 检查省份
  const provinceCode = idCard.substring(0, 2)
  if (vcity[provinceCode] === undefined) {
    return false
  }
  // 检验位的检测
  return checkParity(idCard) !== false
}

/**
 * 校验位的检测
 * @param card
 * @returns {boolean}
 */
function checkParity(card) {
  // 15位转18位
  card = changeFifteenToEighteen(card)
  const len = card.length
  if (len === 18) {
    const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    let sum = 0
    for (let i = 0; i < 17; i++) {
      sum += card.charAt(i) * arrInt[i]
    }
    const checkCode = arrCh[sum % 11]
    return checkCode === card.substring(17).toLocaleUpperCase()
  }
  return false
}

function changeFifteenToEighteen(card) {
  if (card.length === 15) {
    const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    let sum = 0
    card = card.substring(0, 6) + '19' + card.substring(6)
    for (let i = 0; i < 17; i++) {
      sum += card.charAt(i) * arrInt[i]
    }
    const checkCode = arrCh[sum % 11]
    return card + checkCode
  }
  return card
}

