<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label"><tab-pane :analysisType="1"/></span>
        <list />
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label"><tab-pane :analysisType="2"/></span>
        <menber-statistics />
      </el-tab-pane>
      <el-tab-pane name="third">
        <span slot="label"><tab-pane :analysisType="3"/></span>
        <sale-view />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import list from './List'
import menberStatistics from './MemberStatistics'
import saleView from './SaleView'
import TabPane from './components/TabPane'
export default {
  components: {
    list, menberStatistics, saleView, TabPane
  },
  data () {
    return {
      activeName: 'first'
    }
  }
}
</script>
