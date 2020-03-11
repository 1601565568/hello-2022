<template>
  <div>
    <callList ref="callTable" :url=$api.riskManagement.callRecords.findList @onPlay="onPlay" @onDownLoad="onDownLoad"></callList>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="504px" class="detail-dialog"
               @keyup.enter.native="cleanGuide" @keyup.esc.native="cleanGuide">
      <div class="detail-dialog__content">
        <audio :src="content" ref="callAudio" controls="controls" ></audio>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import callList from './CallList'
import index from './src/index'

index.components = {
  callList
}
export default index
</script>

<style scoped>

</style>
