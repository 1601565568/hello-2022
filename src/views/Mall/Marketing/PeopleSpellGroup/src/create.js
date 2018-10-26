import tableMixin from 'mixins/table'
export default {
  name: 'create',
  mixins: [tableMixin],
  data: function () {
    let dayArr = []
    let hourArr = []
    let minArr = []
    for (let i = 0; i <= 30; i++) {
      dayArr.push(i)
    }
    for (let i = 0; i <= 24; i++) {
      hourArr.push(i)
    }
    minArr = [0, 15, 30, 45]
    return {
      dayArr,
      hourArr,
      minArr,
      model: {
        type: '',
        day: '',
        hour: '',
        min: ''
      }
    }
  },
  methods: {

  },
  mounted () {}
}
