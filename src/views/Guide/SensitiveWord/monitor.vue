<template xmlns:el="http://www.w3.org/1999/html">
  <div calss="NsTable_main">
    <!-- 导航 -->
    <div style="v-align:top;height:25px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Guide/Content' }">内容管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/ContentMange/SensitiveWord/index' }">敏感词管理</el-breadcrumb-item>
        <el-breadcrumb-item>敏感词监控</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 导航-结束 -->
    <div>
      <ns-page-table>
        <!-- 按钮 -->
        <template slot="buttons">
          <ns-table-operate-button :buttons="_data._table.table_buttons">
          </ns-table-operate-button>
        </template>
        <!-- 按钮-结束 -->

        <!-- 搜索 -->
        <template slot="searchSearch">
          <el-form :model="model" :inline="true" @submit.native.prevent class="pull-right">
            <el-form-item>
          <span>
            自定义时段&nbsp;
            <el-date-picker
              v-model="model.createDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd"
              end-placeholder="结束日期" style="width:210px">
            </el-date-picker>
          </span>
            </el-form-item>
            <el-form-item>
              <span>
                <el-form-item label="发送人：">
                  <el-select v-model="model.receive" placeholder="请选择发送人" style="width: 100px">
                    <el-option v-for="item in receiveTypeData" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
                </el-form-item>
              </span>
            </el-form-item>
            <el-form-item>
              <span>
                个人号&nbsp;
                <el-select v-model="model.ownerWid" placeholder="请选择个人号">
                  <el-option v-for="item in ownerData" :key="item.wid" :label="item.nick" :value="item.wid"/>
                </el-select>
              </span>
            </el-form-item>
            <el-form-item>
              <span>
                敏感词&nbsp;
                <el-input ref="quickText" style="width: 100px" name="name" v-model="model.name" placeholder="搜索敏感词"
                          @keyup.enter.native="search()" clearable/>
              </span>
            </el-form-item>
            <span>
            <ns-button type="primary" @click="search()">搜索</ns-button>
            <ns-button @click="reset()">重置</ns-button>
          </span>
          </el-form>
        </template>
        <!-- 搜索-结束 -->

        <!-- 表格 -->
        <template slot="table">
          <el-table ref="table" :data="_data._table.data" stripe v-loading="loading" @sort-change="sortChange">
            <el-table-column prop="ownerWid" label="个人号" align="left" width="250">
              <template slot-scope='scope'>
                {{scope.row.ownerNick}} ({{scope.row.ownerWid}})
              </template>
            </el-table-column>
            <el-table-column prop="friendWid" label="好友" align="left" width="250">
              <template slot-scope='scope'>
                {{scope.row.friendNick}} ({{scope.row.friendWid}})
              </template>
            </el-table-column>
            <el-table-column prop="name" label="敏感词" align="left" width="100"/>
            <el-table-column prop="receive" label="发送人" align="left" width="200">
              <template slot-scope='scope'>
                <span v-if="scope.row.receive">
                  {{scope.row.ownerNick}}
                </span>
                <span v-else>
                  {{scope.row.friendNick}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" align="left" width="150" sortable="custom"/>
            <el-table-column prop="subContent" label="上下文" align="left" width="720">
              <template slot-scope='scope'>
                <span v-html="scope.row.subContent"></span>
                <a v-if="scope.row.isSubContent === '1'" @click="openContentDlg(scope.row)">查看</a>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 表格-结束 -->

        <!-- 分页 -->
        <template slot="pagination">
          <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                         :page-sizes="_data._pagination.sizeOpts"
                         :total="_data._pagination.total"
                         :current-page.sync="_data._pagination.page"
                         :page-size="_data._pagination.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         @size-change="$sizeChange$"
                         @current-change="$pageChange$">
          </el-pagination>
        </template>
        <!-- 分页-结束 -->
      </ns-page-table>

      <!-- 删除分组 -->
      <template>
        <el-dialog title="查看" :visible.sync="contentDlgVisible" width="600px" height="390px">
          <div class="el-header" style="text-align:center;width:100%;align-items:center"/>
          <div>
            <div v-html="dlgContent"
                 style="text-align: left; border:1px solid #000;border-radius: 4px;border-color:#DCDFE6;overflow-y:auto;width:96%;height:250px"/>
          </div>
          <div style="height:10px"/>
          <div style="text-align: left">
            发送人:{{dlgNick}}({{dlgWid}})
          </div>
          <div class="el-footer">
            <ns-button @click="contentDlgVisible=false">确定</ns-button>&nbsp;
          </div>
        </el-dialog>
      </template>
      <!-- 删除分组 结束 -->
    </div>
  </div>
</template>
<script>
  import monitor from './src/monitor.js'

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
