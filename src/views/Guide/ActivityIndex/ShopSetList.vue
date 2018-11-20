
<template>
<!-- 门店指标  wanrengang 20180712 -->
<div>
  <div class="template-table">
    <!-- 筛选start -->
    <el-tabs v-model="activeName" @tab-click="tabHandleClick">
    <el-tab-pane label="销售指标" name="0"></el-tab-pane>
    <el-tab-pane label="招募会员指标" name="1"></el-tab-pane>
  </el-tabs>
  <!-- 简单搜索start -->
  <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->
          <el-col :span="7">
            <div class="topTip">
              <ns-button type="primary" @click="AddShowToggle">批量设置</ns-button><span class="tipInfo">单位：<span v-if="searchObj.searchMap.type==1">人</span><span v-if="searchObj.searchMap.type==0">万元</span></span>
            </div>
          </el-col>
          <el-col :span="17">
            <!-- 右上角操作区域 -->
            <div class="float-right tabSearchBtn">
              <ns-button @click="tabSearchType" style="padding: 9px 0 9px 10px;opacity: 0.5;color: #002041;" type="text">{{searchType.tipText}}<i :class="{'el-icon--right': true, 'el-icon-arrow-down': !searchType.advanced, 'el-icon-arrow-up': searchType.advanced} ">
                </i></ns-button>
            </div>
            <el-form ref="searchform" class="float-right" v-if="!searchType.advanced" :inline="true" :model="searchform">
              <el-form-item label="年份：" prop="year">
                <el-date-picker
                  :clearable="false"
                  :editable="false"
                  v-model="searchform.year"
                  type="year"
                  placeholder="选择年"
                  @change="yearChange"
                  >
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
          <el-form-item label="年份：" prop="year">
            <el-date-picker
              v-model="searchform.year"
              type="year"
              :editable="false"
              :clearable="false"
              placeholder="选择年"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="门店名称：" prop="shopName">
            <el-input v-model="searchform.shopName" placeholder="请输入门店名称"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="shopStatus">
            <el-select v-model="searchform.shopStatus" placeholder="请选择状态">
              <el-option  v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" >
              </el-option>
            </el-select>
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
        label="营业状态"
        width="86"
        prop="shopStatusMean"
      >
      </el-table-column>
      <el-table-column
        label="1月"
        prop="quota1"
        width='74'
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="2月"
        width='74'
        prop="quota2"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="3月"
        width='74'
        prop="quota3"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="4月"
        width='74'
        prop="quota4"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="5月"
        width='74'
        prop="quota5"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="6月"
        width='74'
        prop="quota6"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="7月"
        width='74'
        prop="quota7"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="8月"
        width='74'
        prop="quota8"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="9月"
        width='74'
        prop="quota9"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="10月"
        width='74'
        prop="quota10"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="11月"
        width='74'
        prop="quota11"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="12月"
        width='74'
        prop="quota12"
        align="center"
      >
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
  <shopSetAdd ref="addDialogDom" :callBack="loadListFun"></shopSetAdd>
</div>
</template>
<script>
import moment from 'moment'
import listPageMixin from 'mixins/listPage'
import shopSetAdd from './ShopSetAdd'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      activeName: '0',
      statusOptions: [
        {
          // 状态
          value: '1',
          label: '正常营业'
        },
        {
          value: '-1',
          label: '暂停营业'
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
          value: 'JMD',
          label: '加盟'
        }
      ],
      selectedArr: [],
      searchform: {
        shopName: '',
        year: '2018' // 年份,
      },
      // 新增保存时提交对象
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
    this.searchObj.searchMap.type = 0
    this.loadListFun(this.searchObj)
  },
  methods: {
    // 切换搜索模式
    tabSearchType () {
      this.searchType.advanced = !this.searchType.advanced
      if (this.searchType.advanced) {
        this.searchType.tipText = '收起搜索'
      } else {
        this.searchType.tipText = '展开搜索'
      }
    },
    tabHandleClick (tab, event) {
      this.searchObj.searchMap.type = tab.name
      this.loadListFun()
    },
    // 打开弹窗
    AddShowToggle () {
      if (this.selectedArr.length === 0) {
        this.$notify.error('请选择门店')
        return
      }
      // 重置选择的门店
      this.saveObj.selectedArr = this.selectedArr
      this.saveObj.year = this.searchObj.searchMap.year
      this.saveObj.type = this.searchObj.searchMap.type
      // 传递保存时需要的参数
      this.$nextTick(() => {
        this.$refs.addDialogDom.showToggle(this.saveObj)
      })
    },
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.guide.guide.shopIndexList, searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.dataList.map(item => {
            switch (item.shopStatus) {
              case 0 : item.shopStatusMean = '删除'; break
              case -1 : item.shopStatusMean = '暂停'; break
              case -2 : item.shopStatusMean = '已关店'; break
              case 1 : item.shopStatusMean = '正常营业'; break
            }
            if (searchObj.searchMap.type === 0 || searchObj.searchMap.type === '0') {
              for (let i in item) {
                if (i.indexOf('quota') !== -1) {
                  item[i] = (item[i] / 10000).toFixed(2)
                }
              }
            } else {
              for (let i in item) {
                if (i.indexOf('quota') !== -1 && item[i] === null) {
                  item[i] = 0
                }
              }
            }
          })
          console.log(this.dataList)
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
        })
      this.loading = false
      // 总条数
    },
    // 选择门店
    handleSelectionChange (val) {
      this.selectedArr = val
      // this.model.monthDay =
    },
    // 提交搜索
    submitForm (formName) {
      // 组装搜索对象
      this.searchObj.searchMap.shopType = this.searchform.shopType
      this.searchObj.searchMap.shopName = this.searchform.shopName
      this.searchObj.searchMap.shopStatus = this.searchform.shopStatus
      this.loadListFun()
    },
    // 选择年份
    yearChange (e) {
      this.searchObj.searchMap.year = moment(e).format('YYYY')
    }
  },
  components: {
    shopSetAdd
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
