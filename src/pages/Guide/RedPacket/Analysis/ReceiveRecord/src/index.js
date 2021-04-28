import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  data () {
    return {
      model: {
        endTime: '',
        launchType: null,
        name: '',
        payConfigId: null,
        redpackType: null,
        startTime: ''
      },
      url: this.$api.guide.redpacket.getStrategiesList
    }
  },
  mixins: [tableMixin],
  mounted () {
    this.$reload()
  },
  methods: {}
}
