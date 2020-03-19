<template>
  <div>
    <NsTableAutoPass ref="mainTable" :url=$api.guide.autoPass.findList @scopeRowCount="scopeRowCount"
                  @shopEdit="shopEdit"  @failPassAgain="failPassAgain" @batchEdit="batchEdit" @showShop="showShop" @onRedactFun="onRedactFun"  @handleSelectionChange="handleSelectionChange">
    </NsTableAutoPass>
    <!--  失败重新通过弹窗开始  -->
    <el-dialog :title="title" :visible.sync="resignFormVisible" width="800px" @close="closeDialog">
      <!--  搜索开始  -->
      <div class="search">
        <el-form class="el_form" ref="table_filter_form" :model="model" label-width="60px" :inline="true">
          <el-form-item label="员工：">
            <el-form-grid size="xmd">
              <el-input autofocus=true v-model="name" placeholder="" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="在线状态：">
            <el-form-grid>
              <el-select placeholder="全部" v-model="online" clearable>
                <el-option label="在线" :value="2"></el-option>
                <el-option label="离线" :value="1"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <ns-button type="primary" @click="failPassAgain()">搜索</ns-button>
            <ns-button @click="transferToReset()">重置</ns-button>
          </el-form-item>
        </el-form>
      </div>
      <!--  搜索结束  -->
      <!--  表格开始  -->
      <el-table ref="table" :data="frindAddList" stripe>
        <el-table-column prop="workId" label="好友微信昵称" align="left" width="100">
          <template slot-scope="scope">
            {{scope.row.nick || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="申请时间" align="left" width="180px">
          <template slot-scope="scope">
            {{scope.row.create_time || '-'}}
          </template >
        </el-table-column>
        <el-table-column prop="mobile" label="添加员工" align="center">
          <template slot-scope="scope">
            {{scope.row.name || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="shopName" label="微信账号" align="left">
          <template slot-scope="scope">
            {{scope.row.wxnick || '-'}}({{scope.row.wxaccount || '-'}})
          </template >
        </el-table-column>
        <el-table-column prop="isOnline" label="微信登录状态" align="left">
          <template slot-scope="scope">
            <div v-if="scope.row.online === 1">
              <p>离线</p>
            </div>
            <div v-if="scope.row.online === 2">
              <p>在线</p>
            </div>
          </template >
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                         width="160px">
          <template slot-scope="scope">
            <div v-if="scope.row.isruned === 0">
              <p>执行中</p>
            </div>
            <div v-if="scope.row.isruned === 1">
              <p>已完成</p>
            </div>
            <div v-if="scope.row.isruned === 3">
              <ns-button size="mini" @click="fassAgain(scope.row)">重新通过</ns-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--  表格结束  -->
      <!-- 分页 -->
      <el-pagination v-if="_data.paginations.enable" class="template-table-pagination"
                     :page-sizes="_data.paginations.sizeOpts"
                     :total="_data.paginations.total"
                     :current-page.sync="_data.paginations.page"
                     :page-size="_data.paginations.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="customerSizeChange"
                     @current-change="customerPageChange">
      </el-pagination>
      <!-- 分页-结束 -->
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog">取消</ns-button>
        <ns-button type="primary" @click="closeDialog">确定</ns-button>
      </div>
    </el-dialog>
    <!--  失败重新通过弹窗结束  -->
  </div>
</template>

<script>
import List from './src/List'
import ElUpload from '@nascent/nui/lib/upload'
import NsTableAutoPass from './NsTableAutoPass'
import ShopSelectLoad from '@/components/ShopSelectLoad'

List.components = {
  NsTableAutoPass,
  ElUpload,
  ShopSelectLoad
}
export default List
</script>
<style scoped>
  @import "@theme/variables.pcss";

  >>>.avatar-uploader .el-upload {
    width: 128px;
    height: 128px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--theme-base-border-color-primary);
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: var(--theme-base-link-color-hover);
  }
  .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: var(--theme-font-color-secondary);
  }
  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }
</style>
<style scoped>
  @import "@theme/variables.pcss";

  .resignFormVisible_title{
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #FFDEAD;
    font-size: 14px;
    padding-left: 10px;
    margin-bottom: 10px
  }
  .resignFormVisible_way{
    line-height: 40px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    border-bottom: 1px solid #aaaaaa;
  }
  .resignFormVisible_otherShoppers_01{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .resignFormVisible_otherShoppers_search{
    padding: 10px 0 10px 0;
  }
  .resignFormVisible_otherShoppers_02{
    line-height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    border-bottom: 1px solid #aaaaaa;
    padding-left: 10px;
  }
  .resignFormVisible_custom_title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 0 10px;
    font-size: 13px;
    line-height: 40px;
  }
  .resignFormVisible_custom_01{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .resignFormVisible_custom_search{
    padding-top: 5px;

  }
  .template-table__more-btns{
    padding-left: -3px !important;
  }
  .dialog-footer{
    display:flex;
    justify-content: flex-end;
    align-items: center;
  }
  .replaceTheShoppers{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 10px 10px 20px 0;
    position: relative;;
    float: right;
    bottom: 0
  }
  .el-scrollbar__bar.is-vertical {
    width: 0!important;
    top: 2px;
  }
  .el-scrollbar__bar.is-horizontal {
    height: 0 !important;
    left: 2px;
  }
  .user_style_text{
    font-size: 14px;
    font-weight: 600;
  }
  .user_style{
    text-align: center;
    display: inline-block;
    background:rgba(255,0,0,0.1);
    padding: 3px 10px;
    margin-top: 10px;
    border-radius: var(--default-radius-mini);
  }
  .bulkReplacementStores{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding-left: 20px;
  }
  .bulkReplacementStores_logo{
    font-size: 24px;
    position: relative;
    top: 13px;
    left: -15px;
  }
  .Setupbulksalesguide{
    margin: 0 20px !important;
  }
  .bulkReplacementStores_cause{
    color: var(--theme-font-color-secondary);
    background: rgba(188,188,188,0.3);
    padding: 0 var(--default-padding-base);
    border-radius: var(--default-radius-mini);
  }
  >>> .el-radio-group {
    vertical-align: unset;
  }
  .text-black {
    color: var(--theme-font-color-primary);
    font-weight: bold;
  }
</style>
