<template>
  <page-table>
    <template slot='search'>
    <el-form :inline="true" class='form-inline_top'>
      <el-form-item label="所属员工：">
        <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" dialogTitle="选择员工" v-model="guideIds" @input="handleChangeGuide">
          <template slot='selfBtn'>
            <Icon type="geren"></Icon>
          </template>
        </NsGuideDialog>
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="seachVal" :placeholder="`请输入${holderName}`"  @keyup.enter.native="handleSearch" class='diff-input'>
          <template slot="prepend">
            <el-select v-model='searchType' class='input-select'>
              <el-option :key="1" label="好友昵称" :value="1"></el-option>
              <el-option :key="2" label="推广大师" :value="2"></el-option>
            </el-select>
          </template>
          <Icon type="ns-search-copy" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
        </el-input>
      </el-form-item>
    </el-form>
  </template>
  <template slot='button'>
    <ns-button type="primary" size='large' @click="exportFile">导出</ns-button>
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
              <img :src='scope.row.friendAvatar' class="scope-title_img">
              <div class="scope-title_text">
                {{scope.row.friendName}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="promotionName"
          label="推广大师">
          <template slot-scope="scope">
            <div class="scope-title">
              <img :src='scope.row.promotionAvatar' class="scope-title_img">
              <div class="scope-title_text">
                {{scope.row.promotionName}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="employeeName"
          label="所属员工">
          <template slot-scope="scope">
            <div class="scope-title_text">
              <div class="scope-name">
                <div :class="'scope-name_text'+ (scope.row.offlineShops.length>10?' more':'')" >
                  {{scope.row.employeeName}}({{scope.row.offlineShops.join(',')}})
                </div>
                <el-popover
                  placement="top-start"
                  class="item"
                  width="200"
                  trigger="hover"
                  :content="scope.row.offlineShops">
                  <span class="scope-name_tip" slot="reference">共{{scope.row.offlineShops ? scope.row.offlineShops.length:0}}个</span>
                </el-popover>
                <!-- <div class="scope-name_num">
                  共<span class="scope-name_num__blue">{{scope.row.emplee.length}}</span>个
                </div> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="addTime"
          sortable="custom"
          label="添加时间">
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
export default {
  data () {
    return {
      model: {
        timeStart: null,
        timeEnd: null,
        employeeName: null,
        guideIds: null,
        guestCodeId: this.$route.query.guestCodeId
      },
      url: this.$api.guide.customerCode.getFriendListByParam,
      seachVal: '',
      guideIds: [],
      searchType: 1
    }
  },
  components: { PageTable, NsGuideDialog },
  computed: {
    holderName () {
      return ['', '好友昵称', '推广大师'][this.searchType]
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
    exportFile () {
      if (this.checkTableDataExists()) {
        return false
      }
      let that = this
      let param = this.$generateParams$()
      that.$notify.info('导出中，请稍后片刻')
      this.$http.fetch(this.$api.guide.customerCode.exportFriendListByExcel, param)
        .then((resp) => {
          that.$notify.success('下载完成')
        }).catch((resp) => {
          if (!resp.size === 0) {
            that.$notify.error('导出报错，请联系管理员')
          } else {
            let url = window.URL.createObjectURL(new Blob([resp]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            var fileName = '邀请好友明细表.CSV'
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
          }
        })
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
    startTime (newVal) {
      this.changeSearchfrom({ timeStart: newVal, timeEnd: this.endTime })
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
