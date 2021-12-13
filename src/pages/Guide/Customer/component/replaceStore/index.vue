<template>
    <el-dialog
        :visible.sync="dialogVisible"
        width="960px"
    >
        <div slot="title" class="checkNumberTitle">
            <span class="dialogtitle">{{title}}</span>
            <span class="number">已选会员{{checkNumberLength}}人</span>
        </div>
        <div class="replace-rule">
          更换规则：1、会员专属门店将更换为所选门店。2、会员将成为无专属导购会员。
        </div>
        <div class="flex">
            <el-form class="el_form" ref="table_filter_form" :model="departData" label-width="60px" :inline="true">
              <el-form-item>
                <el-form-grid><div>工作门店：</div></el-form-grid>
                <el-form-grid>
                  <ns-droptree ref="shopCateTree" placeholder="请选择门店分类" :lazy="true" :load="loadShopAreaNode" :multiple="false" v-model="departData.shopArea" clearable></ns-droptree>
                </el-form-grid>
              </el-form-item>
              <el-form-item>
                <el-select v-model="departData.value" filterable placeholder="选择门店">
                  <el-option
                    v-for="item in departData.shopOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="门店类型："  style="margin-left: 10px;" label-width="75px">
                 <el-select v-model="departData.shopType" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-form>
          <div>
            <ns-button type="primary" @click="searchAction()">搜索</ns-button>
            <ns-button @click="resetInputAction()">重置</ns-button>
          </div>
        </div>
        <el-table
          ref="table"
          :data="_data._table.data"
          :element-loading-text="$t('prompt.loading')"
          v-loading.lock="_data._table.loadingtable">
          <el-table-column width="150">
            <template slot-scope="scope">
              <div class="customerManage">
                <el-radio :label="scope.row.shopId" v-model="shopId">
                  <span></span>
                </el-radio>
              </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="shop_name" label="店铺名称" align="left"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="shopType" label="门店类型" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.shopType  === 'ZYD'">直营店</span>
              <span v-if="scope.row.shopType  === 'JMD'">加盟店</span>
              <span v-if="scope.row.shopType  === 'C'">淘宝店</span>
              <span v-if="scope.row.shopType  === 'B'">天猫店</span>
              <span v-if="scope.row.shopType  === ''">-</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                      :page-sizes="_data._pagination.sizeOpts"
                      :total="_data._pagination.total"
                      :current-page.sync="_data._pagination.page"
                      :page-size="_data._pagination.size"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="$sizeChange$"
                      @current-change="$pageChange$">
      </el-pagination>
        <span
            slot="footer"
            class="dialog-footer"
        >
            <ns-button @click="close()">取 消</ns-button>
            <ns-button
                type="primary"
                @click="onSave()"
            >确 定</ns-button>
        </span>
    </el-dialog>
</template>
<script>
import index from './src/index'
export default index
</script>
<style scoped lang='scss'>
  .checkNumberTitle {
    height: 30px;
    display: flex;
    align-items: center;
    .dialogtitle {
      font-size: 16px;
      color: #303133;
      display: inline-block;
      margin-right: 16px;
      font-weight: bold;
    }
    .number {
      font-size: 14px;
      color: #595959;
    }
  }
  .replace-rule {
    padding: 0 16px;
    margin-bottom: 16px;
    background: #F2F9FE;
    border-radius: 2px;
    height: 40px;
    line-height: 40px;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    padding-right: 15px;
  }
  // .customerManage {
  //   color:transparent
  // }
  /* 去掉更换导购列表弹框单选组多余数字 */
  .customerManage >>> .el-radio__label {
    display: none!important;
  }
</style>
