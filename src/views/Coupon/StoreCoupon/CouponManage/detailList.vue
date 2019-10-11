
<template>
<!-- 优惠券使用明细  wanrengang 20180720 -->
<div>
  <div class="template-table">
    <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->
          <el-col :span="7"></el-col>
          <el-col :span="17">
             <!-- 简单搜索 -->
             <!-- 右上角操作区域 -->
            <div class="float-right tabSearchBtn">
              <ns-button @click="tabSearchType" style="padding: 9px 0 9px 10px;opacity: 0.5;color: #002041;" type="text">{{searchType.tipText}}<i :class="{'el-icon--right': true, 'el-icon-arrow-down': !searchType.advanced, 'el-icon-arrow-up': searchType.advanced} ">
                </i></ns-button>
            </div>
            <el-form ref="searchform" v-if="!searchType.advanced" class="float-right" :inline="true" :model="searchform">
              <el-form-item label="优惠券券码：" prop="couponDetailNo">
                <el-input  placeholder="请输入优惠券券码" v-model="searchform.couponDetailNo"></el-input>
              </el-form-item>
              <el-form-item>
                <ns-button type="primary" @click="submitForm('searchform')">查询</ns-button>
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
          <el-form-item label="优惠券券码：" prop="couponDetailNo">
            <el-input  placeholder="请输入优惠券券码" v-model="searchform.couponDetailNo"></el-input>
          </el-form-item>
          <el-form-item label="优惠券名称：" prop="name">
            <el-input  placeholder="请输入优惠券名称" v-model="searchform.name"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select v-model="searchform.status"  placeholder="请选择">
              <el-option  v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型：" prop="type">
            <el-select v-model="searchform.type" placeholder="请选择">
              <el-option v-for="item in shopTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发放时间：" prop="time">
            <el-date-picker
              v-model="searchform.time"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
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
      style="width: 100%"
      stripe
      >
      <el-table-column
        label="优惠券"
        width="220"
        >
        <template slot-scope="scope">
          <couponItem :itemObj="scope.row"></couponItem>
        </template>
      </el-table-column>
      <el-table-column
        label="优惠券名称"
      >
      <template slot-scope="scope">
        <div>{{scope.row.couponTitle}}</div>
      </template>
      </el-table-column>
      <el-table-column
        label="券码"
      >
      <template slot-scope="scope">
        <div>
          {{scope.row.couponDetailNo}}
        </div>
      </template>
      </el-table-column>
      <el-table-column
        label="有效时间"
      >
      <template slot-scope="scope">
        {{scope.row.startTime}}<br>
          {{scope.row.endTime}}
      </template>
      </el-table-column>
      <el-table-column
        label="发放客户"
        width="120"
      >
      <template slot-scope="scope">
        <div>
          客户ID：{{scope.row.sysCustomerId}}<br/>
          姓名： {{scope.row.customerName}}
        </div>
      </template>
      </el-table-column>
      <el-table-column
        label="发放时间"
        width="160"
      >
      <template slot-scope="scope">
        <div>
          {{scope.row.sendTime}}
        </div>
      </template>
      </el-table-column>
      <el-table-column
        label="发放渠道"
        width="120"
      >
      <template slot-scope="scope">
        <div>
          {{scope.row.channel}}
        </div>
      </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="90"
      >
      <template slot-scope="scope">
        <div>
          <div v-if="scope.row.useStatus==0">未使用</div>
          <div v-else-if="scope.row.useStatus==1">使用中</div>
          <div v-else-if="scope.row.useStatus==2">已使用</div>
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
  <!-- table end -->
</div>
</template>
<script>
import moment from 'moment'
import listPageMixin from '@/mixins/listPage'
import couponItem from '@nascent/ecrp-ecrm/src/components/NsCouponItem'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      statusOptions: [
        {
          value: '0',
          label: '未使用'
        },
        {
          value: '2',
          label: '已使用'
        },
        {
          value: '3',
          label: '已过期'
        },
        {
          value: '4',
          label: '已禁用'
        }
      ],
      shopTypeOptions: [
        {
          // 状态
          value: '1',
          label: '代金券'
        },
        {
          value: '2',
          label: '折扣券'
        },
        {
          value: '3',
          label: '兑换券'
        }
      ],
      selectedArr: [],
      searchform: {
        time: [],
        name: ''
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
    this.loadListFun()
  },
  methods: {
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.coupon.storeCoupon.queryLogUsedList, searchObj)
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
      this.searchObj.searchMap.couponDetailNo = this.searchform.couponDetailNo
      this.searchObj.searchMap.type = this.searchform.type
      this.searchObj.searchMap.name = this.searchform.name
      this.searchObj.searchMap.status = this.searchform.status
      if (this.searchform.time.length === 2) {
        this.searchObj.searchMap.startTime = moment(
          this.searchform.time[0]
        ).format('YYYY-MM-DD HH:mm:ss')
        this.searchObj.searchMap.endTime = moment(
          this.searchform.time[1]
        ).format('YYYY-MM-DD HH:mm:ss')
      } else {
        this.searchObj.searchMap.startTime = ''
        this.searchObj.searchMap.endTime = ''
      }
      this.loadListFun()
    },
    // 选择年份
    yearChange (e) {
      this.searchObj.searchMap.year = moment(e).format('YYYY')
    }
  },
  components: {
    couponItem
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
