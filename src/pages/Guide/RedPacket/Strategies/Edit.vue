<template>
  <el-form label-width='100px' label-position='left' ref='searchform' class='normal-from common-container out-content ' :model='model' :rules="rules"  size='medium' :disabled='disabled'>
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
          <Box :noborder='true'>
            <template slot='collapse-left'>
              <el-form-item label='红包类型' required prop='redpackType' class='larger-item'>
                <el-select v-model="model.redpackType" placeholder="请选择" @change='handleChangeRedpackType'>
                    <el-option
                      v-for="item in redpacketTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label='发放类型' required prop='launchType' class='larger-item'>
                  <el-radio-group v-model="model.launchType">
                    <template v-for='item in setTypeList'>
                      <el-radio v-if='item.value === staffPost || model.redpackType === normalRed' :label="item.value" :key='item.value'>{{item.label}}</el-radio>
                    </template>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label='支付商户号' required prop='payConfigId' class='larger-item'>
                  <template slot='label' class='larger-item_icon'>
                    <span>支付商户号</span>
                    <el-tooltip content="可前往“系统设置->授权管理->支付配置”添加支付商户号"  placement="top">
                      <Icon type="question-circle" class='question-circle' />
                    </el-tooltip>
                  </template>
                  <el-select v-model="model.payConfigId" placeholder="请选择">
                    <el-option
                      v-for="item in wxpayList"
                      :key="item.mchid"
                      :label="item.mchid"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
            </template>
          </Box>
        </SimpleCollapse>
        <!-- 红包封面配置 start -->
        <SimpleCollapse title='基本信息'>
          <Box :noborder='true'>
            <template slot='collapse-left'>
              <el-form-item label='红包名称' required prop='name' class='larger-item'>
                <length-input v-model='model.name' placeholder="请输入红包名称" :length='10' />
              </el-form-item>
              <el-form-item label='有效时间' required prop='timeType' class='larger-item'>
                <el-radio-group v-model="model.timeType">
                  <template v-for='item in timeTypeList'>
                    <el-radio :label="item.value" :key='item.value'>{{item.nick}}</el-radio>
                  </template>
                </el-radio-group>
                <div class='form-item_time larger-item' v-if='model.timeType === timeTypeInterval'>
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
              <el-form-item label='红包总数（个）' required prop='total' class='larger-item'>
                <length-input v-model='model.total' placeholder="请输入红包总数" oninput="value=value.replace(/[^\d]/g,'')"/>
                <p class='prompt-text'><span class='yellow-point'></span>控制此红包的总个数，全部发送完后，则不可发放此红包</p>
              </el-form-item>
              <el-form-item label='单人单日发放个数上限（个）' required prop='limitType' class='larger-item'>
                <div class='form-item_toptext'>
                  <el-radio-group v-model="model.limitType">
                    <el-radio :label="1">有限<el-tooltip content="可前往“系统设置->授权管理->支付配置”添加支付商户号"  placement="top">
                        <Icon type="question-circle" class='question-circle' />
                      </el-tooltip></el-radio>
                    <el-radio :label="2">不限</el-radio>
                  </el-radio-group>
                </div>
                <div v-if='model.limitType === 1'>
                  <el-form-item label-width="0px" label=' '  prop='everyoneLimit' hide-required-asterisk>
                    <length-input v-model='model.everyoneLimit' placeholder="请输入单人单日发放个数上限" />
                  </el-form-item>
                </div>
              </el-form-item>
            </template>
            <template slot='collapse-right'>
              <div class='mobile-content'>

              </div>
              <p class='collapse-right__bottom'>好友收到红包消息预览图</p>
            </template>
          </Box>
        </SimpleCollapse>
         <!-- 红包封面配置 end -->
        <!-- 红包封面配置 start -->
        <recruitment-collapse title='红包信息' phoneTitle=''>
          <template slot='collapse-left'>
            <el-form-item v-if='model.redpackType === normalRed' label='单个红包金额（元）' required prop='money' class='larger-item'>
              <length-input v-model='model.money' oninput="value=value.replace(/[^\d]/g,'')"/>
              <p class='prompt-text'><span class='yellow-point'></span>单红包金额的范围为1~200</p>
            </el-form-item>
            <el-form-item v-else-if='model.redpackType === luckyRed' label='红包总金额（元）' required prop='moneyMin' class='larger-item'>
              <div class='input-chain'>
                <length-input v-model='model.moneyMin'/>
                <span class='chain'></span>
                <length-input v-model='model.moneyMax'/>
              </div>
              <p class='prompt-text'><span class='yellow-point'></span>每个拼手气红包的总金额</p>
            </el-form-item>
            <el-form-item v-else-if='model.redpackType === diyRed' label='单个红包可发放金额（元）' required prop='moneyMin' class='larger-item'>
              <div class='input-chain'>
                <length-input v-model='model.moneyMin'/>
                <span class='chain'></span>
                <length-input v-model='model.moneyMax'/>
              </div>
            </el-form-item>
            <el-form-item label='红包祝福语' prop='benediction' class='larger-item'>
              <length-input v-model='model.benediction' type='textarea' placeholder="恭喜发财，大吉大利" :length='20'/>
              <el-checkbox v-model="model.customizeType">允许员工自定义红包祝福语</el-checkbox>
            </el-form-item>
            <el-form-item label='红包封面' prop='coverId' class='larger-item'>
              <template slot='label' class='larger-item_icon'>
                <span>红包封面</span>
                <el-tooltip content="可前往“内容管理->红包工具->红包封面”添加红包封面"  placement="top">
                  <Icon type="question-circle" class='question-circle' />
                </el-tooltip>
              </template>
              <div class='poster-container'>
                <div class='poster-img'><RedPacket :bgImage='posterInfo.activityPoster' :bgHasFont='true'/></div>
                <ns-button type='text' class='choose-poster' @click='handleChangePoster'>选择封面</ns-button>
              </div>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='preview-img'>
              <RedPacketContent />
            </div>
          </template>
          <template slot='collapse-right__bottom'>
            <p class='collapse-right__bottom'>好友领红包封面预览图</p>
          </template>
        </recruitment-collapse>
         <!-- 红包封面配置 end -->
      </template>
    </page-edit>
    <el-dialog title="选择封面"
      custom-class='full-dialog'
      class='full-dialog'
      height='600px'
      width='1000px'
      :modal-append-to-body='true' :append-to-body='true'
      :visible="visible">
      <PosterList ref='fullDialog'/>
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
import SimpleCollapse from '@/components/NewUi/SimpleCollapse'
import Box from '@/components/NewUi/Box'
import LengthInput from '@/components/NewUi/LengthInput'
import DrapUpload from '@/components/NewUi/DrapUpload'
import PageEdit from '@/components/NewUi/PageEdit'
import RedPacket from '../components/RedPacket'
import RedPacketContent from '../components/RedPacketContent'
import PosterList from '../components/PosterList'
Index.components = {
  RecruitmentCollapse, LengthInput, PageEdit, DrapUpload, RedPacket, SimpleCollapse, RedPacketContent, Box, PosterList
}
export default Index
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .preview-img {
    width: 100%;
    height: 100%;
    font-size: 13.65px;
  }
  .collapse-right__bottom {
    text-align: center;
  }
  .form-item_time {
    display: flex;
    padding: 16px;
    background: #F5F5F5;
    border-radius: 2px;
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
  .question-circle {
    color: #8C8C8C !important;
  }
  .poster-container {
    display: flex;
    align-items: flex-start;
    .poster-img {
      width: 112.44px;
      font-size: 12px;
    }
  }
  .choose-poster {
    margin-left: 16px;
  }
  .input-chain {
    display: flex;
    align-items: center;
    .chain {
      display: inline-block;
      width: 16px;
      height: 1px;
      background: #D9D9D9;
      margin: 0 8px;
    }
  }
</style>
<style scoped>
.out-content >>> .full-dialog{
  padding-bottom: 20px;
  box-sizing: content-box;
}
</style>
