export default {
  data () {
    return {
      loading: false,
      isEdit: false, // 是否是编辑页面
      defaultActive: '1-1',
      menuArr: [],
      pageModuleType: [],
      recordIsEdit: [], // 记录源数据是否被编辑
      menuObj: {
        active: '1-1',
        menuListTitle: '工作台', // 菜单栏标题
        menuId: 1 // 小程序类型 1导购 2店长
      },
      recordMenu: {}, // 暂时保存左侧菜单栏变化
      tipsShow: false, // 左侧弹窗切换
      escShow: false, // 顶部取消按钮弹窗
      settingCode: '', // 点击设置的区域
      rewardSettingList: [], // 业绩数据来源设置
      templateCode: '',
      activeSetName: [], // 右侧设置栏默认展开获取数据
      guideSettingList: [],
      shopSettingList: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$http
        .fetch(this.$api.guide.custom.findMiniProgramPageModuleList)
        .then(res => {
          if (res.success) {
            this.menuObj = {
              ...this.menuObj,
              moduleName: res.result[0].moduleName,
              moduleType: res.result[0].moduleType
            }
            // 默认摸板保存后会重新生成templateCode
            this.templateCode = res.result[0].templateCode
            this.findMiniProgramPageModuleSettingList()
            this.getRewardSettingList(this.templateCode)
            this.getSetUpSettingList(this.templateCode, 1)
            this.getSetUpSettingList(this.templateCode, 2)
            this.menuArr = this.forMatMenuArr(res.result)
          } else {
            this.$notify.error('查询菜单列表接口失败')
          }
        })
        .catch(err => {
          this.$notify.error(`菜单查询失败，${err.msg}`)
        })
    },
    forMatMenuArr (arr) {
      let newArr = arr.map(item => {
        return {
          moduleName: item.moduleName,
          moduleType: item.moduleType,
          projectType: item.projectType,
          templateCode: item.templateCode
        }
      })
      const menuList1 = []
      const menuList2 = []
      for (let i = 0; i < newArr.length; i++) {
        const item = newArr[i]
        if (item.projectType === 1) {
          menuList1.push({
            moduleName: item.moduleName,
            moduleType: item.moduleType,
            projectType: item.projectType
          })
        } else {
          menuList2.push({
            moduleName: item.moduleName,
            moduleType: item.moduleType,
            projectType: item.projectType
          })
        }
      }
      let menuBar = [
        {
          projectType: 1,
          projectTypeName: '导购端',
          menuList: menuList1
        },
        {
          projectType: 2,
          projectTypeName: '店长端',
          menuList: menuList2
        }
      ]
      return menuBar
    },
    findMiniProgramPageModuleSettingList () {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.pageModuleType = []
        this.recordIsEdit = []
        let params = {
          moduleType: this.menuObj.moduleType,
          templateCode: this.templateCode
        }
        this.$http
          .fetch(
            this.$api.guide.custom.findMiniProgramPageModuleSettingList,
            params
          )
          .then(res => {
            if (res.success && res.result) {
              this.pageModuleType = this.forMatPageModuleType(res.result)
              this.activeSetName = this.forMatActiveName(this.pageModuleType)
              this.recordIsEdit = JSON.stringify(
                this.forMatPageModuleType(res.result)
              )
              this.loading = false
              resolve()
            }
          })
          .catch(() => {
            this.$notify.error(`配置查询失败`)
            reject(new Error('配置查询失败'))
          })
      })
    },
    forMatPageModuleType (arr) {
      return arr.map(item => {
        return {
          itemList: item.itemList ? JSON.parse(item.itemList) : null,
          moduleType: item.moduleType,
          settingCode: item.settingCode,
          settingName: item.settingName,
          settingType: item.settingType,
          sort: item.sort,
          sortable: item.sortable,
          status: item.status === 1 ? 1 : 0
        }
      })
    },
    getRewardSettingList (templateCode) {
      this.$http
        .fetch(this.$api.guide.custom.findMiniProgramPageRewardSettingList, {
          templateCode: templateCode
        })
        .then(res => {
          if (res.success) {
            this.rewardSettingList = this.formalist(res.result)
          }
        })
        .catch(err => {
          this.$notify.error(err.msg)
        })
    },
    getSetUpSettingList (templateCode, type) {
      this.$http
        .fetch(this.$api.guide.custom.findMiniGuideBusinessSettingList, {
          templateCode: templateCode,
          type
        })
        .then(res => {
          if (res.success) {
            if (type === 1) {
              this.guideSettingList = this.formalist(res.result)
            } else if (type === 2) {
              this.shopSettingList = this.formalist(res.result)
            }
          }
        })
        .catch(err => {
          this.$notify.error(err.msg)
        })
    },
    // 获取右侧列表列表展示默认数据
    forMatActiveName (pageModuleType) {
      return pageModuleType.map(item => {
        return item.sort
      })
    },
    formalist (arr) {
      if (Object.prototype.toString.call(arr) === '[object Array]') {
        return arr.map(item => {
          return {
            rewardType: item.rewardType,
            status: item.status
          }
        })
      } else {
        this.$notify.error('业绩数据获取失败')
        return []
      }
    },
    // 左侧菜单栏变化
    async onChangeMenu (data) {
      this.recordMenu = data
      if (JSON.stringify(this.pageModuleType) !== this.recordIsEdit) {
        this.onTipsShow()
        return
      }
      this.handlerSwitch()
    },
    handlerSwitch () {
      this.menuObj = this.recordMenu
      this.findMiniProgramPageModuleSettingList().then(() => {
        this.defaultActive = this.menuObj.active
      })
    },
    // 修改设置左侧切换显示是否保存
    onTipsShow () {
      this.tipsShow = !this.tipsShow
    },
    // 切换菜单取消保存
    onTipsShowCancel () {
      this.onTipsShow()
      this.handlerSwitch()
    },
    // 切换菜单确认保存
    async onConfirm () {
      this.onTipsShow()
      await this.onSave()
      this.handlerSwitch()
    },
    onSetChange (data) {
      this.pageModuleType = data
    },
    /* 保存数据开始 */
    onSave () {
      return new Promise((resolve, reject) => {
        this.loading = true
        let query = {
          moduleType: this.menuObj.moduleType, // 模块类型
          templateCode: this.templateCode, // 模板ID
          projectType: this.menuObj.menuId, // 项目类型 1导购 2店长
          pageModuleSettingList: this.forMatPageModuleSettingList(
            this.pageModuleType
          ),
          pageRewardSettingList: this.rewardSettingList,
          pageGuideTurnoverList: this.guideSettingList,
          pageShopTurnoverList: this.shopSettingList
        }
        this.$http
          .fetch(
            this.$api.guide.custom.saveOrUpdateMiniProgramPageSetting,
            query
          )
          .then(res => {
            if (res.success) {
              this.$notify.success('页面配置保存成功')
              // 保存成功记录最新的数据
              this.recordIsEdit = JSON.stringify(this.pageModuleType)
              this.loading = false
              this.templateCode = res.result
              resolve()
            } else {
              this.$notify.success('页面配置保存成功')
            }
          })
          .catch(err => {
            this.loading = false
            this.$notify.error(err.msg)
            reject(new Error(err))
          })
      })
      // this.$refs.PageContentMiddle.toImage()
    },
    forMatPageModuleSettingList (pageModuleType) {
      let arr = JSON.parse(JSON.stringify(pageModuleType))
      return arr.map((item, index) => {
        return {
          ...item,
          sort: index + 1,
          itemList: JSON.stringify(this.forMatItemList(item.itemList))
        }
      })
    },
    forMatItemList (itemList) {
      if (Object.prototype.toString.call(itemList) === '[object Array]') {
        return itemList.map((item, index) => {
          return {
            ...item,
            sort: index + 1
          }
        })
      } else if (
        Object.prototype.toString.call(itemList) === '[object Object]'
      ) {
        return itemList
      }
    },
    /* 保存数据结束 */
    onCancel () {
      if (JSON.stringify(this.pageModuleType) !== this.recordIsEdit) {
        this.onEscShows()
        return
      }
      this.isEdit = false
      this.settingCode = ''
    },
    onEscShows () {
      this.escShow = !this.escShow
    },
    onEscCancel () {
      this.isEdit = true
      this.onEscShows()
    },
    onEscConfirm () {
      this.isEdit = false
      this.onEscShows()
      this.findMiniProgramPageModuleSettingList()
      this.settingCode = ''
    },
    // 保存并退出
    onSaveAndEsc () {
      this.onSave().then(res => {
        this.isEdit = false
        this.settingCode = ''
      })
    },
    onEdit () {
      this.isEdit = true
    },
    // 右侧设置子组件传值
    onShowEdit (data) {
      this.settingCode = data
    },
    // 调用金额来源设置
    onPageRewardSetting (itemCode) {
      if (itemCode === 'setting') {
        this.$refs.PageSetupSetting.init(this.guideSettingList, 'guide')
      } else if (itemCode === 'account-switch') {
        this.$refs.PageSetupSetting.init(this.shopSettingList, 'shop')
      } else {
        this.$refs.PageRewardSetting.init()
      }
    },
    // 保存金额来源确认
    onSettingConfirm (data) {
      this.rewardSettingList = data
    },
    onClearSettingCode () {
      this.settingCode = ''
    },
    onSetupConfirm (data, type) {
      if (type === 'guide') {
        this.guideSettingList = data
      } else if (type === 'shop') {
        this.shopSettingList = data
      }
    }
  }
}
