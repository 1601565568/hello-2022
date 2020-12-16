export default {
  data () {
    return {
      defaultActive: '1-1',
      menuArr: [],
      pageModuleType: [],
      recordIsEdit: [], // 记录源数据是否被编辑
      menuObj: {
        active: '1-1',
        menuListTitle: '工作台', // 菜单栏标题
        menuId: 1 // 小程序类型 1导购 2店长
      },
      tipsShow: false,
      settingCode: '' // 点击设置的区域
    }
  },
  watch: {
    pageModuleType (newVal) {
      console.log(newVal, 'pageModuleType')
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
              moduleType: res.result[0].moduleType,
              templateCode: res.result[0].templateCode
            }
            this.findMiniProgramPageModuleSettingList()
            this.menuArr = this.forMatMenuArr(res.result)
          } else {
            this.$notify.error('查询菜单列表接口失败')
          }
        })
        .catch(err => {
          this.$notify.error(`菜单查询失败，${err}`)
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
            projectType: item.projectType,
            templateCode: item.templateCode
          })
        } else {
          menuList2.push({
            moduleName: item.moduleName,
            moduleType: item.moduleType,
            projectType: item.projectType,
            templateCode: item.templateCode
          })
        }
      }
      let menuBar = [
        {
          projectType: 1,
          projectTypeName: '导购小程序',
          menuList: menuList1
        },
        {
          projectType: 2,
          projectTypeName: '店长小程序',
          menuList: menuList2
        }
      ]
      return menuBar
    },
    findMiniProgramPageModuleSettingList () {
      this.pageModuleType = []
      this.recordIsEdit = []
      let params = {
        moduleType: this.menuObj.moduleType,
        templateCode: this.menuObj.templateCode
      }
      this.$http
        .fetch(
          this.$api.guide.custom.findMiniProgramPageModuleSettingList,
          params
        )
        .then(res => {
          if (res.success && res.result) {
            this.pageModuleType = this.forMatPageModuleType(res.result)
            this.recordIsEdit = JSON.stringify(
              this.forMatPageModuleType(res.result)
            )
          }
        })
        .catch(() => {
          this.$notify.error(`配置查询失败`)
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
    // 左侧菜单栏变化
    async onChangeMenu (data) {
      if (JSON.stringify(this.pageModuleType) !== this.recordIsEdit) {
        return
      }
      this.menuObj = data
      await this.findMiniProgramPageModuleSettingList()
      this.defaultActive = data.active
    },
    onTipsShow () {
      this.tipsShow = !this.tipsShow
    },
    // 切换菜单取消保存
    onTipsShowCancel () {
      this.onTipsShow()
    },
    // 切换菜单确认保存
    onConfirm () {
      this.onTipsShow()
    },
    onSetChange (data) {
      this.pageModuleType = data
    },
    onSave () {
      console.log('保存')
      // this.$refs.PageContentMiddle.toImage()
    },
    onCancel () {
      // console.log('取消')
    },
    // 右侧设置子组件传值
    onShowEdit (data) {
      this.settingCode = data
      console.log(data, '12313131231')
    }
  }
}
