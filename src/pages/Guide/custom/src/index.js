export default {
  data () {
    let terminal = [
      { value: '1', label: '导购端' },
      { value: '2', label: '店长端' }
    ]
    return {
      terminal: terminal,
      terminalType: '1' // 终端类型
    }
  },
  methods: {
    onEdit () {
      console.log('编辑')
    }
  }
}
