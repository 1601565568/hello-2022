import { timeTypeInterval, timeTypeForever, redpacketTypeList, setTypeList, timeTypeList, normalRed, luckyRed, diyRed, staffPost, activityPost, BLESSING } from '../const'
export default {
  data () {
    return {
      timeTypeInterval, timeTypeForever, redpacketTypeList, setTypeList, timeTypeList, normalRed, luckyRed, diyRed, staffPost, activityPost, BLESSING
    }
  },
  methods: {
    /**
   * 设置默认值
   */
    setDefault (defaultModel) {
      this.model = Object.assign(this.model, defaultModel)
    },
    /**
     * 返回列表
     * @param {*} [path=this.listPath]
     */
    handleCancel (path = this.listPath) {
      this.$router.push({ path })
    },
    /**
     * 提交校验
     */
    update (api = this.submitApi) {
      this.btnLoad = true
      this.$refs.searchform.validate(async (valid) => {
        if (!valid) {
          this.btnLoad = false
        } else {
          this.doUpdata(api, this.formatData(this.model, 'submit'))
        }
      })
    },
    /**
     * 提交
     * @param {*} model
     */
    doUpdata (api, model) {
      this.$http.fetch(api, model).then(() => {
        this.btnLoad = false
        this.$notify.success('保存成功')
        this.handleCancel()
      }).catch((resp) => {
        this.btnLoad = false
        this.$notify.error(resp.msg)
      })
    }
  }

}
