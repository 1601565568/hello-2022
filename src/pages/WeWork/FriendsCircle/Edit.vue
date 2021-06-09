<template>
  <el-form label-width='100px' label-position='left' ref='searchform' class='normal-from common-container friends-from' :model='model' :rules="rules"  size='medium'>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>{{title}}</h3>
          <div class='common-btn' v-if='!isEdit'>
            <ns-button class='customer-btn_cancel' size='large' :loading='btnLoad' @click='handleCancel'>取消</ns-button>
            <ns-button class='customer-btn_save' type="primary" size='large' @click='handleSave' :loading='btnLoad'>保存</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <!-- 基础信息 start -->
        <recruitment-collapse title='基本信息' phoneTitle='' :phoneBar='styleData.name || "客户"' :isShowPhone='!!model.profileId'>
          <template slot='collapse-left'>
            <el-form-item label='内容' prop='content' :rules="[
              { required: true, message: '请输入内容', trigger: ['blur', 'change'] },
              { validator: validateContent.bind(this, activityIntroductionLength), trigger: ['blur', 'change'] }
            ]">
              <tag-area v-model='model.content' tag="wise" ref="testText" :maxlength="2000" :tools='tools' @inputLength="inputLength" :disabled='isEdit' :showEmoji='true' :showTextEmoji='true'/>
            </el-form-item>
            <el-form-item label='附件' prop='mediaList'>
              <MoveUpload :value='model.mediaList' @input='handleChangeMedia' :mediaType='model.type' :disabled='isEdit'/>
              <p class='prompt-text'><span class='yellow-point'></span>支持小于2M的jpg、jpeg、png格式图片或小于20M的MP4格式视频</p>
            </el-form-item>
            <el-form-item label='热度' prop='hotLevel' class='larger-item'>
              <star v-model='model.hotLevel' :img='sohot' :voidImg='nothot' :disabled='isEdit'/>
            </el-form-item>
            <el-form-item label='对外信息名称' prop='profileId' class='larger-item'>
              <template v-if='isEdit'>
                <div class='preview-div'>
                  {{styleData.name}}
                </div>
              </template>
              <template v-else>
                <html-area @onOpen='handleChangeVisible(true)'>
                  <div class='employee-list profile-list'>
                    <template v-if='model.profileId'>
                      <div class='employee-list_item'>
                        {{styleData.name}}
                        <i class="el-icon-close" @click.stop="handleDelectProfileId"></i>
                      </div>
                    </template>
                    <template v-else>
                      <p class='employee-text'>请选择</p>
                    </template>
                  </div>
                  <template slot='suffix'>
                    <div class='employee-suffix_top'>
                      <Icon  class='suffix-icon' type="icon-duiwaixinximingcheng-2-x"></Icon>
                    </div>
                  </template>
                </html-area>
              </template>
            </el-form-item>
            <el-form-item label='选择员工' prop='userType' class='larger-item'>
              <template v-if='!isEdit'>
                <el-radio-group v-model="model.userType">
                  <el-radio :label="0">全部员工</el-radio>
                  <el-radio :label="1">部分员工</el-radio>
                </el-radio-group>
                <div class='employee-content' v-if='model.userType === 1'>
                  <el-form-item label='' prop='guideIds' class='larger-item'>
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
              </template>
              <template v-else>
                <el-radio-group v-model="model.userType" disabled>
                  <el-radio v-if='model.userType === 0' :label="0">全部员工</el-radio>
                  <el-radio v-if='model.userType === 1' :label="1">部分员工</el-radio>
                </el-radio-group>
                <div class='employee-content' v-if='model.userType === 1'>
                  <el-form-item label='选择员工' prop='guideIds' class='larger-item'>
                    <div class='preview-div'>
                      已选择{{model.guideIds.length}}个员工
                    </div>
                  </el-form-item>
                </div>
              </template>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='phone-wrapper'>
              <template v-if='styleData.style === 0'>
                <Friend :data='styleData' :type='model.type' :list='model.mediaList' :hotNum='model.hotLevel' :text='textConTent'/>
              </template>
              <template v-else-if='styleData.style === 1'>
                <Design :data='styleData' :type='model.type' :list='model.mediaList' :hotNum='model.hotLevel' :text='textConTent'/>
              </template>
              <template v-else-if='styleData.style === 2'>
                <Media :data='styleData' :type='model.type'  :list='model.mediaList' :hotNum='model.hotLevel' :text='textConTent' />
              </template>
              <!-- <Media /> -->
              <!-- <Friend /> -->
              <!-- <Design /> -->
            </div>
          </template>
        </recruitment-collapse>
        <!-- 基础信息 end -->
      </template>
    </page-edit>
    <!-- 选择对外信息弹框 start -->
    <el-dialog ref="friendsList" :visible.sync="visible"
               title="选择对外信息展示"
               width="960px">
      <NsTableFriends v-if='visible' ref='friendList' :id="model.profileId"></NsTableFriends>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="handleChangeVisible(false)">取消</ns-button>
        <ns-button @click="handleSureProfileId" type='primary'>确定</ns-button>
      </div>
    </el-dialog>
    <!-- 选择对外信息弹框 end -->
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
import NsTableFriends from './components/Edit/NsTableFriends'
Index.components = {
  PageEdit, HtmlArea, TagArea, LengthInput, RecruitmentCollapse, Star, Media, Friend, Design, NsGuideDialog, MoveUpload, NsTableFriends
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
    overflow-y: hidden;
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
  .employee-text {
    font-size: 14px;
    color: #BFBFBF;
  }
  .employee-content {
    border: 1px solid #E8E8E8;
    border-radius: 2px;
    padding: 16px;
  }
  .suffix-icon {
    color: #8C8C8C;
    font-size: 14px;
  }
  .employee-suffix_top {
    margin-right: 9px;
  }
  .preview-div {
    padding: 5px 9px;
    background: #F5F5F5;
    border-radius: 2px;
    font-size: 14px;
    color: #595959;
    line-height: 22px;
  }
  .prompt-text {
    display: flex;
    align-items: center;
    .yellow-point {
      background: #F2AA18;
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
</style>
<style scoped>
.friends-from >>> .scroll-view {
  overflow-x: hidden;
  overflow-y:scroll
}
</style>
