<template>
  <el-form label-width='100px' label-position='left' ref='searchform' class='normal-from common-container' :model='model' :rules="rules"  size='medium'>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>新建红包</h3>
          <div class='common-btn'>
            <ns-button class='customer-btn_cancel' size='large' :loading='btnLoad' @click='handleCancel'>取消</ns-button>
            <ns-button class='customer-btn_save' type="primary" size='large' @click='update' :loading='btnLoad'>保存</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <SimpleCollapse title='红包配置'>
          <el-form-item label='红包类型' required prop='name' class='larger-item'>

          </el-form-item>
          <el-form-item label='发放类型' required prop='name' class='larger-item'>

          </el-form-item>
          <el-form-item label='支付商户号' required prop='name' class='larger-item'>

          </el-form-item>
        </SimpleCollapse>
        <!-- 红包封面配置 start -->
        <recruitment-collapse title='基本信息' phoneTitle=''>
          <template slot='collapse-left'>
            <el-form-item label='红包名称' required prop='name' class='larger-item'>
              <length-input v-model='model.name' placeholder="请输入封面名称，长度10个字符以内" :length='10'/>
            </el-form-item>
            <el-form-item label='有效时间' required prop='validTimeType'>
              <div class='form-item_toptext'>
                <el-radio v-model="model.validTimeType" :label="1"  :disabled='isStating'>固定时间</el-radio>
                <el-radio v-model="model.validTimeType" :label="0"  :disabled='isStating'>永久有效</el-radio>
              </div>
              <div class='form-item_time' v-if='model.validTimeType === 1'>
                <div>时间范围</div>
                <el-form-item label-width="8px" label=' '  prop='time' hide-required-asterisk>
                  <el-date-picker
                    v-model="model.time"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="请选择开始日期"
                    end-placeholder="请选择结束日期"
                    :default-time="['00:00:00','23:59:59']"
                    align="right">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label='红包总数（个）' required prop='name' class='larger-item'>
              <length-input v-model='model.name' placeholder="请输入封面名称，长度10个字符以内" :length='10'/>
            </el-form-item>
            <el-form-item label='单人单日发放个数上限（个）' required prop='name' class='larger-item'>
              <div class='form-item_toptext'>
                <el-radio v-model="model.validTimeType" :label="1"  :disabled='isStating'>有限</el-radio>
                <el-radio v-model="model.validTimeType" :label="0"  :disabled='isStating'>不限</el-radio>
              </div>
              <div class='form-item_time'>
                <el-form-item label-width="8px" label=' '  prop='time' hide-required-asterisk>
                  <length-input v-model='model.name' placeholder="请输入封面名称，长度10个字符以内" :length='10'/>
                </el-form-item>
              </div>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='preview-img'>
              <RedPacket :bgImage='model.activityPoster'/>
            </div>
          </template>
          <template slot='collapse-right__bottom'>
            <p class='collapse-right__bottom'>好友领红包封面预览图</p>
          </template>
        </recruitment-collapse>
         <!-- 红包封面配置 end -->
        <!-- 红包封面配置 start -->
        <recruitment-collapse title='红包信息' phoneTitle=''>
          <template slot='collapse-left'>
            <el-form-item label='单个红包金额（元）' required prop='name' class='larger-item'>
              <length-input v-model='model.name' placeholder="请输入封面名称，长度10个字符以内" :length='10'/>
            </el-form-item>
            <el-form-item label='红包祝福语' required prop='name' class='larger-item'>
              <length-input v-model='model.name' placeholder="请输入封面名称，长度10个字符以内" :length='10'/>
            </el-form-item>
            <el-form-item label='单人单日发放个数上限（个）' required prop='name' class='larger-item'>
              <div class='form-item_toptext'>
                <el-radio v-model="model.validTimeType" :label="1"  :disabled='isStating'>有限</el-radio>
                <el-radio v-model="model.validTimeType" :label="0"  :disabled='isStating'>不限</el-radio>
              </div>
              <div class='form-item_time'>
                <el-form-item label-width="8px" label=' '  prop='time' hide-required-asterisk>
                  <length-input v-model='model.name' placeholder="请输入封面名称，长度10个字符以内" :length='10'/>
                </el-form-item>
              </div>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <RedPacketContent />
          </template>
          <template slot='collapse-right__bottom'>
            <p class='collapse-right__bottom'>好友领红包封面预览图</p>
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
import SimpleCollapse from '@/components/NewUi/SimpleCollapse'
import LengthInput from '@/components/NewUi/LengthInput'
import DrapUpload from '@/components/NewUi/DrapUpload'
import PageEdit from '@/components/NewUi/PageEdit'
import RedPacket from '../components/RedPacket'
import RedPacketContent from '../components/RedPacketContent'
Index.components = {
  RecruitmentCollapse, LengthInput, PageEdit, DrapUpload, RedPacket, SimpleCollapse, RedPacketContent
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
</style>
