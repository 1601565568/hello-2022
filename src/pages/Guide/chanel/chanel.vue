
<template>
<div class="channel-management">
  <!-- 渠道分析顶部搜索栏 -->
  <el-form :inline="true" class="top-tool-bar" v-show="activeName === '1'">
    <el-radio-group class="alalysis-radio" v-model="analysisDateField">
      <el-radio :label="1" border>全部</el-radio>
      <el-radio :label="2" border>近7天</el-radio>
      <el-radio :label="3" border>近30天</el-radio>
    </el-radio-group>
    <span class="line"></span>
    <el-date-picker
      v-model="analysisSearchDate"
      type="datetimerange"
      value-format="yyyy-MM-dd HH:mm:ss"
      :default-time="['00:00:00','23:59:59']"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :clearable="false"
    ></el-date-picker>
  </el-form>
  <el-tabs v-model="activeName" @tab-click="tabHandleClick">
    <el-tab-pane label="渠道管理" name="0">
      <div class="template-table">
        <!-- 简单搜索start -->
        <div class="template-table__bar">
            <el-row class="template-table__bar-base">
              <!-- 左边上角操作区域 -->
              <el-col :span="10">
                  <ns-button type="primary" @click="AddShowToggle({})" v-if="0 == isAnalyce">新增渠道</ns-button>
              </el-col>
              <el-col :span="14">
                <el-form label-width="80px" @submit.native.prevent class="surround-btn" :model="searchform" :inline="true">
                  <el-form-item v-show="!expanded" label="渠道名称：" prop="channel_name">
                    <el-input v-model="searchform.channel_name" placeholder="请输入渠道名称" @keyup.enter.native="submitForm()" clearable></el-input>
                  </el-form-item>
                  <el-form-item v-show="!expanded">
                    <ns-button type="primary" @click="submitForm()">搜索</ns-button>
                    <ns-button @click="resetForm()">重置</ns-button>
                  </el-form-item>
                  <el-form-item>
                    <ns-button type="text" @click="switchExpanded()">
                      {{collapseText}}
                      <Icon :type="expanded ? 'up' : 'down'"/>
                    </ns-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          <div class="template-table-search">
            <div class="template-table__bar-more">
              <span v-if="0 == isAnalyce">
                <el-form v-show="expanded" label-width="80px" @submit.native.prevent class="surround-btn" style="float: right" :model="searchform" :inline="true">
                  <el-form-item label="渠道名称：" prop="channel_name">
                    <el-input v-model="searchform.channel_name" placeholder="请输入渠道名称" @keyup.enter.native="submitForm()" clearable></el-input>
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
                    <el-input v-model="searchform.welcontent" placeholder="请输入欢迎语" @keyup.enter.native="submitForm()" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="创建人：" prop="welcontent">
                    <el-input v-model="searchform.creatorName" placeholder="请输入名称" @keyup.enter.native="submitForm()" clearable></el-input>
                  </el-form-item>
                </el-form>
                <div v-show="expanded" class="template-table__more-btn">
                  <ns-button type="primary" @click="submitForm()">搜索</ns-button>
                  <ns-button @click="resetForm()">重置</ns-button>
                </div>
              </span>
              <span v-if="1 == isAnalyce">
                <el-form ref="searchAlalyceform" label-width="80px" @submit.native.prevent class="surround-btn" :inline="true">
                  <el-form-item label="时间：" prop="time">
                      <el-date-picker
                        v-model="analysetime"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="请选择开始日期"
                        end-placeholder="请选择结束日期"
                        align="right">
                      </el-date-picker>
                  </el-form-item>
                </el-form>
                  <div class="template-table__more-btn">
                    <ns-button type="primary" @click="subAnalyse()">搜索</ns-button>
                    <ns-button @click="resetAnalyseForm()">重置</ns-button>
                  </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    <!-- 筛选end -->
    <!-- table start -->
    <span v-if="0 == isAnalyce">
      <div>
        <el-table
          ref="multipleTable"
          :data="dataList"
          v-loading="loading"
          :element-loading-text="$t('prompt.loading')"
          tooltip-effect="dark"
          stripe
          style="width: 100%">
          <el-table-column prop="channel_name" label="渠道名称" align="left"></el-table-column>
          <el-table-column prop="create_time" label="创建时间 "  align="center"></el-table-column>
          <el-table-column prop="welcontent" label="欢迎语"  align="center"></el-table-column>
          <el-table-column prop="creator_name" label="创建人"  align="center"></el-table-column>
          <!--<el-table-column prop="allCount" label="总添加好友数"  align="center"></el-table-column>
          <el-table-column prop="durCount" label="添加好友数" align="center"></el-table-column>-->
          <el-table-column
            label="操作"
            width="80"
            align="center">
          <template slot-scope="scope">
            <ns-button @click="AddShowToggle(scope.row)" type="text">编辑</ns-button>
            <ns-button type="text" @click="delsTipFun(scope.row.id)">删除</ns-button>
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
      </span>
    <!-- 编辑弹窗 -->
    <addModal ref="addDialogDom" :callBack="loadListFun"></addModal>
  </el-tab-pane>
  <el-tab-pane label="渠道分析" name="1" :lazy="true">
    <ChannelAnalysis :searchDate="analysisSearchDate"/>
  </el-tab-pane>
  </el-tabs>
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import addModal from './addModal'
import moment from 'moment'
import { getErrorMsg } from '@/utils/toast'
import echarts from 'echarts'
import businessEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import ChannelAnalysis from './ChannelAnalysis/index.vue'

export default {
  name: 'chanel',
  mixins: [listPageMixin],
  components: {
    addModal,
    ChannelAnalysis
  },
  watch: {
    analysisDateField (newVal) {
      const todayStartTime = new Date(new Date().toLocaleDateString())
      const todayEndTeime = new Date(todayStartTime.getTime() + 24 * 3600 * 1000 - 1)
      const endTimeStr = moment(todayEndTeime).format('YYYY-MM-DD HH:mm:ss')

      if (newVal === 1) { // 全部
        this.analysisSearchDate = []
      }

      if (newVal === 2) { // 近7天
        const during7Days = new Date(new Date(new Date().toLocaleDateString()).getTime() - 6 * 24 * 3600 * 1000)
        this.analysisSearchDate = [ this.formatTime(during7Days), endTimeStr ]
      }

      if (newVal === 3) { // 近30天
        const during30Days = new Date(new Date(new Date().toLocaleDateString()).getTime() - 29 * 24 * 3600 * 1000)
        this.analysisSearchDate = [ this.formatTime(during30Days), endTimeStr ]
      }
    }
  },
  data: function () {
    return {
      activeName: '0',
      searchform: {
        channel_name: null,
        time: [],
        welcontent: null,
        timeEnd: null,
        timeStart: null,
        creatorName: null
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
      isAnalyce: 0,
      expanded: false,
      analysetime: [],
      searchDate: '',
      analysisDateField: 2,
      analysisSearchDate: [
        moment(new Date(new Date(new Date().toLocaleDateString()).getTime() - 6 * 24 * 3600 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
        moment(new Date((new Date(new Date().toLocaleDateString())).getTime() + 24 * 3600 * 1000 - 1)).format('YYYY-MM-DD HH:mm:ss')
      ]
    }
  },
  mounted: function () {
    this.loadListFun()
  },
  computed: {
    collapseText () {
      return this.expanded ? '收起搜索' : '展开搜索'
    }
  },
  methods: {
    formatTime (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    switchExpanded () {
      this.expanded = !this.expanded
    },
    tabHandleClick (tab, event) {
      this.searchObj.searchMap.type = tab.name
      if (tab.name === '0') {
        this.loadListFun()
      }
    },
    toAnalyse () {
      this.isAnalyce = 1
      this.getAnalyceData()
    },
    toChanel () {
      this.isAnalyce = 0
    },
    subAnalyse () {
      if (this.analysetime !== '' && this.analysetime !== null && this.analysetime.length === 2) {
        this.searchObj.searchMap.timeStart = moment(this.searchform.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.searchObj.searchMap.timeEnd = moment(this.searchform.time[1]).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    resetAnalyseForm () {
      this.searchObj.searchMap.timeStart = ''
      this.searchObj.searchMap.timeEnd = ''
    },
    getAnalyceData () {
      this.$http
        .fetch({
          url: '/Guide/chanel/getAnalyseData',
          method: 'post'
        }, this.searchObj)
        .then(resp => {
          this.$notify({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('删除失败', resp))
        })
    },
    // 新增，编辑渠道
    AddShowToggle (obj) {
      // 传递保存时需要的参数
      this.$nextTick(() => {
        this.$refs.addDialogDom.showToggle(obj)
      })
    },
    // 提交搜索
    submitForm () {
      this.searchObj.searchMap.channel_name = this.searchform.channel_name
      this.searchObj.searchMap.welcontent = this.searchform.welcontent
      this.searchObj.searchMap.creatorName = this.searchform.creatorName
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
    resetForm () {
      for (let attr in this.searchform) {
        this.searchform[attr] = null
      }
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
        .fetch({
          url: '/Guide/chanel/delete',
          method: 'post'
        }, obj)
        .then(resp => {
          this.$notify({
            type: 'success',
            message: '删除成功!'
          })
          this.loadListFun(this.searchObj)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('删除失败', resp))
        })
    },
    // 加载列表
    loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      this.$http
        .fetch({
          url: '/Guide/chanel/findList',
          method: 'post'
        }, searchObj)
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
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/reset.css";
.template-table {
  margin-top: 10px;
}

.channel-management {
  position: relative;
  .top-tool-bar {
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;
    height: 48px;
    display: flex;
    align-items: center;
  }

  .line {
    margin-left: 8px;
    margin-right: 24px;
    display: inline-block;
    height: 20px;
    border: 1px solid #E8E8E8;
  }
}
</style>
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
