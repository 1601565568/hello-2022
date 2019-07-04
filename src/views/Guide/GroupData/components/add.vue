<template>
  <div>
    <el-dialog
      title="新建群聊"
      :visible.sync="sVisible"
      width="350px"
      height='150px'
      @closed="onClose">
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/add'

export default Index
</script>
