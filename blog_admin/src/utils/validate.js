
var regexEnum = {
  intege: '^-?[1-9]\\d*$', // 整数
  intege1: '^[1-9]\\d*$', // 正整数
  intege2: '^-[1-9]\\d*$', // 负整数
  num: '^([+-]?)\\d*\\.?\\d+$', // 数字
  num1: '^([+]?)\\d*$', // 正数（正整数 + 0）
  num2: '^-[1-9]\\d*|0$', // 负数（负整数 + 0）
  num3: '^([+]?)\\d*\\.?\\d+$', // 正数
  decmal: '^([+-]?)\\d*\\.\\d+$', // 浮点数
  decmal1: '^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$', // 正浮点数
  decmal2: '^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$', // 负浮点数
  decmal3: '^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$', // 浮点数
  decmal4: '^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$', // 非负浮点数（正浮点数 + 0）
  decmal5: '^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$', // 非正浮点数（负浮点数 +
  // 0）
  email: '^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$', // 邮件
  color: '^[a-fA-F0-9]{6}$', // 颜色
  url: '^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$', // url
  chinese: '^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$', // 仅中文
  ascii: '^[\\x00-\\xFF]+$', // 仅ACSII字符
  zipcode: '^\\d{6}$', // 邮编
  mobile: '^(13|15|18|14)[0-9]{9}$', // 手机
  ip4: '^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$', // ip地址
  notempty: '^\\S+$', // 非空
  picture: '(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$', // 图片
  jpg: '(.*)\\.(jpg|gif)$', // 图片
  rar: '(.*)\\.(rar|zip|7zip|tgz)$', // 压缩文件
  date: '^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$', // 日期
  qq: '^[1-9]*[1-9][0-9]*$', // QQ号码
  tel: '^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$', // 电话号码的函数(包括验证国内区号,国际区号,分机号)
  username: '^\\w+$', // 用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
  letter: '^[A-Za-z]+$', // 字母
  letter_u: '^[A-Z]+$', // 大写字母
  letter_l: '^[a-z]+$', // 小写字母
  letter_num: '^\\w+$', // 匹配由数字、26个英文字母或者下划线组成的字符串
  idcard: '/(^/d{15}$)|(^/d{17}([0-9]|X)$)/', // 身份证
  htmlcode: "^[^\\\\'\"<>@#$&]+$", // 禁止输入html代码（特殊字符）
  uploadFile: '(.*)\\.(jpg|bmp|gif|png|jpeg|tif|pdf|doc|docx|xls|xlsx|ppt|pptx)$' // 图片
}

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
  const valid_map = ['admin', 'editor','ceshi']
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
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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

/**
 * @description: v
 * @param {type}
 * @return {Boolran}
 */
export function isZNum(val) {
  var reg = /^[0-9]*[1-9][0-9]*$/
  return reg.test(val)
}
