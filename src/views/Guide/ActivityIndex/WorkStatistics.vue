
<template>
<!-- 导购工作统计  wanrengang 20180716 -->
<div>
  <div class="template-table">
    <!-- 简单搜索start -->
  <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->
          <el-col :span="7">
             &nbsp
          </el-col>
          <el-col :span="17">
            <!-- 右上角操作区域 -->
            <div class="float-right tabSearchBtn">
              <ns-button @click="tabSearchType" style="padding: 9px 0 9px 10px;opacity: 0.5;color: #002041;" type="text">{{searchType.tipText}}<i :class="{'el-icon--right': true, 'el-icon-arrow-down': !searchType.advanced, 'el-icon-arrow-up': searchType.advanced} ">
                </i></ns-button>
            </div>
            <el-form ref="searchform" class="float-right" v-if="!searchType.advanced" :inline="true" :model="searchform">
              <el-form-item  prop="type">
                <el-select
                style="width:100px"
                v-model="searchform.type" placeholder="请选择">
                  <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item  prop="date">
                <el-date-picker
                  v-if="searchform.type=='1'"
                  v-model="searchform.date"
                  type="month"
                  placeholder="请选择月份"
                  >
                </el-date-picker>
                <el-date-picker
                    v-if="searchform.type=='2'"
                    v-model="searchform.date"
                    type="date"
                    placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="门店名称：" prop="shopName">
                <el-input v-model="searchform.shopName" placeholder="请输入门店名称"></el-input>
              </el-form-item>
              <el-form-item>
                <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
                <ns-button @click="resetForm('searchform')">重置</ns-button>
              </el-form-item>
            </el-form>
        </el-col>
      </el-row>
  <!-- 简单搜索end -->
  <!-- 高级搜索start -->
  <div class="template-table-search" v-if="searchType.advanced">
      <div class="template-table__bar-more">
        <el-form ref="searchform" label-width="80px"  class="surround-btn" :model="searchform"  :inline="true">
          <el-form-item  prop="type">
            <el-select
            style="width:100px"
            v-model="searchform.type" placeholder="请选择">
            <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
            </el-option>
            </el-select>
            </el-form-item>
            <el-form-item  prop="date">
            <el-date-picker
                v-if="searchform.type=='1'"
                v-model="searchform.date"
                type="month"
                placeholder="请选择月份"
                >
            </el-date-picker>
            <el-date-picker
                v-if="searchform.type=='2'"
                v-model="searchform.date"
                type="date"
                placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="门店名称："  prop="shopName">
            <el-input v-model="searchform.shopName" placeholder="请输入门店名称"></el-input>
          </el-form-item>
          <el-form-item label="工号："  prop="workId">
            <el-input v-model="searchform.workId" placeholder="请输入工号"></el-input>
          </el-form-item>
          <el-form-item label="姓名："  prop="name">
            <el-input v-model="searchform.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
          <ns-button @click="resetForm('searchform')">重置</ns-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 高级搜索end -->
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
      style="width: 100%">
      <el-table-column
        label="工号"
        prop="workId"
        width="120"
      >
      <template slot-scope="scope">
        {{scope.row.workId?scope.row.workId:'-'}}
      </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        prop="name"
        width="180"
      >
      </el-table-column>
      <el-table-column
        label="门店名称"
        prop="shopName"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        label="完成招募/还差（人）"
        align="center"
        width="220"
      >
      <template slot-scope="scope">
        <span>{{scope.row.recruitComplete}}</span>/<span class="text-error">
          <span v-if="scope.row.recruitQuota-scope.row.recruitComplete<0">
            0
          </span>
          <span v-else>
            {{scope.row.recruitQuota-scope.row.recruitComplete}}
          </span>
          </span>
      </template>
      </el-table-column>
      <el-table-column
        label="完成销售额/还差（元）"
        align="center"
        width="200"
      >
      <template slot-scope="scope">
        <span>{{scope.row.sellComplete}}</span>/<span class="text-error">
          <span v-if="scope.row.sellQuota-scope.row.sellComplete<0">0</span>
          <span v-else>{{scope.row.sellQuota-scope.row.sellComplete}}</span>
          </span>
      </template>
      </el-table-column>
    </el-table>
  </div>
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
</div>
</template>
<script>
import moment from 'moment'
import listPageMixin from 'mixins/listPage'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      selectedArr: [],
      typeOptions: [
        {
          // 状态
          value: '2',
          label: '按日查询'
        },
        {
          value: '1',
          label: '按月查询'
        }
      ],
      searchform: {
        shopName: '',
        date: '', // 年月份,
        type: '1' // 1按月、2按日
      }
    }
  },
  created: function () {
     // 初始化默认查询本年当月
    this.searchObj.searchMap = Object.assign(this.searchObj.searchMap, {
      type: '1', // 1按月、2按日
      date: moment(new Date()).format('YYYY-MM') // 年月份,
    })
    // 获取当前年份---默认加载当前年
    this.searchform.date = moment(new Date()).format('YYYY-MM')
    console.log(this.searchform.date)
    this.loadListFun()
  },
  methods: {
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.guide.guide.guideperfList, searchObj)
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
      if (this.searchform.type === '2') {
        this.searchObj.searchMap.date = moment(this.searchform.date).format(
          'YYYY-MM-DD'
        )
      } else {
        this.searchObj.searchMap.date = moment(this.searchform.date).format(
          'YYYY-MM'
        )
      }
      this.searchObj.searchMap.shopName = this.searchform.shopName
      this.searchObj.searchMap.name = this.searchform.name
      this.searchObj.searchMap.workId = this.searchform.workId
      this.searchObj.searchMap.type = this.searchform.type
      this.loadListFun()
    },
    // 重置搜索
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.submitForm()
    }
  }
}
</script>
<style scoped>
.el-input.el-input--small .el-input__inner {
  text-indent: 25rpx !important;
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
