<!--
 * @Descripttion: 重复好友
 * @Author: xiaotx
 * @Date: 2021-02-7 17:28:29
 * @LastEditors: xiaotx
 * @LastEditTime: 2021-02-7 17:28:29
 -->
<template>
  <div>
    <!-- 主列表 -->
    <ns-table-repeat-customer ref='table' @onRedactFun="onRedactFun"></ns-table-repeat-customer>
    <!-- 查看导购详情开始-->
    <el-dialog title="详情" :visible.sync="RepeatCustomerShow" width="600px" class="detail-dialog">
      <div class="detail-dialog__content">
        <div class="detail-rightside">
        </div>
        <el-form label-width="90px" class="detail-leftside">
          <el-form-item >
            <el-form-grid>
              <el-image
                :width="84" :height="84"
                :src="guide.avatar ? guide.avatar : require('@/icons/fill/shangjiatouxiang.svg')"
                mode="cover" :circle="true" class="detail-rightside__img"></el-image>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="昵称：" >
            <el-form-grid>
              <span>{{guide.name}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="性别：">
            <el-form-grid>
              <span>{{guide.gender}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <el-form-grid>
              <el-table ref="table" :data="shopFindLists" stripe
                        resizable v-loading.lock="_data._table.loadingtable"
                        :element-loading-text="$t('prompt.loading')" >
                <el-table-column label="所属员工" align="left" >
                  <template slot-scope="scope">
                    {{scope.row.name}}
                  </template>
                </el-table-column>
                <el-table-column label="员工门店" width="250">
                  <template slot-scope="scope">
                    {{scope.row.shop_name}}
                  </template>
                </el-table-column>
                <el-table-column label="添加时间" width="200">
                  <template slot-scope="scope">
                    {{scope.row.add_time}}
                  </template>
                </el-table-column>
              </el-table>
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="cleanGuide">关闭</ns-button>
      </div>
    </el-dialog>
    <!--  查看导购详情结束 -->
  </div>
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsTableRepeatCustomer from './components/NsTableRepeatCustomer.vue'
import ElImage from '@nascent/nui/lib/image'

export default {
  mixins: [tableMixin],
  name: 'welcomeCodeList',
  components: {
    NsTableRepeatCustomer,
    ElImage
  },
  data () {
    return {
      RepeatCustomerShow: false,
      channelList: [],
      shopList: [],
      guide: {},
      shopFindLists: []
    }
  },
  methods: {
    // 打开员工详情页
    onRedactFun (row) {
      if (row) {
        this.RepeatCustomerShow = true
        this.guide = row
        this.getGuideExtShop(row.external_user_id)
      }
    },
    // 打开员工详情页，异步显示员工门店列表数据
    async getGuideExtShop (id) {
      let tableConfig = this._data._table
      var _this = this
      tableConfig.loadingtable = true
      _this.$http.fetch(_this.$api.weWork.weWorkCustomer.getRepeatGuideList, { id: id }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindLists = resp.result
        }
      }).catch((resp) => {
        return resp
      }).finally(() => {
        tableConfig.loadingtable = false
      })
    },
    // 关闭详情弹窗
    cleanGuide (e) {
      this.RepeatCustomerShow = false
      this._data._table.loadingtable = false
      this.guide = {}
      this.shopFindLists = []
    }
  }
}
</script>
