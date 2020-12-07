export default {
  data () {
    return {
      menuListTitle: '工作台', // 菜单栏标题
      menuType: 1 // 小程序类型 1导购 2店长
    }
  },
  methods: {
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
