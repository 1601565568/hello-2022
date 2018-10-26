function isAuthorize (url, code) {
  var AUTH = {}
  var CODEACL = {}
  var isAuthorized = true
  if (AUTH && url) {
    isAuthorized = Boolean(AUTH[url] !== undefined ? AUTH[url] : true)
  }
  if (isAuthorized && code && CODEACL) {
    return Boolean(CODEACL[code] !== undefined ? CODEACL[code] : true)
  }
  return isAuthorized
}

export default isAuthorize
