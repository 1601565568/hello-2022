<template>
  <div class="PageContentRight">
    <el-collapse class="common-collapse" v-model="activeNames">
      <el-collapse-item>
        <template slot="title">
          <div class="common-title" @click="onShowEdit()">
            <span>头部资料</span>
            <div class="switch" @click="onclick">
              <el-switch v-model="value1" active-color="#0091FA"> </el-switch>
            </div>
          </div>
        </template>
        <div @click="onShowEdit()">
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeNames: [],
      value1: true
    }
  },
  methods: {
    // 解决switch 开关触发 collapse
    onclick (event) {
      event.stopPropagation()
    },
    // 点击获取编辑模块
    onShowEdit () {
      return false
    }
  }
}
</script>

<style scoped lang="scss">
@import './style/PageContentRight.css';
.common-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  // .switch {
  //   position: absolute;
  //   right: 0;
  // }
}
</style>
