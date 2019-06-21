
<template>
<!-- 门店工作统计  wanrengang 20180716 -->
<div>
  <el-tabs v-model="activeTabName" @tab-click="tabHandleClick">
    <el-tab-pane label="推广素材" name="/guide/Material/List"></el-tab-pane>
    <el-tab-pane label="素材分组" name="/guide/MaterialSubdivision/List"></el-tab-pane>
  </el-tabs>
   <div class="template-table">
      <!-- 简单搜索start -->
  <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->
          <el-col :span="7">
             <ns-button type="primary" @click="AddShowToggle({})">新增</ns-button>
          </el-col>
          <el-col :span="17">
            <!-- 右上角操作区域 -->
            <div class="float-right tabSearchBtn">
              <ns-button @click="tabSearchType" style="padding: 9px 0 9px 10px;opacity: 0.5;color: #002041;" type="text">{{searchType.tipText}}<i :class="{'el-icon--right': true, 'el-icon-arrow-down': !searchType.advanced, 'el-icon-arrow-up': searchType.advanced} ">
                </i></ns-button>
            </div>
            <el-form ref="searchform" class="float-right" v-if="!searchType.advanced" :inline="true" :model="searchform">
              <el-form-item label="分组名称：" prop="subdivision_name">
                <el-input v-model="searchform.subdivision_name" placeholder="请输入分组名称"></el-input>
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
  <div class="template-table-search" v-show="searchType.advanced">
      <div class="template-table__bar-more">
        <el-form ref="searchform" label-width="80px"  class="surround-btn" :model="searchform"  :inline="true">
          <el-form-item label="分组名称：" prop="subdivision_name">
            <el-input v-model="searchform.subdivision_name" placeholder="请输入分组名称"></el-input>
          </el-form-item>
          <el-form-item label="更新时间：" prop="time">
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
      :element-loading-text="$t('prompt.loading')"
      tooltip-effect="dark"
      stripe
      style="width: 100%"
      >
      <el-table-column
        label="名称"
        prop="subdivision_name"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        label="素材数"
        align="left"
        prop="counts"
        width="150"
      >
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间 " width="200" align="left">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
        align="right"
      >
      <template slot-scope="scope">
        <ns-button @click="AddShowToggle(scope.row)" type="text">编辑</ns-button>
        <a class="text-error" href="javascript:" style="color:#f00" @click="delsTipFun(scope.row.subdivision_id)">删除</a>
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
  <!-- 编辑弹窗 -->
  <addGroudModal ref="addGroudDialogDom" :callBack="loadListFun"></addGroudModal>
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'
import addGroudModal from './addGroudModal'
import moment from 'moment'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      activeTabName: '/guide/MaterialSubdivision/List',
      selectedArr: [],
      searchform: {
        time: []
      },
      dataList: [
      ],
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
      }
    }
  },
  created: function () {
    this.loadListFun()
  },

  methods: {
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.guide.materialGroudList, searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
      // 总条数
    },
    // 删除
    delsTipFun (val) {
      apiRequestConfirm('永久删除该分组(不影响分组中的素材)')
        .then(() => {
          this.delsFun(val)
        })
        .catch(() => {
          // 点击取消事件
        })
    },
    async delsFun (val) {
      let obj = {
        subdivision_id: val
      }
      await this.$http
        .fetch(this.$api.guide.materialGroudDel, obj)
        .then(resp => {
          this.$notify({
            type: 'success',
            message: '删除成功!'
          })
          this.loadListFun(this.searchObj)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    // 打开弹窗--编辑
    AddShowToggle (obj) {
      // 传递保存时需要的参数
      this.$nextTick(() => {
        this.$refs.addGroudDialogDom.showToggle(obj)
      })
    },
    // 打开弹窗--编辑
    setGroudShowToggle () {
      if (this.selectedArr.length === 0) {
        this.$notify.error('请选择素材')
        return
      }
      // 传递保存时需要的参数
      this.$nextTick(() => {
        this.$refs.setGroudDialogDom.showToggle(
          this.selectedArr,
          this.groudList
        )
      })
    },
    // 提交搜索
    submitForm (formName) {
      this.searchObj.searchMap.subdivision_name = this.searchform.subdivision_name
      if (this.searchform.time.length === 2) {
        this.searchObj.searchMap.time_start = moment(
          this.searchform.time[0]
        ).format('YYYY-MM-DD HH:mm:ss')
        this.searchObj.searchMap.time_end = moment(
          this.searchform.time[1]
        ).format('YYYY-MM-DD HH:mm:ss')
      } else {
        this.searchObj.searchMap.time_start = ''
        this.searchObj.searchMap.time_end = ''
      }
      this.loadListFun()
    },
    // 选择门店
    handleSelectionChange (val) {
      this.selectedArr = val
    }
  },
  components: {
    addGroudModal
  }
}
</script>
