<!--
 * @Date: 2022-04-01 11:14:11
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-01 18:13:45
 * @FilePath: \ECRP-SG-WEB\src\pages\WeWork\topicAnalysis\components\KeyWordList.vue
-->
<template>
  <div class="page-contnaier">
    <div v-show="isDetails">
      <div class="container-head">
        <ns-button round @click="handleRowJump">返回</ns-button>
        <div class="head-serach">
          <div>
            <el-form :inline="true" label-width="100px">
              <el-form-item label="企业微信成员: ">
                <el-input
                  @keyup.enter.native="fetch"
                  @clear="fetch"
                  clearable
                  style="width:240px"
                  placeholder="请输入企业微信成员"
                  v-model="keyWordVoListReq.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="好友: ">
                <el-input
                  @keyup.enter.native="fetch"
                  @clear="fetch"
                  clearable
                  style="width:240px"
                  placeholder="请输入好友"
                  v-model="keyWordVoListReq.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="自定义时段: ">
                <el-date-picker
                  style="margin-left:15px"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  type="datetimerange"
                  :clearable="false"
                  v-model="keyWordVoListReq.timeData"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <ns-button round type="primary" @click="handleAddKeyWord"
              >搜索</ns-button
            >
            <ns-button round @click="handleAddKeyWord">重置</ns-button>
          </div>
        </div>
        <div class="chat_record">
          <el-scrollbar ref="fullScreen">
            <el-table
              ref="multipleTable"
              :data="table.tableData"
              :element-loading-text="$t('prompt.loading')"
              v-loading.lock="table.loading"
              stripe
              resizable
            >
              <el-table-column label="企业微信成员" prop="word">
              </el-table-column>
              <el-table-column label="好友" prop="keyWordId"> </el-table-column>
              <el-table-column prop="count" label="关键词"></el-table-column>
              <el-table-column prop="count" label="时间"></el-table-column>
              <el-table-column label="内容">
                <template slot-scope="scope">
                  <span
                    v-html="
                      fliterText(
                        `auto_加入登录.1111auto_加入登录${scope.row.word}auto_加入登录`
                      )
                    "
                  >
                  </span>
                </template>
              </el-table-column>
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
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div v-show="!isDetails">
      <div class="container-head">
        <div class="head-title">
          <span>关键词列表</span>
          <ns-button round @click="handleAddKeyWord">新建关键词</ns-button>
        </div>
        <div class="head-serach">
          <div>
            <el-form label-position="left" :inline="true" label-width="80px">
              <el-form-item label="关键词: ">
                <el-input
                  @keyup.enter.native="fetch"
                  @clear="fetch"
                  clearable
                  placeholder="请输入关键词"
                  v-model="keyWordVoListReq.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="自定义时段: ">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  type="datetimerange"
                  :clearable="false"
                  v-model="keyWordVoListReq.timeData"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <ns-button round type="primary" @click="handleAddKeyWord"
              >搜索</ns-button
            >
            <ns-button round @click="handleAddKeyWord">重置</ns-button>
          </div>
        </div>
      </div>
      <div class="chat_record">
        <el-scrollbar ref="fullScreen">
          <el-table
            ref="multipleTable"
            :data="table.tableData"
            :element-loading-text="$t('prompt.loading')"
            v-loading.lock="table.loading"
            stripe
            resizable
          >
            <el-table-column label="关键词" prop="word"> </el-table-column>
            <el-table-column prop="keyWordId" label="最后发生时间">
            </el-table-column>
            <el-table-column label="成员发送次数">
              <template slot-scope="scope">
                <ns-button type="text" @click="handleRowJump(scope.row.word)">{{
                  scope.row.count
                }}</ns-button>
              </template>
            </el-table-column>
            <el-table-column label="好友发送次数">
              <template slot-scope="scope">
                <ns-button type="text" @click="handleRowJump(scope.row.word)">{{
                  scope.row.count
                }}</ns-button>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="创建人"></el-table-column>
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
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
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
  .head-serach {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
