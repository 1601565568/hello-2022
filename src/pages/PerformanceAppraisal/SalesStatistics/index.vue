<template>
  <div class="template_main">
    <div class="template-page">
      <div class="page-header">
        <div class="page-header__text">
          <!-- <el-breadcrumb separator="/">
            <el-breadcrumb-item
              :to="{ path: '/PerformanceAppraisal/SalesStatistics/List' }"
              >绩效考核</el-breadcrumb-item
            >
            <el-breadcrumb-item>销售数据统计</el-breadcrumb-item>
          </el-breadcrumb> -->
          <span class="head-title">销售数据统计</span>
        </div>
      </div>
    </div>

    <div class="blue-tip">
      <div>点击设置销售数据计算规则</div>
      <div class="tip-button">
        <ns-button type="text" @click="handleSet">统计设置</ns-button>
      </div>
    </div>
    <div class="page-content">
      <el-tabs v-model="tabId" @tab-click="handleTabsClick">
        <el-tab-pane
          v-for="item in tabOptions.tabList"
          :key="item.name"
          :label="item.name"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
      <div class="params-container">
        <div class="seach-left-view">
          <div class="shop-content operation-view base-view">
            <span class="ml-8"
              >{{ { '1': '企业微信成员', '2': '群主' }[tabId] }}：</span
            >
            <GuideDialog
              :selfBtn="true"
              :appendToBody="true"
              :switchAreaFlag="1"
              :isButton="false"
              :auth="true"
              type="primary"
              btnTitle=""
              :dialogTitle="`选择${tabId === '1' ? '企业微信成员' : '群主'}`"
              v-model="guideIds"
              @inputAllData="guideClick"
            >
              <template slot="selfBtn">
                <div class="self-btn">
                  {{
                    guideIds && guideIds.length
                      ? `已选择${guideIds.length}个`
                      : '全部'
                  }}
                  <span
                    class="icon-xuanzeyuangong2x iconfont"
                    style="margin: 0 10px 0 5px"
                  ></span>
                </div>
              </template>
            </GuideDialog>
          </div>
          <div class="operation-view base-view" style="width: auto">
            <div class="name" style="width: 70px">订单来源：</div>
            <div class="item-select">
              <el-select
                v-model="tableParams.searchMap.platform"
                :default-first-option="true"
                @change="fetchList()"
              >
                <el-option
                  v-for="item in orderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="icon-view">
              <Icon type="ns-arrow-drowdown" style="color: #8c8c8c" />
            </div>
          </div>
          <div class="operation-view base-view" style="width: auto">
            <div class="name" style="width: 70px">店铺来源：</div>
            <div class="item-select">
              <el-select
                v-model="tableParams.searchMap.shopId"
                :default-first-option="true"
                @change="fetchList()"
              >
                <el-option
                  v-for="item in storeOptions"
                  :key="item.shopId"
                  :label="item.shopName"
                  :value="item.shopId"
                >
                </el-option>
              </el-select>
            </div>
            <div class="icon-view">
              <Icon type="ns-arrow-drowdown" style="color: #8c8c8c" />
            </div>
          </div>
          <div class="date-view base-view">
            <span style="font-size: 13px">下单时间: </span>
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy/MM/dd"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              v-model="orderTime"
              @change="fetchList()"
              :pickerOptions="pickerOptions"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </div>
        </div>
        <!-- <el-form :inline="true" class="form-inline_top">
          <el-form-item>
            <div class="shop-content">
              <span>{{ { '1': '企业微信成员', '2': '群主' }[tabId] }}：</span>
              <GuideDialog
                :selfBtn="true"
                :appendToBody="true"
                :switchAreaFlag="1"
                :isButton="false"
                :auth="true"
                type="primary"
                btnTitle=""
                :dialogTitle="`选择${tabId === '1' ? '企业微信成员' : '群主'}`"
                v-model="guideIds"
                @inputAllData="guideClick"
              >
                <template slot="selfBtn">
                  <div class="self-btn">
                    {{
                      guideIds && guideIds.length
                        ? `已选择${guideIds.length}个`
                        : '全部'
                    }}
                    <span
                      class="icon-xuanzeyuangong2x iconfont"
                      style="marginleft: 5px"
                    ></span>
                  </div>
                </template>
              </GuideDialog>
            </div>
          </el-form-item>
          <el-form-item label="订单来源：" class="el-form__change">
            <el-select
              v-model="tableParams.searchMap.platform"
              placeholder="请选择"
              @change="fetchList()"
            >
              <el-option
                v-for="item in orderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店铺来源：" class="el-form__change">
            <el-select
              v-model="tableParams.searchMap.shopId"
              placeholder="请选择"
              @change="fetchList()"
            >
              <el-option
                v-for="item in storeOptions"
                :key="item.shopId"
                :label="item.shopName"
                :value="item.shopId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间: ">
            <el-date-picker
              style="margin-left: 15px"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy/MM/dd"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              v-model="orderTime"
              @change="fetchList()"
              :pickerOptions="pickerOptions"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </el-form-item>
        </el-form> -->
      </div>
      <el-table
        :data="table.tableData"
        class="new-table_border table-container"
        style="width: 100%"
        v-loading="table.loading"
      >
        <el-table-column
          v-if="tabId == '1'"
          prop="userName"
          key="qw"
          label="企业微信成员"
        >
        </el-table-column>
        <el-table-column
          v-if="tabId == '2'"
          prop="chatName"
          label="群名称"
          key="qmc"
        >
        </el-table-column>
        <el-table-column
          v-if="tabId == '2'"
          prop="ownerName"
          key="qz"
          label="群主"
        >
        </el-table-column>
        <el-table-column prop="orderPriceAll">
          <template slot="header">
            下单金额/笔数
            <el-tooltip
              effect="light"
              popper-class="popperClass"
              placement="top"
            >
              <Icon type="question-circle" class="question-circle" />
              <template slot="content">
                时间段内好友通过商品链接触达后下单总金额/笔数（已付款+未付款订单）
              </template>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <template>
              {{ scope.row.orderPriceAll }}/{{ scope.row.orderCountAll }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="payPriceAll">
          <template slot="header">
            付款金额/笔数
            <el-tooltip
              effect="light"
              popper-class="popperClass"
              placement="top"
            >
              <Icon type="question-circle" class="question-circle" />
              <template slot="content">
                时间段内好友通过商品链接触达后下单并付款总金额/笔数
              </template>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <template>
              {{ scope.row.payPriceAll }}/{{ scope.row.payCountAll }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="refundPriceAll">
          <template slot="header">
            退款金额/笔数
            <el-tooltip
              effect="light"
              popper-class="popperClass"
              placement="top"
            >
              <Icon type="question-circle" class="question-circle" />
              <template slot="content">
                时间段内好友通过商品链接触达后下单并退款完成的总金额/笔数
              </template>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <template>
              {{ scope.row.refundPriceAll }}/{{ scope.row.refundCountAll }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="avgCustomerPrice">
          <template slot="header">
            平均客单价
            <el-tooltip
              effect="light"
              popper-class="popperClass"
              placement="top"
            >
              <Icon type="question-circle" class="question-circle" />
              <template slot="content">
                时间段内好友通过商品链接触达后下单并付款总金额/付款人数
              </template>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="buyCustomerCount">
          <template slot="header">
            购买人数
            <el-tooltip
              effect="light"
              popper-class="popperClass"
              placement="top"
            >
              <Icon type="question-circle" class="question-circle" />
              <template slot="content">
                时间段内所有有过付款行为的好友数
              </template>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="buyCustomerTax">
          <template slot="header">
            购买率
            <el-tooltip
              effect="light"
              popper-class="popperClass"
              placement="top"
            >
              <Icon type="question-circle" class="question-circle" />
              <template slot="content">
                指定时间范围内所有有过付款行为的好友数/所有好友数
              </template>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <template>
              {{ floatObj.multiply(scope.row.buyCustomerTax, 100) }}%
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="address" width="125px" label="操作">
          <template slot-scope="scope">
            <ns-button type="text" @click="handleDetail(scope.row)"
              >详情
            </ns-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        key=""
        class="template-table__pagination"
        :page-sizes="pagination.sizeOpts"
        :total="pagination.total"
        :current-page="pagination.page"
        :page-size="pagination.size"
        layout="slot, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      >
        <span class="pagination-text">单页显示: </span>
      </el-pagination>
    </div>

    <el-dialog
      title="统计设置"
      custom-class="full-dialog"
      class="full-dialog"
      width="758px"
      :visible.sync="dialogVisible"
    >
      <div class="dialog-content">
        <div class="blue-tip">
          <div>
            成员分享的商品链接被好友点击后，好友在规定的时间内下单即可被统计计算业绩。
          </div>
        </div>
        <div>
          <el-form :model="dialogData" size="small">
            <el-form-item label="销售数据统计 ">
              <el-form-item prop="saleSwitch">
                <el-switch
                  class="sale-switch"
                  v-model="dialogData.saleSwitch"
                />
              </el-form-item>
            </el-form-item>
            <div v-if="dialogData.saleSwitch">
              <el-form-item label="时间间隔设置" prop="saleTime">
                <!-- <el-input v-model="dialogData.saleTime" width="68" /> -->
                <el-input-number
                  class="input-number"
                  v-model="dialogData.saleTime"
                  type="number"
                  :min="1"
                  :max="999"
                ></el-input-number>
                小时
              </el-form-item>
              <div class="sub-title">
                <span class="yellow-point"></span>
                <span>用户点开商品链接，在间隔时间内下单即可被统计</span>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <ns-button
          @click="
            () => {
              this.dialogVisible = !this.dialogVisible
            }
          "
          >取 消</ns-button
        >
        <ns-button type="primary" @click="confirm()">保 存</ns-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import { getErrorMsg } from '@/utils/toast'
import GuideDialog from '@/components/NewUi/GuideDialog'
import ElInputNumber from '@nascent/nui/lib/input-number'
import { ShipOptions, StatisticsCode } from './src/const.js'
import { floatObj } from '@/utils/common.js'
export default {
  components: {
    ElInputNumber,
    GuideDialog
  },
  data () {
    return {
      floatObj: { ...floatObj },
      dialogVisible: false,
      dialogData: {
        saleSwitch: false,
        saleTime: '',
        id: null,
        code: StatisticsCode
      },
      table: {
        loading: false,
        tableData: []
      },
      pagination: {
        size: 15,
        sizeOpts: [15, 50, 100],
        page: 1,
        total: 0
      },
      tabId: '1',
      tabOptions: {
        tabList: [
          { name: '成员销售数据', value: '1' },
          { name: '群销售数据', value: '2' }
        ]
      },
      tableParams: {
        start: 0,
        length: 15,
        searchMap: {
          chatId: '',
          createdEnd: '',
          createdStart: '',
          platform: null,
          shopId: null,
          userIdList: ''
        }
      },
      orderTime: [],
      guideIds: [],
      orderOptions: ShipOptions,
      storeOptions: [],
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate.getTime()
          if (maxDate) {
            this.selectDate = ''
          }
        },
        disabledDate: time => {
          if (this.selectDate !== '') {
            const one = 365 * 24 * 3600 * 1000 // 限制一年
            const minTime = this.selectDate - one
            const maxTime = this.selectDate + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.fetchList()
    this.fetchOptions()
  },
  watch: {
    'orderTime': function (val) {
      this.tableParams.searchMap.createdStart = val[0]
      this.tableParams.searchMap.createdEnd = val[1]
    },
    guideIds: {
      handler: function (val) {
        this.tableParams.searchMap.userIdList = val.join(',')
      }
    }
  },
  methods: {
    init () {
      let beginDate = this.handleTimeOld(new Date())
      let endDate = this.handleTimeNew(new Date())
      this.orderTime.push(beginDate)
      this.orderTime.push(endDate)
      // this.orderTime = ['2020-01-08 14:38:18', '2021-01-07 14:38:18']
    },
    fetchList (params) {
      this.table.loading = true
      let _params = { ...this.tableParams, params }
      let url =
        {
          1: this.$api.weWork.salesStatistics.statisticsUserList,
          2: this.$api.weWork.salesStatistics.statisticsRoomList
        }[this.tabId] || ''
      this.$http
        .fetch(url, _params)
        .then(res => {
          if (res.success) {
            const {
              result: { data, recordsTotal }
            } = res
            this.pagination.total = parseInt(recordsTotal) || 0
            this.table.tableData = data || []
          }
          this.table.loading = false
        })
        .catch(resp => {
          this.table.loading = false
          this.$notify.error(getErrorMsg('加载失败', resp))
        })
    },
    fetchOptions () {
      this.$http
        .fetch(this.$api.weWork.salesStatistics.statisticsShopList)
        .then(res => {
          if (res.success) {
            this.storeOptions = [{ shopName: '不限', shopId: null }, ...res.result]
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('加载失败', resp))
        })
    },
    handleDetail (row) {
      let _params = {
        ...this.tableParams.searchMap,
        userIdList: row.userID,
        chatId: row.chatID
      }
      this.$router.push({
        name: 'memberStatistics',
        params: _params
      })
    },
    guideClick (value) {
      this.guideIds = value.map(item => item.userId)
      this.fetchList()
    },
    handleTabsClick () {
      this.tableParams = Object.assign({}, this.$options.data().tableParams)
      this.pagination = Object.assign({}, this.$options.data().pagination)
      this.guideIds = []
      this.orderTime = []
      this.init()
      this.fetchList()
    },
    /**
     * 每页条数发生变化
     */
    handleSizeChange (size) {
      this.pagination.page = 1
      this.pagination.size = size
      this.tableParams.length = size
      this.tableParams.start = 0
      this.fetchList()
    },
    /**
     * 页码发生变化
     */
    handlePageChange (page) {
      this.tableParams.start = (page - 1) * this.tableParams.length
      this.fetchList()
    },
    confirm () {
      let { id, code, saleSwitch, saleTime } = this.dialogData
      let strifyValue = JSON.stringify({
        isOpen: saleSwitch,
        hours: saleTime
      })
      let params = { id, code, value: strifyValue }
      this.$http
        .fetch(this.$api.weWork.salesStatistics.saveOrUpdate, params)
        .then(res => {
          if (res.success) {
            this.$notify.success('更新成功')
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('加载失败', resp))
        })
      this.dialogVisible = false
    },
    handleSet () {
      let params = { code: this.dialogData.code }
      this.$http
        .fetch(this.$api.weWork.salesStatistics.findByCode, params)
        .then(res => {
          if (res.success) {
            const {
              result: { id, code, value }
            } = res
            let parseStr = JSON.parse(value)
            this.dialogData = {
              ...this.dialogData,
              id,
              code,
              saleSwitch: parseStr.isOpen,
              saleTime: parseStr.hours
            }
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('加载失败', resp))
        })
      this.dialogVisible = true
    },
    // 格式化日期
    formatNumber (number) {
      return String(number)[1] ? String(number) : `0${number}`
    },
    // 设置前一周日期
    handleTimeOld (time, split) {
      let date = new Date(time)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate() - 7
      split = '-'
      return (
        [year, month, day].map(num => this.formatNumber(num)).join(split) +
        ' 00:00:00'
      )
    },
    // 设置昨天日期
    handleTimeNew (time) {
      let date = new Date(time)
      let year = date.getFullYear()
      let month =
        date.getMonth() + 1 > 10
          ? date.getMonth() + 1
          : '0' + (date.getMonth() + 1)
      let day = date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
      day--
      return `${year}-${month}-${day}` + ' 23:59:59'
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@components/NewUi/styles/reset.css';
@import './styles/index.css';

.self-btn {
  width: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
  .guideIds-icon {
    color: #c0c4cc;
  }
}
.dialog-content {
  width: 100%;
}
.sale-switch {
  margin-left: 8px;
}
.input-number {
  width: 100px;
  margin-left: 8px;
}
.template_main {
  .head-title {
    display: inline-block;
  }
  .page-content {
    margin-top: 16px;
    padding: 0 16px 16px;
    background: #fff;
  }
  .params-container {
    margin-top: 16px;
  }
  .table-container {
    margin-top: 16px;
  }
  .shop-content {
    display: flex;
  }
  .pagination-text {
    float: left;
    font-weight: 400;
  }
  .sub-title {
    margin-left: 90px;
    display: flex;
    align-items: center;
    .yellow-point {
      background: #f2aa18;
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-right: 6px;
    }
  }
  .blue-tip {
    margin: 16px 0;
    justify-content: flex-start;
    .tip-button {
      margin-left: 8px;
    }
  }
  .base-view {
    margin-right: 16px;
    margin-bottom: 16px;
  }
  .icon-view {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .operation-view {
    width: auto;
    height: 32px;
    background: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    display: flex;
    flex-direction: row;
    font-size: 14px;
    align-items: center;
    .name {
      width: 70px;
      margin-left: 8px;
    }
  }
  .seach-left-view {
    width: 80%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .date-view {
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    padding: 0px 12px;
  }
  .ml-8 {
    margin-left: 8px;
  }
}
.page-header {
  background: #ffffff;
  margin: -10px -10px 0;
  padding: 16px;
  margin-bottom: 16px;
}
.page-header__text {
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  font-weight: bold;
}
.template-table__pagination {
  padding: 13px 20px;
}
</style>
<style scoped>
.template_main >>> .full-dialog {
  padding-bottom: 6px;
  box-sizing: content-box;
}
.template_main >>> .el-tabs__header {
  border-bottom: none;
}
.template_main >>> .el-input__inner {
  padding-right: 0px;
  text-align: center;
}
</style>
