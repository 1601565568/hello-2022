
<template>
<!-- 新增素材--编辑弹窗  wanrengang 20180731 -->
<div class="selectMarketbox">
  <el-dialog
  title="选择商品"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="800px"
  :before-close="handleClose">
    <div class="template-table">
      <div class="template-table-search">
        <div class="template-table__bar-more">
          <el-form ref="searchform" label-width="80px"  class="surround-btn" :model="searchObj.searchMap"  :inline="true">
            <!-- <el-form-item label="活动类型：" prop="title">
              <el-select v-model="searchObj.searchMap.title" placeholder="请选择商品分类" clearable>
                <el-option v-for="item in groudList"
                :key="item.type"
                :label="item.name"
                :value="item.type">
                </el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-tree class="filter-tree tmp-droptree-tree" ref="subTree" :data="treeData" :props="defaultProps"  default-expand-all :filter-node-method="onFilterNode"
                     node-key="id" highlight-current :expand-on-click-node="false"
                     @node-collapse="onCloseNode" @node-click="onClickNode">
              <div class="subdivision-tree-node" slot-scope="{ node, data }" @mouseover="onNodeHover(node,data)"  @mouseout="onNodeHover(node,data)">
                <span>{{ node.label }}</span>
                <span v-show="data.extData.showIcon" class="subdivision-tree-node-icon">
                  <span>
                    <Icon type="plus-circle" theme="filled" v-show="data.extData.showAddIcon" @click="onAppendNode(node,data)"/>
                  </span>
                  <span>
                    <Icon type="edit" v-show="data.extData.showEditIcon" @click="onEditNode(node,data)"/>
                  </span>
                  <span>
                    <Icon type="delete" v-show="data.extData.showDeleteIcon" @click="onDeleteNode(node, data)"/>
                  </span>
                </span>
              </div>
            </el-tree> -->
            <el-form-item label="商品名称：" prop="title">
              <el-input v-model="searchObj.searchMap.title" placeholder="请输入商品名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品编号：" prop="outerId">
              <el-input v-model="searchObj.searchMap.outerId" placeholder="请输入商品编号" clearable></el-input>
            </el-form-item>
          </el-form>
          <div class="template-table__more-btn">
            <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
            <ns-button @click="resetForm('searchform')">重置</ns-button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt10">
      <el-table
        ref="multipleTable"
        :data="dataList"
        v-loading="loading"
        :element-loading-text="$t('prompt.loading')"
        tooltip-effect="dark"
        stripe
        highlight-current-row
        @current-change="selectCurrentChange"
        style="width: 100%"
        >
        <el-table-column  width="30">
          <template slot-scope="scope">
              <el-radio :label="scope.row.sysItemId" v-model="sysItemId" ></el-radio>
          </template>
        </el-table-column>
        <!-- <el-table-column  label="活动类型" align="left" >
          <template slot-scope="scope">
            <span :class='scope.row'>{{searchObj.searchMap.type ==2 ?'多人拼团':searchObj.searchMap.type ==3?'满减送':'秒杀'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="title" label="商品名称" align="left" >
        </el-table-column>
        <el-table-column prop="outerId" label="商品编号" align="left" >
        </el-table-column>
        <!-- <el-table-column label="有效时间 " width="300" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.startTime}} - {{scope.row.endTime}}</span>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <el-pagination v-if="pagination.enable" class="template-table-pagination"
        :page-sizes="pagination.sizeOpts"
        :total="pagination.total"
        :current-page.sync="pagination.page"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">取 消</ns-button>
      <ns-button type="primary"  @click="saveFun">确定</ns-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import { getErrorMsg } from '@/utils/toast'
export default {
  components: {
  },
  mixins: [listPageMixin],
  props: {
    callBack: Function
  },
  data () {
    return {
      outerId: '',
      sysItemId: '',
      title: '',
      goodsCode: '',
      market: {
        sysItemId: ''
      },
      loading: false,
      searchObj: { searchMap: {
      } },
      wechatPageTypeList: [{ name: '商城主页面', id: 1 }, { name: '商品', id: 2 }, { name: '优惠券', id: 3 }, { name: '营销活动', id: 4 }, { name: '自定义页面', id: 5 }],
      wechatPageUrlList: [],
      dialogImageUrl: '',
      groudList: [{ name: '多人拼团', type: 2 }, { name: '满减送', type: 3 }, { name: '秒杀', type: 4 }],
      dialogVisible: false
    }
  },
  methods: {
    selectCurrentChange (currentRow) {
      this.market = currentRow || {}
    },
    showToggle (obj) {
      this.dialogVisible = true
      this.loadListFun()
      // this.getGoodsCategory()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 提交保存
    saveFun () {
      this.handleClose()
      this.$props.callBack(this.market)
    },
    handleClose () {
      this.dialogVisible = false
      this.$refs.searchform.resetFields()
    },
    async loadListFun () {
      let that = this
      this.loading = true
      await this.$http.fetch(this.$api.guide.material.findMallGoodsList, this.searchObj).then(res => {
        // let newTime = new Date().getTime()
        // res.result.data.map(item => {
        //   let startTime = new Date(item.startTime).getTime()
        //   let endTime = new Date(item.endTime).getTime()
        //   if (newTime < startTime) {
        //     item.statusStr = '未开始'
        //   } else if (newTime > endTime) {
        //     item.statusStr = '已结束'
        //   } else {
        //     item.statusStr = '进行中'
        //   }
        // })
        if (res.result.data && res.result.data.length > 0) {
          that.dataList = res.result.data
          that.pagination.total = Number(res.result.total)
        } else {
          that.dataList = null
        }
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('查询失败', resp))
      }).finally(() => {
        this.loading = false
      })
    },
    async getGoodsCategory () {
      let that = this
      await this.$http.fetch(this.$api.guide.material.getGoodsCategory, {}).then(res => {
        // let newTime = new Date().getTime()
        // res.result.data.map(item => {
        //   let startTime = new Date(item.startTime).getTime()
        //   let endTime = new Date(item.endTime).getTime()
        //   if (newTime < startTime) {
        //     item.statusStr = '未开始'
        //   } else if (newTime > endTime) {
        //     item.statusStr = '已结束'
        //   } else {
        //     item.statusStr = '进行中'
        //   }
        // })
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 去重
    unique (arr, attribute) {
      var newarr = []
      var jsonarr = []
      for (var i = 0; i < arr.length; i++) {
        console.log(newarr.indexOf(arr[i][attribute]))
        if (newarr.indexOf(arr[i][attribute]) === -1) { //  -1代表没有找到
          newarr.push(arr[i][attribute]) // 如果没有找到就把这个name放到arr里面，以便下次循环时用
          jsonarr.push(arr[i])
        }
      }
      return jsonarr
    },
    submitForm () {
      this.market = {}
      this.clearSearch()
      this.loadListFun()
    }
  }
}
</script>
<style scoped>
.selectMarketbox .current-row{
  td{
    color: #fff !important;
    background:  #0091FA !important
  }
}
</style>
