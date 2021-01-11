<template>
  <el-dialog :visible.sync="tipsShow" width="30%">
    <div class="tipsShowTitle" slot="title">提示信息</div>
    <div class="tipsShowContent">
      <span class="ns-warm-cricle">!</span><slot></slot>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="onCancel">取 消</ns-button>
      <ns-button type="primary" @click="onConfirm">确 定</ns-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    tipsShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    onConfirm () {
      this.$emit('onConfirm')
    },
    onCancel () {
      this.$emit('onCancel')
    }
  }
}
</script>
<style scoped>
.tipsShowTitle {
  padding-top: 5px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.tipsShowContent {
  padding: 16px 5px;
  color: #595959;
  font-size: 14px;
}
.ns-warm-cricle {
  display: inline-block;
  text-align: center;
  line-height: 14px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffaa00;
  color: #fff;
  margin-right: 10px;
}
</style>
