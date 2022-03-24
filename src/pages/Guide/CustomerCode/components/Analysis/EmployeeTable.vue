<template>
  <page-table :searchCol='24'>
    <template slot='search'>
      <el-form :inline="true" class='form-inline_top' @submit.native.prevent>
        <el-form-item label="所属员工：">
          <GuideDialog  :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" :dialogTitle="`选择${employeeEnv}`" v-model="guideIds" @input="handleChangeGuide" :isOpenDialogAfterRequest='false'>
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(guideIds&&guideIds.length)?`已选择${guideIds.length}个员工`:'全部'}}
                <Icon type="geren" class='guideIds-icon'></Icon>
              </div>
            </template>
          </GuideDialog>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="seachVal" placeholder="请输入员工姓名"  @keyup.enter.native="handleSearch">
            <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <template slot='button'>
      <ns-button type="primary" size='large' @click="employeeListExportClick">导&nbsp;出</ns-button>
    </template>
    <template slot='table'>
      <template>
        <el-table
          :data="_data._table.data"
          class="new-table_border"
          v-loading.lock="_data._table.loadingtable"
          :row-style="tableRowClassName"
          @sort-change="handleSort"
          style="width: 100%">
          <el-table-column
            prop="employeeName"
            label="员工姓名">
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{scope.row.employeeName|| '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="employeeNumber"
            label="工号">
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{scope.row.employeeNumber|| '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="employeeMobile"
            label="手机号">
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{scope.row.employeeMobile|| '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="loginAccount"
            label="线下门店">
            <template slot-scope="scope">
              <div class="scope-name">
                <div :class="'scope-name_text'" >
                  {{scope.row.offlineShops.join(',')}}
                </div>
                <el-popover
                  placement="top-start"
                  class="item"
                  :title="`线下门店（${scope.row.offlineShops.length}）`"
                  width="200"
                  trigger="hover"
                  :content="scope.row.offlineShops.join(',')">
                  <span class="scope-name_tip" slot="reference">共{{scope.row.offlineShops.length}}个</span>
                </el-popover>
                <!-- <el-tooltip class="item" effect="light" :content="scope.row.offlineShops.join(',')" placement="top" popper-class='max-popper'>
                  <span class="scope-name_tip">共{{scope.row.offlineShops.length}}个</span>
                </el-tooltip> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="promotionMasterNumber"
            align='center'
            sortable="custom"
            label="裂变大师人数">
            <template slot-scope="scope">
              <ns-button type='text' @click="handleShowMaster(scope.row, scope.$index)">{{scope.row.promotionMasterNumber}}</ns-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="inviteFriendNumber" align='center'>
            <template slot='header'>
              添加好友总数
              <el-tooltip  effect='light' popper-class='popperClass' placement="top">
                <Icon type="question-circle"  class='question-circle'/>
                <template slot='content'>
                  添加该导购为好友的人数
                </template>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <ns-button type='text' @click="handleShowFriend(scope.row, scope.$index)">{{scope.row.inviteFriendNumber}}</ns-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </template>
    <template slot='pagination'>
      <el-pagination v-if="_data._pagination.enable"
                     class="template-table__pagination"
                     :page-sizes="_data._pagination.sizeOpts"
                     :total="_data._pagination.total"
                     :current-page="_data._pagination.page"
                     :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </template>
  </page-table>
</template>
<script>
import PageTable from '../PageTable'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import GuideDialog from '@/components/NewUi/GuideDialog'
import moment from 'moment'
import { getErrorMsg } from '@/utils/toast'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      model: {
        timeStart: null,
        timeEnd: null,
        employeeName: null,
        guideIds: null,
        guestCodeId: this.$route.query.guestCodeId,
        masterOrder: null,
        friendOrder: null
      },
      validTimeStart: this.$route.query.validTimeStart,
      url: this.$api.guide.customerCode.getEmployeeListByGuestCodeId,
      seachVal: '',
      employeeListExportState: true,
      guideIds: [],
      activeIndex: -1
      // data: { 'success': true, 'result': { 'draw': 0, 'data': [{ 'guideId': '1007162', 'employeeName': '莫志敏', 'employeeNumber': '18458445553', 'employeeMobile': '18458445550', 'offlineShops': ['莫志敏测试店铺', '张邵成企微测试线下门店01', '周杰伦的线下门店', '张邵成企微测试线下门店02', '杭州企微_dzm_001'], 'promotionMasterNumber': 5, 'inviteFriendNumber': 6 }, { 'guideId': '1010408', 'employeeName': '夏敏洁测试2', 'employeeNumber': '18551345765', 'offlineShops': ['夏敏洁测试门店01', '夏敏洁测试门店02', '夏敏洁测试门店03', '夏敏洁企微线下门店05', 'lytest-1', '线下_xmj_001', '杭州企微_dzm_001'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006965', 'employeeName': '张珏', 'employeeNumber': '张珏', 'employeeMobile': '13709382014', 'offlineShops': ['周杰伦的线下门店', '线下门店b'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006964', 'employeeName': '许志龙', 'employeeNumber': 'Aa123456', 'employeeMobile': '18559025686', 'offlineShops': ['昆凌的线下门店', '线下门店a'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006962', 'employeeName': '谢燕珊', 'employeeNumber': '谢燕珊', 'employeeMobile': '15980756362', 'offlineShops': ['线下-wha01', 'xys企微线下店'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006954', 'employeeName': '梁秋霞', 'employeeNumber': '梁秋霞', 'employeeMobile': '15859264967', 'offlineShops': ['鼓浪屿线下店', '会展中心线下店', 'lqx线下店01', 'lqx线下店02', '线下-wha01', '韩金鹏企微新门店门店01', 'lqx集团线下店01', '线下门店-星期三003', '线下门店-星期三004', '线下_xmj_001', '企微_xmj_01'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006948', 'employeeName': '申志奎', 'employeeNumber': '申志奎', 'employeeMobile': '17681806002', 'offlineShops': ['线下门店a'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006947', 'employeeName': '郑兴强', 'employeeNumber': '郑兴强', 'employeeMobile': '15960253866', 'offlineShops': ['线下门店a'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006942', 'employeeName': '黄宇业', 'employeeNumber': 'test20200403', 'employeeMobile': '13185378611', 'offlineShops': ['周杰伦的线下门店', '昆凌的线下门店', '线下门店a', '联想软件园店', '线下门店b', 'lytest-1', 'lytest-2', '夏敏洁测试门店04', '夏敏洁企微线下门店05'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006941', 'employeeName': '徐磊', 'employeeNumber': '13733105819', 'employeeMobile': '13733105819', 'offlineShops': ['于亚洲的线下门店01', '周杰伦的线下门店', '昆凌的线下门店', '线下门店a', '线下门店b', '线下门店c', '线下门店d', '夏敏洁企微线下门店05'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006939', 'employeeName': '测试xmj', 'employeeNumber': '13345678001', 'employeeMobile': '13345678001', 'offlineShops': ['数字门店AB线下', '夏敏洁测试门店01', '夏敏洁测试门店02', '夏敏洁测试门店03', '夏敏洁测试门店04', '夏敏洁企微线下门店05'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006932', 'employeeName': '刘影', 'employeeNumber': 'ly0804', 'employeeMobile': '18355302093', 'offlineShops': ['南讯企业微信店铺', 'lytest-1', 'lytest-2', 'lytest0427', 'lytest-0521', '数字门店AB线下', '周杰伦的线下门店', '昆凌的线下门店', '线下门店a', '线下门店b', '线下门店c', '线下门店d', '联想观音山店', '联想软件园店', '美的空调店', '美的微波炉店', '线下永安1店', '线下永安2店', '线下永安3店', '线下大湖1店', '线下大湖2店', '线下门店-HJP-积分兑换001'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006931', 'employeeName': '彭云超', 'employeeNumber': '彭云超', 'employeeMobile': '18132097151', 'offlineShops': ['导购招募测试门店', '永安测导购招募', 'lytest-2', 'lytest-1', '韩金鹏企微线下门店', '周杰伦的线下门店', '昆凌的线下门店', '美的小家电', '线下门店b', '线下门店c', '线下门店d', 'cyf-线下-01', '线下门店a', '新增门店', '线下门店', '邓志明的企微门店', '暂停营业数字门店的线下门店'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006927', 'employeeName': '于亚洲', 'employeeNumber': '18551770017', 'employeeMobile': '18551770017', 'offlineShops': ['会展中心线下店', '于亚洲的线下门店01', '于亚洲的测试视角01', '于亚洲的测试视角008', '夏敏洁测试门店01', '周杰伦的线下门店', '昆凌的线下门店', '线下门店a', '线下门店b', '线下门店c', '线下门店d', '联想观音山店', '联想软件园店', '美的空调店', '美的微波炉店', '线下永安1店', '线下永安2店', '线下永安3店', '线下大湖1店', '线下大湖2店'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1005761', 'employeeName': '张泽川', 'employeeNumber': '张泽川', 'employeeMobile': '15868874895', 'offlineShops': ['南讯企业微信店铺'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }], 'recordsTotal': '17', 'recordsFiltered': '17' } }
    }
  },
  components: { PageTable, GuideDialog },
  props: ['startTime', 'endTime'],
  mixins: [tableMixin],
  computed: {
    ...mapState({
      // 环境判断
      cloudPlatformType: state => state.user.remumber.remumber_login_info.productConfig.cloudPlatformType
    }),
    employeeEnv () {
      return this.cloudPlatformType === 'ecrp' ? '员工' : '成员'
    }
  },
  mounted () {
    this.$searchAction$()
  },
  methods: {
    // 修改请求参数
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    handleChangeGuide (value) {
      this.changeSearchfrom({ guideIds: value.length > 0 ? value.join(',') : null })
    },
    handleSearch () {
      this.changeSearchfrom({ employeeName: this.seachVal })
    },
    employeeListExportClick () {
      if (!this._data._table.data.length) {
        this.$notify.info('当前没有匹配的数据项')
        return
      }
      if (!this.employeeListExportState) {
        this.$notify.info('正在导出中，请不要重复操作')
        return
      }
      let params = this.$generateParams$()
      if (!this.model.timeStart && !this.model.timeEnd) {
        params.searchMap.timeStart = this.validTimeStart
        params.searchMap.timeEnd = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
      this.employeeListExportState = false
      let that = this
      that.$notify.info('导出中，请稍后片刻')
      this.$http
        .fetch(this.$api.guide.customerCode.employeeListExport, params)
        .then(resp => {
          that.employeeListExportState = true
          that.$notify.success('下载完成')
        })
        .catch(resp => {
          that.employeeListExportState = true
          if (!resp.size === 0) {
            that.$notify.error('导出报错，请联系管理员')
          } else {
            let url = window.URL.createObjectURL(new Blob([resp]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url

            let time = ''
            if (params.searchMap.timeStart && params.searchMap.timeEnd) {
              const csvStartTime = params.searchMap.timeStart.substring(0, 10).replace(/-/g, '')
              const csvEndTime = params.searchMap.timeEnd.substring(0, 10).replace(/-/g, '')
              time = csvStartTime + '-' + csvEndTime
            } else {
              time = '全部'
            }
            let fileName = '参与活动员工总数明细' + time + '.csv'
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
          }
        })
    },
    // 排序
    handleSort (data) {
      const order = data.order
      const prop = data.prop
      const sortData = {
        promotionMasterNumber: 'masterOrder',
        inviteFriendNumber: 'friendOrder',
        descending: 'desc',
        ascending: 'asc'
      }
      this.changeSearchfrom(Object.assign({}, { masterOrder: null, friendOrder: null }, { [sortData[prop]]: sortData[order] }))
    },
    handleShowMaster (item, index) {
      this.activeIndex = index
      this.$emit('showMaster', item)
    },
    handleShowFriend (item, index) {
      this.activeIndex = index
      this.$emit('showFriend', item)
    },
    getOhterGuideForMaster (type) {
      this.getOhterGuide(type, this.handleShowMaster)
    },
    getOhterGuideForFriend (type) {
      this.getOhterGuide(type, this.handleShowFriend)
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === this.activeIndex) {
        return { backgroundColor: '#D9EFFE' }
      }
      return ''
    },
    // 查看上一个或下一个导购或好友
    getOhterGuide (type, cb) {
      const { page, size, total } = this._data._pagination
      if (type === 'prev') {
        if (this.activeIndex === 0) {
          if (page === 1) {
            this.$notify.error('暂无上一个员工')
          } else {
            this._data._pagination.page = page - 1
            this.$queryList$(this.$generateParams$()).then(() => {
              const index = this._data._table.data.length - 1
              cb(this._data._table.data[index], index)
            })
          }
        } else {
          const index = this.activeIndex - 1
          cb(this._data._table.data[index], index)
        }
      } else if (type === 'next') {
        if (((page - 1) * size + this.activeIndex + 1) >= total) {
          this.$notify.error('暂无下一个员工')
        } else {
          if (this.activeIndex === size - 1) {
            this._data._pagination.page = page + 1
            this.$queryList$(this.$generateParams$()).then(() => {
              const index = 0
              cb(this._data._table.data[index], index)
            })
          } else {
            const index = this.activeIndex + 1
            cb(this._data._table.data[index], index)
          }
        }
      }
    },
    clearActiveIndex () {
      this.activeIndex = -1
    }
  },
  watch: {
    startTime: {
      handler (newVal) {
        this.changeSearchfrom({ timeStart: newVal, timeEnd: this.endTime })
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../styles/reset.css";
.search-icon {
  font-size: 22px;
  margin-top: 2px;
}
.scope-name_text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.scope-name_tip {
  color: #0091FA
}
.max-popper {
  max-width: 450px;
}
.self-btn {
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
  .guideIds-icon {
    color:#C0C4CC;
  }
}
</style>
