<template>
  <div>
    <div class='header-tip'>
      <div class='header-tip__content'>需向企业微信申请企业白名单，才可使用此功能</div>
    </div>
    <ns-page-table @add="$emit('add')" @failPassAgain="$emit('failPassAgain')"  @batchEdit="$emit('batchEdit')" :colButton='10'>
      <!-- 按钮 -->
      <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.operate_buttons">
        </ns-table-operate-button>
      </template>
      <!-- 按钮-结束 -->

      <!-- 简单搜索 -->
      <!-- el-form 需添加 @submit.native.prevent 配置 -->
      <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
      <template slot="searchSearch">
        <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
          <el-form-item label="标题：">
            <el-input
              v-model="model.remark"
              placeholder="请输入聚合码标题"
              @keyup.enter.native="submitForm()"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <ns-button type="primary" @click="submitForm()">搜索</ns-button>
            <ns-button @click="resetForm()" class="resetbtn">重置</ns-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 简单搜索-结束 -->

      <!-- 表格 -->
      <template slot="table">
        <!-- 表格配置 不能添加 border 配置 -->
        <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

        <!-- 表格单元格宽度配置规范 -->
        <!-- 复选框/单选框 :width="45" -->
        <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
        <!-- 手机号 :width="120" -->
        <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->

        <el-table
          ref="table"
          :data="dataList"
          :element-loading-text="$t('prompt.loading')"
          v-loading.lock="loading"
        >
          <el-table-column prop="personnel" label="标题" align="left" min-width="100">
            <template slot-scope="scope">
              {{scope.row.remark || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="personnels" label="聚合群码" align="left" min-width="88" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <img v-if="scope.row.qrCode" class="qrCodeImg" :src="scope.row.qrCode" alt="" @click="togglePreview(scope.row.qrCode)">
              <span v-else>-</span>
            </template>
          </el-table-column>
            <el-table-column prop="personnels" label="可加入群聊(未满)" align="left" min-width="120" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.canJoinChatRoom || '-'}}
              </template>
            </el-table-column>
          <el-table-column prop="num"  min-width="120">
            <template slot="header">
              已聚合群聊
              <el-tooltip content='单个码聚合群上限为100个，达到后不会自动新建，请注意及时删除已满群聊'>
                <Icon type="question-circle" />
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              {{scope.row.chatRoomNum || '0'}}个群
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="群成员数" min-width="80">
            <template slot-scope="scope">
              {{scope.row.memberNum || '-'}}人
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="群主" min-width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.owners || ''}}
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建时间" align="center" min-width="150">
            <template slot-scope="scope">
              {{scope.row.createTime || '-'}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="160px">
            <template slot-scope="scope">
                <ns-table-column-operate-button-ext :buttons="_data._table.table_buttons" :prop="scope">
                </ns-table-column-operate-button-ext>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 表格-结束 -->
      <!-- 分页 -->
      <template slot="pagination">
        <el-pagination v-if="pagination.enable" class="template-table-pagination"
                       :page-sizes="pagination.sizeOpts"
                       :total="pagination.total"
                       :current-page.sync="pagination.page"
                       :page-size="pagination.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange">
        </el-pagination>
      </template>
      <!-- 分页-结束 -->
    </ns-page-table>
    <Preview ref="preview"/>
  </div>
</template>

<script>
import index from './src/index'
export default index
</script>
<style>
  @import "@theme/variables.pcss";
  .del-btn {
    color: var(--theme-color-danger)
  }
</style>
<style scoped>
  @import "@theme/variables.pcss";

  .scope_row_count{
    color: blue;
  }

  .tips {
    color: var(--theme-color-danger)
  }

  >>> .table-header-icon {
    font-size: var(--default-font-size-base);
    font-weight: normal;
    padding-left: var(--default-padding-base);
    cursor: pointer;
  }
  >>> .el-dropdown-link {
    margin-left: 5px !important;
  }
  .qrCodeImg {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    cursor: pointer;
  }
  .header-tip {
    padding: 16px;
    background: #fff;
    border-bottom: 1px solid #EBEEF5;
  }
  .header-tip__content {
    font-size: 14px;
    color: #595959;
    line-height: 22px;
    background: #F2F9FE;
    padding: 9px 16px;
  }
</style>
