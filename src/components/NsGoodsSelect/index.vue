<template>
  <!-- 选择商品结果列表 列表展开收缩切换结构-->
  <div>
    <ns-toggles :max-height="180">
      <el-row class="tmp-choose">
        <el-col :span="24">
          <div class="tmp-choose__title">
            <ns-button type="primary" @click="onShow"><i class="bui-select-goods"></i>选择商品</ns-button>
            <span class="total">已选择<b class="text-danger padding-lr-base">{{confirmData.length}}</b>件商品</span></div>
          <el-form-grid size="xlg" v-show="confirmData.length>0">
          <ul class="tmp-choose__goods">
            <li v-for="(item,index) in confirmData">
              <span class="g-name">{{item[props.name]}}</span>
              <a  @click="onDelSelected('confirmData',index,item[props.unique]), callbackData()" class="delete-icon">
              <i class="g-delete el-icon-delete"></i>
              </a>
            </li>
          </ul>
          </el-form-grid>
        </el-col>
      </el-row>
    </ns-toggles>
    <ns-goods-select-dialog ref="goods"
                            :props="props"
                            :max-select-count="maxSelectCount"
                            @change="dataChange"
                            :shop-ids="shopIds"
                             v-model="confirmData"
                            :table-api="tableApi">
    </ns-goods-select-dialog>
  </div>
</template>

<script>
import NsToggles from '../NsToggles'
import NsGoodsSelectDialog from '../NsGoodsSelectDialog'

export default {
  components: {
    NsGoodsSelectDialog,
    NsToggles
  },
  name: 'NsGoodsSelect',
  data () {
    return {
      confirmData: this.value || []
    }
  },
  props: {
    props: {
      type: Object,
      default: function () {
        return {
          unique: 'sysGoodsId',
          data: 'data',
          name: 'title'
        }
      }
    },
    maxSelectCount: {
      type: Number,
      default: function () {
        return 500
      }
    },
    tableApi: {
      type: Object,
      default: function () {
        return this.$api.core.common.queryGoodsTable4Component
      }
    },
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    shopIds: String,
    show: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  methods: {
    /**
       *  删除已选择
       */
    onDelSelected: function (dataName, index, unique) {
      this.$refs.goods.onDelSelected(dataName, index, unique)
    },
    callbackData: function () {
      this.$refs.goods.callbackData()
    },
    onShow: function () {
      if (this.show) {
        this.$refs.goods.onShow()
      }
    },
    dataChange: function (val) {
      this.confirmData = val
      this.$emit('input', val)
    }
  },
  watch: {
    value: function (val) {
      this.confirmData = JSON.parse(JSON.stringify(val))
    }
  }
}
</script>

<style scoped>
  @import "../../style/small/variables.pcss";
  >>> .tmp-toggles{
    margin-top:0 !important;
  }
  .tmp-choose__goods{
    margin-top:5px;
    list-style: none;
    font-size: 12px;
    padding:var(--default-padding-base);
    background: var(--default-table-tr-hover);
    li{
      line-height:20px;
      display: flex;
      flex-wrap: nowrap;
      padding:0 3px;
      .delete-icon{
        padding: 3px 5px;
        position: relative;
        top: -3px;
        &:hover{
          color:var(--theme-color-warning);
        }
      }
      .g-name{
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

  }
</style>
