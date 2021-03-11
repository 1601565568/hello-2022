import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  data () {
    return {
      previewVisin: false
    }
  },
  mixins: [tableMixin],
  methods: {
    /**
     * 查看/关闭 配置说明
     * @param {*} previewVisin
     */
    handlePreview (previewVisin) {
      this.previewVisin = previewVisin
    }
  }
}
