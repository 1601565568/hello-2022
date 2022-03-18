<template>
  <page-table>
    <template slot='search'>
      <el-form :inline="true" class='form-inline_top'>
        <el-form-item label="添加员工：">
          <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" dialogTitle="选择员工" v-model="guideIds" @input="handleChangeGuide">
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(guideIds&&guideIds.length)?`已选择${guideIds.length}个员工`:'全部'}}
                <Icon type="geren" class='guideIds-icon'></Icon>
              </div>
            </template>
          </NsGuideDialog>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="seachVal" :placeholder="`请输入${holderName}`"  @keyup.enter.native="handleSearch" class='diff-input'>
            <template slot="prepend">
              <el-select v-model='searchType' class='input-select'>
                <el-option :key="1" label="好友昵称" :value="1"></el-option>
                <el-option :key="2" label="裂变大师" :value="2"></el-option>
              </el-select>
            </template>
            <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
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
          <el-table-column
            prop="friendName"
            label="好友昵称">
            <template slot-scope="scope">
              <div class="scope-title">
                <img :src='scope.row.friendAvatar || defaultIcon' class="scope-title_img">
                <div class="scope-title_text">
                  {{scope.row.friendName||'-'}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="employeeName"
            label="好友添加员工">
            <template slot-scope="scope">
              <div class="scope-title_text" v-if="scope.row.addOfflineShops">
                <div class="scope-name">
                  <div :class="'scope-name_text'+ (scope.row.addOfflineShops.split(',').length>10?' more':'')" >
                    {{scope.row.addEmployeeName}}({{scope.row.addOfflineShops}})
                  </div>
                  <el-popover
                    placement="top-start"
                    class="item"
                    width="200"
                    trigger="hover"
                    :content="scope.row.addOfflineShops">
                    <span class="scope-name_tip" slot="reference">共{{scope.row.addOfflineShops.split(',').length}}个</span>
                  </el-popover>
                </div>
              </div>
              <div class="scope-title_text" v-else>
                <div class="scope-name">
                  <div :class="'scope-name_text'" >
                    {{scope.row.addEmployeeName}}
                  </div>
                  <el-popover
                    placement="top-start"
                    class="item"
                    width="200"
                    trigger="hover"
                    content="">
                    <span class="scope-name_tip" slot="reference">共0个</span>
                  </el-popover>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="employeeNumber"
            label="工号">
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{scope.row.addEmployeeNumber|| '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="promotionName"
            label="裂变大师">
            <template slot-scope="scope">
              <div class="scope-title">
                <img :src='scope.row.promotionAvatar || defaultIcon' class="scope-title_img">
                <div class="scope-title_text">
                  {{scope.row.promotionName||'-'}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="employeeName"
            label="裂变大师所属员工">
            <template slot-scope="scope">
              <div class="scope-title_text" v-if="scope.row.offlineShops">
                <div class="scope-name">
                  <div :class="'scope-name_text'+ (scope.row.offlineShops.split(',').length>10?' more':'')" >
                    {{scope.row.employeeName}}({{scope.row.offlineShops}})
                  </div>
                  <el-popover
                    placement="top-start"
                    class="item"
                    width="200"
                    trigger="hover"
                    :content="scope.row.offlineShops">
                    <span class="scope-name_tip" slot="reference">共{{scope.row.offlineShops.split(',').length}}个</span>
                  </el-popover>
                  <!-- <div class="scope-name_num">
                    共<span class="scope-name_num__blue">{{scope.row.emplee.length}}</span>个
                  </div> -->
                </div>
              </div>
              <div class="scope-title_text" v-else>
                <div class="scope-name">
                  <div :class="'scope-name_text'" >
                    {{scope.row.employeeName}}
                  </div>
                  <el-popover
                  placement="top-start"
                  class="item"
                  width="200"
                  trigger="hover"
                  content="">
                  <span class="scope-name_tip" slot="reference">共0个</span>
                </el-popover>
                </div>
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
            prop="addTime"
            sortable="custom"
            label="添加时间">
            <template slot-scope="scope">
              <div class="scope-title_text">
                {{scope.row.addTime|| '-'}}
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
import { API_ROOT } from '@/config/http.js'
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
        guestCodeId: this.$route.query.guestCodeId,
        type: 1
      },
      exportState: true,
      validTimeStart: this.$route.query.validTimeStart,
      url: this.$api.guide.customerCode.getFriendListByParam,
      seachVal: '',
      guideIds: [],
      searchType: 1,
      defaultIcon
    }
  },
  components: { PageTable, NsGuideDialog },
  computed: {
    holderName () {
      return ['', '好友昵称', '裂变大师'][this.searchType]
    }
  },
  props: ['startTime', 'endTime'],
  mixins: [tableMixin],
  mounted () {
    this.$searchAction$()
  },
  methods: {
    handleChangeGuide (value) {
      this.changeSearchfrom({ guideIds: value.length > 0 ? value.join(',') : null })
    },
    handleSearch () {
      if (this.searchType === 1) {
        this.changeSearchfrom({ friendName: this.seachVal, promotionMasterName: null })
      } else {
        this.changeSearchfrom({ promotionMasterName: this.seachVal, friendName: null })
      }
    },
    // 排序
    handleSort (data) {
      const order = data.order
      const prop = data.prop
      const sortData = {
        addTime: 'addTimeOrder',
        descending: 'desc',
        ascending: 'asc'
      }
      this.changeSearchfrom(Object.assign({}, { [sortData[prop]]: sortData[order] }))
    },
    // 修改请求参数
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    // 导出
    handleDownLoad () {
      this.exportData('/')
    },
    exportClick () {
      if (!this._data._table.data.length) {
        this.$notify.info('当前没有匹配的数据项')
        return
      }
      // if (!this.exportState) {
      //   this.$notify.info('正在导出中，请不要重复操作')
      //   return
      // }
      let params = this.$generateParams$()
      if (!this.model.timeStart && !this.model.timeEnd) {
        params.searchMap.timeStart = this.validTimeStart
        params.searchMap.timeEnd = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
      const sendParams = {
        ...params.searchMap,
        exportType: 26
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
      // this.exportState = false
      // let that = this
      // that.$notify.info('导出中，请稍后片刻')
      // this.$http
      //   .fetch(this.$api.guide.customerCode.friendListExport, params)
      //   .then(resp => {
      //     that.exportState = true
      //     that.$notify.success('下载完成')
      //   })
      //   .catch(resp => {
      //     that.exportState = true
      //     if (!resp.size === 0) {
      //       that.$notify.error('导出报错，请联系管理员')
      //     } else {
      //       let url = window.URL.createObjectURL(new Blob([resp]))
      //       let link = document.createElement('a')
      //       link.style.display = 'none'
      //       link.href = url

      //       let time = ''
      //       if (params.searchMap.timeStart && params.searchMap.timeEnd) {
      //         const csvStartTime = params.searchMap.timeStart.substring(0, 10).replace(/-/g, '')
      //         const csvEndTime = params.searchMap.timeEnd.substring(0, 10).replace(/-/g, '')
      //         time = csvStartTime + '-' + csvEndTime
      //       } else {
      //         time = '全部'
      //       }
      //       let fileName = '邀请好友总数明细' + time + '.csv'
      //       link.setAttribute('download', fileName)
      //       document.body.appendChild(link)
      //       link.click()
      //     }
      //   })
    },
    /**
     * 校验当前是否表格有数据
     * @returns {boolean}
     */
    checkTableDataExists () {
      if (!this._data || !this._data._table || !this._data._table.data || this._data._table.data.length < 1) {
        this.$notify.error('当前没有匹配的数据项')
        return true
      }
      return false
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
.scope-title {
  display: flex;
  align-items: center;
}
.scope-title_img {
  height: 32px;
  width: 32px;
  margin-right: 8px;
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
.el-input-group__append .el-select.input-select {
  margin: -10px 0px;
  width: 115px;
  padding: 0 10px;
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
<style scoped>
.diff-input {
>>>.el-input-group__prepend {
  background-color: #fff;
  border:none;
}
>>> .input-select {
  margin: -10px 0px;
  width: 110px;
  padding-right: 8px;
}
}
</style>
