<template>
  <div>
    <page-edit>
      <template slot='header'>
        <div class='common-header flex-box'>
          <h3>支付配置</h3>
          <div class='common-btn'>
            <ns-button class='customer-btn_save' type="primary" size='large' @click='update' :loading='btnLoad'>新增授权</ns-button>
          </div>
        </div>
      </template>
      <template slot='content'>
        <el-row>
          <el-col :span='8' class='card-warrper'>
            <div class='card-content'>
              <template v-for='item in mapItem'>
                <div class='card-item' :key='item.key'>
                  <div class='card-key'><span class='key-name'><span v-if='item.isRequire' class='red-point'>*</span>{{item.name}}</span></div>
                  <div class='card-value'>{{item.value}}</div>
                </div>
              </template>
              <ns-button class='fix-btn'>修改</ns-button>
            </div>
          </el-col>
        </el-row>
      </template>
    </page-edit>
    <el-drawer
      :modal='false'
      size='50%'
      @close='handleClose'
      :visible.sync="drawer"
      :with-header="false">

    </el-drawer>
  </div>
</template>
<script>
import Index from './src/index'
import PageEdit from '@/components/NewUi/PageEdit'
Index.components = {
  PageEdit
}
export default Index
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.card-warrper {
  padding: 0 8px;
  .card-content {
    background-color: #fff;
    border-radius: 5px;
    padding: 17px 0;
    overflow: hidden;
    .card-item {
      height: 52px;
      display: flex;
      margin-bottom: 4px;
      align-items: center;
      .card-key {
        font-size: 14px;
        line-height: 22px;
        color: #595959;
        width: 102px;
        text-align: right;
        .key-name {
          position: relative;
          .red-point {
            font-size: 14px;
            color: #D63102;
          }
        }
      }
      .card-value {
        font-size: 12px;
        color: #595959;
        line-height: 20px;
        margin-left: 36px;
      }
    }
    .fix-btn {
      float: right;
      margin-right: 16px;
    }
  }
}

</style>
