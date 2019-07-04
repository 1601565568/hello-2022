<template>
  <div>
    <el-dialog
      title="详情"
      :visible.sync="sVisible"
      @closed="onClose">
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/memberDetail'

export default Index
</script>
