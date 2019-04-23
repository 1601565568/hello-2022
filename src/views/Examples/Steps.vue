<template>
  <div style="background: #fff;height: 120px;padding:20px 10px;width: 1000px;">
    <el-steps :active="active" finish-status="success" simple>
      <el-step title="步骤 1" >1</el-step>
      <el-step title="步骤 2" >2</el-step>
      <el-step title="步骤 3" >3</el-step>
    </el-steps>
    <ns-button @click="next" style="margin-top: 20px;">下一步</ns-button>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: 0
    }
  },
  methods: {
    next () {
      if (this.active++ > 2) { this.active = 0 }
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
