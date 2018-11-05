<template>
  <div>
  <ns-table-offline-shop ref="table" @open-dialog="onOpenDialog"></ns-table-offline-shop>

  <!-- 新增线下店铺start -->
   <el-dialog  :title="dialogTitle" :visible="offlineDialogVisible" :modal-append-to-body="false"
             :close-on-click-modal = "false" :before-close="onCloseOffline" width="55%">
     <div class="form" v-loading="loading" element-loading-text="数据保存中...">
      <el-form label-width="120px" ref='offlineForm' class="form-main" :model="offlineModel" :rules="offlineRules">
        <!--
        <el-form-item class='edit-form' label="店铺名称：" prop='shopName' >
          <el-form-grid size="lg">
            <el-input v-model="offlineModel.shopName" placeholder='输入店铺名称，最多50个字'></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="所属渠道：" prop = "channels" >
          <el-form-grid size="lg">
            <el-form-item >
              <ns-select  v-model="offlineModel.channels" multiple filterable clearable :placeholder="$t('prompt.select')"
                          :url="$api.core.channel.queryOptionChannel">
              </ns-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="开业时间："  prop="openShopTime">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="offlineModel.openShopTime"
                            value-format='yyyy-MM-dd' style="width: 300px" ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item class='edit-form' label="营业时间：" prop='businessTimeSpan'>
          <el-form-grid size="lg">
            <el-input v-model="offlineModel.businessTimeSpan" placeholder='营业时间'></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item class='edit-form' label="联系电话："   v-model="offlineModel.contactJson"  >
          &lt;!&ndash;prop='contact'&ndash;&gt;
          <el-form-item v-for="(contact, index) in offlineModel.contacts" :key="index">
            <el-form-grid width="84">
              <el-select v-model="contact.type">
                <el-option label="电话"  :value="0"></el-option>
                <el-option label="手机"  :value="1"></el-option>
              </el-select>
            </el-form-grid>
            <el-form-grid width="180">
              <el-input type="text" v-model="contact.contact" @blur="handleVerify(index,contact)" typeof="info"></el-input>
            </el-form-grid>
            <el-form-grid>
              <ns-button v-if="offlineModel.contacts.length-1 === index" type="text"
                         @click="onHandleAddContact"><i class="el-icon-circle-plus"></i></ns-button>
              <ns-button v-else type="text" @click="onHandleDelContact(index)"><i class="el-icon-delete"></i></ns-button>
            </el-form-grid>
          </el-form-item>
        </el-form-item>
        <el-form-item class='edit-form'  label="营业状态：" prop='shopStatus' >
          <el-form-grid size="lg">
            <el-radio-group v-model="offlineModel.shopStatus">
              <el-radio :label="1">正常营业</el-radio>
              <el-radio :label="-1">暂停营业</el-radio>
              <el-radio :label="-2">已关店</el-radio>
            </el-radio-group>
          </el-form-grid>
        </el-form-item>
        <el-form-item class='edit-form'  label="店铺类型：" prop='shopType' >
          <el-form-grid size="lg">
            <el-radio-group v-model="offlineModel.shopType">
              <el-radio :label="'ZYD'">直营</el-radio>
              <el-radio :label="'JMD'">加盟</el-radio>
            </el-radio-group>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="关联品牌："  prop='brands' class="el-form-validate__box">
          <el-row>
            <el-checkbox-group v-model="offlineModel.brands">
              <el-col :span="8"  v-for="brand in brandOptions" :key="brand.value">
                <el-checkbox :label="brand.value">{{brand.label}}
                </el-checkbox>
              </el-col>
            </el-checkbox-group>
          </el-row>
        </el-form-item>

        <el-form-item label="所在区域：" style="margin-right:0;" prop="area">
            <el-form-grid width="300" >
              <ns-area  :props="key" @change="onChange" v-model="area"></ns-area>
            </el-form-grid>
          </el-form-item>

        <el-form-item class='edit-form' label="详细地址："  prop='address'>
          <el-form-grid width="300">
            <el-input v-model="offlineModel.address" placeholder='请输入店铺详细地址'></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item class='edit-form' label="经纬度：" v-if="offlineModel.id > 0">
          <el-form-grid width="145">
            <el-form-item  prop='longitude'>
            <el-input v-model="offlineModel.longitude" placeholder='经度'></el-input>
            </el-form-item>
          </el-form-grid>
          <el-form-grid width="145">
            <el-form-item  prop='latitude'>
            <el-input v-model="offlineModel.latitude"  placeholder='纬度'></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
-->
        <el-form-item class='edit-form' label="微商城下单：" prop='method'>
          <el-checkbox-group v-model="offlineModel.deliverMethod">
            <el-col :span="4">
              <el-checkbox :label="1" @change="sendChange">配送</el-checkbox>
              <el-checkbox :label="2" >自提</el-checkbox>
            </el-col>
          </el-checkbox-group>
          <el-form-grid width="150" v-if="offlineModel.sendMethod > 0">
            <el-form-item  prop='postage'>
              <el-input v-model="offlineModel.postage"  type="number" placeholder='运费'></el-input>
            </el-form-item>
          </el-form-grid>
          <el-form-grid width="150" v-if="offlineModel.sendMethod > 0">
            <el-form-item>
              元
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <!--<el-form-item class='edit-form' label="首单优惠：" prop='firstOrderPreferential' >
          <el-form-grid size="lg">
            <el-input v-model="offlineModel.firstOrderPreferential" type="number" placeholder='请输入优惠金额'></el-input>
          </el-form-grid>
        </el-form-item>-->
    <!--
        <el-form-item class='edit-form' label="备注：" prop='remark'>
          <el-form-grid width="580">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入内容" v-model="offlineModel.remark">
            </el-input>
          </el-form-grid>
        </el-form-item>
        -->
      </el-form>
    </div>
     <div slot="footer" class="dialog-footer">
       <ns-button @click="onCloseOffline">{{$t('operating.cancel')}}</ns-button>
       <ns-save @click="onSaveOffline" ></ns-save>
     </div>
  </el-dialog>
  </div>
</template>
<script>
import index from './src/index'
import NsTableOfflineShop from './NsTableOfflineShop'
import NsArea from 'components/NsArea'

index.components = {
  NsTableOfflineShop,
  NsArea
}
export default index
</script>
<style scoped>
  @import "../../../../style/small/variables.pcss";
  @component-namespace shop {
    .el-checkbox {
      max-width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
