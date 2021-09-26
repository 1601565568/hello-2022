<template>
  <div class="item-view">
    <el-form :rules="rules"
      label-width="100px"
      label-position="left"
      size="medium"
      class="normal-from">
      <el-form-item
        label="头像样式"
        prop="name"
        class="larger-item"
      >
        <div class="radio-view">
          <el-radio
            v-model="gender"
            :label="1"
          >方形
          </el-radio>
          <el-radio
            v-model="gender"
            :label="0"
          >圆形
          </el-radio>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'headeImg',
  data () {
    return {
      gender: 1,
      rules: {
        name: [
          { required: true, message: '请选择头像样式', trigger: ['blur', 'change'] }
        ]
      }
    }
  }
}
</script>

<style scoped>
.radio-view {

}
.item-view {
  margin-top: 24px;
  margin-bottom: 24px;
}
.logo-type {
  height: 24px;
  width: 24px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  display: inline-block;
  &.active {
    border-color: #41a2e8;
  }
  &.circle {
    border-radius: 50%;
  }
  &.square {
    border-radius: 2px;
  }
}
</style>
