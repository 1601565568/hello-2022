<template>
  <span
    class="el-countdown"
    :callback="callback">
    {{time}}
  </span>
</template>

<script>
  export default {
    name: 'NsCountDown',
    data () {
      return {
        time: '',
        clear: false
      }
    },
    props: {
      date: {
        type: String
      },
      callback: {
        type: Function,
        default: ''
      },
      format: String,
      type: String
    },
    mounted () {
      let time = setInterval(() => {
        if (this.clear) {
          clearInterval(time)
        } else {
          this.timeDown()
        }
      }, 500)
    },
    methods: {
      timeDown () {
        let endTime = new Date(this.date)
        let nowTime = new Date()
        let remainingTime = parseInt((endTime.getTime() - nowTime.getTime()) / 1000, 10)
        /* 倒计时结束，清除计时器 */
        if (remainingTime <= 0) {
          this.clear = true
          this._callback()
        }
        if (this.type === 'HMS') {
          let h, m, s
          /* 小时 */
          h = this.formatFun(parseInt(remainingTime / (60 * 60) % 24, 10))
          /* 分钟 */
          m = this.formatFun(parseInt(remainingTime / 60 % 60, 10))
          /* 秒数 */
          s = this.formatFun(parseInt(remainingTime % 60, 10))
          if (remainingTime <= 0) {
            h = m = s = '0' + 0
          }
          if (this.format === 'HH:MM:SS') {
            this.time = h + ':' + m + ':' + s
          } else {
            this.time = h + '时' + m + '分' + s + '秒'
          }
        } else if (this.type === 'DHMS') {
          let d, h, m, s
          /* 天数 */
          d = this.formatFun(parseInt(remainingTime / (60 * 60 * 24), 10))
          /* 小时 */
          h = this.formatFun(parseInt(remainingTime / (60 * 60) % 24, 10))
          /* 分钟 */
          m = this.formatFun(parseInt(remainingTime / 60 % 60, 10))
          /* 秒数 */
          s = this.formatFun(parseInt(remainingTime % 60, 10))
          if (remainingTime <= 0) {
            d = h = m = s = '0' + 0
          }
          if (this.format === 'DD:HH:MM:SS') {
            this.time = d + ':' + h + ':' + m + ':' + s
          } else {
            this.time = d + '天' + h + '时' + m + '分' + s + '秒'
          }
        } else {
          /* 秒数 */
          let s = remainingTime
          if (remainingTime <= 0) {
            s = 0
          }
          if (this.format === 'SS') {
            this.time = s + 's'
          } else {
            this.time = s + '秒'
          }
        }
      },
      /* 格式化时间，小于10的进行0的补位 */
      formatFun (time) {
        if (time >= 10) {
          return time
        } else {
          return '0' + time
        }
      },
      _callback () {
        this.callback()
      }
    }
  }
</script>
