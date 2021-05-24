<template>
  <el-form label-width='100px' label-position='left' ref='searchform' class='normal-from common-container out-content ' :model='model' :rules="rules"  size='medium' :disabled='disabled' @submit.native.prevent>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <!-- 编辑进入 start -->
          <template v-if='disabled'>
            <h3>
              <Icon type="icon-fanhuishangyiji" class='back-icon' @click='handleCancel(listPath)'></Icon>
              查看红包
            </h3>
          </template>
          <!-- 编辑进入 end -->
          <!-- 新建进入 start -->
          <template v-else>
            <h3>新建红包</h3>
            <div class='common-btn'>
              <ns-button class='customer-btn_cancel' size='large' :loading='btnLoad' @click='handleCancel(listPath)'>取消</ns-button>
              <ns-button class='customer-btn_save' type="primary" size='large' @click='update(submitApi)' :loading='btnLoad'>保存</ns-button>
            </div>
          </template>
          <!-- 新建进入 end -->
        </div>
      </template>
      <template slot='content'>
        <!-- 红包配置 start -->
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
                  <p class='prompt-text' v-if='model.redpackType === luckyRed'><span class='yellow-point'></span>拼手气红包仅可在群聊中使用</p>
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
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
            </template>
          </Box>
        </SimpleCollapse>
        <!-- 红包配置 end -->
        <!-- 基本信息 start -->
        <SimpleCollapse title='基本信息'>
          <Box>
            <template slot='collapse-left'>
              <el-form-item label='红包名称' required prop='name' class='larger-item'>
                <length-input v-model='model.name' placeholder="请输入红包名称" :length='10' />
              </el-form-item>
              <el-form-item label='有效期' required class='larger-item'>
                <el-radio-group v-model="model.timeType">
                  <template v-for='item in timeTypeList'>
                    <el-radio :label="item.value" :key='item.value' @change="resetValite('timeItem')">{{item.nick}}</el-radio>
                  </template>
                </el-radio-group>
                <div class='form-item_time larger-item' v-if='model.timeType === timeTypeInterval'>
                  <div>时间范围</div>
                  <el-form-item label-width="8px" label=' '  prop='time' hide-required-asterisk ref='timeItem' key='time'  class='el-form__change'>
                    <el-date-picker
                      width='500px'
                      v-model="model.time"
                      type="datetimerange"
                      :picker-options="pickerOptions"
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
                <length-input v-model='model.total' placeholder="请输入红包总数" @input="(value)=>{model.total = value.replace(/[^\d]/g,'')}"  :length='10'/>
                <p class='prompt-text'><span class='yellow-point'></span>控制此红包的总个数，全部发送完后，则不可发放此红包</p>
              </el-form-item>
              <el-form-item v-if='model.launchType !== activityPost' label='单人单日发放个数上限（个）' required class='larger-item'>
                <div class='form-item_toptext'>
                  <el-radio-group v-model="model.limitType"  @change="resetValite('limitTypeItem')">
                    <el-radio :label="1">有限<el-tooltip content="达到上限后，不能再发送此红包"  placement="top">
                        <Icon type="question-circle" class='question-circle' />
                      </el-tooltip></el-radio>
                    <el-radio :label="2">不限</el-radio>
                  </el-radio-group>
                </div>
                <div v-if='model.limitType === 1'>
                  <el-form-item label-width="0px" label=' '  prop='everyoneLimit' hide-required-asterisk  ref='limitTypeItem'>
                    <length-input v-model='model.everyoneLimit' @input="(value)=>{model.everyoneLimit = value.replace(/[^\d]/g,'')}" placeholder="请输入单人单日发放个数上限" :length='10'/>
                  </el-form-item>
                </div>
              </el-form-item>
            </template>
            <template slot='collapse-right'>
              <div class='mobile-content'>
                <img class='redpacket-userimg' :src='baguser'>
                <div class='mobile-chat'>
                  <h3 class='mobile-h3'>{{model.name|| '返利红包'}}</h3>
                  <div class='mobile-detail'>
                    <p class='mobile-p'>{{model.benediction || '大吉大利，恭喜发财'}}</p>
                    <img :src='fangRedpact'>
                  </div>
                </div>
              </div>
              <p class='collapse-right__bottom'>好友收到红包消息预览图</p>
            </template>
          </Box>
        </SimpleCollapse>
         <!-- 基本信息 end -->
        <!-- 红包信息 start -->
        <recruitment-collapse title='红包信息' phoneTitle=''>
          <template slot='collapse-left'>
            <el-form-item v-if='model.redpackType === normalRed' label='红包金额（元）' required prop='money' class='larger-item'>
              <length-input v-model='model.money' @input="(value)=>{model.money = value.replace(/[^\d.]/g,'')}"/>
              <p class='prompt-text'><span class='yellow-point'></span>单红包金额的范围为0.3~5000</p>
            </el-form-item>
            <el-form-item v-else-if='model.redpackType === luckyRed' label='红包金额（元）' class='larger-item is-required'>
              <div class='input-chain'>
                <el-form-item label=' ' prop='moneyMin' class='larger-item' :rules="[
                    { required: true, message: '请输入最小金额', trigger: ['blur', 'change'] },
                    { validator: ValidateUtil.isPositiveMoney, trigger: ['blur', 'change'] },
                    { validator: ValidateUtil.intervalMoney.bind(this, 0.3, model.moneyMax || 5000), trigger: ['blur', 'change'] }
                  ]">
                  <length-input v-model='model.moneyMin' @input="(value)=>{model.moneyMin = value.replace(/[^\d.]/g,'')}"/>
                </el-form-item>
                <span class='chain'></span>
                <el-form-item label=' ' prop='moneyMax' class='larger-item' :rules="[
                    { required: true, message: '请输入最大金额', trigger: ['blur', 'change'] },
                    { validator: ValidateUtil.isPositiveMoney, trigger: ['blur', 'change'] },
                    { validator: ValidateUtil.intervalMoney.bind(this, model.moneyMin || 0.3, 5000), trigger: ['blur', 'change'] }
                  ]">
                  <length-input v-model='model.moneyMax' @input="(value)=>{model.moneyMax = value.replace(/[^\d.]/g,'')}"/>
                </el-form-item>
              </div>
              <p class='prompt-text'><span class='yellow-point'></span>每个拼手气红包的总金额</p>
            </el-form-item>
            <el-form-item v-else-if='model.redpackType === diyRed' label='红包金额（元）' class='larger-item is-required'>
              <div class='input-chain'>
                <el-form-item label=' ' prop='moneyMin' class='larger-item' :rules="[
                    { required: true, message: '请输入最小金额', trigger: ['blur', 'change'] },
                    { validator: ValidateUtil.isPositiveMoney, trigger: ['blur', 'change'] },
                    { validator: ValidateUtil.intervalMoney.bind(this, 0.3, model.moneyMax || 5000), trigger: ['blur', 'change'] }
                  ]">
                  <length-input v-model='model.moneyMin' @input="(value)=>{model.moneyMin = value.replace(/[^\d.]/g,'')}"/>
                </el-form-item>
                <span class='chain'></span>
                <el-form-item label=' ' prop='moneyMax' class='larger-item' :rules="[
                    { required: true, message: '请输入最大金额', trigger: ['blur', 'change'] },
                    { validator: ValidateUtil.isPositiveMoney, trigger: ['blur', 'change'] },
                    { validator: ValidateUtil.intervalMoney.bind(this, model.moneyMin || 0.3, 5000), trigger: ['blur', 'change'] }
                  ]">
                  <length-input v-model='model.moneyMax' @input="(value)=>{model.moneyMax = value.replace(/[^\d.]/g,'')}"/>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label='红包祝福语' prop='benediction' class='larger-item'>
              <length-input type="textarea" v-model='model.benediction' placeholder="恭喜发财，大吉大利" :length='25'/>
              <el-checkbox  v-if='model.launchType !== activityPost' v-model="model.customizeType">允许员工自定义红包祝福语</el-checkbox>
            </el-form-item>
            <el-form-item label='红包封面' prop='coverId' class='larger-item'>
              <template slot='label' class='larger-item_icon'>
                <span>红包封面</span>
                <el-tooltip content="可前往“内容管理->红包工具->红包封面”添加红包封面"  placement="top">
                  <Icon type="question-circle" class='question-circle' />
                </el-tooltip>
              </template>
              <div class='poster-container'>
                <div class='poster-img'><PreviewRedPacket :bgImage='posterInfo.background' :bagTip='model.benediction' :bgHasFont='false'/></div>
                <ns-button type='text' class='choose-poster' @click='handleChangePoster'>选择封面</ns-button>
              </div>
            </el-form-item>
          </template>
          <template slot='collapse-right'>
            <div class='preview-img'>
              <RedPacketContent :money='model.money' :benediction='model.benediction' :moneyMax='model.moneyMax' :moneyMin='model.moneyMin' :redpackType='model.redpackType' :background='posterInfo.background'/>
            </div>
          </template>
          <template slot='collapse-right__bottom'>
            <p class='collapse-right__bottom'>好友领红包封面预览图</p>
          </template>
        </recruitment-collapse>
         <!-- 红包信息 end -->
      </template>
    </page-edit>
    <el-dialog title="选择封面"
      custom-class='full-dialog'
      class='full-dialog'
      height='600px'
      width='1000px'
      :modal-append-to-body='true' :append-to-body='true'
      :visible.sync="visible">
      <PosterList v-if='visible' ref='fullDialog' :background='posterInfo.background' :checked='model.coverId'/>
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
import PreviewRedPacket from '../components/PreviewRedPacket'
Index.components = {
  RecruitmentCollapse, LengthInput, PageEdit, DrapUpload, RedPacket, SimpleCollapse, RedPacketContent, Box, PosterList, PreviewRedPacket
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
  .mobile-content {
    background: #F5F5F5;
    padding: 53px 21px;
    display: flex;
    align-items: flex-start;
    width: 326px;
    box-sizing: border-box;
    margin-left: 10%;
    margin: 100px auto 8px auto;
    .redpacket-userimg {
      width: 40px;
      height: 40px;
      border-radius: 2px;
    }
    .mobile-chat {
      background-color: #fff;
      padding: 8px 12px 13px 18px;
      margin-left: 8px;
      width:238px;
      box-sizing: border-box;
      .mobile-h3 {
        font-size: 16px;
        color: #262626;
        line-height: 20px;
        word-break: break-all;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .mobile-detail {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        img {
          width: 50px;
          max-width: 50px;
          height: 50px;
          flex: 1;
          margin-left: 24px;
        }
      }
      .mobile-p {
        margin-top: 4px;
        font-size: 14px;
        color: #8C8C8C;
        line-height: 22px;
        word-break: break-all;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
</style>
<style scoped>
.out-content >>> .full-dialog{
  padding-bottom: 20px;
  box-sizing: content-box;
}
.input-chain {
  >>> .el-form-item {
    margin-bottom: 0px;
  }
  >>> .el-form-item__label {
    width: 0 !important;
  }
  >>> .el-form-item__content {
    margin-left: 0 !important;
  }
}
.form-item_time {
  >>> .el-form-item__label:before {
    display: none !important ;
  }
}
</style>
