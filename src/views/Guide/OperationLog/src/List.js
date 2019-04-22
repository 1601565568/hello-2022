
export default {
  data: function () {
    return {
      title: '变更详情',
      detailShow: false,
      changeValue: {},
      sum: []
    }
  },
  methods: {
    viewDetails (value) {
      this.detailShow = true
      this.initList(value)
    },
    initList (value) { // 查询详情列表
      let _this = this
      let arr = []
      let arr1 = []
      _this.$http.fetch(_this.$api.guide.guide.operationlogGetDetail, {id: Number(value.id)}).then(resp => {
        if (resp.result.afterJson !== null) {
          resp.result.afterJson = JSON.parse(resp.result.afterJson)
          for (let i in resp.result.afterJson) {
            if (Object.prototype.toString.call(resp.result.afterJson[i]) === '[object Array]') {
              resp.result.afterJson[i].map(item => {
                let str = ''
                for (let j in item) {
                  str = str + `${j}:${item[j] || '-'}，`
                }
                arr.push(str.substring(0, str.length - 1))
              })
            } else {
              arr.push(`${i}:${resp.result.afterJson[i] || ''}`)
            }
          }
          resp.result.afterJson = arr
        }
        if (resp.result.beforeJson !== null) {
          resp.result.beforeJson = JSON.parse(resp.result.beforeJson)
          for (let i in resp.result.beforeJson) {
            if (Object.prototype.toString.call(resp.result.beforeJson[i]) === '[object Array]') {
              resp.result.beforeJson[i].map(item => {
                let str = ''
                for (let j in item) {
                  str = str + `${j}:${item[j] || '-'}，`
                }
                arr1.push(str.substring(0, str.length - 1))
              })
            } else {
              arr1.push(`${i}:${resp.result.beforeJson[i] || ''}`)
            }
          }
          resp.result.beforeJson = arr1
        }
        this.changeValue = resp.result
        this.sum = []
        if (arr.length !== 0 && arr1.length !== 0) {
          arr.map((item, i) => {
            if (arr1[i] !== item) {
              this.sum.push(i)
            } else {
              this.sum.push(null)
            }
          })
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    }
  }
}
