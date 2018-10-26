<template>
  <div>
    <el-tabs tab-position="top" style="height: 200px;">
      <el-tab-pane label="用户管理">用户管理</el-tab-pane>
      <el-tab-pane label="配置管理">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>
    <div class="form-main">
      <p class="text-info">
        适用场景：弹窗及部分只需要切换数据的页面，其他情况推荐使用 <router-link to="/AnalysisMember">页面tab</router-link>
      </p>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        tabPosition: 'top'
      }
    }
  }
</script>
