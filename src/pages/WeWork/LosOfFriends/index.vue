<!--
 * @Descripttion: 好友流失
 * @Author: xiaotx
 * @Date: 2021-02-7 17:28:29
 * @LastEditors: yuye.huang
 * @LastEditTime: 2021-08-17 16:42:38
 -->
<template>
  <div>
    <div class="box">
      <div class="template-page__row-left">
          <AreaTree v-model='areaId' @input='onClickNode' />
      </div>
      <!-- 主列表 -->
      <div class="template-page__row-right">
        <ns-table-repeat-customer ref='table' @Reminder="Reminder"></ns-table-repeat-customer>
      </div>
    </div>
    <el-dialog custom-class='losOfriend' width="1000px" :modal-append-to-body='true' :append-to-body='true' @close='formCancel' :visible="hotVisible">
      <div slot="title" class="dialog-title">
        <span class="title-text">提醒设置</span>
        <span class="title-text1">固定时间提醒设置保存后隔日生效</span>
      </div>
      <el-form :rules="rules" ref="ruleForm" class="formLos" :model="form">
        <el-form-item label="导购被删除好友时" prop="delGuideNotify">
          <div class="switch_t">
            <el-switch
              inactive-color="#8C8C8C"
              v-model="form.delGuideNotify"></el-switch><span class="switch_btn">{{form.delGuideNotify? '通知': '不通知'}}</span>
              <template v-if="form.delGuideNotify">
                <el-checkbox-group :min='1' style="display: inline-block" v-model="delGuideNotifyObj.checkboxGroup" size="small">
                  <el-checkbox label="0">通知店长</el-checkbox>
                  <el-checkbox label="1">通知导购</el-checkbox>
                </el-checkbox-group>
                <div class="swich_open">
                  <span v-if="delGuideNotifyObj.delGuideRunType == 0" class="txt">提醒时间</span>
                  <el-form-item v-if="delGuideNotifyObj.delGuideRunType == 1"  class="txt" prop="delGuideSendTime">提醒时间</el-form-item>
                  <el-radio v-model="delGuideNotifyObj.delGuideRunType" label="0">实时提醒</el-radio>
                  <el-radio v-model="delGuideNotifyObj.delGuideRunType" label="1">固定时间提醒</el-radio>
                </div>
                <div v-if="+delGuideNotifyObj.delGuideRunType === 1" class="gdTime">
                  <el-time-picker
                    v-model="form.delGuideSendTime"
                    value-format='HH:mm:ss'
                    placeholder="请选择时间">
                  </el-time-picker>
                </div>
              </template>
          </div>
        </el-form-item>
        <el-form-item label="导购删除好友时" prop="delFriendNotify">
           <div class="switch_t">
            <el-switch
              inactive-color="#8C8C8C"
              v-model="form.delFriendNotify"></el-switch><span class="switch_btn">{{form.delFriendNotify? '通知': '不通知'}}</span>
              <template v-if="form.delFriendNotify">
                <el-checkbox-group :min='1' style="display: inline-block" v-model="delFriendNotifyObj.checkboxGroup" size="small">
                  <el-checkbox label="0">通知店长</el-checkbox>
                  <el-checkbox label="1">通知导购</el-checkbox>
                </el-checkbox-group>
                <div class="swich_open">
                  <span v-if="delFriendNotifyObj.delFriendRunType == 0" class="txt">提醒时间</span>
                  <el-form-item v-if="delFriendNotifyObj.delFriendRunType == 2" class="txt" prop="delFriendSendTime">提醒时间</el-form-item>
                  <el-radio v-model="delFriendNotifyObj.delFriendRunType" label="0">实时提醒</el-radio>
                  <el-radio v-model="delFriendNotifyObj.delFriendRunType" label="1">固定时间提醒</el-radio>
                </div>
                <div v-if="+delFriendNotifyObj.delFriendRunType === 1" class="gdTime">
                  <el-time-picker
                    v-model="form.delFriendSendTime"
                    value-format='HH:mm:ss'
                    placeholder="请选择时间">
                  </el-time-picker>
                </div>
              </template>
          </div>
        </el-form-item>
        <el-form-item label="好友退群时" prop="delChatRunType">
           <div class="switch_t">
            <el-switch
            inactive-color="#8C8C8C" v-model="form.delChatRunType"></el-switch>
            <span class="switch_btn switch_open_btn">{{form.delChatRunType? '通知': '不通知'}}</span>
            <span class="switch_txt"><i></i>好友退群时通知给群主</span>
            <template v-if="form.delChatRunType">
              <div class="swich_open">
                <el-form-item class="txt open_txt" prop="delChatSendTime">提醒时间</el-form-item>
                <el-time-picker
                  v-model="form.delChatSendTime"
                  value-format='HH:mm:ss'
                  placeholder="请选择时间">
                </el-time-picker>
              </div>
              <div class="switch_txt v_t"><i></i>统计昨日数据，合并提醒</div>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="formCancel">取消</ns-button>
        <ns-button type="primary" @click="formSave('ruleForm')">保存</ns-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsTableRepeatCustomer from './components/NsTableRepeatCustomer.vue'
import AreaTree from '@/components/NewUi/AreaTree'

export default {
  mixins: [tableMixin],
  name: 'welcomeCodeList',
  components: {
    NsTableRepeatCustomer,
    AreaTree
  },
  data () {
    return {
      id: '', // 如果是详情就有id
      areaId: '',
      hotVisible: false,
      form: {
        delGuideNotify: false, // 被删好友
        delFriendNotify: false, // 删除好友
        delChatRunType: false, // 好友退群
        delGuideSendTime: '', // 被删好友时间设置
        delFriendSendTime: '', // 删除好友时间设置
        delChatSendTime: '' // 好友退群时间设置
      },
      // 被删好友数据
      delGuideNotifyObj: {
        delGuideRunType: '0',
        checkboxGroup: ['0']
      },
      // 删除好友
      delFriendNotifyObj: {
        delFriendRunType: '0',
        checkboxGroup: ['0']
      },

      rules: {
        delGuideNotify: [
          { required: true, message: '请设置提醒时间', trigger: 'change' }
        ],
        delFriendNotify: [
          { required: true, message: '请设置提醒时间', trigger: 'change' }
        ],
        delChatRunType: [
          { required: true, message: '请设置提醒时间', trigger: 'change' }
        ],
        delGuideSendTime: [
          { required: true, message: '请设置提醒时间', trigger: 'change' }
        ],
        delChatSendTime: [
          { required: true, message: '请设置提醒时间', trigger: 'change' }
        ],
        delFriendSendTime: [
          { required: true, message: '请设置提醒时间', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 打开提醒设置
    Reminder () {
      this.hotVisible = true
      // 请求消息提醒数据
      this.findDefaultTask()
    },
    // 请求消息提醒数据
    async findDefaultTask () {
      let res = await this.$http.fetch(this.$api.weWork.weWorkCustomer.findDefaultTask)
      if (!res.success) return
      // eslint-disable-next-line camelcase
      const { id, del_guide_notify, del_guide_run_type, del_friend_notify, del_friend_run_type, del_chat_run_type, del_chat_send_time, del_friend_send_time, del_guide_send_time } = res.result
      this.id = id
      Object.assign(this.form, {
        // eslint-disable-next-line camelcase
        delGuideNotify: del_guide_run_type !== 999,
        // eslint-disable-next-line camelcase
        delFriendNotify: del_friend_run_type !== 999,
        // eslint-disable-next-line camelcase
        delChatRunType: del_chat_run_type !== 999,
        delGuideSendTime: del_guide_send_time, // 被删好友时间设置
        delFriendSendTime: del_friend_send_time, // 删除好友时间设置
        delChatSendTime: del_chat_send_time // 好友退群时间设置
      })
      // 被删好友数据
      Object.assign(this.delGuideNotifyObj, {
        delGuideRunType: String(del_guide_run_type),
        // eslint-disable-next-line camelcase
        checkboxGroup: del_guide_notify.split(',')
      })
      // 删除好友
      Object.assign(this.delFriendNotifyObj, {
        delFriendRunType: String(del_friend_run_type),
        // eslint-disable-next-line camelcase
        checkboxGroup: del_friend_notify.split(',')
      })
      console.log(this.delGuideNotifyObj, this.delFriendNotifyObj)
    },
    // 提醒设置取消
    formCancel () {
      this.hotVisible = false
    },
    // 提醒设置保存
    formSave (formName) {
      // 被删好友数据
      const { delGuideRunType, checkboxGroup } = this.delGuideNotifyObj
      // 删除好友
      const { delFriendRunType, checkboxGroup: checkboxGroups } = this.delFriendNotifyObj
      const { delGuideNotify, delFriendNotify, delChatRunType, delGuideSendTime, delFriendSendTime, delChatSendTime } = this.form
      let subObj = Object.assign({}, {
        id: this.id || null,
        delGuideNotify: delGuideNotify ? checkboxGroup.join(',') : 999, // 删除好友 通知店长
        delGuideRunType: delGuideNotify ? +delGuideRunType ? 1 : 0 : 999, // 删除好友 提醒时间 0提醒 1固定时间
        delGuideSendTime: delGuideNotify ? delGuideSendTime : '', // 被删好友时间设置（固定时间）
        delFriendNotify: delFriendNotify ? checkboxGroups.join(',') : 999, // 删除好友 通知店长
        delFriendRunType: delFriendNotify ? +delFriendRunType ? 1 : 0 : 999, // 删除好友 提醒时间
        delFriendSendTime: delFriendNotify ? delFriendSendTime : '', // 被删好友时间设置（固定时间）
        delChatNotify: delChatRunType ? 2 : 999, // 退群写死
        delChatRunType: delChatRunType ? delChatRunType ? 1 : 0 : 999,
        delChatSendTime: delChatRunType ? delChatSendTime : ''
      })
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = await this.$http.fetch(this.$api.weWork.weWorkCustomer.saveOrUpdateTask, subObj)
          if (res.success) {
            this.id ? this.$notify.success('设置成功') : this.$notify.success('修改成功')
            this.hotVisible = false
          } else {
            this.$notify.error(res.msg)
          }
        } else {
          return false
        }
      })
    },
    onClickNode () {
      console.log(this.areaId, 'areaIdareaIdareaId')
    }
  }
}
</script>

<style scoped>
@import "@theme/variables.pcss";
.box{
  display: flex;
}
  .template-page__row-left {
    position: relative;
    height: 100vh;
  }
  .template-page__row-right{
    overflow-x: hidden;
    margin-left: 16px;
    width:calc(100vw - 527px)
  }
.formLos{
  margin-top: 20px;
  .el-form-item{
    margin-bottom: 18px;
  }
}
.dialog-title{
  background: #FFFFFF;
  border-radius: 4px 4px 0px 0px;
  margin-top: 6px;
}
.title-text{
  display: inline-block;
  height: 24px;
  font-size: 16px;
  color: #303133;
  line-height: 24px;
  font-weight: bolder;
  margin-right: 7px;
  }
  .title-text1{
    display: inline-block;
    height: 20px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #595959;
    line-height: 20px;
    font-weight: 400;
  }
  .switch_t{
    margin-left: 140px;
    &:nth-child(2){
      margin-left: 132px;
    }
    &:nth-child(3){
      margin-left: 160px;
    }
    .el-checkbox{
      font-size: 14px;
      margin-right: 16px;
    }
  }
  .switch_btn{
    display: inline-block;
    font-size: 14px;
    color: #595959;
    margin-left: 8px;
    margin-right: 32px;
  }
  .switch_open_btn{
    margin-right: 0;
  }
  .switch_txt{
    display: inline-block;
    height: 20px;
    font-size: 12px;
    color: #595959;
    line-height: 20px;
    margin-left: 8px;
    i{
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #F2AA18;
      margin-right: 8px;
    }
  }
  .v_t{
    margin-left: 92px;
    margin-top: 4px;
  }
  .swich_open{
    margin-top: 12px;
    .txt{
      display: inline-block;
      width: 56px;
      height: 22px;
      font-size: 14px;
      color: #595959;
      line-height: 22px;
      font-weight: 400;
      margin-right: 22px;
    }
    .open_txt{
      margin-right: 36px;
    }
    .el-radio{
      margin-right: 16px;
    }
  }
  .gdTime{
    margin-left: 180px;
    margin-top: 8px;
  }
</style>
