<template>
  <el-dialog title="审核" width="492px" :visible="visible" @close="close" @open="open">
    <el-form class="examine-activity el-form-reset" label-width="6px" label-position="left">
      <el-form-item>
        <el-radio-group v-model="status">
          <el-radio :label="SOPExamineStatus.Succeed">通过</el-radio>
          <el-radio :label="SOPExamineStatus.Failed">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="status === SOPExamineStatus.Failed">
        <el-input
          class="el-input"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6}"
          placeholder="请输入"
          v-model="remark"
          :maxlength="100"
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
import { SOPExamineStatus } from '../../types'

export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    activityId: Number
  },
  data () {
    return {
      SOPExamineStatus: SOPExamineStatus,
      status: SOPExamineStatus.Succeed,
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
      this.$emit('confirm', { id: this.activityId, status: this.status, remark: this.remark })
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/reset.css";
.examine-activity {
  .el-form-item {
    .el-input {
      width: 460px;
    }
  }
}
</style>
