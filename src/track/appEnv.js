const map = new Map([
  ['sandbox-sg-v6.vecrp.com', 'test'],
  ['demo-sg.vecrp.com', 'pre'],
  ['sg-v6.vecrp.com', 'saas'],
  ['sg-qa.vecrp.com', 'qa'],
  ['sg-v6.eifini.com', 'eifini'],
  ['scrmsdg.peaksport.com', 'peak']
])

function getWebDev () {
  const originURL = window.location.host || ''
  if (map.has(originURL)) {
    return map.get(originURL)
  }
  return 'localhost'
}

function getAppEnv () {
  const appEnv = getWebDev()
  if (appEnv === 'qa' || appEnv === 'eifini' || appEnv === 'peak') {
    return 'saas'
  }
  return appEnv
}

module.exports = {
  getWebDev,
  getAppEnv
}
