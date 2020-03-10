import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
  name: 'index',
  mixins: [tableMixin],
  data: function () {
    return null
  },
  method: {
    onRedactFun (row) {
      return null
    }
  }
}
