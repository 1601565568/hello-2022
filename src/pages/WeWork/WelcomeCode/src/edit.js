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
      visible: false,
      employeeIds: []
    }
    let channelModel = {
      visible: false,
      channelId: null
    }
    let model = {
      content: '', // 欢迎语内容
      annexType: 0, // 附带内容，默认无
      annexContent: '',
      employeeIds: [], // 使用员工ids
      channelId: null // 使用渠道id
    }
    return {
      filterText: '',
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
      channelList: [],
      employeeSelectMsg: '',
      channelSelectMsg: '',
      // 选择员工组件
      // 左边树数据（所有数据,包含id、label、children等shu'ji）
      leftTreeData: null,
      // 左边树默认绑定数据
      leftDefaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted: function () {
    // 获取渠道列表 todo 异步问题
    this.$http.fetch(this.$api.weWork.welcomeCode.findChannelList).then((resp) => {
      this.channelList = resp.result
      this.$init({ uuid: this.$route.query.welcomeCodeUuid })
    }).catch((resp) => {
      this.$notify.error(resp.msg)
    })
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /**
     * @msg: 插入占位符
     * @param {String} 占位符类型
     */
    insertPlaceHolder (append) {
      this.model.content = this.model.content + append
    },
    /**
     * @msg: 选择附件内容
     * @param {Number} 2链接 3小程序
     */
    showAnnex (type) {
      let that = this
      // 链接
      if (type === 2) {
        this.linkModel.visible = true
      } else if (type === 3) {
        this.appModel.visible = true
      }
      // 数据预处理
      if (type === 1 && this.model.annexType === 1) {
        that.imageModel = {
          visible: that.imageModel.visible,
          image: that.model.image
        }
      } else if (type === 2 && this.model.annexType === 2) {
        // 网页链接配置model
        that.linkModel = {
          visible: that.linkModel.visible,
          custom: that.model.custom, // 默认自定义
          settingId: that.model.settingId, // 预置配置ID
          link: that.model.link, // 链接
          title: that.model.title,
          innerContent: that.model.innerContent, // 文案
          image: that.model.image
        }
      } else if (type === 3 && this.model.annexType === 3) {
        // 小程序实体model
        that.appModel = {
          visible: that.appModel.visible,
          custom: that.model.custom, // 默认自定义
          settingId: that.model.settingId, // 预置配置ID
          appid: that.model.appid, // 小程序appid
          path: that.model.path, // 小程序路径
          link: that.model.link, // 备用网页
          title: that.model.title, // 标题
          innerContent: that.model.innerContent, // 文案
          image: that.model.image // 封面
        }
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
    },
    /**
     * @msg: 切换附件类型，但是没有提交，则关闭弹框后重置数据
     * @param {Number} 2链接 3小程序
     */
    onCloseHandleModel (type) {
      let that = this
      // 重置
      if (type === 1 && this.model.annexType !== 1) {
        this.imageModel.image = ''
      }
      if (type === 2 && this.model.annexType !== 2) {
        this.$nextTick(() => {
          this.$refs['linkForm'].resetFields()
        })
      }
      if (type === 3 && this.model.annexType !== 3) {
        this.$nextTick(() => {
          this.$refs['appForm'].resetFields()
        })
      }
    },
    /**
     * @msg: 确认切换附件类型且已提交，则重置旧类型的表单数据
     * @param {Number} 2链接 3小程序
     */
    onSubmitHandleModel (type) {
      let that = this
      // 从图片切换成其他
      if (this.model.annexType === 1 && type !== 1) {
        this.imageModel.image = ''
      }
      if (this.model.annexType === 2 && type !== 2) {
        // 从网页变成其他，置空
        this.$nextTick(() => {
          that.$refs['linkForm'].resetFields()
        })
      }
      if (this.model.annexType === 3 && type !== 3) {
        // 从小程序变成其他，置空
        this.$nextTick(() => {
          that.$refs['appForm'].resetFields()
        })
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
          // 关闭
          that.onCloseAnnex(type)
          // 数据处理
          // 链接实体model
          Object.assign(that.model, {
            custom: that.linkModel.custom, // 默认自定义
            settingId: that.linkModel.settingId, // 预置配置ID
            link: that.linkModel.link, // 小程序appid
            title: that.linkModel.title, // 标题
            innerContent: that.linkModel.innerContent, // 文案
            image: that.linkModel.image // 封面
          })
          that.onSubmitHandleModel(type)
          // 最后修改附件类型
          that.model.annexType = type
        })
      } else if (type === 3) {
        that.$refs.appForm.validate(valid => {
          if (!valid) {
            return
          }
          // 关闭
          that.onCloseAnnex(type)
          // 小程序实体model
          Object.assign(that.model, {
            custom: that.appModel.custom, // 默认自定义
            settingId: that.appModel.settingId, // 预置配置ID
            appid: that.appModel.appid, // 小程序appid
            path: that.appModel.path, // 小程序路径
            link: that.appModel.link, // 备用网页
            title: that.appModel.title, // 标题
            innerContent: that.appModel.innerContent, // 文案
            image: that.appModel.image // 封面
          })
          that.onSubmitHandleModel(type)
          // 最后修改附件类型
          that.model.annexType = type
        })
      }
    },
    /**
     * @msg: 附件-图片上传成功
     * @param {type}
     */
    handleAnnexAvatarSuccess: function (res, file) {
      this.imageModel.image = res.result.url
      this.model.image = res.result.url
      this.model.annexType = 1
    },
    /**
     * @msg: 网页/小程序上传封面图
     * @param {type}
     */
    handleLinkAvatarSuccess: function (res, file) {
      this.linkModel.image = res.result.url
    },
    /**
     * @msg: 小程序封面图上传
     */
    handleAppAvatarSuccess: function (res, file) {
      this.appModel.image = res.result.url
    },
    /**
     * @msg: 图片上传校验
     */
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
     * @msg: 选择员工弹框
     */
    showEmployee () {
      let _this = this
      // 预取历史数据
      // _this.employeeModel.employeeIds = this.model.employeeIds
      _this.employeeModel.visible = true
      // 查询选择的员工
      _this.$http.fetch(_this.$api.guide.personalQrcode.getDepartment).then(resp => {
        if (resp.success && resp.result != null) {
          // 全部数据
          _this.leftTreeData = JSON.parse(resp.result)
          // _this.choosePerson = [5, 6, 7, 8]
        } else {
          _this.$notify.error(getErrorMsg('获取员工数据失败', resp))
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('获取员工数据失败', resp))
      })
    },
    /**
     * @msg: 确认选择员工
     */
    selectEmployee () {
      this.employeeModel.visible = false
      this.handleCheckChange()
    },
    /**
     * @msg: 赋值已选员工 | 提示语
     */
    handleCheckChange () {
      let _this = this
      let res = this.$refs.tree.getCheckedNodes()
      let arr = []
      res.forEach((item) => {
        if (item.id) {
          arr.push(item.id)
        }
      })
      _this.model.employeeIds = arr

      _this.employeeSelectMsg = '已选择' + _this.model.employeeIds.length + '名员工'
    },
    setAllEmployee () {
      let _this = this
      let arr = []
      _this.leftTreeData.forEach(item => {
        item.children.forEach(child => {
          arr.push(child.id)
        })
      })
      _this.$refs.tree.setCheckedKeys(arr)
      _this.handleCheckChange()
    },
    /**
     * @msg: 选择渠道
     */
    showChannel () {
      // 预取历史数据
      this.channelModel.channelId = this.model.channelId
      this.channelModel.visible = true
    },
    /**
     * @msg: 选择渠道
     */
    selectChannel () {
      this.channelModel.visible = false
      // 保存选择数据
      this.model.channelId = this.channelModel.channelId
      this.setSelectChannelMsg()
    },
    /**
     * @msg: 设置选择渠道消息
     */
    setSelectChannelMsg () {
      this.channelSelectMsg = ''
      this.channelList.forEach(item => {
        if (item.value === this.model.channelId) {
          this.channelSelectMsg = '已选择渠道：' + item.label
        }
      })
    },
    saveOrUpdate: function () {
      let that = this
      let annexContent = {}
      if (that.model.annexType === 1) {
        annexContent.image = that.model.image
      } else if (that.model.annexType === 2) {
        annexContent.link = that.model.link
        annexContent.title = that.model.title
        annexContent.innerContent = that.model.innerContent
        annexContent.image = that.model.image
      } else if (that.model.annexType === 3) {
        annexContent.appid = that.model.appid
        annexContent.path = that.model.path
        annexContent.link = that.model.link
        annexContent.title = that.model.title
        annexContent.innerContent = that.model.innerContent
        annexContent.image = that.model.image
      }
      // 附带内容json
      that.model.annexContent = JSON.stringify(annexContent)

      that.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        that.$http
          .fetch(that.$api.weWork.welcomeCode.saveWelcomeCode, that.model)
          .then(resp => {
            that.$notify.success('操作成功')
            that.$router.push({ path: '/WeWork/WelcomeCode/WelcomeCodeList' })
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
        that.$http
          .fetch(that.$api.weWork.welcomeCode.getWelcomeCode, {
            uuid: data.uuid
          }).then(resp => {
            that.model = resp.result
            if (that.model.annexType === 0) {
              return
            }

            this.setSelectChannelMsg()
            // 设置选择员工
            this.employeeSelectMsg = '已选择' + this.model.employeeIds.length + '名员工'

            let annexContent = JSON.parse(that.model.annexContent)
            if (that.model.annexType === 1) {
              that.model.image = annexContent.image
            } else if (that.model.annexType === 2) {
              that.model.link = annexContent.link
              that.model.title = annexContent.title
              that.model.innerContent = annexContent.innerContent
              that.model.image = annexContent.image
            } else if (that.model.annexType === 3) {
              that.model.appid = annexContent.appid
              that.model.path = annexContent.path
              that.model.link = annexContent.link
              that.model.title = annexContent.title
              that.model.innerContent = annexContent.innerContent
              that.model.image = annexContent.image
            }
          }).catch(resp => {
            that.$notify.error(resp.msg)
          })
      }
    }
  }
}
