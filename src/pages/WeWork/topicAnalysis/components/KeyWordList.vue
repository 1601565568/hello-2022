<!--
 * @Date: 2022-04-01 11:14:11
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-15 19:31:57
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
                type="date"
                :clearable="false"
                v-model="keyWordVoListReq.time"
                @change="handleKeyWordSearch"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input
                @keyup.enter.native="fetch"
                @clear="fetch"
                placeholder="请输入关键词"
                v-model="keyWordVoListReq.name"
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
          :cell-style="'text-align:center'"
        >
          <el-table-column label="关键词" prop="word"> </el-table-column>
          <el-table-column
            prop="lastSendTime"
            label="最后发生时间"
            min-width="110"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.lastSendTime || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成员发送次数">
            <template slot-scope="scope">
              <ns-button
                type="text"
                @click="
                  handleRowJump({ ...scope.row, id: scope.row.wordId, type: 1 })
                "
                >{{ scope.row.staffSendCount }}</ns-button
              >
            </template>
          </el-table-column>
          <el-table-column label="好友发送次数">
            <template slot-scope="scope">
              <ns-button
                type="text"
                @click="
                  handleRowJump({ ...scope.row, id: scope.row.wordId, type: 2 })
                "
                >{{ scope.row.friendSendCount }}</ns-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建人"></el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="110"
          ></el-table-column>
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
