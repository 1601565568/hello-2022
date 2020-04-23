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
      loading: false, // 防重复提交
      // 页面滚动条内容高度配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 39 // 底部按钮的高度39
      },
      groupLogo: '',
      model: {
        title: '',
        content: '',
        id: null,
        // 小程序招募背景图
        recruiting_posters_image: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/guide/1/img/common/app/Group.png',
        // 封面图
        picture: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1-20个字符以内', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入摘要内容', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在1-50个字符以内', trigger: 'blur' }
        ],
        picture: [
          { required: true, message: '请上传封面图', trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function () {
    // 加载页面设置函数
    let _this = this
    this.$http.fetch(this.$api.guide.recruitPageConfig.getInfo).then((resp) => {
      if (resp.success && resp.result) {
        _this.model.title = resp.result.title
        _this.model.content = resp.result.content
        _this.model.picture = resp.result.picture
        _this.model.id = resp.result.id
        if (resp.result.recruiting_posters_image) {
          _this.model.recruiting_posters_image = resp.result.recruiting_posters_image
        }
        _this.model.groupLogo = resp.msg
      }
    })
  },
  methods: {
    update () {
      this.loading = true
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.doUpdate()
        }
      })
    },
    async doUpdate () {
      let that = this
      that.$http.fetch(that.$api.guide.recruitPageConfig.updateSet, that.model).then(() => {
        this.loading = false
        that.$notify.success('修改成功')
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('修改失败', resp))
      })
    },
    // 背景图
    handleBackgroundSuccess (res, file) {
      this.model.recruiting_posters_image = res.result.url
    },
    // 封面图
    handleSurfaceSuccess (res, file) {
      this.model.picture = res.result.url
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isJPG && isLt2M
    }
  }
}
