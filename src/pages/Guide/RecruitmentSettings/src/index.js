import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import ElUpload from '@nascent/nui/lib/upload'

export default {
  name: 'index',
  mixins: [tableMixin],
  components: {
    ElUpload
  },
  data: function () {
    return {
      model: {
        id: null,
        secruitment_type: 0,
        sign_up_url: ''
      },
      status: 1
    }
  },
  mounted: function () {
    // 加载页面设置函数
    let _this = this
    this.$http.fetch(this.$api.guide.secruitmentSet.getInfo).then((resp) => {
      if (resp.success && resp.result) {
        _this.model.secruitment_type = resp.result.secruitment_type
        _this.model.sign_up_url = resp.result.sign_up_url
        _this.model.id = resp.result.id
      }
    })
  },
  methods: {
    onSaveOrUpdate () { // 修改配置功能
      let that = this
      that.$http.fetch(that.$api.guide.secruitmentSet.saveOrUpdateSet, that.model).then(() => {
        that.$notify.success('修改成功')
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('修改失败', resp))
      })
    },
    'handleAvatarSuccess': function (res, file) {
      // console.log('图片地址：' + res.result.url)
      this.model.sign_up_url = res.result.url
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!')
      }
      return isJPG && isLt2M
    }
  }
}
