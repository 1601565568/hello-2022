export default {
  data () {
    return {
      menuListTitle: '工作台', // 菜单栏标题
      menuType: 1, // 小程序类型 1导购 2店长
      menuArr: []
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
        // debugger
        if (item.projectType === 1) {
          menuList1.push({
            moduleName: item.moduleName,
            moduleType: item.moduleType
          })
        } else {
          menuList2.push({
            moduleName: item.moduleName,
            moduleType: item.moduleType
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
      console.log(menuBar)
      return menuBar
    },
    findMiniProgramPageModuleSettingList () {
      let param = {
        moduleType: 1,
        templateCode: 'DEFAULT_TEMPLATE_CODE'
      }
      this.$http
        .fetch(this.$api.guide.custom.findMiniProgramPageModuleSettingList, {
          moduleType: 1,
          templateCode: 'DEFAULT_TEMPLATE_CODE'
        })
        .then(res => {
          console.log(res, 'res')
        })
        .catch(err => {
          this.$notify.error(err.msg)
        })
    },
    // 左侧菜单栏变化
    onChangeMenu (menuId, menuListTitle) {
      this.menuType = menuId
      this.menuListTitle = menuListTitle
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
