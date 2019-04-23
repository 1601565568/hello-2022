<template>
  <div class="template-page">
    <div class="template-page__row">
      <div class="template-page__row-right">
        <shop-goods-table ref="table" @add="showAddDialog" @edit="editGoods"></shop-goods-table>
      </div>
    </div>
    <div>
      <sg-goods-Select ref="goods" v-model="goodsInfo" :show-btn ="false" @change="addShopGoods"></sg-goods-Select>
    </div>
    <el-dialog ref="editDialog" :width="width"
        title="修改商品库存及售价" :visible.sync="dialogVisible">
        <div style="margin-left: 20px">
          <div style="color: grey">门店：{{shopName}}</div>
          <div>
            <span style="color: grey">商品：{{formData.title}}</span>
          </div>
          <div v-if="formData.skuCount == 0"><span style="color: grey">建议零售价：</span>￥{{formData.price}}</div>
        </div>
        <div v-if="formData.skuCount == 0">
          <el-form ref="form" label-width="120px" class="form-main" :model="formData" :rules="rules">
            <el-form-item label="售价：" required>
              <el-form-grid size="xmd">
                <el-form-item prop="sales_price">
                  <el-input type="number" v-model="formData.sales_price"><span slot="append">元</span></el-input>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="库存：" required>
              <el-form-grid size="xmd">
                <el-form-item prop="stock">
                  <el-input type="number" v-model="formData.stock"></el-input>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          <el-table ref="skuTable" :data="skuList" class="template-table__main"
                    stripe resizable :element-loading-text="$t('prompt.loading')">
            <el-table-column prop="name" label="sku属性" show-overflow-tooltip width="140"></el-table-column>
            <el-table-column prop="price" label="建议零售价（元）" align="center"></el-table-column>
            <el-table-column label="售价（元）" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sales_price"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="库存" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.stock"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="sales_count" label="销量" align="center" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
        <ns-button @click="dialogVisible = false">取 消</ns-button>
        <ns-save @click="onSave"></ns-save>
      </span>
      </el-dialog>
  </div>
</template>

<script>
import ShopGoodsTable from './ShopGoodsTable'
import SgGoodsSelect from '../components/SgGoodsSelect'
import ShopGoodsIndex from './src/ShopGoodsIndex'
ShopGoodsIndex.components = { ShopGoodsTable, SgGoodsSelect }
export default ShopGoodsIndex
</script>
<style scoped>
</style>
