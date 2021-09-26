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
        <el-radio
          v-model="sex"
          :label="0"
        >男生
        </el-radio>
        <el-radio
          v-model="sex"
          :label="1"
        >女生
        </el-radio>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'headeImg',
  data () {
    return {
      sex: '',
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
@import '../styles/reset.css';
.item-view {
  margin-top: 24px;
  margin-bottom: 24px;
}
.item-base {
  height: 48px;
  display: flex;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 24px;
  >>> .el-radio__label {
    font-size: 14px;
    color: #606266;
  }
}
</style>
