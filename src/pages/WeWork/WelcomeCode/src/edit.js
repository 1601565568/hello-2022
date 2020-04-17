import ElCard from '@nascent/nui/lib/card'
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import commonRules from './commonRules.js'
import ElMain from '@nascent/nui/lib/main'
import ElContainer from '@nascent/nui/lib/container'
import ElAside from '@nascent/nui/lib/aside'
import ElImage from '@nascent/nui/lib/image'
import ElUpload from '@nascent/nui/lib/upload'

export default {
  name: 'Edit',
  mixins: [scrollHeight],
  components: {
    ElCard,
    ElContainer,
    ElMain,
    ElAside,
    ElImage,
    ElUpload
  },
  data: function () {
    // 图片配置model
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
      desc: '', // 文案
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
      desc: '', // 文案
      image: '' // 封面
    }
    let employeeModel = {
      visible: false,
      employeeIds: []
    }
    let channelModel = {
      visible: false,
      channelCodes: null
    }
    let model = {
      content: '', // 欢迎语内容
      annexType: 0, // 附带内容，默认无
      annexContent: '',
      employeeIds: [], // 使用员工ids
      channelCodes: [] // 使用渠道id
    }
    return {
      focusState: true,
      // 页面滚动条内容高度配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 39 // 底部按钮的高度
      },
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
      rightTreeData: [],
      // 左边树默认绑定数据
      leftDefaultProps: {
        children: 'children',
        label: 'label'
      },
      // 系统预置链接集合
      presetLink: []
    }
  },
  computed: {
    /**
     * @msg: 获取字数，后续改成computed
     * 出现一次占位符 + N字数
     * count += [占位符字符] * (占位符代替字数 - 占位符字符串字数)
     * @return: 返回输入字数
     */
    wordCount () {
      let count = this.model.content.length
      // 出现一次占位符 + N字数
      count += (this.model.content.split('{EmployeeNick}').length - 1) * (10 - 14)
      count += (this.model.content.split('{CustomerNick}').length - 1) * (10 - 14)
      return count
    }
  },
  mounted () {
    // 获取渠道列表 todo 异步问题
    this.$http.fetch(this.$api.weWork.welcomeCode.findChannelList).then((resp) => {
      this.channelList = resp.result
      this.$init({ welcomeCodeUuid: this.$route.query.welcomeCodeUuid })
      this.getSystemPresetLink()
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
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      const chooseIndex = this.rightTreeData.findIndex(d => d.id === data.id)
      this.rightTreeData.splice(chooseIndex, 1)
      const nodes = this.$refs.tree.getCheckedNodes()
      const nodeIndex = nodes.findIndex(d => d.id === data.id)
      nodes.splice(nodeIndex, 1)
      for (let i in nodes) {
        if (nodes[i].children) {
          nodes.splice(i, 1)
        }
      }
      this.$refs.tree.setCheckedNodes(nodes)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /**
     * @msg: 插入占位符 {EmployeeNick} {CustomerNick}
     * @param {String} 占位符类型
     */
    insertPlaceHolder (append) {
      this.model.content = this.model.content + append
      // this.focusState = true
      this.$refs['input'].focus()
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
          desc: that.model.desc, // 文案
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
          desc: that.model.desc, // 文案
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
          that.linkModel.link = ''
          that.linkModel.settingId = null
          if (this.$refs['linkForm']) {
            this.$refs['linkForm'].resetFields()
          }
        })
      }
      if (type === 3 && this.model.annexType !== 3) {
        this.$nextTick(() => {
          if (this.$refs['appForm']) {
            this.$refs['appForm'].resetFields()
          }
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
          that.linkModel.link = ''
          that.linkModel.settingId = null
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
      if (type === 0) {
        that.onSubmitHandleModel(type)
        that.model.annexType = type
      } else if (type === 2) {
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
            desc: that.linkModel.desc, // 文案
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
            // link: that.appModel.link, // 备用网页
            title: that.appModel.title, // 标题
            // desc: that.appModel.desc, // 文案
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
      this.onSubmitHandleModel(1)
      this.model.annexType = 1
      this.imageModel.image = res.result.url
      this.model.image = res.result.url
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
      const isJPG = file.type === 'image/jpeg' // || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!')
      }
      return isJPG && isLt2M
    },
    /**
     * @msg: 选择员工弹框
     */
    showEmployee () {
      let _this = this
      _this.rightTreeData = []
      // 预取历史数据
      _this.employeeModel.visible = true
      // 查询选择的员工
      _this.$http.fetch(_this.$api.guide.sgPersonalQrcode.getDepartment, { plan: 1 }).then(resp => {
        if (resp.success && resp.result != null) {
          // 全部数据
          _this.leftTreeData = JSON.parse(resp.result)
          // 初始化右侧数据
          let res = this.$refs.tree.getCheckedNodes()
          res.forEach((item) => {
            if (item.id) {
              _this.rightTreeData.push(item)
            }
          })
          this.$refs.selectedTree.setCheckedNodes(_this.rightTreeData)
        } else {
          _this.$notify.error(getErrorMsg('获取员工数据失败', resp))
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('获取员工数据失败', resp))
      })
    },
    /**
     * @msg: 关闭员工弹框
     */
    closeEmployeeDialog () {
      let _this = this
      _this.employeeModel.visible = false
      _this.employeeModel.employeeIds = this.model.employeeIds
      _this.$refs.tree.setCheckedKeys(_this.employeeModel.employeeIds)
    },
    /**
     * @msg: 确认选择员工
     */
    selectEmployee () {
      this.rightTreeData = []
      this.employeeModel.visible = false
      this.handleSubmitCheckChange()
    },
    /**
     * @msg: 赋值已选员工 | 提示语
     */
    handleSubmitCheckChange () {
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
    /**
     * @msg: 处理未提交前的选择变化
     */
    handleUnSubmitCheckChange () {
      let _this = this
      let res = _this.$refs.tree.getCheckedNodes()
      let arr = []
      res.forEach((item) => {
        if (item.id) {
          arr.push(item)
        }
      })
      _this.rightTreeData = arr
      this.$refs.selectedTree.setCheckedNodes(_this.rightTreeData)
      // _this.rightTreeData = arr
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
      _this.handleUnSubmitCheckChange()
    },
    /**
     * @msg: 选择渠道
     */
    showChannel () {
      // 预取历史数据
      this.channelModel.channelCodes = this.model.channelCodes
      this.channelModel.visible = true
    },
    /**
     * @msg: 选择渠道
     */
    selectChannel () {
      this.channelModel.visible = false
      // 保存选择数据
      this.model.channelCodes = this.channelModel.channelCodes
      this.setSelectChannelMsg()
    },
    /**
     * @msg: 设置选择渠道消息
     */
    setSelectChannelMsg () {
      let _this = this
      _this.channelSelectMsg = ''
      if (!_this.model.channelCodes) {
        return
      }
      for (let select of _this.model.channelCodes) {
        for (let channel of _this.channelList) {
          if (select === channel.value) {
            _this.channelSelectMsg += channel.label + '|'
          }
        }
      }
    },
    /**
     * @msg: 保存或更新
     */
    saveOrUpdate: function () {
      let that = this
      if (that.wordCount > 100) {
        that.$message.error('欢迎语超过最大可输入字数!')
        return
      }
      let annexContent = {}
      if (that.model.annexType === 1) {
        annexContent.image = that.model.image
      } else if (that.model.annexType === 2) {
        annexContent.link = that.model.link
        annexContent.title = that.model.title
        annexContent.desc = that.model.desc
        annexContent.image = that.model.image
      } else if (that.model.annexType === 3) {
        annexContent.appid = that.model.appid
        annexContent.path = that.model.path
        annexContent.link = that.model.link
        annexContent.title = that.model.title
        annexContent.desc = that.model.desc
        annexContent.image = that.model.image
      }
      // 附带内容json
      that.model.annexContent = JSON.stringify(annexContent)
      that.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        that.$http
          .fetch(that.$api.weWork.welcomeCode.saveOrUpdateWelcomeCode, that.model)
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
     * @msg: 取消新增/修改
     */
    back () {
      let _this = this
      _this.$confirm('表单修改内容将丢失,确定是否返回？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$router.push({ path: '/WeWork/WelcomeCode/WelcomeCodeList' })
      })
    },
    /**
     * @msg: 切换radio重置
     */
    linkRadioChange (val) {
      this.linkModel = {
        visible: true,
        custom: val,
        settingId: null, // 预置配置ID
        link: '', // 链接
        title: '',
        desc: '', // 文案
        image: ''
      }
    },
    /**
     * @msg: 页面初始化时的数据加载函数
     */
    $init (data) {
      // 页面初始化时，加载页面数据
      let that = this
      if (data.welcomeCodeUuid) {
        that.$http
          .fetch(that.$api.weWork.welcomeCode.getWelcomeCode, {
            welcomeCodeUuid: data.welcomeCodeUuid
          }).then(resp => {
            that.model = resp.result
            that.setSelectChannelMsg()
            // 设置选择员工
            if (that.model.employeeIds) {
              that.employeeSelectMsg = '已选择' + that.model.employeeIds.length + '名员工'
            }
            if (that.model.annexType === 0) {
              return
            }
            let annexContent = JSON.parse(that.model.annexContent)
            if (that.model.annexType === 1) {
              that.model.image = annexContent.image
            } else if (that.model.annexType === 2) {
              that.model.link = annexContent.link
              that.model.title = annexContent.title
              that.model.desc = annexContent.desc
              that.model.image = annexContent.image
            } else if (that.model.annexType === 3) {
              that.model.appid = annexContent.appid
              that.model.path = annexContent.path
              that.model.link = annexContent.link
              that.model.title = annexContent.title
              that.model.desc = annexContent.desc
              that.model.image = annexContent.image
            }
          }).catch(resp => {
            that.$notify.error(resp.msg)
          })
      }
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
    systemPresetChange (e) { // 首页，分类，我的页面选择是添加codeTargetName
      var _this = this
      this.presetLink.forEach(function (value, i) {
        if (e === '') {
          _this.linkModel.link = ''
          return
        }
        if (value.id === e) {
          _this.linkModel.link = value.url + '&guideUserId={guideUserId}&userId={userId}&source=2'
          _this.linkModel.image = value.picture
          _this.linkModel.title = value.title
          _this.linkModel.desc = value.content
          _this.linkModel.settingId = e
        }
      })
    }
  }
}
