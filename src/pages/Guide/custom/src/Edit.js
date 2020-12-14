export default {
  data () {
    return {
      defaultActive: '1-1',
      menuArr: [],
      pageModuleType: [],
      menuObj: {
        active: '1-1',
        menuListTitle: '工作台', // 菜单栏标题
        menuId: 1 // 小程序类型 1导购 2店长
      }
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
            console.log(this.pageModuleType)
          }
        })
        .catch(err => {
          this.$notify.error(`配置查询失败${err.msg}`)
        })
    },
    forMatPageModuleType (arr) {
      return arr.map((item, index) => {
        console.log(index, item.itemList ? JSON.parse(item.itemList) : null)
        return {
          itemList: item.itemList ? JSON.parse(item.itemList) : null,
          moduleType: item.moduleType,
          settingCode: item.settingCode,
          settingName: item.settingName,
          settingType: item.settingType,
          sort: item.sort,
          sortable: item.sortable,
          status: item.status
        }
      })
    },
    // 左侧菜单栏变化
    async onChangeMenu (data) {
      this.menuObj = data
      await this.findMiniProgramPageModuleSettingList()
      this.defaultActive = data.active
    },
    onSetChange (data) {
      this.pageModuleType = data
    },
    onSave () {
      // console.log('保存')
      this.$refs.PageContentMiddle.toImage()
    },
    onCancel () {
      // console.log('取消')
    }
  }
}
