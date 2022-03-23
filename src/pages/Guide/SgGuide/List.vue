<template>
  <div>
    <NsTableGuide ref="mainTable" :url=$api.guide.guide.findList @scopeRowCount="scopeRowCount" @onRedactFun="onRedactFun">
    </NsTableGuide>
    <!-- 查看导购详情开始-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="504px" class="detail-dialog"
               @keyup.enter.native="cleanGuide" @keyup.esc.native="cleanGuide">
      <div class="detail-dialog__content">
        <el-form label-width="90px" class="detail-leftside">
          <el-form-item label="员工类型：" >
            <el-form-grid>
              <span v-if="sgGuide.job == 0"> 导购 </span>
              <span v-if="sgGuide.job == 1"> 店长 </span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="账号：">
            <el-form-grid>
              <span>{{sgGuide.work_id || '-'}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-form-grid>
              <span>{{sgGuide.name || '-'}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="工号：">
            <el-form-grid>
              <span>{{sgGuide.work_number || '-'}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="昵称：" >
            <el-form-grid>
              <span >{{sgGuide.nickname || '-'}} </span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="手机号：" >
            <el-form-grid>
              <span>{{sgGuide.mobile || '-'}}</span>
            </el-form-grid>
          </el-form-item>

          <span v-if="productPlan == 1">
            <el-form-item label="企微userid：" >
              <el-form-grid>
                <span>{{sgGuide.userId || '-'}}</span>
              </el-form-grid>
            </el-form-item>
          </span>
          <span v-else-if="productPlan == 2">
            <el-form-item label="微信id：" >
              <el-form-grid>
                <span>{{sgGuide.wxId || '-'}}</span>
              </el-form-grid>
            </el-form-item>
          </span>

          <el-form-item label="系统角色：" >
            <el-form-grid>
              <span>{{sgGuide.system_role || '-'}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="部门：">
            <el-form-grid>
              <span>{{sgGuide.department || '-'}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="性别：">
            <el-form-grid size="xxmd">
              <span v-if="sgGuide.sex == 1"> 男 </span>
              <span v-else-if="sgGuide.sex == 0"> 女 </span>
              <span v-else> 未知 </span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="备注：">
            <el-form-grid size="xxmd">
              <span>{{sgGuide.remark}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="工作门店：">
            <el-form-grid>
              <el-table ref="table" :data="shopFindLists" stripe
                        resizable v-loading.lock="_data._table.loadingtable"
                        :element-loading-text="$t('prompt.loading')" >
                <el-table-column label="工作店铺" align="left" width="150">
                  <template slot-scope="scope">
                    {{ scope.row.name ? scope.row.name : '-' }}
                    <span :class="scope.row.shopStatus > 0 ? '' : 'text-error'">
                      {{scope.row.shopStatus === -1 ?  '(门店暂停营业)':scope.row.shopStatus === -2?'(门店已闭店)':''}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="所属地区" width="220">
                  <template slot-scope="scope">
                    {{scope.row.address || '-'}}
                  </template>
                </el-table-column>
              </el-table>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <div class="detail-rightside">
          <el-image
            :width="84" :height="84"
            :src="sgGuide.image ? sgGuide.image : require('@/icons/fill/shangjiatouxiang.svg')"
            mode="cover" :circle="true" class="detail-rightside__img"></el-image>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="cleanGuide">关闭</ns-button>
      </div>
    </el-dialog>
    <!--  查看导购详情结束 -->
    <!-- 指定导购所属门店查看详情开始 -->
    <el-dialog :title="title"  :visible.sync="scopeRowCountShow" width="660px" >
      <el-table ref="table" :data="shopFindLists" stripe
                resizable v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')" >
        <el-table-column  label="工作店铺" align="left" width="320">
          <template slot-scope="scope">
            {{ scope.row.name ? scope.row.name : '-' }}
            <span :class="scope.row.shopStatus > 0 ? '' : 'text-error'">
                {{scope.row.shopStatus === -1 ?  '(门店暂停营业)':scope.row.shopStatus === -2?'(门店已闭店)':''}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="所属地区" align="left" width="320">
          <template slot-scope="scope">
            {{scope.row.address || '-'}}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <ns-button class="scopeRowCountShow_button" @click="scopeRowCountShow = false">关闭</ns-button>
      </div>
    </el-dialog>
    <!-- 指定导购所属门店查看详情结束 -->
  </div>
</template>

<script>
import List from './src/List'
import ElUpload from '@nascent/nui/lib/upload'
import NsTableGuide from './NsTableGuide'
import ShopSelectLoad from '@/components/ShopSelectLoad'
import ElImage from '@nascent/nui/lib/image'
List.components = {
  NsTableGuide,
  ElUpload,
  ShopSelectLoad,
  ElImage
}
export default List
</script>
<style scoped>
  @import "@theme/variables.pcss";

   .avatar-uploader .el-upload {
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
  @component-namespace detail {
    @b dialog {
      @e content {
        position: relative;
      }
    }
    @b leftside {
      width: 65%;
    }
    @b rightside {
      width: 84px;
      height: 84px;
      position: absolute;
      top: 0;
      right: 14px;
      @e img {
        border-radius: 50%;
      }
    }
  }
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
  .el-radio-group {
    vertical-align: unset;
  }
  .text-black {
    color: var(--theme-font-color-primary);
    font-weight: bold;
  }
</style>
