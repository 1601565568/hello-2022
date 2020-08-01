<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="hide"
    :close-on-click-modal="false"
    :append-to-body="appendToBody"
    customClass="label-dialog"
  >
    <div class="label-dialog__wrapper">
      <div class="label-dialog__header">
        <div>
          <ns-button type="primary" @click="toggleLabel()">新增</ns-button>
        </div>
        <div class="label-dialog__search">
          <el-form ref="searchform" label-width="60px" @submit.native.prevent :model="searchform"  :inline="true">
            <el-form-item label="标签名称：" prop="subdivisionName">
              <el-input v-model="searchform.subdivisionName" placeholder="请输入标签名称" @keyup.enter.native="submitForm()" clearable></el-input>
            </el-form-item>
            <el-form-item label="更新时间：" prop="time">
              <el-date-picker
                v-model="searchform.time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="请输入开始日期"
                end-placeholder="请输入结束日期"
                align="right">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div class="label-dialog__btns">
            <ns-button type="primary" @click="$submitForm$()">搜索</ns-button>
            <ns-button @click="$resetForm$()">重置</ns-button>
          </div>
        </div>
      </div>
      <div class="label-dialog__content">
        <el-table
          ref="multipleTable"
          :data="dataList"
          :element-loading-text="$t('prompt.loading')"
          v-loading.lock="loading"
          tooltip-effect="dark"
          stripe
          style="width: 100%;"
          height="600"
        >
          <el-table-column label="序号" width="100" prop="sort"></el-table-column>
          <el-table-column label="名称" prop="subdivisionId" show-overflow-tooltip></el-table-column>
          <el-table-column label="素材数" prop="counts" width="120"></el-table-column>
          <el-table-column  label="更新时间" prop="updateTime" width="180"></el-table-column>
          <el-table-column  width="165">
            <template slot="header">
              <span style="margin-right: 6px">排序</span>
              <el-tooltip content="调整分类的排列顺序">
                <Icon type="question-circle"/>
              </el-tooltip>
            </template>
            <!-- 末位不能往下和置底，首位不能往上和置顶； 删除，新增，要重新加载MaxSort -->
            <template slot-scope="scope">
              <i
                class="label-sort__icon"
                :class="scope.row.sort === 1 ? 'label-sort__icon--hide' : ''"
                @click='exchangeSort(1, scope.row)'
              >
                <Icon type="zhiding"/>
              </i>
              <i
                class="label-sort__icon"
                :class="scope.row.sort === 1 ? 'label-sort__icon--hide' : ''"
                @click='exchangeSort(2, scope.row)'
              >
                <Icon type="top-arr"/>
              </i>
              <i
                class="label-sort__icon"
                :class="scope.row.sort === maxSortNum ? 'label-sort__icon--hide' : ''"
                @click='exchangeSort(3, scope.row)'
              >
                <Icon type="down-arr"/>
              </i>
              <i
                class="label-sort__icon"
                :class="scope.row.sort === maxSortNum ? 'label-sort__icon--hide' : ''"
                @click='exchangeSort(4, scope.row)'
              >
                <Icon type="zhidi"/>
              </i>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <ns-button type="text" @click="toggleLabel(scope.row)">编辑</ns-button>
              <ns-button type="text" @click="removeLabel(scope.row)">删除</ns-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="pagination.enable"
          class="label-dialog__pagination"
          :page-sizes="pagination.sizeOpts"
          :total="pagination.total"
          :current-page.sync="pagination.page"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <label-add ref="newLabel" @refresh="afterAdd"></label-add>
  </el-dialog>
</template>
<script>
import LabelAdd from './LabelAdd'
import listPageMixin from '@/mixins/listPage'
import { getErrorMsg } from '@/utils/toast'
import moment from 'moment'

export default {
  props: {
    appendToBody: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },
  mixins: [listPageMixin],
  components: { LabelAdd },
  data: function () {
    return {
      title: '标签管理',
      visible: false,
      modify: false,
      searchform: {
        subdivisionName: null,
        time: []
      },
      maxSortNum: 0
    }
  },
  computed: {},
  methods: {
    /**
     * 获取素材分组最大排序序号
     */
    async getSubdivisionMaxSortNum () {
      const resp = await this.$http.fetch(this.$api.guide.materialSubdivision.getSubdivisionMaxSortNum)
      if (resp && resp.success) {
        this.maxSortNum = parseInt(resp.result)
      } else {
        this.$notify.error(getErrorMsg('查询最大排序序号失败', resp))
      }
    },
    /**
     * 获取素材列表数据
     */
    async loadListFun () {
      this.loading = true
      await this.getSubdivisionMaxSortNum()
      const resp = await this.$http.fetch(this.$api.guide.materialGroudList, this.searchObj)
      if (resp && resp.success) {
        this.dataList = resp.result.data
        this.pagination.total = parseInt(resp.result.recordsTotal)
      } else {
        this.$notify.error(getErrorMsg('查询失败', resp))
      }
      this.loading = false
    },
    /**
     * 调整排序
     */
    async exchangeSort (type, row) {
      const params = { type, subdivisionId: row.subdivisionId }
      const resp = await this.$http.fetch(this.$api.guide.materialExchangeSort, params)
      if (resp && resp.success) {
        this.loadListFun()
      } else {
        this.$notify.error(getErrorMsg('调整排序失败', resp))
      }
    },
    show () {
      this.visible = true
      this.$submitForm$()
    },
    hide () {
      this.visible = false
      this.$resetForm$(true)
      // 存在新增标签时
      if (this.modify) {
        this.modify = false
        this.$emit('refresh')
      }
    },
    // 新增标签后触发回调
    afterAdd () {
      this.modify = true
      this.loadListFun()
    },
    $resetForm$ (onlyReset) {
      this.$refs.searchform.resetFields()
      if (!onlyReset) {
        this.$submitForm$()
      }
    },
    $submitForm$ () {
      this.clearSearch()
      this.submitForm()
    },
    submitForm () {
      const { time, subdivisionName } = this.searchform
      const searchMap = {
        subdivision_name: subdivisionName || '',
        time_start: '',
        time_end: ''
      }
      if (time && time.length === 2) {
        searchMap.time_start = moment(time[0]).format('YYYY-MM-DD HH:mm:ss')
        searchMap.time_end = moment(time[0]).format('YYYY-MM-DD HH:mm:ss')
      }
      this.searchObj.searchMap = searchMap
      this.loadListFun()
    },
    toggleLabel (row) {
      this.$refs.newLabel.show(row)
    },
    removeLabel (row) {
      this.$confirm(`此操作将永久删除该标签（不影响有该标签的素材），是否继续？`, '删除素材标签', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(async () => {
        const params = { subdivisionId: row.subdivisionId }
        const resp = await this.$http.fetch(this.$api.guide.materialGroudDel, params)
        if (resp && resp.success) {
          this.$notify({ type: 'success', message: '删除成功!' })
          this.loadListFun()
        } else {
          this.$notify.error(getErrorMsg('删除失败', resp))
        }
      }).catch(() => {})
    }
  }
}
</script>
<style scoped>
@component-namespace label {
  @b dialog {
    @e search {
      padding: 15px 0;
      display: flex;
      >>> .el-form {
        flex: 1;
      }
      >>> .el-form-item {
        margin-right: 20px !important;
        .el-input {
          width: 160px;
        }
        .el-date-editor--datetimerange {
          width: 356px;
        }
      }
    }
    @e pagination {
      margin-top: 15px;
    }
  }
  @b sort {
    @e icon {
      margin-right: 12px;
      font-size: 14px;
      color: #0091fa;
      cursor: pointer;
      @m hide {
        visibility: hidden;
      }
    }
  }
  >>> .label-dialog {
    width: 900px;
    .el-dialog__header {
      padding: 20px 30px !important;
    }
    .el-dialog__headerbtn {
      top: 20px !important;
      right: 30px !important;
    }
    .el-dialog__footer {
      padding: 10px 30px 20px !important;
    }
  }
  >>> .label-dialog__wrapper {
    padding: 0 20px 20px;
  }
}
</style>
