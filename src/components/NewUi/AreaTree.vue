<template>
  <div class="">
    <el-input ref="quickText" v-model="shopTreePage.areaName" placeholder="请输入区域名称" clearable
              @keyup.enter.native="initDigitalShopList(1)">
      <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name"
            @click="initDigitalShopList(1)"/>
    </el-input>
    <el-scrollbar ref='pageLeft' wrapStyle="overflow-x:hidden;" style="padding-bottom: 10px" >
      <el-tree
        class="filter-tree"
        ref="shopTree"
        :data="digitalShopList"
        highlight-current
        node-key="id"
        :show-checkbox="false"
        :default-expand-all="false"
        :expand-on-click-node="false"
        :current-node-key="areaId"
        :default-expanded-keys="[areaId]"
        :filter-node-method="onFilterNode"
        :render-content="renderNode"
        @node-click="onClickNode"
      >
        <div class="subdivision-tree-node" slot-scope="{ node }">
          <span>{{node.label}}</span>
          <span v-if="node.label === '全部'">
          <el-tooltip content="查看所有的线下门店">
              <i class="question-circle"><Icon type="question-circle" /></i>
          </el-tooltip>
        </span>
        </div>
      </el-tree>
    </el-scrollbar>
    <el-pagination style='text-align: center' small
                    :total="shopTreePage.total"
                    :page-size="shopTreePage.size"
                    layout="prev, slot, next, jumper"
                    :current-page.sync="shopTreePage.page"
                    @current-change="initDigitalShopList">
      <span>{{shopTreePage.page + '/' + (Math.ceil(shopTreePage.total/ shopTreePage.size) || 1)}}</span>
    </el-pagination>
  </div>
</template>
<script>
export default {
  data () {
    return {
      shopTreePage: {
        total: 0,
        page: 1,
        size: 50,
        areaName: ''
      },
      digitalShopList: [],
      areaId: '',
      areaName: ''
    }
  },
  methods: {
    // 区域列表
    initDigitalShopList (page) {
      this.shopTreePage.page = page || 1
      var _this = this
      this.$http
        .fetch(_this.$api.guide.shop.findDigitalShopList, {
          start: (this.shopTreePage.page - 1) * this.shopTreePage.size,
          length: this.shopTreePage.size,
          searchMap: {
            areaName: this.shopTreePage.areaName
          }
        })
        .then(resp => {
          if (resp.success && resp.result !== null) {
            this.shopTreePage.total = Number(resp.result.recordsTotal)
            this.digitalShopList = resp.result.data
            this.model.areaId = this.digitalShopList[0].id
            this.model.areaName = this.digitalShopList[0].label
            this.$searchAction$()
          }
        })
        .catch(resp => {
          _this.$notify.error(getErrorMsg('查询失败', resp))
        })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
