
<template>
<!-- 提成奖励设置  wanrengang 20180716 -->
<div>
  <div class="template-table">
    <!-- 简单搜索start -->
  <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->
          <el-col :span="7">
            <div class="topTip">
              <ns-button type="primary" @click="AddShowToggle">批量设置</ns-button>
            </div>
          </el-col>
          <el-col :span="17">
            <el-form ref="searchform" class="float-right"  :inline="true" :model="searchform" style='padding-top:3px'>
              <el-form-item label="门店名称：" prop="shopName">
                <el-input v-model="searchform.shopName" placeholder="请输入门店名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="状态：" prop="shopStatus">
                <el-select v-model="searchform.shopStatus"  placeholder="请选择状态">
                  <el-option  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
                <ns-button @click="resetForm('searchform')">重置</ns-button>
              </el-form-item>
            </el-form>
        </el-col>
      </el-row>
  </div>
  <!-- 简单搜索end -->
  </div>
   <!-- 筛选end -->
  <!-- table start -->

  <div class="mt10">
    <el-table
      ref="multipleTable"
      :data="dataList"
      v-loading="loading"
      :element-loading-text="$t('prompt.loading')"
      tooltip-effect="dark"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="42">
      </el-table-column>
      <el-table-column
        label="门店名称"
        prop="shopName"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        label="状态"
        width="150"
        align="left"
        show-overflow-tooltip
        >
        <template slot-scope="scope">
          <span>{{scope.row.shopStatus|shopStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="销售提成"
        width="300"
      >
        <template slot-scope="scope"><div v-if="scope.row.salesStatus">
          <span>线上：成单导购 {{scope.row.onlineSalesRewardOrder}}% + 专属导购 {{scope.row.onlineSalesRewardExclusive}}%<br></span>
          <span>线下：成单导购 {{scope.row.salesRewardOrder}}% + 专属导购 {{scope.row.salesRewardExclusive}}%<br></span>
        </div>
        <div v-else>
          <span>暂未设置</span>
        </div></template>
      </el-table-column>
      <el-table-column
        label="招募新会员奖励"
        width="280"
      >
      <template slot-scope="scope">
        <div v-if="scope.row.memberStatus">
          <span>每招募一名新会员提成 {{scope.row.memberReward}} 元</span>
        </div>
        <div v-else>
          <span>暂未设置</span>
        </div>
      </template>
      </el-table-column>
      <!-- <el-table-column
        label="分享奖励"
      > -->
      <!-- <template slot-scope="scope">
        <div v-if="scope.row.shareStatus">
          每{{scope.row.shareNum}}条UV奖励{{scope.row.shareReward}}元
        </div>
        <div v-else>
          暂未设置
        </div>
      </template>
      </el-table-column> -->

      <el-table-column
        label="操作"
        width="60"
        align="right"
      >
      <template slot-scope="scope">
        <ns-button @click="itemSetFun(scope.row)" type="text">设置</ns-button>
      </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 分页 -->
   <el-pagination v-if="pagination.enable" class="template-table-pagination"
          :page-sizes="pagination.sizeOpts"
          :total="pagination.total"
          :current-page="pagination.page"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
  <!-- table end -->
 <rewardSetAdd ref="addDialogDom" :callBack="loadListFun"></rewardSetAdd>
</div>
</template>
<script>
import moment from 'moment'
import listPageMixin from 'mixins/listPage'
import rewardSetAdd from './RewardSetAdd'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      statusOptions: [
        {
          // 状态
          value: '1',
          label: '正常营业'
        },
        {
          value: '-1',
          label: '暂停营业'
        },
        {
          value: '-2',
          label: '已关店'
        }
      ],
      shopTypeOptions: [
        {
          // 状态
          value: 'B',
          label: '天猫'
        },
        {
          value: 'C',
          label: '淘宝店'
        },
        {
          value: 'ZYD',
          label: '直营店'
        },
        {
          value: '-JMD',
          label: '加盟'
        }
      ],
      selectedArr: [],
      searchform: {
        shopName: ''
      },
      // 保存时提交对象
      saveObj: {
        type: 0, // 销售指标
        year: '2018', // 年份,
        selectedArr: []
      }
    }
  },
  created: function () {
    // 获取当前年份---默认加载当前年
    var myDate = new Date()
    var curYear = myDate.getFullYear()
    this.searchObj.searchMap.year = curYear
    this.searchObj.searchMap.type = 0// 0销售指标、1招募会员指标
    this.loadListFun(this.searchObj)
  },
  methods: {
    // 打开弹窗
    AddShowToggle () {
      if (this.selectedArr.length === 0) {
        this.$notify.error('请选择门店')
        return
      }
      // 重置选择的门店
      this.saveObj.selectedArr = this.selectedArr
      // 传递保存时需要的参数
      this.$nextTick(() => {
        this.$refs.addDialogDom.showToggle(this.saveObj)
      })
    },
    itemSetFun (item) {
      this.selectedArr = []
      this.selectedArr.push(item)
      this.AddShowToggle()
      this.selectedArr = []
    },
    // 选择门店
    handleSelectionChange (val) {
      console.log(val)
      this.selectedArr = val
    },
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      this.selectedArr = []
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.guide.guide.rewardruleList, searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
        })
      this.loading = false
      // 总条数
    },
    // 提交搜索
    submitForm (formName) {
      // 组装搜索对象
      this.searchObj.searchMap.shopType = this.searchform.shopType
      this.searchObj.searchMap.shopName = this.searchform.shopName
      this.searchObj.searchMap.shopStatus = this.searchform.shopStatus
      this.loadListFun()
    },

    yearChange (e) {
      this.searchObj.searchMap.year = moment(e).format('YYYY')
    }
  },
  components: {
    rewardSetAdd
  }
}
</script>
<style scoped>
.el-input.el-input--small .el-input__inner {
  text-indent: 25px !important;
}
.topTip {
  line-height: 32px;
  height: 32px;
}
.topTip .tipInfo {
  padding-left: 15px;
  color: #333;
}
.topTip span {
  font-size: 13px;
  color: #f00;
}
.mt10 {
  margin-top: 10px;
}
</style>
