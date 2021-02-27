<template>
  <div>
    <div class="replace-rule" v-if='configObj.id'>
      <div class='rule-left'>
        已选择：{{configObj.title}} <span class='login-account'>{{configObj.loginAccount}}</span>
      </div>
      <div class='rule-right' @click='handlePreview(configObj)'>
        <Icon type="ns-file-picture" className="message-upload__tip"/>
        查看二维码海报
      </div>
    </div>
    <div class="flex">
      <el-form :inline="true" class='form-inline_top poster-form'>
        <el-form-item label="">
          <el-input v-model="model.loginAccount" placeholder="请输入创建人"  @keyup.enter.native="handleSearch('loginAccount')">
            <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch('loginAccount')"></Icon>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="model.title" placeholder="请输入海报名称"  @keyup.enter.native="handleSearch('title')">
            <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch('title')"></Icon>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
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
                <el-radio :label="scope.row.id" v-model="configId" @change='handleChange'>
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
    <PreviewPoster :dialogVisible='dialogVisible' :url='dialogData.placard' @onClose='handleClose'/>
  </div>
</template>
<script>
import index from './src/index'
export default index
</script>
<style scoped lang='scss'>
  @import "@components/NewUi/styles/reset.css";
  .poster-form .el-form-item--small.el-form-item:last-child {
    margin-bottom: 8px;
  }
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
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #262626;
    .login-account {
      color: #606266;
      margin-left: 10px;
    }
    .rule-right {
      cursor: pointer;
      color: #0091FA;
      display: flex;
      align-items: center;
      .message-upload__tip {
        font-size: 20px;
        margin-right: 10px;
      }
    }
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
  .box-padding {
    color:#0091FA;
    padding: 0 20px;
    font-size: 16px;
    cursor: pointer;
  }
  .flex-box {
    display: flex;
    align-items: center;
    .copy {
      margin-left: 17px;
      font-size: 14px;
    }
    &.bottom {
      align-items: flex-end;
      justify-content: flex-start;
    }
    .copy-img {
      width: 122px;
      height: 216px;
    }
  }
  .question-circle {
    margin-left: 5px;
  }
</style>
