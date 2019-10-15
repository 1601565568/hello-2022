'use strict'
const packageData = require('../package.json')
if (packageData) {
  console.log('启动版本软件版本信息生成')
  process.env.VUE_APP_INFOS = JSON.stringify({
    name: packageData.name,
    version: packageData.version,
    buildTime: new Date(),
    hash: `${process.env.GIT_COMMIT}`
  })
}
