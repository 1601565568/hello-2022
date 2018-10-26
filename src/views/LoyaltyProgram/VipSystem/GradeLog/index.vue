<template>
  <ns-table-grade-log ref="table" :url="$api.vip.gradeLog.queryTable"></ns-table-grade-log>
</template>

<script>
  import index from './src/index'
  import NsTableGradeLog from './NsTableGradeLog'
  index.components = {
    NsTableGradeLog
  }
  export default index
</script>
