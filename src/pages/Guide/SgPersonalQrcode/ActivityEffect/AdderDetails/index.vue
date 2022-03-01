<template>
  <div class="adder-detail-container">
    <div class="adder-tool-bar">
      <div class='flex-box'>
        <div class="adder-owners">
          <span class="owners-label">所属员工：</span>
          <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" dialogTitle="选择员工" v-model="model.guideIds" @input="searchform">
            <template slot='selfBtn'>
              <div class="owners-select">
                <span>{{(model.guideIds && model.guideIds.length)?`已选择${model.guideIds.length}个员工`:'全部'}}</span>
                <Icon type="geren" class="select-icon"/>
              </div>
            </template>
          </NsGuideDialog>
        </div>
        <el-input v-model="model.employeeName" placeholder="请输入员工姓名" @keyup.enter.native="searchform">
          <Icon type="ns-search" slot="suffix" class='search-icon el-input__icon' @click="searchform"></Icon>
        </el-input>
        <div class="adder-date">
          <span>添加时间：</span>
          <el-date-picker
            v-model="seachDate"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
            :default-time="['00:00:00','23:59:59']"
            align="right"
            style="border: none"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <ns-button size="medium" type='primary' class="export-cvs-btn-left" @click='handleMarking'>批量打标</ns-button>
        <ns-button size="medium" class="export-cvs-btn" @click="exportFile">导出CSV文件</ns-button>
      </div>
    </div>
    <div class="adder-detail-table">
      <el-table
        style="width: 100%;"
        class="table-form_reset"
        row-class-name="employee-table_row"
        header-cell-class-name="employee-talbe-header-cell"
         @selection-change="onHandleSelectChange"
        :data="_data._table.data"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" align="center" :width="50">
        </el-table-column>
        <el-table-column
          prop="friendAvatar"
          width='65px'
          label="头像">
          <template slot-scope="scope">
            <img class="scope-avatar" :src="scope.row.friendAvatar" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="friendName"
          label="昵称">
        </el-table-column>
        <el-table-column
          prop="employeeName"
          label="员工">
        </el-table-column>
        <el-table-column
          prop="employeeNumber"
          label="工号">
          <template slot-scope="scope">
            {{ scope.row.employeeNumber ? scope.row.employeeNumber : '-' }}
          </template>
        </el-table-column>
        <el-table-column type="default" prop="groupTags"
                          label="企业标签" dbcolumn="groupTags" column="groupTags" align="left">
          <template slot-scope="scope">
            <template v-if="scope.row.groupTags">
              <el-tag class='qy-name_tag'
                      v-for="(tag, index) in scope.row.groupTags.split('|').filter(i => i)"
                      :key="index">
                <template v-if="tag.length > 10">
                  <el-tooltip :content="tag" effect="light"><span>{{tag.substring(0,10)+ '...'}}</span></el-tooltip>
                </template>
                <template v-else>
                  {{tag}}
                </template>
              </el-tag>
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="添加时间"
          sortable="custom">
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      v-if="_data._pagination.enable"
      class="template-table__pagination"
      :page-sizes="[15, 25]"
      :total="_data._pagination.total"
      :current-page="_data._pagination.page"
      :page-size="_data._pagination.size"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="$sizeChange$"
      @current-change="$pageChange$">
    </el-pagination>
    <MarkingDialog ref='markingDialog' @onChangeCheckedTagList='onChangeCheckedTagList'/>
  </div>
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsGuideDialog from '@/components/NsGuideDialog'
import MarkingDialog from '@/components/NewUi/MarkingDialog'
import { getErrorMsg } from '@/utils/toast'
/**
 * 添加明细
 */
export default {
  components: {
    NsGuideDialog, MarkingDialog
  },
  mixins: [tableMixin],
  data () {
    return {
      url: this.$api.guide.sgPersonalQrcode.getQrCodeInviteFriendDetailList,
      seachVal: '',
      checkedCustomerList: [],
      // 筛选数据
      model: {
        guid: this.$route.params.guid,
        guideIds: [],
        employeeName: '',
        createTimeOrderStr: 'desc',
        startTime: '',
        endTime: ''
      },
      seachDate: []
    }
  },
  mounted () {
    this.searchform()
    this.$store.dispatch('marking/getTagGroupList')
  },
  methods: {
    // 打标
    handleMarking () {
      if (this.checkedCustomerList.length > 0) {
        this.$refs.markingDialog.handleChangeVisible(true)
        return
      }
      this.$notify.warning('请先选择要打标的客户')
    },
    // 打标多选框选中事件
    onHandleSelectChange: function (list) {
      this.checkedCustomerList = list.map(item => ({
        externalUserId: item.externalUserId,
        userId: item.userId
      }))
    },
    onChangeCheckedTagList (data) {
      this.saveBatchMarking({ 'checkedCustomerList': this.checkedCustomerList, 'checkedTagList': data })
    },
    saveBatchMarking (params) {
      this.$http.fetch(this.$api.weWork.externalContact.saveBatchMarking, params).then((resp) => {
        this.$notify.success('批量打标成功')
        this.$refs.markingDialog.handleChangeVisible(false)
        this.$searchAction$()
      }).catch((resp) => {
        this.$refs.markingDialog.loading = false
        this.$notify.error(getErrorMsg('批量打标失败', resp))
      })
    },
    searchform () {
      this.$searchAction$()
    },
    sortChange (data) {
      if (data.order === 'ascending') {
        this.model.createTimeOrderStr = 'asc'
      } else if (data.order === 'descending') {
        this.model.createTimeOrderStr = 'desc'
      } else {
        this.model.createTimeOrderStr = 'asc'
      }
      this.searchform()
    },
    checkTableDataExists () {
      if (!this._data || !this._data._table || !this._data._table.data || this._data._table.data.length < 1) {
        this.$notify.error('当前没有匹配的数据项')
        return true
      }
      return false
    },
    exportFile () {
      if (this.checkTableDataExists()) {
        return false
      }

      let param = this.$generateParams$()
      param.searchMap.type = 2
      this.$notify.info('导出中，请稍后片刻')
      this.$http.fetch(this.$api.guide.sgPersonalQrcode.exportEffectByExcel, param)
        .then((resp) => {
          this.$notify.success('下载完成')
        }).catch((resp) => {
          if (!resp.size === 0) {
            this.$notify.error('导出报错，请联系管理员')
          } else {
            let url = window.URL.createObjectURL(new Blob([resp]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            const fileName = `${this.$route.params.name || ''}-好友添加明细.CSV`
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
          }
        })
    }
  },
  watch: {
    seachDate (val) {
      if (val) {
        this.model.startTime = val[0]
        this.model.endTime = val[1]
      } else {
        this.model.startTime = ''
        this.model.endTime = ''
      }
      this.searchform()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/table-reset.css";
@import "../styles/toolbar-reset.css";

.adder-detail-container {
  margin-top: 16px;
  width: 100%;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;

  .adder-tool-bar {
    margin-top: 4px;
    width: 100%;
    height: 56px;
    display: flex;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .flex-box {
      display: flex;
      align-items: center;
    }
    .adder-owners {
      position: relative;
      width: 230px;
      height: 32px;
      font-size: 14px;
      box-sizing: border-box;
      border: 1px solid #D9D9D9;
      border-radius: 4px;
      margin: 0 16px;
      display: flex;
      align-items: center;
      .owners-label {
        color: #606266;
        padding-left: 8px;
      }
      .owners-select {
        display: flex;
        align-items: center;
        cursor: pointer;
        span {
          display: inline-block;
          width: 60px;
          white-space: nowrap;
          color:#262626;
          font-size: 14px;
        }
        .select-icon {
          display: inline-block;
          position: absolute;
          top: 8px;
          right: 8px;
          color:#C0C4CC;
        }
      }
    }
    .export-cvs-btn {
      margin-right: 16px
    }
    .adder-date{
      height: 32px;
      width: 450px;
      border: 1px solid #D9D9D9;
      border-radius: 4px;
      margin: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span{
        width: 80px;
        margin: 0 8px;
      }
    }
  }

  .adder-detail-table {
    width: calc(100% - 32px);
    margin: 8px auto 0;

    .scope-avatar {
      width: 32px;
      height: 32px;
      border-radius: 4px;
    }
  }
}
.qy-name_tag.el-tag {
  margin:4px 8px 4px 0 ;
  cursor: default;
  background: #E6F2FF;
  border: 1px solid #BDDCFF;
  border-radius: 2px;
  color: rgba(0,0,0,0.85);
}
</style>
