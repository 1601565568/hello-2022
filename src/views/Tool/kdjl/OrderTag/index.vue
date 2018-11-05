<template>
  <div class="template-page">
     <ns-table-order ref="order" @add="add"></ns-table-order>
    <!--添加短语-->
    <el-dialog title="新增订单标签" :visible.sync="visible"
               :close-on-click-modal = "false" :before-close="onClose" width="650px" height="350px">
          <el-form label-width="100px" style="padding-top: 3px;" ref="form" :model="model" :rules="rules">
            <el-form-item label="店铺：" class = "el-inline-block" required>
              <el-form-grid size="xmd">
                <el-form-item prop = "shop_id" >
                  <el-select v-model="model.shop_id" :placeholder="$t('prompt.select')">
                    <el-option v-for="item in shops" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-form-grid>
            </el-form-item>

            <el-form-item label="标签类型：" required>
              <el-form-grid size="xmd">
                <el-form-item prop = "trade_tag_type" >
                  <el-select v-model="model.trade_tag_type" filterable placeholder="请选择" @change="change">
                    <el-option label="其他" value="0"></el-option>
                    <el-option label="预售" value="1"></el-option>
                    <el-option label="赠品" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-form-grid>
            </el-form-item>


            <el-form-item label="标签名称：" prop="trade_tag_name" required>
              <el-form-grid size="xmd">
                <el-input type="text" v-model.trim="model.trade_tag_name" placeholder="请输入标签名称" :disabled="model.trade_tag_type != 0"> </el-input>
              </el-form-grid>
            </el-form-item>

            <template v-if="model.trade_tag_type == '0'">
              <el-form-item label="标签内容：" prop="trade_tag_content">
                <el-form-grid size="xmd">
                  <el-form-item>
                    <el-input type="textarea" ref="classPhrase" :rows="6" v-model.trim="model.trade_tag_content" placeholder="请输入标签内容" > </el-input>
                  </el-form-item>
                </el-form-grid>
              </el-form-item>
            </template>

            <template v-else-if="model.trade_tag_type == '1'">
              <el-form-item label="预售商品：" prop="selectShop" required>
                <el-form-grid size="xmd">
                  <el-form-item>
                    <ns-goods-select v-model="model.selectShop" @click.native="shopItem" :shop-ids="model.shop_id" :show="model.shop_id ? true : false"></ns-goods-select>
                  </el-form-item>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="预发售时间："  required>
                <el-form-grid size="xmd">
                  <el-form-item prop="saleTime">
                    <el-date-picker v-model="model.saleTime" type="datetime" placeholder="选择预发售时间" :picker-options="pickerOptions"></el-date-picker>
                  </el-form-item>
                </el-form-grid>
              </el-form-item>
            </template>

            <template v-else>
                <el-form-item label="赠送设置：" size="xxlg" required prop="giftList">
                  <template v-for="(gift,index) of model.giftList">
                  <el-form-grid>
                    <el-form-item class="el-inline-block">
                      <el-form-grid size="xmd">
                      <el-input type="text" v-model.trim="gift.name" placeholder="赠品名称"> </el-input>
                      </el-form-grid>
                    </el-form-item>
                    <el-form-item class="el-inline-block">
                      <el-form-grid size="xs">
                        <el-input type="text" v-model.trim="gift.code" placeholder="商家编码"> </el-input>
                      </el-form-grid>
                    </el-form-item>
                    <el-form-item class="el-inline-block">
                      <el-form-grid size="xxs">
                        <el-input  v-model.number="gift.num" type="number" placeholder="件数"> </el-input>
                      </el-form-grid>
                    </el-form-item>
                    <el-form-item class="el-inline-block">
                      <el-form-grid size="xs">
                        <el-input type="text" v-model.trim="gift.remark" placeholder="备注"> </el-input>
                      </el-form-grid>
                    </el-form-item>
                    <el-form-item class="el-inline-block">
                      <el-form-grid>
                        <ns-button type="text" @click="delGift(index)" v-if="index > 0">
                          <i class="el-icon-remove"></i>
                        </ns-button>
                      </el-form-grid>
                    </el-form-item>
                    <el-form-item class="el-inline-block" v-if="index == model.giftList.length-1">
                      <el-form-grid>
                        <ns-button type="text" @click="addGift()">
                          <i class="el-icon-circle-plus"></i>
                        </ns-button>
                      </el-form-grid>
                    </el-form-item>
                  </el-form-grid>
                  </template>
                </el-form-item>
            </template>
          </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onClose()">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSave()" :loading="loading"></ns-save>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import index from './src/index'
  import NsTableOrder from './NsTableOrder'
  import NsGoodsSelect from 'components/NsGoodsSelect'
  index.components = {
    NsTableOrder,
    NsGoodsSelect
  }
  export default index
</script>
