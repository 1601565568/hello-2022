<template>
  <div style="background-color: white">
    <ns-page-table v-if="status == 0">
      <!-- 按钮 -->
        <template slot="buttons">
          <ns-table-operate-button :buttons="_data._table.table_buttons"></ns-table-operate-button>
        </template>
    </ns-page-table>
    <el-scrollbar ref="integralRuleHeight" outsider>
      <el-form label-width="150px" ref="form" style="height: 800px">

        <!-- 会员招募码配置开始 -->
        <div class="form-grid">
          <div class="form-grid__title" style="margin-top: 10px;">| 会员招募码配置</div>
          <div class="form-grid__content" style="margin-left: -100px">
            <el-form-item size="xxs">
              <el-form-grid>
                <el-radio v-model="model.recruit_type" :label="0" :disabled="status===0" size="xxs">企业微信名片 </el-radio>
              </el-form-grid>
            </el-form-item>
            <el-form-item>
              <el-form-grid style="padding-left: 10px">
                招募时发送企业微信个人名片并添加为外部联系人，导购在聊天窗口发送注册开卡小程序，
                会员注册开卡成功后，同步到会员列表，导购可在企业微信上与会员互动进行关怀和营销推广。
              </el-form-grid>
            </el-form-item>

            <el-form-item>
              <el-form-grid>
                <el-radio v-model="model.recruit_type" :label="1" :disabled="status===0" size="xxs">微信公众号 </el-radio>

              </el-form-grid>
            </el-form-item>
            <el-form-item>
              <el-form-grid style="padding-left: 10px">
                招募时发送微信公众号名片，关注公众号完成注册开卡。微信公众号可自动推送关怀和营销推广。
              </el-form-grid>
            </el-form-item>

            <el-form-item >
              <el-form-grid>
                <el-radio v-model="model.recruit_type" :label="2" :disabled="status===0" size="xxs">会员注册开卡 </el-radio>
              </el-form-grid>
            </el-form-item>
            <el-form-item>
              <el-form-grid style="padding-left: 10px">
                招募时发送会员注册开卡二维码，直接完成开卡操作。
              </el-form-grid>
            </el-form-item>

          </div>
        </div>
        <!-- 会员招募码配置结束 -->

        <!-- 会员更换导购配置开始 -->
        <div class="form-grid" >
          <div class="form-grid__title" style="margin-top: 60px;">| 会员更换导购配置</div>
          <div class="form-grid__content" style="margin-left: -100px">
            <el-form-item size="xxs">
              <el-form-grid>
                会员可自主更换专属导购 :
                <el-radio v-model="model.change_type" @change="changeType()" :label="1" :disabled="status===0" size="xxs" style="margin-left: 15px">允许自主更换导购 </el-radio>
                <el-radio v-model="model.change_type" @change="changeType()" :label="0" :disabled="status===0" size="xxs">不允许自主更换导购 </el-radio>
              </el-form-grid>
            </el-form-item>

            <el-form-item size="xxs" v-if="model.change_type === 1">
              <el-form-grid>
                会员可自主更换专属导购的次数 :
                <el-select  v-model="model.limit_type" @change="limitTypeChange()" :disabled="status===0" placeholder="请选择" style="width:160px">
                  <el-option v-for="(types) in typeList" :label="types.label" :value="types.value" :key="types.value"></el-option>
                </el-select>
              </el-form-grid>
              <el-input v-model="model.change_num" style="width:100px" v-if="model.limit_type > 0" :disabled="status===0"></el-input>
            </el-form-item>
          </div>
        </div>
        <!-- 会员更换导购配置结束 -->

        <div v-if="status === 1" style="margin-top: 50px; margin-bottom: 250px; text-align: center;">
          <ns-button @click="reload()" >取消</ns-button>
          <ns-button type="primary" @click="onSave">确定</ns-button>
        </div>
      </el-form>
    </el-scrollbar>
  </div>
</template>
<script>
import index from './src/index'
export default index
</script>
<style>
.dialog_mian_topText p sapn{
  color:grey;
}
.dialog_mian_topText p{
  height: 30px;
  line-height: 30px;
}
.form-grid__title {
  font-size: 14px;
  padding: 10px 0 10px 10px;
  background-color: rgba(242, 242, 242, 1);
  font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
  font-weight: 700;
}
</style>
