const map = new Map([
  ['sandbox-sg-v6.vecrp.com', 'test'],
  ['demo-sg.vecrp.com', 'pre'],
  ['sg-v6.vecrp.com', 'saas'],
  ['sg-qa.vecrp.com', 'qa'],
  ['sg-v6.eifini.com', 'eifini'],
  ['scrmsdg.peaksport.com', 'peak']
])

function getWebDev () {
  const originURL = 'sandbox-sg-v6.vecrp.com'
  if (map.has(originURL)) {
    return map.get(originURL)
  }
  return 'localhost'
}

module.exports = {
  getWebDev
}
