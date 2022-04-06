<!--
 * @Date: 2022-04-01 11:14:11
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-06 18:29:17
 * @FilePath: \ECRP-SG-WEB\src\pages\WeWork\topicAnalysis\components\KeyWordList.vue
-->
<template>
  <div class="page-contnaier">
    <div v-show="isDetails">
      <MemberList
        ref="memberList"
        :memberData="memberData"
        @handleRowJump="handleRowJump"
      />
    </div>
    <div v-show="!isDetails">
      <div class="container-head">
        <div class="head-serach">
          <div>
            <el-form label-position="left" :inline="true">
              <el-form-item>
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  type="date"
                  :clearable="false"
                  v-model="keyWordVoListReq.timeRange"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-input
                  @keyup.enter.native="fetch"
                  @clear="fetch"
                  clearable
                  placeholder="请输入关键词"
                  v-model="keyWordVoListReq.keyWord"
                >
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    @click="handleKeyWordSearch"
                  ></i>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <ns-button type="primary" @click="handleAddKeyWord"
              >新建关键词</ns-button
            >
            <!-- <ns-button round type="primary" @click="handleKeyWordSearch"
              >搜索</ns-button
            >
            <ns-button round @click="handleKeyWordReset">重置</ns-button> -->
          </div>
        </div>
      </div>
      <div class="container-content">
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
            <el-table-column label="关键词" prop="word"> </el-table-column>
            <el-table-column prop="keyWordId" label="最后发生时间">
            </el-table-column>
            <el-table-column label="成员发送次数">
              <template slot-scope="scope">
                <ns-button type="text" @click="handleRowJump(scope.row)">{{
                  scope.row.count
                }}</ns-button>
              </template>
            </el-table-column>
            <el-table-column label="好友发送次数">
              <template slot-scope="scope">
                <ns-button type="text" @click="handleRowJump(scope.row)">{{
                  scope.row.count
                }}</ns-button>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="创建人"></el-table-column>
            <el-table-column prop="count" label="创建时间"></el-table-column>
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
import Index from './src/KeyWordList'
export default Index
</script>
<style lang="scss" scoped>
.page-contnaier {
  background: #ffffff;
  .container-head {
    padding: 12px 16px 16px;
    background: #ffffff;
  }
  // .head-title {
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  // }
  .head-serach {
    display: flex;
    justify-content: space-between;
  }
  .container-content {
    padding: 0 16px 16px;
  }
  .pagination-text {
    float: left;
    font-weight: 400;
  }
}
</style>
