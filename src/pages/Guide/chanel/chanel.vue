
<template>
<div>
   <div class="template-table">
      <!-- 简单搜索start -->
  <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->
        <el-col :span="7">
            <ns-button type="primary" @click="AddShowToggle({})">新增渠道</ns-button>
            <ns-button type="primary" @click="alert(1)">渠道分析</ns-button>
        </el-col>
      </el-row>
  <div class="template-table-search" v-show="searchType.advanced">
      <div class="template-table__bar-more">
        <el-form ref="searchform" label-width="80px" @submit.native.prevent class="surround-btn" :model="searchform"  :inline="true">
          <el-form-item label="渠道名称：" prop="content">
            <el-input v-model="searchform.content" placeholder="请输入渠道名称" @keyup.enter.native="submitForm('searchform')" clearable></el-input>
          </el-form-item>
          <el-form-item label="时间：" prop="time">
            <el-date-picker
              v-model="searchform.time"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="欢迎语：" prop="welcontent">
            <el-input v-model="searchform.welcontent" placeholder="请输入欢迎语" @keyup.enter.native="submitForm('searchform')" clearable></el-input>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
          <ns-button @click="resetForm('searchform')">重置</ns-button>
        </div>
      </div>
    </div>
  </div>
  </div>
  <!-- 筛选end -->
  <!-- table start -->
  <div>
    <el-table
      ref="multipleTable"
      :data="dataList"
      v-loading="loading"
      :element-loading-text="$t('prompt.loading')"
      tooltip-effect="dark"
      stripe
      style="width: 100%">
      <el-table-column prop="content" label="渠道名称" align="left" width="190"></el-table-column>
      <el-table-column prop="create_time" label="创建时间 " width="150" align="center"></el-table-column>
      <el-table-column prop="welcontent" label="欢迎语" width="150" align="center"></el-table-column>
      <el-table-column prop="allfriends" label="总添加好友数" width="150" align="center"></el-table-column>
      <el-table-column prop="todayfriends" label="添加好友数" width="150" align="center"></el-table-column>
      <el-table-column
        label="操作"
        width="80"
        align="center">
      <template slot-scope="scope">
        <ns-button @click="AddShowToggle(scope.row)" type="text">编辑</ns-button>
        <a href="javascript:" @click="delsTipFun(scope.row.id)">删除</a>
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
  <addModal ref="addDialogDom" :callBack="loadListFun"></addModal>
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import addModal from './addModal'
import moment from 'moment'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [listPageMixin],
  data () {
    const that = this
    return {
      searchform: {
        content: null,
        time: [],
        welcontent: null,
        timeEnd: null,
        timeStart: null
      },
      dataList: [],
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
      },
      insertList: [
        {
          id: 0,
          shopName: that.$store.state.user.remumber.remumber_login_info.companyName
        }
      ]
    }
  },
  created: function () {
    this.loadListFun()
  },

  methods: {
    // 新增，编辑渠道
    AddShowToggle (obj) {
      // 传递保存时需要的参数
      this.$nextTick(() => {
        this.$refs.addDialogDom.showToggle(obj, this.groudList)
      })
    },
    // 提交搜索
    submitForm (formName) {
      this.searchObj.searchMap.content = this.searchform.content
      if (this.searchform.time !== '' && this.searchform.time !== null && this.searchform.time.length === 2) {
        this.searchObj.searchMap.timeStart = moment(this.searchform.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.searchObj.searchMap.timeEnd = moment(this.searchform.time[1]).format('YYYY-MM-DD HH:mm:ss')
      } else {
        delete this.searchObj.searchMap.timeStart
        delete this.searchObj.searchMap.timeEnd
      }
      // 组装搜索对象
      this.loadListFun()
    },
    // 重置搜索
    resetForm (formName) {
      for (let attr in this.searchform) {
        this.searchform[attr] = null
      }
      // this.$refs[formName].resetFields()
      this.submitForm()
    },
    // 删除
    delsTipFun (val) {
      apiRequestConfirm('永久删除该数据')
        .then(() => {
          this.delsFun(val)
        })
        .catch(() => {
          // 点击取消事件
        })
    },
    async delsFun (val) {
      let obj = {
        id: val
      }
      await this.$http
        .fetch(this.$api.guide.chanelDel, obj)
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
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.guide.chanelList, searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
      // 总条数
    }
  },
  components: {
    addModal
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";
  .mt10{
    border-radius: var(--default-radius-mini) var(--default-radius-mini) 0 0 !important
  }
  .searchbtn {
    margin-left: var(--default-margin-base);
  }
  .resetbtn {
    margin-left: 9px;
  }
</style>
