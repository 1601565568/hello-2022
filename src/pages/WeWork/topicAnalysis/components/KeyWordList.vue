<!--
 * @Date: 2022-04-01 11:14:11
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-12 16:29:25
 * @FilePath: \ECRP-SG-WEB\src\pages\WeWork\topicAnalysis\components\KeyWordList.vue
-->
<template>
  <div class="page-contnaier">
    <div class="container-head">
      <div class="head-serach">
        <div>
          <el-form :inline="true" class="form-inline_top">
            <el-form-item label="日期: ">
              <el-date-picker
                value-format="yyyy-MM-dd"
                format="yyyy/MM/dd"
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
                <Icon
                  type="ns-search"
                  slot="suffix"
                  class="search-icon"
                  @click="handleKeyWordSearch"
                ></Icon>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <ns-button
            type="primary"
            @click="handleAddKeyWord"
            class="add-word-btn"
            >新建关键词</ns-button
          >
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
              <ns-button
                type="text"
                @click="handleRowJump({ ...scope.row, type: 1 })"
                >{{ scope.row.count }}0</ns-button
              >
            </template>
          </el-table-column>
          <el-table-column label="好友发送次数">
            <template slot-scope="scope">
              <ns-button
                type="text"
                @click="handleRowJump({ ...scope.row, type: 2 })"
                >{{ scope.row.count }}</ns-button
              >
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
</template>

<script>
import Index from './src/KeyWordList'
export default Index
</script>
<style lang="scss" scoped>
@import './styles/reset.css';
.page-contnaier {
  background: #ffffff;
  .container-head {
    padding: 12px 16px 16px;
    background: #ffffff;
  }
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
::v-deep .el-input .el-input__suffix-inner svg {
  padding: 2px;
}
.search-icon {
  font-size: 22px;
  margin-top: 2px;
}
.add-word-btn {
  padding: 5px 16px;
  font-size: 14px;
  text-align: center;
  line-height: 22px;
  font-weight: 400;
}
.template-table__pagination {
  padding: 13px 20px;
}
</style>
