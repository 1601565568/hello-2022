<template>
  <div>
    <div class="replace-rule">
      更换规则：1、会员专属门店将更换为所选门店。2、会员将成为无专属导购会员。
    </div>
    <div class="flex">
      <el-form :inline="true" class='form-inline_top'>
        <el-form-item label="">
          <el-input v-model="model.loginAccount" placeholder="请输入创建人"  @keyup.enter.native="handleSearch('loginAccount')">
            <Icon type="ns-search-copy" slot="suffix" class='search-icon' @click="handleSearch('loginAccount')"></Icon>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="model.title" placeholder="请输入海报名称"  @keyup.enter.native="handleSearch('title')">
            <Icon type="ns-search-copy" slot="suffix" class='search-icon' @click="handleSearch('title')"></Icon>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div style="max-height:400px; overflow: hidden">
      <el-scrollbar>
        <el-table
          ref="table"
          :data="_data._table.data"
          class="new-table_border"
          :element-loading-text="$t('prompt.loading')"
          v-loading.lock="_data._table.loadingtable">
          <el-table-column width="150" label='单选'>
            <template slot-scope="scope">
              <div class="customerManage">
                <el-radio :label="scope.row.id" v-model="configId">
                  <span></span>
                </el-radio>
              </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="title" label="标题" align="left"></el-table-column>
          <el-table-column
              prop="guideNames"
              label="二维码海报">
              <template slot-scope="scope">
                <div class="scope-name scope-name_num box-padding">
                  <Icon type="ns-file-picture" className="message-upload__tip" @click='handlePreview(scope.row)'/>
                </div>
              </template>
            </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="loginAccount" label="创建人" align="left"></el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                  :page-sizes="_data._pagination.sizeOpts"
                  :total="_data._pagination.total"
                  :current-page.sync="_data._pagination.page"
                  :page-size="_data._pagination.size"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="$sizeChange$"
                  @current-change="$pageChange$">
    </el-pagination>
  </div>
</template>
<script>
import index from './src/index'
export default index
</script>
<style scoped lang='scss'>
  @import "@components/NewUi/styles/reset.css";
  .checkNumberTitle {
    height: 30px;
    display: flex;
    align-items: center;
    .dialogtitle {
      font-size: 16px;
      color: #303133;
      display: inline-block;
      margin-right: 16px;
      font-weight: bold;
    }
    .number {
      font-size: 14px;
      color: #595959;
    }
  }
  .replace-rule {
    padding: 0 16px;
    margin-bottom: 16px;
    background: #F2F9FE;
    border-radius: 2px;
    height: 40px;
    line-height: 40px;
  }
  .search-icon {
    font-size: 22px;
    margin-top: 2px;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    padding-right: 15px;
  }
  // .customerManage {
  //   color:transparent
  // }
  /* 去掉更换导购列表弹框单选组多余数字 */
  .customerManage >>> .el-radio__label {
    display: none!important;
  }
</style>
