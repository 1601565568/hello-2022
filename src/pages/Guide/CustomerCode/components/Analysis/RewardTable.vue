<template>
  <page-table :searchCol='24'>
    <template slot='search'>
      <el-form :inline="true" class='form-inline_top' @submit.native.prevent>
        <el-form-item :label="`所属${employeeEnv}：`">
          <GuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" :dialogTitle="`选择${employeeEnv}`" v-model="guideIds" @input="handleChangeGuide">
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(guideIds&&guideIds.length)?`已选择${guideIds.length}个${employeeEnv}`:'全部'}}
                <Icon type="geren" class='guideIds-icon'></Icon>
              </div>
            </template>
          </GuideDialog>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="seachVal" placeholder="请输入裂变大师昵称"  @keyup.enter.native="handleSearch">
            <Icon type="ns-search-copy" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <template slot='button'>
      <ns-button type="primary" size='large' @click="exportClick" id="exportButton">导&nbsp;出</ns-button>
    </template>
    <template slot='table'>
      <template>
        <el-table
          :data="_data._table.data"
          class="new-table_border"
          v-loading.lock="_data._table.loadingtable"
          @sort-change="handleSort"
          style="width: 100%">
          <el-table-column  width="120px"
            prop="name"
            label="裂变大师">
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{scope.row.name|| '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120px" prop="guideName" :label="`所属${employeeEnv}`">
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{scope.row.guideName|| '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if='cloudPlatformType === "ecrp"' prop="guideName" label="员工所属门店">
            <template slot-scope="scope">
              <div class="scope-name">
                <div :class="'scope-name_text'" >
                  {{scope.row.offlineShopsStr || '-'}}
                </div>
                <el-popover v-if="scope.row.offlineShopsStr"
                  placement="top-start"
                  class="item"
                  width="180"
                  trigger="hover"
                  :content="scope.row.offlineShopsStr||''">
                  <span class="scope-name_tip" slot="reference">共{{scope.row.offlineShopsStr.split(',').length}}个</span>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="180px" prop="friendsCount">
            <template slot='header'>
              成功邀请/扣减好友数
              <el-tooltip  effect='light' popper-class='popperClass' placement="top">
                <Icon type="question-circle"  class='question-circle'/>
                <template slot='content'>
                  成功邀请数：有效的成功邀请人数（已扣除“扣减好友数”）<br />
                  扣减好友数：因活动规则解除好友后扣除的好友数
                </template>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{scope.row.friendsCount||0}}/{{scope.row.unfriendsCount||0}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="presentsState">
            <template slot='header'>
              已达标门槛
              <el-tooltip  effect='light' popper-class='popperClass' placement="top">
                <Icon type="question-circle" class='question-circle'/>
                <template slot='content'>
                  显示 “达标阶梯（达标要求人数）”<br/>
                  例：阶梯一（3）
                </template>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{scope.row.prizeLadderStr || '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120px" prop="guideName" label="已领次数">
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{scope.row.count || '0'}}
              </div>
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
        name: null,
        guideIds: null,
        guestCodeId: this.$route.query.guestCodeId,
        presentsState: null // 赠送状态
      },
      exportState: true,
      validTimeStart: this.$route.query.validTimeStart,
      url: this.$api.guide.customerCode.findActivityReachStandard,
      seachVal: '',
      guideIds: [],
      activeIndex: -1,
      statusList: [
        {
          label: '全部',
          value: null
        }, {
          label: '已领取',
          value: 1
        }, {
          label: '待领取',
          value: 2
        }
      ]
      // data: { 'success': true, 'result': { 'draw': 0, 'data': [{ 'guideId': '1007162', 'employeeName': '莫志敏', 'employeeNumber': '18458445553', 'employeeMobile': '18458445550', 'offlineShops': ['莫志敏测试店铺', '张邵成企微测试线下门店01', '周杰伦的线下门店', '张邵成企微测试线下门店02', '杭州企微_dzm_001'], 'promotionMasterNumber': 5, 'inviteFriendNumber': 6 }, { 'guideId': '1010408', 'employeeName': '夏敏洁测试2', 'employeeNumber': '18551345765', 'offlineShops': ['夏敏洁测试门店01', '夏敏洁测试门店02', '夏敏洁测试门店03', '夏敏洁企微线下门店05', 'lytest-1', '线下_xmj_001', '杭州企微_dzm_001'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006965', 'employeeName': '张珏', 'employeeNumber': '张珏', 'employeeMobile': '13709382014', 'offlineShops': ['周杰伦的线下门店', '线下门店b'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006964', 'employeeName': '许志龙', 'employeeNumber': 'Aa123456', 'employeeMobile': '18559025686', 'offlineShops': ['昆凌的线下门店', '线下门店a'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006962', 'employeeName': '谢燕珊', 'employeeNumber': '谢燕珊', 'employeeMobile': '15980756362', 'offlineShops': ['线下-wha01', 'xys企微线下店'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006954', 'employeeName': '梁秋霞', 'employeeNumber': '梁秋霞', 'employeeMobile': '15859264967', 'offlineShops': ['鼓浪屿线下店', '会展中心线下店', 'lqx线下店01', 'lqx线下店02', '线下-wha01', '韩金鹏企微新门店门店01', 'lqx集团线下店01', '线下门店-星期三003', '线下门店-星期三004', '线下_xmj_001', '企微_xmj_01'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006948', 'employeeName': '申志奎', 'employeeNumber': '申志奎', 'employeeMobile': '17681806002', 'offlineShops': ['线下门店a'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006947', 'employeeName': '郑兴强', 'employeeNumber': '郑兴强', 'employeeMobile': '15960253866', 'offlineShops': ['线下门店a'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006942', 'employeeName': '黄宇业', 'employeeNumber': 'test20200403', 'employeeMobile': '13185378611', 'offlineShops': ['周杰伦的线下门店', '昆凌的线下门店', '线下门店a', '联想软件园店', '线下门店b', 'lytest-1', 'lytest-2', '夏敏洁测试门店04', '夏敏洁企微线下门店05'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006941', 'employeeName': '徐磊', 'employeeNumber': '13733105819', 'employeeMobile': '13733105819', 'offlineShops': ['于亚洲的线下门店01', '周杰伦的线下门店', '昆凌的线下门店', '线下门店a', '线下门店b', '线下门店c', '线下门店d', '夏敏洁企微线下门店05'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006939', 'employeeName': '测试xmj', 'employeeNumber': '13345678001', 'employeeMobile': '13345678001', 'offlineShops': ['数字门店AB线下', '夏敏洁测试门店01', '夏敏洁测试门店02', '夏敏洁测试门店03', '夏敏洁测试门店04', '夏敏洁企微线下门店05'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006932', 'employeeName': '刘影', 'employeeNumber': 'ly0804', 'employeeMobile': '18355302093', 'offlineShops': ['南讯企业微信店铺', 'lytest-1', 'lytest-2', 'lytest0427', 'lytest-0521', '数字门店AB线下', '周杰伦的线下门店', '昆凌的线下门店', '线下门店a', '线下门店b', '线下门店c', '线下门店d', '联想观音山店', '联想软件园店', '美的空调店', '美的微波炉店', '线下永安1店', '线下永安2店', '线下永安3店', '线下大湖1店', '线下大湖2店', '线下门店-HJP-积分兑换001'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006931', 'employeeName': '彭云超', 'employeeNumber': '彭云超', 'employeeMobile': '18132097151', 'offlineShops': ['导购招募测试门店', '永安测导购招募', 'lytest-2', 'lytest-1', '韩金鹏企微线下门店', '周杰伦的线下门店', '昆凌的线下门店', '美的小家电', '线下门店b', '线下门店c', '线下门店d', 'cyf-线下-01', '线下门店a', '新增门店', '线下门店', '邓志明的企微门店', '暂停营业数字门店的线下门店'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1006927', 'employeeName': '于亚洲', 'employeeNumber': '18551770017', 'employeeMobile': '18551770017', 'offlineShops': ['会展中心线下店', '于亚洲的线下门店01', '于亚洲的测试视角01', '于亚洲的测试视角008', '夏敏洁测试门店01', '周杰伦的线下门店', '昆凌的线下门店', '线下门店a', '线下门店b', '线下门店c', '线下门店d', '联想观音山店', '联想软件园店', '美的空调店', '美的微波炉店', '线下永安1店', '线下永安2店', '线下永安3店', '线下大湖1店', '线下大湖2店'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }, { 'guideId': '1005761', 'employeeName': '张泽川', 'employeeNumber': '张泽川', 'employeeMobile': '15868874895', 'offlineShops': ['南讯企业微信店铺'], 'promotionMasterNumber': 0, 'inviteFriendNumber': 0 }], 'recordsTotal': '17', 'recordsFiltered': '17' } }
    }
  },
  components: { PageTable, GuideDialog },
  computed: {
    ...mapState({
      // 环境判断
      cloudPlatformType: state => state.user.remumber.remumber_login_info.productConfig.cloudPlatformType
    }),
    employeeEnv () {
      return this.cloudPlatformType === 'ecrp' ? '员工' : '成员'
    }
  },
  props: ['startTime', 'endTime'],
  mixins: [tableMixin],
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
      this.changeSearchfrom({ name: this.seachVal })
    },
    exportClick () {
      if (!this._data._table.data.length) {
        this.$notify.info('当前没有匹配的数据项')
        return
      }
      let params = this.$generateParams$()
      if (!this.model.timeStart && !this.model.timeEnd) {
        params.searchMap.timeStart = this.validTimeStart
        params.searchMap.timeEnd = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
      const sendParams = {
        ...params.searchMap,
        exportType: 27
      }
      const elem = document.getElementById('exportButton')
      const rect = elem.getBoundingClientRect()
      this.$http.fetch(this.$api.guide.task.exportExcel, sendParams).then((resp) => {
        this.$store.dispatch({
          type: 'down/downAction',
          status: true,
          top: rect.top,
          right: 60
        })
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
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
    // handleShowMaster (item, index) {
    //   this.activeIndex = index
    //   this.$emit('showMaster', item)
    // },
    // handleShowFriend (item, index) {
    //   this.activeIndex = index
    //   this.$emit('showFriend', item)
    // },
    // getOhterGuideForMaster (type) {
    //   this.getOhterGuide(type, this.handleShowMaster)
    // },
    // getOhterGuideForFriend (type) {
    //   this.getOhterGuide(type, this.handleShowFriend)
    // },
    // tableRowClassName ({ row, rowIndex }) {
    //   if (rowIndex === this.activeIndex) {
    //     return { backgroundColor: '#D9EFFE' }
    //   }
    //   return ''
    // },
    // 查看上一个或下一个导购或好友
    // getOhterGuide (type, cb) {
    //   const { page, size, total } = this._data._pagination
    //   if (type === 'prev') {
    //     if (this.activeIndex === 0) {
    //       if (page === 1) {
    //         this.$notify.error('暂无上一个员工')
    //       } else {
    //         this._data._pagination.page = page - 1
    //         this.$queryList$(this.$generateParams$()).then(() => {
    //           const index = this._data._table.data.length - 1
    //           cb(this._data._table.data[index], index)
    //         })
    //       }
    //     } else {
    //       const index = this.activeIndex - 1
    //       cb(this._data._table.data[index], index)
    //     }
    //   } else if (type === 'next') {
    //     if (((page - 1) * size + this.activeIndex + 1) >= total) {
    //       this.$notify.error('暂无下一个员工')
    //     } else {
    //       if (this.activeIndex === size - 1) {
    //         this._data._pagination.page = page + 1
    //         this.$queryList$(this.$generateParams$()).then(() => {
    //           const index = 0
    //           cb(this._data._table.data[index], index)
    //         })
    //       } else {
    //         const index = this.activeIndex + 1
    //         cb(this._data._table.data[index], index)
    //       }
    //     }
    //   }
    // },
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
