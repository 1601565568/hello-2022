<template>
  <div class="form-main" v-loading="loading" element-loading-text="正在加载......">
    <el-scrollbar ref="touchManageHeight" outsider>
      <el-form ref="form" label-width="150px" :model="model" :rules="rules">
        <el-form-item label="营销触达：" required>
          <el-form-grid>
            每客户每天最多发送
          </el-form-grid>
          <el-form-grid size="xxs">
            <el-form-item prop="marketing_sms_limit" required>
              <el-input type="number" v-model.number="model.marketing_sms_limit"></el-input>
            </el-form-item>
          </el-form-grid>
          <el-form-grid>
            条短信
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <el-form-grid>
            每客户每天最多发送
          </el-form-grid>
          <el-form-grid size="xxs">
            <el-form-item prop="marketing_email_limit" required>
              <el-input type="number" v-model.number="model.marketing_email_limit"></el-input>
            </el-form-item>
          </el-form-grid>
          <el-form-grid>
            条邮件
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <el-form-grid>
            每客户每天最多发送
          </el-form-grid>
          <el-form-grid size="xxs">
            <el-form-item prop="marketing_wechat_limit" required>
              <el-input type="number" v-model.number="model.marketing_wechat_limit"></el-input>
            </el-form-item>
          </el-form-grid>
          <el-form-grid>
            条微信模板消息
          </el-form-grid>
        </el-form-item>
        <el-form-item label="关怀触达：" required>
          <el-form-grid>
            每一种关怀任务向每客户每天最多发送
          </el-form-grid>
          <el-form-grid size="xxs">
            <el-form-item prop="touch_sms_limit" required>
              <el-input type="number" v-model.number="model.touch_sms_limit"></el-input>
            </el-form-item>
          </el-form-grid>
          <el-form-grid>
            条短信
            <span class="tmp-tips text-info"><i class="el-icon-info"></i>
              按照关怀类任务的优先级进行发送
            </span>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <el-form-grid>
            每一种关怀任务向每客户每天最多发送
          </el-form-grid>
          <el-form-grid size="xxs">
            <el-form-item prop="touch_email_limit" required>
              <el-input type="number" v-model.number="model.touch_email_limit"></el-input>
            </el-form-item>
          </el-form-grid>
          <el-form-grid>
            条邮件
            <span class="tmp-tips text-info"><i class="el-icon-info"></i>
              按照关怀类任务的优先级进行发送
            </span>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <el-form-grid>
            每一种关怀任务向每客户每天最多发送
          </el-form-grid>
          <el-form-grid size="xxs">
            <el-form-item prop="touch_wechat_limit" required>
              <el-input type="number" v-model.number="model.touch_wechat_limit"></el-input>
            </el-form-item>
          </el-form-grid>
          <el-form-grid>
            条微信模板消息
            <span class="tmp-tips text-info"><i class="el-icon-info"></i>
              按照关怀类任务的优先级进行发送
            </span>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="发件人：" prop="email_send_name" required>
          <el-form-grid  size="xmd">
            <el-input type="text"  v-model.trim="model.email_send_name"></el-input>
          </el-form-grid>
          <el-form-grid>
            <span class="tmp-tips text-info"><i class="el-icon-info"></i>
              默认的发件人
            </span>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="发件地址：" prop="email_send_address" required>
          <el-form-grid size="xmd">
            <el-input type="text"  v-model.trim="model.email_send_address"></el-input>
          </el-form-grid>
          <el-form-grid>
            <span class="tmp-tips text-info"><i class="el-icon-info"></i>
                为提高发送效率，请尽量使用企业邮箱
            </span>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="营销附加手机号：" prop="marketing_attach_phone">
          <el-form-grid size="xlg" class="form-textarea">
            <el-input type="textarea" :rows="4" placeholder="多手机号请用“，”逗号隔开" v-model="model.marketing_attach_phone"></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <el-form-grid class="block">
            <span class="tmp-tips text-info"><i class="el-icon-info"></i>
                营销活动的短信节点将向该手机号也发送一条短信
            </span>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="营销附加邮箱：" prop="marketing_attach_email">
          <el-form-grid size="xlg" class="form-textarea">
            <el-input type="textarea" :rows="4" placeholder="多邮箱请用“，”逗号隔开" v-model="model.marketing_attach_email"></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <el-form-grid class="block">
            <span class="tmp-tips text-info"><i class="el-icon-info"></i>
                营销活动的邮件节点将向该邮件地址也发送一封邮件
            </span>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <el-form-grid>
            <ns-save @click="onSave"></ns-save>
          </el-form-grid>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </div>
</template>
<script>
  import index from './src/index'
  export default index
</script>
