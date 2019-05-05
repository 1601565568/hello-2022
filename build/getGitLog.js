'use strict'
const { execSync } = require('child_process')
const HEAD = 'git rev-parse HEAD'
const REF = 'git symbolic-ref --short -q HEAD'
process.env.VUE_APP_VERSION = `${execSync(REF).toString('utf8')}/${execSync(HEAD).toString('utf8')}/${new Date()}`.replace(/\n|\r|\t/g, '')

module.exports = {
}
