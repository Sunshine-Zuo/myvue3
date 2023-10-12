import JSEncrypt from 'jsencrypt/bin/jsencrypt'
//RSA加密
export function enRsa(str) {
  let encryptor = new JSEncrypt()
  let pubKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJxfm8mFHLgnlb9E1+YlcLliaShCpRa41dg70E2LQjBhRwIcYaqzumy+2b1rlncZKWhKNlQzu7tlTM4ORiZqfg0yXh7TYCSGjz8qE1y1zvUfCB3REt0KNpLkf1ivopwMyIn+HmJomR3BK8CJmi4L7HKwBBJwa8s5xFFBse4cNI6wIDAQAB'
  encryptor.setPublicKey(pubKey)//设置公钥
  return encryptor.encrypt(str)
}
//RSA解密
export function deRsa(str) {
  let decryptor = new JSEncrypt()
  var priKey = '私钥'
  decryptor.setPrivateKey(priKey)//设置私钥
  return decryptor.decrypt(str)
}

export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

export function validPhone(phone) {
  const reg = /^1[3|4|5|7|8][0-9]{9}$/
  return reg.test(phone)
}