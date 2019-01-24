<template>
  <div>
    <ns-table-guide ref="table" :url=$api.guide.guide.operationlogFindList @viewDetails = "viewDetails">
    </ns-table-guide>
    <!--  查看详情弹窗开始  -->
    <el-dialog :title="title" :visible.sync="shopKuhuShow" width="1000px"  >
    <div>
      <div class="kehuBox-main">
        <div class="kehuBox-main-top">
          <p>变更人：{{changeValue.operatorName || '-'}}</p>
          <p>操作时间：{{changeValue.createTime || '-'}}</p>
        </div>
        <div>
          <div class="kehuBox-main-span">
            <div>
              <el-row class="kehuBox-main-span_title">
                <el-col :span='12'><span>操作前</span></el-col>
                <el-col :span='12'><span>操作后</span></el-col>
              </el-row>
            </div>
            <div class="kehuBox-main-span_left">
              <div class="kehuBox-main-span_top">
                <div v-for="(item, i) in changeValue.afterJson" :key="i">
                  <span>{{item}}</span>
                </div>
              </div>
              <div class="kehuBox-main-span_bottom">
                <div  v-for="(item, i) in changeValue.beforeJson" :key="i">
                  <span>{{item}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </el-dialog>
    <!-- 查看详情结束 -->
  </div>
</template>

<script>
  import List from './src/List'
  import NsTableGuide from './NsTableGuide'
  List.components = {
    NsTableGuide
  }
  export default List
</script>
<style scoped>
  .kehuBox-main-top {
    line-height: 35px;
  }
  .kehuBox-main-span_title{
    background-color: #ccc;
  }
  .kehuBox-main-span_title .el-col{
    display: flex;
    justify-content: center;
    line-height: 35px;
  }
  .kehuBox-main-span_left{
    display: flex;
    justify-content: flex-start;
    line-height: 35px;
  }
  .kehuBox-main-span_top{
    float: left;
  }
  .kehuBox-main-span_bottom{
    float: right;
  }
</style>

