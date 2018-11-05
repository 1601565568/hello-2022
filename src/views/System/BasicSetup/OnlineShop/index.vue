<template>
  <div>
    <ns-table-online-shop ref="table" @open-dialog="onOpenDialog"></ns-table-online-shop>
    <el-dialog :title="dialogTitle" :visible="onlineDialogVisible"
             :close-on-click-modal = "false" :before-close="onCloseOnline" width="55%">
    <div class="form" v-loading="loading" element-loading-text="数据保存中...">
      <el-form label-width="120px" ref='onlineForm' class="form-main" :model="onlineModel" :rules="onlineRules">
        <el-form-item class='edit-form' label="店铺名称：" prop='shopName'>
          <el-form-grid size="xmd">
            <el-input v-model.trim="onlineModel.shopName" placeholder='店铺名称'></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="所属渠道：" prop = "channels"  >
          <el-form-grid size="xmd">
              <ns-select  v-model="onlineModel.channels" multiple filterable clearable :placeholder="$t('prompt.select')"
                          :url="$api.core.channel.queryOptionChannel">
              </ns-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="所属平台：" prop="platform" >
          <el-form-grid  size="xmd">
              <ns-select v-model="onlineModel.platform" filterable clearable :placeholder="$t('prompt.select')"
                         :url="$api.core.common.queryPlatForm" >
              </ns-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="关联品牌："  prop = "brands"   >
          <el-row>
            <el-checkbox-group v-model="onlineModel.brands">
              <el-col :span="8"  v-for="brand in brandOptions" :key="brand.value">
                <el-checkbox :label="brand.value" >{{brand.label}}
                </el-checkbox>
              </el-col>
            </el-checkbox-group>
          </el-row>
        </el-form-item>
        <el-form-item label="备注：" prop='remark' class="el-form-validate__unHide">
          <el-form-grid width="580">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入内容" v-model.trim="onlineModel.remark">
            </el-input>
          </el-form-grid>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseOnline">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSubmitOnline" ></ns-save>
    </div>
  </el-dialog>
  <!--功能暂时不要该功能，页面先保留-->
  <!--<el-dialog title="批量关联品牌" :visible="batchBrindVisiable"
             :close-on-click-modal = "false" :before-close="onCloseBind">
    <div class="form" v-loading="loading" element-loading-text="数据保存中...">
      <el-form label-width="120" ref='bindForm' class="form-main" :model="bindBrandModel" :rules="bindRules">
        <el-form-item label="店铺名称">
          <el-row>
            <span :span="8"  v-for="shopName in bindBrandModel.shopNames" :key="shopName">
              {{shopName}}
            </span>
          </el-row>
        </el-form-item>
        <hr/>
        <el-form-item prop="brands">
          <el-row >
            <el-checkbox-group v-model="bindBrandModel.brands">
              <el-col :span="8"  v-for="brand in brandOptions" :key="brand.value">
                <el-checkbox :label="brand.value" >{{brand.label}}
                </el-checkbox>
              </el-col>
            </el-checkbox-group>
          </el-row>
        </el-form-item>
        <el-form-item>
          <ns-button @click="onCloseBind">{{$t('operating.cancel')}}</ns-button>
          <ns-save @click=""></ns-save>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>-->
  </div>
</template>

<script>
  import index from './src/index'
  import NsTableOnlineShop from './NsTableOnlineShop'
  index.components = {
    NsTableOnlineShop
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
