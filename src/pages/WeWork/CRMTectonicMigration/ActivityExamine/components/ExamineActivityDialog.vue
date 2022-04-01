<template>
  <el-dialog title="审核" width="492px" :visible="visible" @close="close" @open="open">
    <el-form class="examine-activity el-form-reset" label-width="6px" label-position="left">
      <el-form-item>
        <el-radio-group v-model="status">
          <el-radio :label="2">通过</el-radio>
          <el-radio :label="3">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="status + '' === '3'">
        <el-input
          class="el-input"
          type="textarea"
          :rows="3"
          placeholder="请输入不通过原因"
          v-model="remark"
          :maxlength="20"
          show-word-limit
        >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <NsButton @click="close" size="medium">取 消</NsButton>
      <NsButton type="primary" size="medium" @click="confirm">确 定</NsButton>
    </span>
  </el-dialog>
</template>

<script>
// import { SOPExamineStatus } from '../../types'

export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    messageId: Number
  },
  data () {
    return {
      // SOPExamineStatus: SOPExamineStatus,
      status: 2,
      remark: ''
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    open () {
      this.status = SOPExamineStatus.Succeed
      this.remark = ''
    },
    confirm () {
      this.$emit('confirm', { messageId: this.messageId, reviewStatus: this.status, reviewRemark: this.remark })
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-reset {
  ::v-deep .el-form-item {
    font-size: 14px;
    .el-form-item__label {
      font-size: 14px;
    }
    .el-radio__label {
      font-size: 14px;
    }
    .el-input__count {
      height: 10px;
    }
  }
}
.examine-activity {
  .el-form-item {
    .el-input {
      width: 460px;
    }
  }
}
</style>
