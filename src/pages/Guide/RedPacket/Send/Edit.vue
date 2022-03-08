<template>
  <el-form label-width='100px' label-position='left' ref='searchform' class='normal-from common-container' :model='model' :rules="rules"  size='medium' @submit.native.prevent>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>发红包</h3>
          <div class='common-btn'>
            <ns-button class='customer-btn_cancel' size='large' :loading='btnLoad' @click='handleCancel(listPath)'>取消</ns-button>
            <ns-button class='customer-btn_save' type="primary" size='large' @click='update(submitApi)' :loading='btnLoad'>保存</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <recruitment-collapse title='发红包配置' phoneTitle=''>
          <template slot='title'>
            <div class='flex-box'>
              <div>发红包配置</div>
              <div class='tip-title'>员工可在企业微信聊天工具栏发此红包</div>
            </div>
          </template>
          <template slot='collapse-left'>
            <el-form-item label='可发红包' prop='redpackPolicyId' class='larger-item'>
              <template slot='label' class='larger-item_icon'>
                <span>可发红包</span>
                <el-tooltip content="可前往“内容管理->红包工具->红包策略”添加“员工发放”的红包"  placement="top">
                  <Icon type="question-circle" class='question-circle' />
                </el-tooltip>
              </template>
              <span class='choose-redpact' v-if='chooseItem.name'>{{chooseItem.name}}</span><ns-button type='text' @click="hanleChoose">选择红包</ns-button>
            </el-form-item>
            <el-form-item label='使用范围' required prop='useType' class='larger-item'>
              <el-radio-group v-model="model.useType" :class="[radioIcon==='QA'?radioboxQA:radiobox]">
                <el-radio :label="1">全部员工</el-radio>
                <el-radio :label="2">按店铺</el-radio>
                <el-radio :label="3">按员工</el-radio>
              </el-radio-group>
              <div class='employee-content' v-if='model.useType === 2'>
                <el-form-item label='参与门店' prop='shopIds'>
                  <html-area>
                    <div class='employee-list'>
                      <div v-if='model.shopIds.length>0' class='employee-text active'>
                      已选{{model.shopIds.length}}个门店
                      </div>
                      <template v-else>
                        <p class='employee-text'>请选择店铺</p>
                      </template>
                    </div>
                    <template slot='suffix'>
                      <div class='employee-suffix'>
                        <shopSelect @callBack="handleChangeShopList" :hasShopArr="model.shopIds" shopStatus='1,-1' isDIYBtn>
                          <template slot='btnIcon'>
                            <Icon type="shop" class='shop-icon'></Icon>
                          </template>
                        </shopSelect>
                      </div>
                    </template>
                  </html-area>
                </el-form-item>
              </div>
              <div class='employee-content' v-if='model.useType === 3'>
                <el-form-item  label='选择人员' prop='guideIds' class='larger-item'>
                  <html-area>
                    <div class='employee-list'>
                      <div v-if='model.guideIds.length>0' class='employee-text active'>
                      已选{{model.guideIds.length}}个员工
                      </div>
                      <template v-else>
                        <p class='employee-text'>请选择员工</p>
                      </template>
                    </div>
                    <template slot='suffix'>
                      <div class='employee-suffix'>
                        <NsGuideDialog ref='nsGuideDialog' :selfBtn='true' :appendToBody='true' :isButton="false" :validNull="true" :auth="true"   btnTitle="" type='text' dialogTitle="选择员工" v-model="model.guideIds" @inputAllData="handleChangeGuide">
                          <template slot='selfBtn'>
                            <Icon type="icon-ns-people" class='suffix-icon'></Icon>
                          </template>
                        </NsGuideDialog>
                        <!-- <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :validNull="true" :auth="false"   btnTitle="" type='text' dialogTitle="选择员工" v-model="model.guideIds" @inputAllData="handleChangeGuide">
                          <template slot='selfBtn'>
                            <Icon type="geren"></Icon>
                          </template>
                        </NsGuideDialog> -->
                      </div>
                    </template>
                  </html-area>
                </el-form-item>
              </div>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='preview-img'>
              <img :src='qychat'>
            </div>
          </template>
        </recruitment-collapse>
      </template>
    </page-edit>
    <el-dialog title="选择红包"
      custom-class='full-dialog'
      class='full-dialog'
      width='1000px'
      :modal-append-to-body='true' :append-to-body='true'
      :visible.sync="visible">
      <StrategiesList v-if='visible' :chooseItem='chooseItem' ref='strategiesList'/>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="changeVisible(false)">取 消</ns-button>
        <ns-button type="primary" @click="handleSure">确 定</ns-button>
      </div>
    </el-dialog>
  </el-form>
</template>
<script>
import Index from './src/edit'
import RecruitmentCollapse from '@/components/NewUi/RecruitmentCollapse'
import HtmlArea from '@/components/NewUi/HtmlArea'
import LengthInput from '@/components/NewUi/LengthInput'
import PageEdit from '@/components/NewUi/PageEdit'
import NsGuideDialog from '@/components/NsGuideDialog'
import shopSelect from '../../components/selectShops'
import StrategiesList from '../components/StrategiesList'
Index.components = {
  RecruitmentCollapse, LengthInput, PageEdit, NsGuideDialog, HtmlArea, shopSelect, StrategiesList
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .preview-img {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
    height: 100%;
    }
  }
  .collapse-right__bottom {
    text-align: center;
  }
  .employee-text {
    font-size: 14px;
    color: #BFBFBF;
  }
  .employee-content {
    border: 1px solid #E8E8E8;
    border-radius: 2px;
    padding: 16px;
    background: #F5F5F5;
  }
  .suffix-icon {
    color: #8C8C8C;
    font-size: 14px;
  }
  .employee-suffix_top {
    margin-right: 9px;
  }
  .employee-text {
    font-size: 14px;
    color: #BFBFBF;
    &.active {
      color: #262626;
    }
  }
  .employee-list {
    display: flex;
    padding-left:8px;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .html-area {
    background-color: #fff;

  }
  .form-item_time {
    display: flex;
    padding: 16px;
    background: #F5F5F5;
    border-radius: 2px;
  }
  .employee-list_item {
    display: inline-block;
    align-items: center;
    background: #F5f5f5;
    margin-right: 4px;
    height: 24px;
    line-height: 24px;
    padding: 0 8px;
    border-radius: 12px;
    font-size: 14px;
    i {
      margin-left: 4px;
      cursor: pointer;
      display: inline;
    }
  }
  .shop-icon {
    margin-right: 10px;
    font-size: 16px;
    color:#8C8C8C;
  }
  .choose-redpact {
    font-size: 14px;
    margin-right: 12px;
  }
  .tip-title {
    font-size: 12px;
    color: #595959;
    line-height: 20px;
    &:before {
      content: ' ';
      width: 8px;
      height: 8px;
      display: inline-block;
      background-color: #F2AA18;
      border-radius: 8px;
      margin: 0 8px 0 28px;
    }
  }
</style>
<style scoped>
.radiobox >>> .el-radio__input.is-checked .el-radio__inner{
  background-color:#41a2e8;
  border-color:#41a2e8;
}
.radiobox >>>.el-radio__input.is-checked + .el-radio__label{
  color:#41a2e8;
}
.radioboxQA >>> .el-radio__input.is-checked .el-radio__inner{
  background-color:#2153D4 ;
  border-color:#2153D4 ;
}
.radioboxQA>>>.el-radio__input.is-checked + .el-radio__label{
  color:#2153D4 ;
}
</style>
