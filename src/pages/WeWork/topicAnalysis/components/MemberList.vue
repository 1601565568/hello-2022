<!--
 * @Date: 2022-04-02 18:36:31
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-07 16:15:13
 * @FilePath: \ECRP-SG-WEB\src\pages\WeWork\topicAnalysis\components\MemberList.vue
-->
<template>
  <div class="page-container">
    <div class="container-head">
      <div>
        <el-form :inline="true">
          <el-form-item>
            <el-input
              @keyup.enter.native="fetchList"
              @clear="fetchList"
              clearable
              style="width:240px"
              placeholder="请输入员工"
              v-model="memberListParams.wxName"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              @keyup.enter.native="fetchList"
              @clear="fetchList"
              clearable
              style="width:240px"
              placeholder="请输入好友"
              v-model="memberListParams.name"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              style="margin-left:15px"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              type="date"
              :clearable="false"
              v-model="memberListParams.timeRange"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div>
          <ns-button round type="primary" @click="handleSearch">搜索</ns-button>
          <ns-button round @click="handleParamsReset">重置</ns-button>
        </div> -->
      <div class="chat_record">
        <el-scrollbar ref="fullScreen">
          <el-table
            ref="multipleTable"
            :data="table.tableData"
            :element-loading-text="$t('prompt.loading')"
            v-loading.lock="table.loading"
            stripe
            resizable
            :header-cell-style="headerStyle"
          >
            <el-table-column label="员工" prop="topicName"> </el-table-column>
            <el-table-column label="好友" prop="topicName"> </el-table-column>
            <el-table-column prop="topicName" label="关键词"></el-table-column>
            <el-table-column label="内容">
              <template slot-scope="scope">
                <el-popover placement="top-start" width="400" trigger="hover">
                  <span
                    v-html="
                      fliterText(
                        `auto_加入登录.1111auto_加入登录${scope.row.topicName}auto_加入登录`
                      )
                    "
                  ></span>
                  <span
                    slot="reference"
                    v-html="
                      fliterText(
                        `auto_加入登录.1111auto_加入登录${scope.row.topicName}auto_加入登录`
                      )
                    "
                  ></span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="topicName" label="时间"></el-table-column>
            <el-table-column label="操作" fixed="right" :width="150">
              <template slot-scope="scope">
                <ns-button type="text" @click="getContext(scope.row)"
                  >详情</ns-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
        <el-pagination
          :page-sizes="pagination.sizeOpts"
          :total="pagination.total"
          :current-page.sync="pagination.page"
          :page-size.sync="pagination.size"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          class="template-table__pagination"
          layout="slot, sizes, prev, pager, next, jumper"
        >
          <span class="pagination-text">单页显示: </span>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Index from './src/MemberList'
export default Index
</script>
<style scoped>
.page-container /deep/ .cell {
  white-space: nowrap;
}
</style>
<style lang="scss" scoped>
.page-container {
  width: 100%;
  background: #ffffff;
  .container-head {
    padding: 16px;
    font-size: 16px;
    background: #ffffff;
    color: #262626;
  }
  .head-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .chat_record {
    margin-top: 11px;
  }
  .pagination-text {
    float: left;
    font-weight: 400;
  }
}
</style>
