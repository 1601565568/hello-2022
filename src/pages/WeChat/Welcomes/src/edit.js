import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  mixins: [scrollHeight, tableMixin],
  data: function () {
    return {
      // 欢迎语ID
      uuid: null,
      // 计划名称输入框绑定值
      title: '',
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
      // 员工组建 员工值
      employeeSelectData: [],
      // 发布内容数据
      publishData: [],
      // 预置链接
      presetLink: []
    }
  },
  mounted () {
    this.initEdit()
    this.getSystemPresetLink()
  },
  methods: {
    // 保存
    saveOrUpdateWelcomes () {
      this.loading = true
      let that = this
      if (!that.title) {
        that.$notify.error('标题不能为空')
        this.loading = false
        return
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
        title: that.title,
        content: encodeURIComponent(content),
        uuid: that.uuid,
        employeeIds: that.employeeSelectData
      }
      that.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        that.$http
          .fetch(that.$api.weChat.welcomes.saveWelcomeCode, model)
          .then(resp => {
            this.loading = false
            that.$notify.success('操作成功')
            that.$router.push({ path: '/Guide/speech/speechList' })
          })
          .catch(resp => {
            that.$notify.error(resp.msg)
          })
          .finally(() => { })
      })
    },
    // 取消编辑
    cancelWelcomes () {
      this.$router.push({ path: '/Guide/speech/speechList' })
    },
    // 获取系统预置链接
    getSystemPresetLink: function () {
      let _this = this
      _this.$http.fetch(_this.$api.guide.systemPreset.getLink).then(resp => {
        if (resp.success && resp.result != null) {
          resp.result.forEach(function (value, i) {
            _this.presetLink.push(value)
          })
        }
      })
    },
    /**
     * @msg: 页面初始化时的数据加载函数
     */
    async initEdit () {
      // 页面初始化时，加载页面数据
      let that = this
      let uuid = this.$route.query.uuid
      var keyMap = {}
      if (uuid) {
        that.$http.fetch(that.$api.weChat.welcomes.getWelcomeCode, { uuid: uuid }
        ).then(resp => {
          that.uuid = resp.result.uuid
          that.title = resp.result.title
          if (resp.result.content) {
            let content = decodeURIComponent(resp.result.content)
            JSON.parse(content).forEach(function (value, i) {
              that.publishData.push(value)
            })
          }
          resp.result.employeeIds.forEach(function (value, i) {
            that.employeeSelectData.push(value)
          })
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
