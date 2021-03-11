<template>
  <el-form label-width='100px' label-position='left' ref='searchform' class='normal-from common-container' :model='model' :rules="rules"  size='medium'>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>新建朋友圈</h3>
          <div class='common-btn'>
            <ns-button class='customer-btn_cancel' size='large' :loading='btnLoad' @click='handleCancel'>取消</ns-button>
            <ns-button class='customer-btn_save' type="primary" size='large' @click='update' :loading='btnLoad'>保存</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <!-- 基础信息 start -->
        <recruitment-collapse title='基本信息' phoneTitle='' phoneBar='客户'>
          <template slot='collapse-left'>
            <el-form-item label='内容' prop='content'>
              <tag-area v-model='model.content' tag="wise" ref="testText" :maxlength="1000" :tools='tools' @inputLength="inputLength"/>
            </el-form-item>
            <el-form-item label='附件' prop='content'>
              <MoveUpload v-model='model.mediaList'/>
            </el-form-item>
            <el-form-item label='热度' prop='content' class='larger-item'>
              <star v-model='model.star' :img='sohot' :voidImg='nothot'/>
            </el-form-item>
            <el-form-item label='对外信息说明' prop='content' class='larger-item'>
              <html-area>
                <div class='employee-list'>
                  <template v-if='model.outList.length>0'>
                    <template v-for='(item,index) in model.outList'>
                      <div class='employee-list_item' :key='item.id'>
                        {{item.name}}
                        <i class="el-icon-close" @click="handleDelect(index)"></i>
                      </div>
                    </template>
                    <span class='employee-list_all' v-if='model.outList.length>0'>
                      <i class="el-icon-close" @click="handleDelectAll()"></i>
                    </span>
                  </template>
                  <template v-else>
                    <p class='employee-text'>请选择</p>
                  </template>
                </div>
                <template slot='suffix'>
                  <div class='employee-suffix'>
                    <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :validNull="true" :auth="false"   btnTitle="" type='text' dialogTitle="选择员工" v-model="model.guideIds" @inputAllData="handleChangeGuide">
                       <template slot='selfBtn'>
                        <Icon type="geren"></Icon>
                      </template>
                    </NsGuideDialog>
                  </div>
                </template>
              </html-area>
            </el-form-item>
            <el-form-item label='选择员工' prop='content' class='larger-item'>
              <el-radio-group v-model="model.isAll">
                <el-radio :label="1">全部员工</el-radio>
                <el-radio :label="0">部分员工</el-radio>
              </el-radio-group>
              <div class='employee-content' v-if='model.isAll === 0'>
                <el-form-item label='选择员工' prop='content' class='larger-item'>
                  <html-area>
                    <div class='employee-list'>
                      <template v-if='model.outList.length>0'>
                        <template v-for='(item,index) in model.outList'>
                          <div class='employee-list_item' :key='item.id'>
                            {{item.name}}
                            <i class="el-icon-close" @click="handleDelect(index)"></i>
                          </div>
                        </template>
                        <span class='employee-list_all' v-if='model.outList.length>0'>
                          <i class="el-icon-close" @click="handleDelectAll()"></i>
                        </span>
                      </template>
                      <template v-else>
                        <p class='employee-text'>请选择</p>
                      </template>
                    </div>
                    <template slot='suffix'>
                      <div class='employee-suffix'>
                        <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :validNull="true" :auth="false"   btnTitle="" type='text' dialogTitle="选择员工" v-model="model.guideIds" @inputAllData="handleChangeGuide">
                          <template slot='selfBtn'>
                            <Icon type="geren"></Icon>
                          </template>
                        </NsGuideDialog>
                      </div>
                    </template>
                  </html-area>
                </el-form-item>
              </div>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='phone-wrapper'>
              <!-- <Media /> -->
              <Friend />
              <!-- <Design /> -->
            </div>
          </template>
          <template slot='collapse-right__bottom'>
            <span></span>
            <span></span>
            <span></span>
          </template>
        </recruitment-collapse>
      </template>
    </page-edit>
  </el-form>
</template>
<script>
import Index from './src/Edit'
import PageEdit from '@/components/NewUi/PageEdit'
import HtmlArea from '@/components/NewUi/HtmlArea'
import TagArea from '@/components/NewUi/TagArea'
import LengthInput from '@/components/NewUi/LengthInput'
import RecruitmentCollapse from '@/components/NewUi/RecruitmentCollapse'
import Media from './components/Edit/Media'
import Friend from './components/Edit/Friend'
import Design from './components/Edit/Design'
import Star from '@/components/NewUi/Star'
import NsGuideDialog from '@/components/NsGuideDialog'
import MoveUpload from '@/components/NewUi/MoveUpload'
Index.components = {
  PageEdit, HtmlArea, TagArea, LengthInput, RecruitmentCollapse, Star, Media, Friend, Design, NsGuideDialog, MoveUpload
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .phone-wrapper {
    height: 518px;
    background-color: #fff;
    margin-left: -1px;
    margin-top: -1px;
    margin-right: -1px;
  }
  .employee-list {
    display: flex;
    padding-left: 8px;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .employee-list_item {
    display: inline-block;
    align-items: center;
    background: #F5f5f5;
    margin-right: 4px;
    margin-bottom: 8px;
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
  .employee-text {
    font-size: 14px;
    color: #BFBFBF;
  }
  .employee-content {
    border: 1px solid #E8E8E8;
    border-radius: 2px;
    padding: 16px;
  }
</style>
