import formMixin from '@nascent/ecrp-ecrm/src/mixins/form'

export default {
  mixins: [formMixin],
  data: function () {
    return {}
  },
  watch: {},
  methods: {},
  created () {
    if (!this.$route.query.id) {
      this.$router.go(-2)
    }
  },
  mounted () {}
}
