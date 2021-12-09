<template>
  <page-table :searchCol='24'>
    <template slot='search'>
      <el-form :inline="true" class='form-inline_top'>
        <el-form-item label="所属员工：">
          <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" dialogTitle="选择员工" v-model="guideIds" @input="handleChangeGuide">
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(guideIds&&guideIds.length)?`已选择${guideIds.length}个员工`:'全部'}}
                <Icon type="geren" class='guideIds-icon'></Icon>
              </div>
            </template>
          </NsGuideDialog>
        </el-form-item>
        <el-form-item label="奖励类型：" class='el-form__change'>
          <el-select v-model="model.status" placeholder="请选择" @change='(value)=>{changeSearchfrom({prizeType:value})}'>
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖励内容：" @keyup.enter.native="handleSearch">
          <el-input v-model="prizeName" placeholder="请输入奖励内容">
          </el-input>
        </el-form-item>
        <el-form-item label="领取时间：" class='el-form__change'>
          <el-date-picker
            v-model="seachDate"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
            :default-time="['00:00:00','23:59:59']"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="seachVal" placeholder="请输入裂变大师昵称"  @keyup.enter.native="handleSearch">
            <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <template slot='button'>
      <ns-button type="primary" size='large' @click="exportClick">导&nbsp;出</ns-button>
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
            label="裂变大师">
            <template slot-scope="scope">
              <div class="scope-title">
                <div class="scope-title_text">
                  {{scope.row.name||'-'}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120px" prop="guideName" label="所属员工">
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{scope.row.guideName|| '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="guideName" label="员工所属门店">
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
          <el-table-column prop="prizeType" label="奖励类型">
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{prizeTypeList[scope.row.prizeType].value}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="prizeGrade" label="奖励阶梯">
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{prizeGradeList[scope.row.prizeGrade].value}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="prizeName" label="奖励内容">
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{scope.row.prizeName || '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="receiveTime" label="领取时间">
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{scope.row.receiveTime|| '-'}}
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
import NsGuideDialog from '@/components/NsGuideDialog'
import defaultIcon from '@/assets/defultheadPic.png'
import moment from 'moment'
export default {
  data () {
    return {
      model: {
        timeStart: null,
        timeEnd: null,
        employeeName: null,
        guideIds: null,
        guestCodeStatus: null,
        guestCodeId: this.$route.query.guestCodeId,
        inviteFriendNo: null,
        lastAddFriendsDate: null
      },
      validTimeStart: this.$route.query.validTimeStart,
      url: this.$api.guide.customerCode.findAwardRecordTable,
      seachVal: '',
      prizeName: '',
      seachDate: [],
      guideIds: [],
      exportState: true,
      statusList: [
        {
          label: '全部',
          value: null
        }, {
          label: '优惠券',
          value: 1
        }, {
          label: '红包',
          value: 2
        }
      ],
      // 奖励类型
      prizeTypeList: {
        0: {
          value: '未知'
        },
        1: {
          value: '优惠券'
        },
        2: {
          value: '红包'
        }
      },
      // 奖励阶梯
      prizeGradeList: {
        0: {
          value: '未知'
        },
        1: {
          value: '阶梯一'
        },
        2: {
          value: '阶梯二'
        },
        3: {
          value: '阶梯三'
        },
        4: {
          value: '阶梯四'
        },
        5: {
          value: '阶梯五'
        }
      },
      activeIndex: -1,
      defaultIcon
    }
  },
  components: { PageTable, NsGuideDialog },
  mixins: [tableMixin],
  props: ['startTime', 'endTime'],
  mounted () {
    this.$searchAction$()
  },
  methods: {
    handleChangeGuide (value) {
      this.changeSearchfrom({ guideIds: value.length > 0 ? value.join(',') : null })
    },
    exportClick () {
      if (!this._data._table.data.length) {
        this.$notify.info('当前没有匹配的数据项')
        return
      }
      if (!this.exportState) {
        this.$notify.info('正在导出中，请不要重复操作')
        return
      }
      let params = this.$generateParams$()
      if (!this.model.timeStart && !this.model.timeEnd) {
        params.searchMap.timeStart = this.validTimeStart
        params.searchMap.timeEnd = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
      this.exportState = false
      let that = this
      that.$notify.info('导出中，请稍后片刻')
      this.$http
        .fetch(this.$api.guide.customerCode.awardRecordTableExport, params)
        .then(resp => {
          that.exportState = true
          that.$notify.success('下载完成')
        })
        .catch(resp => {
          that.exportState = true
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
            let fileName = '领奖记录明细' + time + '.csv'
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
          }
        })
    },
    handleSearch () {
      this.changeSearchfrom({ name: this.seachVal, prizeName: this.prizeName })
    },
    // 修改请求参数
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    handleSort (data) {
      const order = data.order
      const prop = data.prop
      const sortData = {
        inviteFriendNo: 'inviteFriendNo',
        lastAddFriendsDate: 'addTimeOrderNo',
        descending: 0,
        ascending: 1
      }
      this.changeSearchfrom(Object.assign({}, { inviteFriendNo: null, addTimeOrderNo: null }, { [sortData[prop]]: sortData[order] }))
    },
    getOhterGuideForFriend (type) {
      this.getOhterGuide(type, this.handleShowFriend)
    },
    // 查看上一个或下一个导购或好友
    getOhterGuide (type, cb) {
      const { page, size, total } = this._data._pagination
      if (type === 'prev') {
        if (this.activeIndex === 0) {
          if (page === 1) {
            this.$notify.error('暂无上一个裂变大师')
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
          this.$notify.error('暂无下一个裂变大师')
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
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === this.activeIndex) {
        return { backgroundColor: '#D9EFFE' }
      }
      return ''
    },
    clearActiveIndex () {
      this.activeIndex = -1
    }
  },
  watch: {
    seachDate (newVal) {
      const date = newVal || [null, null]
      this.changeSearchfrom({ receiveTimeStart: date[0], receiveTimeEnd: date[1] })
    },
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
.scope-title {
  display: flex;
  align-items: center;
}
.scope-title_img {
  height: 32px;
  width: 32px;
  margin-right: 8px;
}
.scope-name_tag.el-tag {
  border-radius: 2px;
  &.el-tag--success {
    background: #F7FFF0;
    border: 1px solid #53BF1D;
    color: #262626;
  }
  &.el-tag--info {
    background: #F5F5F5;
    border: 1px solid #D9D9D9;
    color: #262626;
  }
  &.el-tag--warning {
    background: #FFFBE6;
    border: 1px solid #FFAE0D;
    color: #262626;
  }
}
.search-icon {
  font-size: 22px;
  margin-top: 2px;
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
