const Mock = require('mockjs')
module.exports = {
  'GET /mock/v1/test1': (req, res) => {
    var list = Mock.mock({
      // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
      'list|1-10': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'id|+1': 1
      }]
    })
    res.send({
      'success': true,
      'code': null,
      'msg': null,
      'result': {
        list,
        'recordsTotal': '200',
        'recordsFiltered': '0',
        'ext': null
      }
    })
  },
  'POST /mock/v1/test2': (req, res) => {
    res.send({
      'success': true,
      'code': null,
      'msg': null
    })
  }
}
