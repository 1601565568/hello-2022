import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  mixins: [scrollHeight, tableMixin],
  data: function () {
    return {
      // 员工组建 员工值
      employeeSelectData: [],
      // 店铺组件 店铺值
      shopSelectData: [],
      replyTimeSpace: 10, // 回复时间间隔
      sendSpaceSet: 10, // 发送间隔设置
      matchType: 0, // 匹配方式
      replyTime: null, // 触发时间
      chatKeyWord: null, // 聊天关键词
      // 智能回复ID
      uuid: null,
      loading: false, // 防重复提交
      // 页面滚动条配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 69 // 底部按钮的高度39 + 30顶部设置小程序积分体系的高度
      },
      // 左边输入框绑定值
      input: '',
      // 弹框是否打开判断值
      dialogVisible: false,
      treeSelect: '',
      treeSelected: '',

      // 发布内容数据
      publishData: [],
      // 预置链接
      presetLink: []
    }
  },
  mounted () {
    this.initEdit()
    // this.getSystemPresetLink()
  },
  methods: {
    // 保存
    saveOrUpdateAutoReply () {
      this.loading = true
      let that = this
      if (that.employeeSelectData.length === 0 && that.shopSelectData.length === 0) {
        that.$notify.error('选择店铺和选择员工不能同时为空')
        this.loading = false
        return
      }
      if (!that.replyTimeSpace) {
        that.$notify.error('自动回复间隔不能为空')
        this.loading = false
        return
      }
      if (!that.sendSpaceSet) {
        that.$notify.error('发送延迟设置不能为空')
        this.loading = false
        return
      }
      if (!this.replyTime) {
        that.$notify.error('触发时间范围不能为空')
        this.loading = false
        return
      }
      if (!that.chatKeyWord) {
        that.$notify.error('聊天关键词不能为空')
        this.loading = false
        return
      }
      let split = that.chatKeyWord.split(',')
      if (split.length > 50) {
        that.$notify.error('最多输入50个关键词')
        this.loading = false
        return
      }
      for (let i = 0; i < split.length; i++) {
        let keyWord = split[i]
        if (keyWord.length > 20) {
          that.$notify.error('关键词：' + keyWord + '，长度超过20个字')
          this.loading = false
          return
        }
      }
      if (this.publishData.length === 0) {
        that.$notify.error('欢迎语不能为空')
        this.loading = false
        return
      }
      if (this.publishData.length > 10) {
        that.$notify.error('欢迎语不能超过10条')
        this.loading = false
        return
      }
      // 附带内容json
      let content = JSON.stringify(this.publishData)
      let model = {
        employeeIds: that.employeeSelectData,
        storeIds: that.shopSelectData,
        replyTimeSpace: that.replyTimeSpace,
        sendSpaceSet: that.sendSpaceSet,
        startTime: that.replyTime[0],
        endTime: that.replyTime[1],
        matchType: that.matchType,
        chatKeyWord: that.chatKeyWord,
        content: encodeURIComponent(content),
        uuid: that.uuid
      }
      debugger
      that.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        that.$http
          .fetch(that.$api.weChat.autoReply.saveOrUpdate, model)
          .then(resp => {
            this.loading = false
            that.$notify.success('操作成功')
            that.$router.push({ path: '/Guide/SgGuide/ChatAutoReply' })
          })
          .catch(resp => {
            this.loading = false
            that.$notify.error(resp.msg)
          })
          .finally(() => { })
      })
    },
    // 取消编辑
    cancelWelcomes () {
      this.$router.push({ path: '/Guide/SgGuide/ChatAutoReply' })
    },
    // // 获取系统预置链接
    // getSystemPresetLink: function () {
    //   let _this = this
    //   _this.$http.fetch(_this.$api.guide.systemPreset.getLink).then(resp => {
    //     if (resp.success && resp.result != null) {
    //       resp.result.forEach(function (value, i) {
    //         _this.presetLink.push(value)
    //       })
    //     }
    //   })
    // },
    /**
     * @msg: 页面初始化时的数据加载函数
     */
    async initEdit () {
      // 页面初始化时，加载页面数据
      let that = this
      let uuid = this.$route.query.uuid
      if (uuid) {
        that.$http.fetch(that.$api.weChat.autoReply.edit, { uuid: uuid }
        ).then(resp => {
          that.uuid = resp.result.uuid
          that.replyTimeSpace = resp.result.replyTimeSpace
          that.sendSpaceSet = resp.result.sendSpaceSet
          that.matchType = resp.result.matchType
          that.chatKeyWord = resp.result.chatKeyWord
          that.replyTime = []
          that.replyTime.push(resp.result.startTime)
          that.replyTime.push(resp.result.endTime)
          if (resp.result.content) {
            let content = decodeURIComponent(resp.result.content)
            JSON.parse(content).forEach(function (value, i) {
              that.publishData.push(value)
            })
          }
          if (resp.result.guideId) {
            let guideIds = resp.result.guideIds.split(',')
            guideIds.forEach(function (value, i) {
              that.employeeSelectData.push(value)
            })
          }
          if (resp.result.shopIds) {
            let shopIds = resp.result.shopIds.split(',')
            shopIds.forEach(function (value, i) {
              that.shopSelectData.push(value)
            })
          }
        }).catch(resp => {
          that.$notify.error(resp.msg)
        })
      }
    }
  },
  watch: {
    treeSelect (val) {
      this.$refs.selectTree.filter(val)
    },
    treeSelected (val) {
      this.$refs.selectedTree.filter(val)
    }
  }
}
