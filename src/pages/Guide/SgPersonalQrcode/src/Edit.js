import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
export default {
  name: 'index',
  mixins: [tableMixin],
  data: function () {
    let that = this
    return {
      personalQrcode: {
        id: null,
        guid: null,
        creatorId: null,
        nickname: null,
        creatorName: null,
        name: null,
        personnels: null,
        prersonelIds: '',
        num: null,
        image: '',
        createTime: '',
        showType: 1
      },
      title: null,
      parameter: {
        length: 10,
        searchMap: {
        },
        start: 0
      },
      modelObj: {},
      status: 0,
      rules: {
        'code': [{ required: true, message: '请输入配置项编码' }],
        'value': [{ required: true, message: '请输入配置项值' }],
        'type': [{ required: true, message: '请选择类型' }]
      }
    }
  },
  mounted: function () {
    const id = this.$route.params.id
    if (id > 0) {
      this.title = '编辑商品'
      this.$http.fetch(this.$api.guide.personalQrcode.findById, {
        id: id
      }).then(data => {
        debugger
        this.personalQrcode.id = data.result.id
        this.personalQrcode.name = data.result.name
        this.personalQrcode.showType = data.result.showType
      }).catch((error) => {
        this.$notify.error(getErrorMsg('加载聚合二维码信息失败：', error))
      }).finally(() => {
        this.loading = false
      })
    } else {
      this.title = '新增商品'
    }
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  methods: {
    // reload () {
    //   this.status = 0
    //   this.model = {
    //     id: null,
    //     recruit_type: null,
    //     change_type: null,
    //     change_num: null,
    //     limit_type: null
    //   }
    //   this.$reload()
    // },
    // // 会员可自主更换专属导购修改 0：不允许自主更换导购
    // changeType () {
    //   if (this.model.change_type === 0) {
    //     this.model.limit_type = 0
    //     this.model.change_num = null
    //   }
    // },
    // // 会员可自主更换专属导购的次数 0:不限制次数
    // limitTypeChange () {
    //   if (this.model.limit_type === 0) {
    //     this.model.change_num = 0
    //   }
    // },
    onSave () { // 小程序保存功能shopManagerreload_radio
      let that = this
      that.$http.fetch(that.$api.guide.personalQrcode.save, that.personalQrcode).then(() => {
        that.$notify.success('保存成功')
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('保存失败', resp))
      })
    }
    /**
     * 处理请求参数
     * @param params
     * @returns {*}
     */
    // $handleParams: function (params) {
    //   this.param = params
    //   if (params.searchMap && params.searchMap.time && params.searchMap.time.length > 0) {
    //     params.searchMap.timeStart = params.searchMap.time[0]
    //     params.searchMap.timeEnd = params.searchMap.time[1]
    //   }
    //   delete params.searchMap.time
    //   return params
    // },
    // $queryList$: function (params) {
    //   let _this = this
    //   return this.$http.fetch(this.$api.guide.guide.getCustomerConfig, params).then((resp) => {
    //     _this.model.recruit_type = resp.result.recruit_type
    //     _this.model.change_type = resp.result.change_type
    //     _this.model.change_num = resp.result.change_num
    //     if (resp.result.change_num > 0) {
    //       _this.model.limit_type = 1
    //     } else {
    //       _this.model.limit_type = 0
    //     }
    //   }).catch(() => {
    //     _this.$notify.error('网络异常，获取数据失败！')
    //   }).finally(() => {
    //   })
    // }
  }
}
