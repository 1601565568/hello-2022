<template>
  <el-form label-width='100px' label-position='left' ref='searchform' class='normal-from common-container' :model='model' :rules="rules"  size='medium'>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>发红包</h3>
          <div class='common-btn'>
            <ns-button class='customer-btn_cancel' size='large' :loading='btnLoad' @click='handleCancel'>取消</ns-button>
            <ns-button class='customer-btn_save' type="primary" size='large' @click='update' :loading='btnLoad'>保存</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <!-- 红包封面配置 start -->
        <recruitment-collapse title='发红包配置' phoneTitle=''>
          <template slot='collapse-left'>
            <el-form-item label='可发红包' prop='name' class='larger-item'>
              <ns-button type='text'>选择红包</ns-button>
            </el-form-item>
            <el-form-item label='选择人员' required prop='activityPoster'>
              <el-radio-group v-model="model.userType">
                <el-radio :label="0">全部员工</el-radio>
                <el-radio :label="1">按店铺</el-radio>
                <el-radio :label="2">按员工</el-radio>
              </el-radio-group>
              <div class='employee-content' v-if='model.userType === 1'>
                <el-form-item  label='选择人员' prop='guideIds' class='larger-item'>
                  <html-area @onOpen='()=>{$refs.nsGuideDialog.onDialogOpen()}'>
                    <div class='employee-list'>
                      <template v-if='model.guideIds.length>0'>
                        <template v-for='(item,index) in model.guideIds'>
                          <div class='employee-list_item' :key='item.id'>
                            {{item.name}}
                            <i class="el-icon-close" @click.stop="handleDelect(index)"></i>
                          </div>
                        </template>
                        <span class='employee-list_all' v-if='model.guideIds.length>0'>
                          <i class="el-icon-close" @click.stop="handleDelectAll()"></i>
                        </span>
                      </template>
                      <template v-else>
                        <p class='employee-text'>请选择</p>
                      </template>
                    </div>
                    <template slot='suffix'>
                      <div class='employee-suffix'>
                        <NsGuideDialog ref='nsGuideDialog' :selfBtn='true' :appendToBody='true' :isButton="false" :validNull="true" :auth="false"   btnTitle="" type='text' dialogTitle="选择员工" v-model="model.guideIds" @inputAllData="handleChangeGuide">
                          <template slot='selfBtn'>
                            <Icon type="geren" class='suffix-icon'></Icon>
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
            </div>
          </template>
        </recruitment-collapse>
         <!-- 红包封面配置 end -->
      </template>
    </page-edit>
  </el-form>
</template>
<script>
import Index from './src/edit'
import RecruitmentCollapse from '@/components/NewUi/RecruitmentCollapse'
import HtmlArea from '@/components/NewUi/HtmlArea'
import LengthInput from '@/components/NewUi/LengthInput'
import PageEdit from '@/components/NewUi/PageEdit'
import NsGuideDialog from '@/components/NsGuideDialog'
Index.components = {
  RecruitmentCollapse, LengthInput, PageEdit, NsGuideDialog, HtmlArea
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .preview-img {
    width: 100%;
    height: 100%;
    font-size: 30px;
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
  .employee-list {
    display: flex;
    padding-left: 8px;
    flex-direction: row;
    flex-wrap: wrap;
    &.profile-list {
      height: 100%;
      align-items: center;
    }
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
</style>
