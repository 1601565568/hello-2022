
<template>
<div>
   <div class="template-table">
      <!-- 简单搜索start -->
    <div class="template-table__bar">
        <el-row class="template-table__bar-base">
           <!-- 左边上角操作区域 -->
          <el-col :span="7">
              <ns-button type="primary" @click="AddShowToggle({})" v-if="0 == isAnalyce">新增渠道</ns-button>
              <ns-button type="primary" @click="toAnalyse" v-if="0 == isAnalyce">渠道分析</ns-button>
              <ns-button type="primary" @click="toChanel" v-if="1 == isAnalyce">渠道管理</ns-button>
          </el-col>
        </el-row>
      <div class="template-table-search">
        <div class="template-table__bar-more">
          <span v-if="0 == isAnalyce">
            <el-form ref="searchform" label-width="80px" @submit.native.prevent class="surround-btn" style="float: right" :model="searchform"  :inline="true">
              <el-form-item label="渠道名称：" prop="channel_name">
                <el-input v-model="searchform.channel_name" placeholder="请输入渠道名称" @keyup.enter.native="submitForm('searchform')" clearable></el-input>
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
        <el-table-column prop="allCount" label="总添加好友数"  align="center"></el-table-column>
        <el-table-column prop="durCount" label="添加好友数" align="center"></el-table-column>
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
    </span>
    <span v-if="1== isAnalyce">
      <el-row class="overview-content__echart mt5" :gutter="5">
          <el-col :span="12">
            <div class="overview-echart__item overview-echart__item--pink">
              <div
                   :element-loading-text="$t('prompt.loading')">
                <!-- 暂无数据结构 -->
               <!-- <div class="no-data" style='height:362px' v-if="!isTaskProgressData">
                </div>-->
                <template>
                  <business-echarts :options="friendsRate" class="oscillogram" auto-resize style='height:362px'></business-echarts>
                </template>
              </div>
            </div>
          </el-col>
       </el-row>

      <el-row class="overview-content__echart mt5" :gutter="5">
          <el-col :span="12">
            <div class="overview-echart__item overview-echart__item--pink">
              <div
                :element-loading-text="$t('prompt.loading')">
                <!-- 暂无数据结构 -->
                <!-- <div class="no-data" style='height:362px' v-if="!isTaskProgressData">
                 </div>-->
                <template>
                  <business-echarts :options="chanelAddFrieds" class="oscillogram" auto-resize style='height:362px'></business-echarts>
                </template>
              </div>
            </div>
          </el-col>
       </el-row>
      <span>
        <el-select v-model="chanelId" placeholder="全部" clearable>
          <el-option v-for="item in chanelList"
                     :key="item.id"
                     :label="item.content"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-table
          ref="multipleTable"
          :data="chanelAlalyseData"
          v-loading="alalyseLoading"
          :element-loading-text="$t('prompt.loading')"
          tooltip-effect="dark"
          stripe
          style="width: 100%">
        <el-table-column prop="create_time" label="日期 " width="150" align="center"></el-table-column>
        <el-table-column prop="welcontent" label="添加好友总数" width="150" align="center"></el-table-column>
        <el-table-column prop="allCount" label="聚合码添加好友数" width="150" align="center"></el-table-column>
        <el-table-column prop="durCount" label="其他添加好友数" width="150" align="center"></el-table-column>
      </el-table>
      </span>
    </span>
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
import echarts from 'echarts'
import businessEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
export default {
  name: 'chanel',
  mixins: [listPageMixin],
  components: {
    businessEcharts,
    addModal
  },
  data: function () {
    const that = this
    return {
      searchform: {
        channel_name: null,
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
      isAnalyce: 0,
      analysetime: [],
      chanelList: [],
      chanelId: null,
      chanelAlalyseData: [],
      alalyseLoading: false,
      friendsRate: {
        title: {
          text: '渠道添加好友占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['线下', '公众号', '小程序']
        },
        series: [
          {
            name: '好友占比',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '线下' },
              { value: 310, name: '公众号' },
              { value: 234, name: '小程序' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      chanelAddFrieds: {
        title: {
          text: '渠道添加好友数'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['全部', '线下', '公众号', '小程序']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '全部',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '线下',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '公众号',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '小程序',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
          }
        ]
      }
    }
  },
  mounted: function () {
    this.loadListFun()
  },

  methods: {
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
          this.$notify.error(getErrorMsg('查询失败', resp))
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
    submitForm (formName) {
      this.searchObj.searchMap.channel_name = this.searchform.channel_name
      this.searchObj.searchMap.welcontent = this.searchform.welcontent
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
          this.$notify.error(getErrorMsg('查询失败', resp))
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
  .no-data {
    width: 100%;
    height: 360px;
    background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QONaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YWJmOTRjYmQtN2UwZi0xZDQ1LWFhNDItZGZhNDc2NzJkZjRmIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg1NkQwQTM1Q0I5NDExRTg5Mzc4ODNFQTg0M0YyQzY2IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg1NkQwQTM0Q0I5NDExRTg5Mzc4ODNFQTg0M0YyQzY2IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmZjMjI1OGRlLWNlMDAtZjc0OC1hZTdiLTExNTc3N2FmNWFiYiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmJlNWVjZDE3LWNiNjctMTFlOC05MmFjLWNlNDA1NzdlZjMxNyIvPiA8L3Jk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) center center no-repeat;
  }
</style>
