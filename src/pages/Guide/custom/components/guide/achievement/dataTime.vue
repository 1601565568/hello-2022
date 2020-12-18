<template>
  <div class="dataTimeWarpper">
    <img src="../../../image/timeScreenIcon.png" />
    <span>{{time}}</span>
    <span class="triangle-down"></span>
  </div>
</template>
<script>
export default {
  name: 'Datetime',
  data () {
    return { time: '' }
  },
  methods: {
    getDate () {
      let nowDate = new Date()
      this.time = `${nowDate.getFullYear()}/${nowDate.getMonth() + 1}`
    }
  },
  created () {
    this.getDate()
  }
}
</script>

<style scoped lang="scss">
.dataTimeWarpper {
  height: 56px;
  padding: 0 16px;
  background: #0091fa;
  color: #fff;
  display: flex;
  align-items: center;
  font-size: 17px;
  margin-bottom: 8px;
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  .triangle-down {
    display: inline-block;
    margin-left: 8px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #fff;
  }
}
</style>
