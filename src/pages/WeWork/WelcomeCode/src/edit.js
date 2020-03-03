import commonRules from './commonRules.js'
import ElMain from '@nascent/nui/lib/main'
import ElCard from '@nascent/nui/lib/card'
import ElContainer from '@nascent/nui/lib/container'
import ElAside from '@nascent/nui/lib/aside'
import ElImage from '@nascent/nui/lib/image'
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import ElUpload from '@nascent/nui/lib/upload'

export default {
  name: '',
  mixins: [scrollHeight],
  components: {
    ElContainer,
    ElMain,
    ElAside,
    ElImage,
    ElUpload
  },
  data: function () {
    // 网页链接配置model
    let imageModel = {
      image: ''
    }
    // 网页链接配置model
    let linkModel = {
      visible: false,
      custom: 1, // 默认自定义
      settingId: null, // 预置配置ID
      link: '', // 链接
      title: '',
      innerContent: '', // 文案
      image: ''
    }
    // 小程序实体model
    let appModel = {
      visible: false,
      custom: 1, // 默认自定义
      settingId: null, // 预置配置ID
      appid: '', // 小程序appid
      path: '', // 小程序路径
      title: '', // 标题
      innerContent: '', // 文案
      image: '' // 封面
    }
    let employeeModel = {
      visible: false
    }
    let channelModel = {
      visible: false,
      channelId: null
    }
    let model = {
      content: '', // 欢迎语内容
      annexType: 0, // 附带内容，默认无
      employeeIds: [], // 使用员工ids
      channelId: null // 使用渠道id
    }
    return {
      // 是否是更新页面
      update: false,
      commonRules: commonRules,
      // 展示内容
      showChoice: 2,
      imageModel: imageModel,
      linkModel: linkModel,
      appModel: appModel,
      employeeModel: employeeModel,
      channelModel: channelModel,
      model: model,
      channelList: []
    }
  },
  mounted: function () {
    this.$init({ uuid: this.$route.query.welcomeCodeUuid })
    // 获取渠道列表
    this.$http.fetch(this.$api.weWork.welcomeCode.findChannelList).then((resp) => {
      this.channelList = resp.result
    }).catch((resp) => {
      this.$notify.error(resp.msg)
    })
  },
  methods: {
    /**
     * @msg: 选择附件内容
     * @param {Number} 2链接 3小程序
     */
    showAnnex (type) {
      // 链接
      if (type === 2) {
        this.linkModel.visible = true
      } else if (type === 3) {
        this.appModel.visible = true
      }
    },
    /**
     * @msg: 关闭附件弹框
     * @param {Number} 2链接 3小程序
     */
    onCloseAnnex (type) {
      // 链接
      if (type === 2) {
        this.linkModel.visible = false
      } else if (type === 3) {
        this.appModel.visible = false
      }
      this.onBeforeClose(type)
    },
    /**
     * @msg: 重置表单
     * @param {Number} 2链接 3小程序
     */
    onBeforeClose (type) {
      // 链接
      if (type === 2) {
        this.$refs['linkForm'].resetFields()
      } else if (type === 3) {
        this.$refs['appForm'].resetFields()
      }
    },
    /**
     * @msg: 提交附件弹框
     * @param {Number} 2链接 3小程序
     */
    onSubmitAnnex (type) {
      let that = this

      if (type === 2) {
        that.$refs.linkForm.validate(valid => {
          if (!valid) {
            return
          }
          // 修改附件类型
          that.model.annexType = type
          that.model = Object.assign({}, that.model, {}, that.linkModel)
          // 关闭
          that.onCloseAnnex(type)
        })
      } else if (type === 3) {
        that.$refs.appForm.validate(valid => {
          if (!valid) {
            return
          }
          // 修改附件类型
          that.model.annexType = type
          that.model = Object.assign({}, that.model, {}, that.appModel)
          // 关闭
          that.onCloseAnnex(type)
        })
      }
    },
    /**
     * @msg: 附件-图片上传成功
     * @param {type}
     */
    handleAnnexAvatarSuccess: function (res, file) {
      this.model.annexType = 1
      this.imageModel.image = res.result.url
    },
    /**
     * @msg: 网页/小程序上传封面图
     * @param {type}
     */
    handleAvatarSuccess: function (res, file) {
      this.linkModel.image = res.result.url
      this.appModel.image = res.result.url
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 20MB!')
      }
      return isJPG && isLt2M
    },
    /**
     * @msg: 关闭附件弹框
     * @param {Number} 2链接 3小程序
     */
    beforeClose (type) {
      if (type === 2) {
        this.$refs['linkForm'].resetFields()
      } else if (type === 3) {
        this.$refs['appForm'].resetFields()
      }
    },
    /**
     * @msg: 选择员工
     */
    showEmployee () {
      this.employeeModel.visible = true
    },
    /**
     * @msg: 选择渠道
     */
    showChannel () {
      this.channelModel.channelId = this.model.channelId
      this.channelModel.visible = true
    },
    /**
     * @msg: 选择渠道
     */
    selectChannel () {
      this.channelModel.visible = false
      this.model.channelId = this.channelModel.channelId
    },
    saveOrUpdate: function () {
      let that = this
      // let param = {
      //   content: that.model.content
      // }
      that.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        that.$http
          .fetch(that.$api.weWork.welcomeCode.saveWelcomeCode, that.model)
          .then(resp => {
            // 1、先触发表格数据更新
            // this.$emit('change')
            // 2、关闭弹框
            // that.onCloseDialog()
            // 3、提示
            that.$notify.success('新增成功')
            that.$router.push({ path: '/WeWork/WelcomeCode/WelcomeList' })
          })
          .catch(resp => {
            that.$notify.error(resp.msg)
          })
          .finally(() => { })
      })
    },
    /**
     * @msg: 页面初始化时的数据加载函数
     */
    $init (data) {
      // 页面初始化时，加载页面数据
      let that = this
      if (data.uuid) {
        // 更新
        that.update = true
        that.$http
          .fetch(that.$api.weWork.welcomeCode.getWelcomeCode, {
            uuid: data.uuid
          }).then(resp => {
            that.model = resp.result
          }).catch(resp => {
            that.$notify.error(resp.msg)
          })
      }
    }
  }
}
