<template>
  <div class="template-page">
    <ns-ys-account ref="table"  @open-dialog="onOpenDialog" @detail="onOpenDetail">
    </ns-ys-account>

    <el-dialog :title="dialogTitle" :visible="dialogVisible"
                :close-on-click-modal = "false" :before-close="onCloseDialog" width="750px">
      <el-form ref="form" placement="right" label-width="120px" class="form-main" :model="model" :rules="rules">
        <el-form-item label="通道账号："   required>
          <el-form-grid size="xmd">
            <el-form-item prop = "ys_account" >
              <el-input type="text" v-model.trim = "model.ys_account" placeholder="请输入通道账号，限制20字">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="账号密码：" required>
          <el-form-grid size="xmd">
            <el-form-item  prop = "password"  >
              <el-input type="password" v-model.trim = "model.password" placeholder="请输入账号密码，限制6-50字" auto-complete="false">-->
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item class="el-form-validate__unHide el-form-validate__box" prop = "use_range" label="应用品牌：" required>
            <el-row v-if="brandOptions.length > 0">
              <el-checkbox-group v-model="model.use_range">
                <el-col :span="8"  v-for="brand in brandOptions" :key="brand.value">
                  <el-checkbox :label="brand.value" :disabled="brand.isDisabled" >{{brand.label}}
                  </el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-row>
            <el-row v-else>
              暂无需要关联通道账号的品牌
            </el-row>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseDialog">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSave" ></ns-save>
      </div>
    </el-dialog>
    <el-dialog :title="detailTitle" :visible="detailVisible" width="67%"
             :close-on-click-modal = "false" :before-close="onCloseDetail" :close-on-press-escape="false">
      <el-form ref="detailForm" placement="right" label-width="110px" :model="detail">
        <el-row>
          <el-col :span="12">
            <el-form-item label="通道账号：" class="el-inline-block">
              <el-form-grid>
                {{detail.ysAccount}} <span v-if="detail.status">[{{detail.status}}]</span>
              </el-form-grid>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用品牌：" >
              <el-form-grid>
                {{detail.use_range}}
              </el-form-grid>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="累计充值：" class="el-inline-block">
              <el-form-grid>
                <template v-if="!detail.totalPrice">-</template>
                <template v-else>{{detail.totalPrice}}</template>
              </el-form-grid>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最近充值时间：">
              <el-form-grid>
                <template v-if="!detail.update_time">-</template>
                <template v-else>{{detail.update_time}}</template>
              </el-form-grid>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form ref="detailForm2" class="ys-detail" :model="detail" >
        <el-row>
          <el-col :span="12">
            <div class="ys-detail__left">
              <span>
                <i class="iconfont icon-duanxin"></i>
              </span>
              <ns-button type="text" @click="onOpenSendSms(detail.ysAccount)" v-show="editable">发送测试短信</ns-button>
            </div>
            <div class="ys-detail__right">
              <el-form-item label="短信余额：">
                <el-form-grid>
                  <template v-if="!detail.smsLeftCount">-</template>
                  <template v-else>{{detail.smsLeftCount}}</template>
                </el-form-grid>
                <el-form-grid>
                  条
                </el-form-grid>
              </el-form-item>
              <el-form-item label="已发短信：">
                <el-form-grid>
                  <template v-if="!detail.smsTotalSendCount">-</template>
                  <template v-else>{{detail.smsTotalSendCount}}</template>
                </el-form-grid>
                <el-form-grid>
                  条
                </el-form-grid>
              </el-form-item>
              <el-form-item label="营销成本：">
                <el-form-grid v-if="!messageState">
                  <template v-if="!detail.clientSmsCharges">-</template>
                  <template v-else>{{detail.clientSmsCharges}}</template>
                </el-form-grid>
                <el-form-grid v-else size="xs">
                  <el-form-item  prop="clientSmsPrice" :rules="[{ type: 'number', message: '营销成本必须为数字值', trigger: ['blur', 'change']}]" >
                    <el-input type="number" v-model.number="detail.clientSmsPrice" class="text-right"></el-input>
                  </el-form-item>
                </el-form-grid>
                <el-form-grid>
                  元/条
                </el-form-grid>
                <el-form-grid>
                  <ns-button type="text" v-if="!messageState" @click="onEditPrice(1)" v-show="editable">修改</ns-button>
                  <ns-save v-else @click="onSavePrice" ></ns-save>
                  <ns-button type="text" v-if="messageState" @click="onClosePrice(1)">关闭</ns-button>
                </el-form-grid>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="ys-detail__left">
              <span>
                <i class="iconfont icon-caixin"></i>
              </span>
            </div>
            <div class="ys-detail__right">
              <el-form-item label="彩信余额：">
                <el-form-grid>
                  <template v-if="!detail.mmsLeftCount">-</template>
                  <template v-else>{{detail.mmsLeftCount}}</template>
                </el-form-grid>
                <el-form-grid>
                  条
                </el-form-grid>
              </el-form-item>
              <el-form-item label="已发彩信：">
                <el-form-grid>
                  <template v-if="!detail.mmsTotalSendCount">-</template>
                  <template v-else>{{detail.mmsTotalSendCount}}</template>
                </el-form-grid>
                <el-form-grid>
                  条
                </el-form-grid>
              </el-form-item>
              <el-form-item label="营销成本：">
                <el-form-grid v-if="!mmsState">
                  <template v-if="!detail.clientMmsCharges">-</template>
                  <template v-else>{{detail.clientMmsCharges}}</template>
                </el-form-grid>
                <el-form-grid v-else size="xs">
                  <el-form-item  prop="clientMmsPrice"  :rules="[{ type: 'number', message: '营销成本必须为数字值', trigger: ['blur', 'change']}]">
                  <el-input type="number" v-model.number="detail.clientMmsPrice" class="text-right"></el-input>
                  </el-form-item>
                </el-form-grid>
                <el-form-grid>
                  元/条
                </el-form-grid>
                <el-form-grid>
                  <ns-button type="text" v-if="!mmsState" @click="onEditPrice(2)" v-show="editable">修改</ns-button>
                  <ns-save v-else @click="onSavePrice" ></ns-save>
                  <ns-button type="text" v-if="mmsState" @click="onClosePrice(2)">关闭</ns-button>
                </el-form-grid>
              </el-form-item>
            </div>
          </el-col>
        <!--  <el-col :span="12">
            <div class="ys-detail__left">
              <span>
                <i class="iconfont icon-chaoxin"></i>
              </span>
            </div>
            <div class="ys-detail__right">
              <el-form-item label="超信余额：">
                <el-form-grid>
                  12312414
                </el-form-grid>
                <el-form-grid>
                  条
                </el-form-grid>
              </el-form-item>
              <el-form-item label="已发超信：">
                <el-form-grid>
                  12312414
                </el-form-grid>
                <el-form-grid>
                  条
                </el-form-grid>
              </el-form-item>
              <el-form-item label="营销成本：">
                <el-form-grid v-if="!superLetterState">
                  0.062
                </el-form-grid>
                <el-form-grid v-else size="xs">
                  <el-input value="0.062" class="text-right"></el-input>
                </el-form-grid>
                <el-form-grid>
                  元/条
                </el-form-grid>
                <el-form-grid>
                  <ns-button type="text" v-if="!superLetterState" @click="superLetterState = !superLetterState">修改</ns-button>
                  <ns-button type="text" v-else @click="superLetterState = !superLetterState">保存</ns-button>
                </el-form-grid>
              </el-form-item>
            </div>
          </el-col>-->
          <el-col :span="12">
            <div class="ys-detail__left">
              <span>
                <i class="iconfont icon-youjian"></i>
              </span>
              <ns-button type="text" @click="onOpenSendEmail(detail.ysAccount)" v-show="editable">发送测试邮件</ns-button>
            </div>
            <div class="ys-detail__right">
              <el-form-item label="邮件余额：">
                <el-form-grid>
                  <template v-if="detail.emailLeftCount === ''">-</template>
                  <template v-else>{{detail.emailLeftCount}}</template>
                </el-form-grid>
                <el-form-grid>
                  条
                </el-form-grid>
              </el-form-item>
              <el-form-item label="已发邮件：">
                <el-form-grid>
                  <template v-if="detail.emailTotalSendCount === ''">-</template>
                  <template v-else>{{detail.emailTotalSendCount}}</template>
                </el-form-grid>
                <el-form-grid>
                  条
                </el-form-grid>
              </el-form-item>
              <el-form-item label="营销成本：" >
                <el-form-grid v-if="!mailState">
                  <template v-if="!detail.clientEmailCharges">-</template>
                  <template v-else>{{detail.clientEmailCharges}}</template>
                </el-form-grid>
                <el-form-grid v-else size="xs">
                  <el-form-item prop="clientEmailPrice"  :rules="[{ type: 'number', message: '营销成本必须为数字值', trigger: ['blur', 'change']}]">
                    <el-input type="number" v-model.number="detail.clientEmailPrice"  class="text-right"></el-input>
                  </el-form-item>
                </el-form-grid>
                <el-form-grid>
                  元/条
                </el-form-grid>
                <el-form-grid>
                  <ns-button type="text" v-if="!mailState" @click="onEditPrice(3)" v-show="editable">修改</ns-button>
                  <ns-save v-else @click="onSavePrice" ></ns-save>
                  <ns-button type="text" v-if="mailState" @click="onClosePrice(3)">关闭</ns-button>
                </el-form-grid>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="onCloseDetail">关闭</ns-button>
      </span>
  </el-dialog>
    <el-dialog title="发送测试短信" :visible="sendSmsVisible"
               :close-on-click-modal = "false" :before-close="onCloseSendSmsDialog" width="450px">
      <el-form ref="smsForm" placement="right" label-width="120px" class="form-main" :model="testSendSms" :rules="smsRules">
        <el-form-item label="手机号：" prop="targetStr" required>
            <el-form-grid size="xmd">
              <el-input v-model="testSendSms.targetStr" placeholder="多手机号用逗号隔开"></el-input>
            </el-form-grid>
        </el-form-item>
        <el-form-item label="内容：" prop="send_content">
          <el-form-grid size="xmd">
            <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="testSendSms.send_content"></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="短信签名：" class = "el-inline-block" prop = "signature_name"  required>
          <el-form-grid size="xmd">
              <ns-select  v-model="testSendSms.signature_name"
                          :url = "$api.touch.smsSignature.querySignatureOption"
                          filterable  clearable
                          :placeholder="$t('prompt.select')" :multiple="false">
              </ns-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="选择通道：" prop = "sp_id"   required>
          <el-form-grid size="xmd">
              <ns-select ref="channelOption1" v-model="testSendSms.sp_id"
                         :url = "$api.touch.ysChannel.querySmsChannelOptionsByAcccount"
                         :params="{ysAccount:testSendSms.account}"
                         filterable  clearable
                         :placeholder="$t('prompt.select')" :multiple="false">
              </ns-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <ns-button @click = "onSendSms" type="primary">发送</ns-button>
          <ns-button @click = "onResetSms" >{{$t('operating.cancel')}}</ns-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="发送测试邮件" :visible="sendEmailVisible"
               :close-on-click-modal = "false" :before-close="onCloseSendEmailDialog">
      <el-form ref="testSendEmail" placement="right" label-width="120px" class="form-main" :model="testSendEmail" :rules="emailRules">
        <el-form-item label="发件人：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="send_name">
              <el-input type="text"
                        v-model.trim="testSendEmail.send_name"
                        placeholder="请输入发件人名称">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="发件地址：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="send_addr">
              <el-input type="text"
                        v-model.trim="testSendEmail.send_addr"
                        placeholder="请输入发件地址">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="收件人：" required>
          <el-form-grid size="xlg">
            <el-form-item prop="targetStr">
              <el-input type="textarea" v-model.trim="testSendEmail.targetStr"
                        placeholder="请输入收件人地址">
              </el-input>
            </el-form-item>
          </el-form-grid>
          <el-form-grid block class="text-info"><i class="el-icon-info"></i>请输入邮件地址，多个地址用“;”或“换行”隔开（每次限发100封）</el-form-grid>
        </el-form-item>
        <el-form-item label="邮件标题：" required>
          <el-form-grid size="xlg">
            <el-form-item prop="title_name">
              <el-input type="text"
                        v-model.trim="testSendEmail.title_name"
                        placeholder="请输入邮件标题">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item  label="邮件内容：" required>
          <el-form-grid class="el-block no-margin"  width="600px">
            <el-form-item prop="editor">
              <vue-ueditor-wrap :config="myConfig" v-model="testSendEmail.editor"  @ready="editorReady"></vue-ueditor-wrap>
            </el-form-item>
          </el-form-grid>
          <el-form-grid block class="text-info"><i class="el-icon-info"></i>请输入邮件内容且 <span class="text-warning">内容不能包含占位符！</span></el-form-grid>
        </el-form-item>

        <el-form-item label="选择通道："  required>
          <el-form-grid size="xmd">
            <el-form-item prop = "sp_id" >
              <ns-select v-model="testSendEmail.sp_id"
                         :url = "$api.touch.ysChannel.queryEmailChannelOptionsByAcccount"
                         :params="{ysAccount:testSendEmail.account}"
                         filterable  clearable
                         :placeholder="$t('prompt.select')" :multiple="false">
              </ns-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <ns-button type="primary" @click="onSendEmail">发送</ns-button>
          <ns-button @click="onResetEmail">{{$t('operating.cancel')}}</ns-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import index from './src/index'
import NsYsAccount from './NsYsAccount'
import VueUeditorWrap from 'vue-ueditor-wrap'

index.components = {
  VueUeditorWrap,
  NsYsAccount
}
export default index
</script>

<style scoped>
  @import "../../../../style/small/variables.pcss";
  @component-namespace ys {
    .el-checkbox{
      max-width:90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    @b detail {
      padding: var(--default-padding-base);
      border-top: 1px solid var(--theme-base-border-color-primary);
      >>> .el-col {
        position: relative;
        padding: var(--default-padding-base) 0;
      }
      @e left {
        position: absolute;
        top: 30%;
        left: 0;
        width: 110px;
        text-align: center;
        span {
          display: inline-block;
          width: 50px;
          height: 50px;
          line-height: 50px;
          border: 1px solid var(--theme-base-border-color-primary);
          border-radius: 50%;
          i {
            font-size: 30px;
          }
        }
      }
      @e right {
        margin-left: 110px;
        .el-form-item {
          margin-bottom: var(--default-margin-small);
          >>> .el-input__inner {
            text-align: right;
          }
        }
      }
    }
  }
</style>
