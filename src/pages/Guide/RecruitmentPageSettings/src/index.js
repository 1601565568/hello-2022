import { getErrorMsg } from '@/utils/toast'
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import ElUpload from '@nascent/nui/lib/upload'

export default {
  name: 'index',
  mixins: [scrollHeight],
  components: {
    ElUpload
  },
  data: function () {
    return {
      // 页面滚动条内容高度配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 39 // 底部按钮的高度39
      },
      model: {
        title: '',
        content: '',
        id: null,
        sign_up_url: 'https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/202002/10000146/7cf9ebfa-37ae-468b-bb29-df37f75c9ea8.jpg'
      }
    }
  },
  mounted: function () {
    // 加载页面设置函数
    let _this = this
    this.$http.fetch(this.$api.guide.secruitmentSet.getInfo).then((resp) => {
      if (resp.success && resp.result) {
        _this.model.sign_up_url = resp.result.sign_up_url
        _this.model.id = resp.result.id
      }
    })
  },
  methods: {
    update () { // 修改配置功能
      let that = this
      that.$http.fetch(that.$api.guide.secruitmentSet.updateSet, that.model).then(() => {
        that.$notify.success('修改成功')
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('修改失败', resp))
      })
    },
    handleAvatarSuccess (res, file) {
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
