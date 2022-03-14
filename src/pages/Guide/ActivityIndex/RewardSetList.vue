
<template>
<!-- 提成奖励设置  wanrengang 20180716 -->
<div>
  <div class="template-table">
    <!-- 简单搜索start -->
  <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->
          <el-col :span="7">
            <div>
              <ns-button type="primary" @click="AddShowToggle">批量设置</ns-button>
            </div>
          </el-col>
          <el-col :span="17">
            <el-form ref="searchform" class="float-right"  :inline="true" :model="searchform">
              <el-form-item label="门店名称：" prop="shopName">
                <el-input v-model="searchform.shopName" placeholder="请输入门店名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="状态：" prop="shopStatus">
                <el-select v-model="searchform.shopStatus"  placeholder="请选择状态" clearable>
                  <el-option  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <ns-button type="primary" @click="submitForm('searchform')" class="searchbtn">搜索</ns-button>
                <ns-button @click="resetForm('searchform')" class="resetbtn">重置</ns-button>
              </el-form-item>
            </el-form>
        </el-col>
      </el-row>
  </div>
  <!-- 简单搜索end -->
  </div>
   <!-- 筛选end -->
  <!-- table start -->
  <div class="mt5">
    <el-table
      ref="multipleTable"
      :data="dataList"
      v-loading="loading"
      :element-loading-text="$t('prompt.loading')"
      tooltip-effect="dark"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :class="[fuscous==='QA'?fuscousQA:fuscousIcon]">
      <el-table-column
        :selectable="selectable"
        type="selection"
        align="center" :width="50" >
      </el-table-column>
      <el-table-column
        label="门店名称"
        prop="shopName"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        label="状态"
        width="50"
        align="center"
        show-overflow-tooltip
        >
        <template slot-scope="scope">
          <span :class="scope.row.shopStatus > 0 ? 'text-success' : scope.row.shopStatus === -1 ? 'text-error' : ''">{{scope.row.shopStatus|shopStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="销售提成"
      >
        <template slot-scope="scope"><div v-if="scope.row.salesStatus">
          <span>线上：成单导购 {{scope.row.onlineSalesRewardOrder}}<span v-if="scope.row.onlineSalesRewardOrder === null">0</span>% + 专属导购 {{scope.row.onlineSalesRewardExclusive}}<span v-if="scope.row.onlineSalesRewardExclusive === null">0</span>%<br></span>
          <span>门店：成单导购 {{scope.row.salesRewardOrder}}<span v-if="scope.row.salesRewardOrder === null">0</span>% + 专属导购 {{scope.row.salesRewardExclusive}}<span v-if="scope.row.salesRewardExclusive === null">0</span>%<br></span>
        </div>
        <div v-else>
          <span>暂未设置</span>
        </div></template>
      </el-table-column>
      <el-table-column
        label="招募新会员奖励"
      >
      <template slot-scope="scope">
        <div v-if="scope.row.memberStatus">
          <span>每招募一名新会员提成 {{$numeral(scope.row.memberReward).format('0,0.00')}} 元</span>
        </div>
        <div v-else>
          <span>暂未设置</span>
        </div>
      </template>
      </el-table-column>
      <el-table-column
        label="新加好友奖励"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.addfriendStatus">
            <span>每添加一名新好友提成 {{$numeral(scope.row.addfriendReward).format('0,0.00')}} 元</span>
          </div>
          <div v-else>
            <span>暂未设置</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="60"
        align="center"
      >
      <template slot-scope="scope">
        <div v-if="scope.row.shopStatus == 1">
        <ns-button @click="itemSetFun(scope.row)" type="text">设置</ns-button>
        </div>
      </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 分页 -->
   <el-pagination v-if="pagination.enable" class="template-table-pagination"
          :page-sizes="pagination.sizeOpts"
          :total="pagination.total"
          :current-page.sync="pagination.page"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
 <rewardSetAdd ref="addDialogDom" :callBack="loadListFun"></rewardSetAdd>
</div>
</template>
<script>
import moment from 'moment'
import listPageMixin from '@/mixins/listPage'
import rewardSetAdd from './RewardSetAdd'
import { getErrorMsg } from '@/utils/toast'

export default {
  mixins: [listPageMixin],
  data () {
    return {
      statusOptions: [
        {
          value: '1',
          label: '正常'
        },
        {
          value: '-1',
          label: '暂停'
        },
        {
          value: '-2',
          label: '关店'
        }
      ],
      selectedArr: [],
      searchform: {
        shopName: '',
        shopStatus: ''
      },
      // 保存时提交对象
      saveObj: {
        type: 0, // 销售指标
        year: '2018', // 年份,
        selectedArr: []
      },
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },
  created: function () { // 获取当前年份---默认加载当前年
    this.loadListFun(this.searchObj)
  },
  methods: {
    // 复选框
    selectable (row, index) {
      if (row.shopStatus === 1) {
        return true
      } else {
        return false
      }
    },
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
      var selectedArrBck = this.selectedArr
      this.selectedArr = []
      this.selectedArr.push(item)
      this.AddShowToggle()
      this.selectedArr = selectedArrBck
    },
    // 选择门店
    handleSelectionChange (val) {
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
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
      // 总条数
    },
    // 提交搜索
    submitForm (formName) {
      // 组装搜索对象
      this.searchObj.start = 0
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
  @import "@theme/variables.pcss";

  .el-input.el-input--small .el-input__inner {
    text-indent: 25px !important;
  }
  .mt10 {
    margin-top: var(--default-margin-larger);
  }
  .searchbtn {
    margin-left: var(--default-margin-base);
  }
  .resetbtn {
    margin-left: 9px;
  }
.fuscousQA >>>.el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #41a2e8;
    border-color: #41a2e8;
}
.fuscousQA >>>.el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #0C4CFF;
    border-color: #0C4CFF;
}
</style>
