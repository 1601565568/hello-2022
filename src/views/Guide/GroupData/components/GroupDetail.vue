<template>
  <div>
    <el-dialog
      title="群详情"
      :visible.sync="sVisible"
      @closed="onClose">
      <span>
        {{this.chatroomname}}
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/groupDetail'

export default Index
</script>
