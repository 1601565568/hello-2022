<template xmlns:el="http://www.w3.org/1999/html">
  <div calss="NsTable_main">
    <!-- 搜索 -->
    <div style="align:center">
      <el-form :model="model" :inline="true" @submit.native.prevent class="pull-right">
        <table style="vertical-align: center;width:99%;background-color:white;" border="0" cellspacing="2">
          <tr>
            <td width="10px">
            </td>
            <td>
              <ns-button type="primary" @click="search()">今天</ns-button>
              <ns-button type="primary" @click="search()">昨天</ns-button>
              <ns-button type="primary" @click="search()">近7天</ns-button>
            </td>
            <td style="text-align: right">
              自定义时段&nbsp;
              <el-form-item>
                <el-date-picker
                  v-model="model.createDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  value-format="yyyy-MM-dd"
                  end-placeholder="结束日期" style="width:240px">
                </el-date-picker>
              </el-form-item>
              个人号：
              <el-form-item>
                <el-select v-model="model.receive" placeholder="请选择个人号">
                  <el-option v-for="item in receiveTypeData" :key="item.value" :label="item.label"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
              聊天内容：
              <el-form-item>
                <el-input ref="quickText" style="width: 100px" name="content" v-model="model.content"
                          placeholder="搜索聊天内容"
                          @keyup.enter.native="search()" clearable/>
              </el-form-item>
              <ns-button type="primary" @click="search()">搜索</ns-button>
              <ns-button @click="reset()">重置</ns-button>
            </td>
            <td width="10px">
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <!-- 搜索-结束 -->
    <div style="height:10px"></div>
    <table border="0" cellpadding="0" cellspacing="10" style="vertical-align: center;width:99%;background-color:white;">
      <tr>
        <td>
          <table border="0" cellpadding="0" cellspacing="1" style="vertical-align: center;width:100%;">
            <tr>
              <td>
                客户/群
              </td>
              <td>
                聊天记录/{{currentTargetName}}&nbsp;
                <a href="">查看详情</a>
              </td>
              <td>
                个人号：{{currentOwnerNick}}({{currentOwnerWid}})
              </td>
            </tr>
            <tr>
              <td>
                <!-- 客户/群 -->

                <!-- 客户/群结束 -->
              </td>
              <td colspan="2">
                <!-- 聊天记录 -->
                <!-- 聊天记录结束 -->
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
  import monitor from './src/index.js'

  export default monitor
</script>
<style scoped>


  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-header {
    height: 5px;
  }

  .el-main {
    text-align: center;
    font-size: 13px;
    vert-align: top;
    height: 150px;
  }

  .el-footer {
    text-align: right;
    vert-align: bottom;
  }
</style>
