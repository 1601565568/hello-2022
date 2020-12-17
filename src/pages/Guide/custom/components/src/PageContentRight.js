export default {
  props: {
    editData: {
      type: Array
    }
  },
  data () {
    return {
      pageModuleType: JSON.parse(JSON.stringify(this.editData)),
      activeNames: [],
      value1: true
    }
  },
  watch: {
    editData: {
      handler (newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          this.pageModuleType = JSON.parse(JSON.stringify(newValue))
        }
      },
      deep: true,
      immediate: true
    },
    pageModuleType: {
      handler (val) {
        this.$emit('change', val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 解决switch 开关触发 collapse
    onclick (settingCode) {
      let event = window.event
      event.stopPropagation()
      this.onShowEdit(settingCode)
    },
    // 点击获取编辑模块
    onShowEdit (settingCode) {
      this.$emit('onShowEdit', settingCode)
    },
    formatStatus (status) {
      return status === 1
    },
    handlerChange (data, item) {
      item.status = data ? 1 : 0
    },
    // 判断需要显示的组件
    formatSettingType (settingType) {
      let setComponent
      switch (settingType) {
        case 1:
          setComponent = 'CheckBox'
          break
        case 2:
          setComponent = 'menuSet'
          break
        case 3:
          setComponent = 'Upload'
      }
      return setComponent
    },
    onChangeItem (data, index) {
      this.pageModuleType[index].itemList = data
    },
    onPageRewardSetting () {
      this.$emit('onPageRewardSetting')
    }
  }
}
