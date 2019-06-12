
<template>
<div>
  <el-tabs v-model="activeName" @tab-click="tabHandleClick">
    <el-tab-pane label="优惠券管理" name="0"></el-tab-pane>
    <el-tab-pane label="优惠券使用明细" name="1"></el-tab-pane>
  </el-tabs>
  <div v-show="couponPageShow">
  <!-- 提成奖励设置  wanrengang 20180716 -->
  <div  v-show="!addBoxShow" class="couponListBox">
    <div class="template-table">
      <!-- 简单搜索start -->
  <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->
          <el-col :span="7">
            <ns-button type="primary" @click="AddShowToggle">新增</ns-button>
          </el-col>
          <el-col :span="17">
             <!-- 右上角操作区域 -->
            <div class="float-right tabSearchBtn">
              <ns-button @click="tabSearchType" style="padding: 9px 0 9px 10px;opacity: 0.5;color: #002041;" type="text">{{searchType.tipText}}<i :class="{'el-icon--right': true, 'el-icon-arrow-down': !searchType.advanced, 'el-icon-arrow-up': searchType.advanced} ">
                </i></ns-button>
            </div>
            <el-form ref="searchform" class="float-right"  v-if="!searchType.advanced" :inline="true" :model="searchform">
              <el-form-item label="优惠券：" prop="name">
                <el-input v-model="searchform.name" placeholder="请输入优惠券名称或编码"></el-input>
              </el-form-item>
              <el-form-item>
                <ns-button type="primary"  @click="submitForm('searchform')">搜索</ns-button>
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
          <el-form-item label="优惠券：" prop="name">
                <el-input v-model="searchform.name" placeholder="请输入优惠券名称或编码"></el-input>
              </el-form-item>
              <el-form-item label="状态：" prop="state">
                <el-select v-model="searchform.state"  placeholder="请选择状态">
                  <el-option  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="类型：" prop="type">
                <el-select v-model="searchform.type" placeholder="请选择类型">
                  <el-option v-for="item in shopTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="失效时间：" prop="time">
                <el-date-picker
                  v-model="searchform.time"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="请输入开始日期"
                  end-placeholder="请输入结束日期"
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
        stripe
        :element-loading-text="$t('prompt.loading')"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          label="面额"
          :width="200"
          >
          <template slot-scope="scope">
          <couponItem :itemObj="scope.row"></couponItem>
        </template>
        </el-table-column>
        <el-table-column
          label="优惠券" align="left" :width="300"
        >
        <template slot-scope="scope">
          <div>
            <span>优惠券名称：</span>{{scope.row.couponTitle}}<br>
            <span>使用条件：</span>{{scope.row.useConditionStr}}<br>
            <span>优惠券编码：</span>{{scope.row.couponCode}}
          </div>
        </template>
        </el-table-column>
        <el-table-column
          label="有效时间" align="center" :width="250"
        >
        <template slot-scope="scope">
          <div v-if="scope.row.dateValidType===0">
            {{scope.row.startTime}}<br>
            {{scope.row.endTime}}
          </div>
          <div v-else>
            领取  {{scope.row.afterGetValidDays}} 天后生效<br/>
            有效期 {{scope.row.validDays}} 天
          </div>
        </template>
        </el-table-column>

        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center" :width="200"
        >
        </el-table-column>

        <el-table-column
          label="发放情况"
          align="center" :width="250"
        >
        <template slot-scope="scope">
          <div>
            发行量：{{scope.row.maxIssueAmount!='0'?scope.row.maxIssueAmount+'张':'不限'}}<br>
            已发放：{{scope.row.hadIssueAmount}} 张<br>
            <span v-if="scope.row.maxIssueAmount==0">未发放：-</span>
            <span v-else>未发放：{{scope.row.maxIssueAmount-scope.row.hadIssueAmount}} 张</span>
          </div>
        </template>
        </el-table-column>

        <el-table-column
          label="是否公开"
          :width="200"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              <div v-if="scope.row.couponStatus!=3">
                <el-switch
                  style="height:48px"
                  v-model="scope.row.couponCommon"
                  :active-value='1'
                  :inactive-value='0'
                  @change='commonStatusChange(scope.row)'
                >
                </el-switch>
              </div>
              <div v-else>
                已过期
              </div>

            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="是否启用"
          :width="200"
          align="center"
        >
        <template slot-scope="scope">
          <div>
            <div v-if="scope.row.couponStatus!=3">
              <el-switch
                style="height:48px"
                v-model="scope.row.couponStatus"
                :active-value='1'
                :inactive-value='0'
                @change='statusChange(scope.row)'
                >
              </el-switch>
            </div>
            <div v-else>
              已过期
            </div>

          </div>
        </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="250"
          align="center"
        >
        <template slot-scope="scope">
          <ns-button @click="showViewDialog(scope.row)" type="text">查看</ns-button>
          <span style="color:#ccc;padding:0 1px;">|</span>
          <span v-if="scope.row.couponStatus==1&&scope.row.maxIssueAmount!=0">
            <ns-button @click="addNumShowToggle(scope.row)" type="text">追加数量</ns-button>
            <span style="color:#ccc;padding:0 1px;">|</span>
          </span>
          <a class="text-error" style="color:#f00" href="javascript:" @click="delsTipFun(scope.row.id,scope.row.hadIssueAmount)">删除</a>
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
    <!-- 编辑优惠券 start -->
  </div>
  <div v-show="addBoxShow" class="couponAddBox">
      <add-coupon @showList="showList"></add-coupon>
  </div>
  <addNum ref="addNumDialogDom" :callBack="showList"></addNum>
  </div>
  <div  v-show="!couponPageShow">
    <detailList></detailList>
  </div>
  <coupon-view ref="viewDialogDom"></coupon-view>
  <addModal  :callBack="loadListFun" ref="addModalDom"></addModal>
</div>
</template>
<script>
import moment from 'moment'
import addCoupon from './add'
import addNum from './addNumDialog'
import couponItem from 'web-crm/src/components/NsCouponItem'
import detailList from './detailList'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'
import addModal from './addModal'
// 详情
import couponView from './couponView'
import listPageMixin from '@/mixins/listPage'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      activeName: '0',
      couponPageShow: true,
      addBoxShow: false,
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
          // 状态
          value: '0',
          label: '禁用'
        },
        {
          value: '2',
          label: '未过期'
        },
        {
          value: '3',
          label: '已过期'
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
        time: []
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
    this.loadListFun(this.searchObj)
  },
  methods: {
    tabHandleClick (e) {
      if (e.name === '1') {
        this.couponPageShow = false
      } else {
        this.couponPageShow = true
      }
    },
    // 改变状态
    async statusChange (e) {
      let obj = {
        couponId: e.id,
        status: e.couponStatus
      }
      await this.$http
        .fetch(this.$api.coupon.storeCoupon.updateStatus, obj)
        .then(resp => {
        })
        .catch(resp => {
          this.$notify.error('查询失败')
        })
      this.loadListFun(this.searchObj)
    },
    // 改变是否公开状态
    async commonStatusChange (e) {
      let obj = {
        couponId: e.id,
        status: e.couponCommon
      }
      await this.$http
        .fetch(this.$api.coupon.storeCoupon.updateCommonStatus, obj)
        .then(resp => {
        })
        .catch(resp => {
          this.$notify.error('查询失败')
        })
      this.loadListFun(this.searchObj)
    },
    // 删除
    delsTipFun (val, hadIssueAmount) {
      if (hadIssueAmount > 0) {
        this.$notify.error('已发放数量大于0无法删除')
      } else {
        apiRequestConfirm('永久删除该数据').then(() => {
          this.delsFun(val)
        }).catch(() => {
          // 点击取消事件
        })
      }
    },
    async delsFun (val) {
      let obj = {
        couponId: val
      }
      await this.$http
        .fetch(this.$api.coupon.storeCoupon.deleteCoupon, obj)
        .then(resp => {
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
        })
      this.$notify({
        type: 'success',
        message: '删除成功!'
      })
      this.loadListFun(this.searchObj)
    },
    // 显示列表
    showList (e) {
      this.addBoxShow = false
      if (e !== 'back') {
        // 返回时不刷新列表
        this.loadListFun(this.searchObj)
      }
    },
    // 追加数量弹窗
    addNumShowToggle (obj) {
      // 传递保存时需要的参数
      this.$nextTick(() => {
        this.$refs.addNumDialogDom.showToggle(obj)
      })
    },
    showViewDialog (item) {
      this.$nextTick(() => {
        this.$refs.viewDialogDom.showToggle(item)
      })
    },
    // 打开新增
    AddShowToggle () {
      this.$refs.addModalDom.showToggle()
    },
    itemSetFun (item) {
      this.selectedArr = []
      this.selectedArr.push(item)
      this.AddShowToggle()
    },
    // 选择门店
    handleSelectionChange (val) {
      this.selectedArr = val
    },
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.coupon.storeCoupon.queryCouponList, searchObj)
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
      this.searchObj.searchMap.type = this.searchform.type
      this.searchObj.searchMap.name = this.searchform.name
      this.searchObj.searchMap.status = this.searchform.state
      if (this.searchform.time && this.searchform.time.length === 2) {
        this.searchObj.searchMap.invalidStartTime = moment(this.searchform.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.searchObj.searchMap.invalidEndTime = moment(this.searchform.time[1]).format('YYYY-MM-DD HH:mm:ss')
      } else {
        this.searchObj.searchMap.invalidStartTime = ''
        this.searchObj.searchMap.invalidEndTime = ''
      }
      this.loadListFun()
    },
    // 选择年份
    yearChange (e) {
      this.searchObj.searchMap.year = moment(e).format('YYYY')
    }
  },
  components: {
    addCoupon,
    couponItem,
    addNum,
    detailList,
    couponView,
    addModal
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
.w80{width: 76px;text-align: right; display: inline-block;}
</style>
