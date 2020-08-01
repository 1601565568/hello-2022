
<template>
  <!-- 门店工作统计  wanrengang 20180716 -->
  <div>
    <el-tabs v-model="activeTabName" @tab-click="tabHandleClick">
      <el-tab-pane label="联系概况" name="/Guide/ActivityAnalysis/List"></el-tab-pane>
      <el-tab-pane label="会员统计" name="/Guide/ActivityAnalysis/MemberStatistics"></el-tab-pane>
      <el-tab-pane label="销售概览" name="/Guide/ActivityAnalysis/SaleView"></el-tab-pane>
    </el-tabs>
    <div class="template-table">
      <!-- 简单搜索start -->
      <div class="template-table__bar">
        <el-row class="template-table__bar-base">
          <el-col :span="23">
            <!-- 右上角操作区域 -->
            <div class="float-right tabSearchBtn">
              <ns-button @click="tabSearchType" type="text" style="padding-left: 10px;opacity: 0.5;color: #002041;">
                {{searchType.tipText}}
                <Icon :type="searchType.advanced ? 'up' : 'down'"/>
              </ns-button>
            </div>
            <el-form ref="searchform" class="float-right" v-if="!searchType.advanced" :inline="true" :model="searchform"
                     @submit.native.prevent>
              <el-form-item>
                <el-radio-group v-model="searchform.date" class="float-right">
                  <el-radio-button label="昨天">昨天</el-radio-button>
                  <el-radio-button label="近7天">近7天</el-radio-button>
                  <el-radio-button label="自定义">自定义</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="自定义：" label-width="80px">
                <el-date-picker
                  class="float-left"
                  :disabled="searchform.date !== '自定义'"
                  v-model="searchform.dateRange"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['12:00:00']">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <ns-button type="primary" @click="submitForm('searchform')" >搜索</ns-button>
                <ns-button @click="resetForm('searchform')">重置</ns-button>
                <ns-button type="primary" @click="submitForm('searchform')" >导出</ns-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!-- 简单搜索end -->
        <!-- 高级搜索start -->
        <div class="template-table-search" v-show="searchType.advanced">
          <div class="template-table__bar-more">
            <el-form ref="searchform" label-width="80px"  class="surround-btn" :model="searchform"  :inline="true">
              <el-form-item>
                <el-radio-group v-model="searchform.date" class="float-right">
                  <el-radio-button label="昨天">昨天</el-radio-button>
                  <el-radio-button label="近7天">近7天</el-radio-button>
                  <el-radio-button label="自定义">自定义</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="自定义：" label-width="80px">
                <el-date-picker
                  class="float-left"
                  :disabled="searchform.date !== '自定义'"
                  v-model="searchform.dateRange"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['12:00:00']">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <NsGuideDialog :auth="false" type="primary" btnTitle="选择员工" dialogTitle="选择员工" v-model="searchform.guideIds"></NsGuideDialog>
              </el-form-item>
              <el-form-item>
                已选择<span class="text-primary">{{searchform.guideIds? searchform.guideIds.length: 0}}</span>个导购员工
              </el-form-item>
              <el-form-item label="排序条件：" prop="state">
                <el-select  v-model="searchform.state" placeholder="不限" clearable>
                  <el-option v-for="item in statusOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="排序方式：" prop="state">
                <el-select  v-model="searchform.type" placeholder="不限" clearable>
                  <el-option v-for="item in typeOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

            </el-form>
            <div class="template-table__more-btn">
              <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
              <ns-button @click="resetForm('searchform')">重置</ns-button>
              <ns-button type="primary" @click="submitForm('searchform')" >导出</ns-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 高级搜索end -->
    </div>
    <!-- 筛选end -->
    <!-- table start -->
    <div class="mt5">
      <el-table
        ref="multipleTable"
        :data="dataList"
        v-loading="loading"
        :element-loading-text="$t('prompt.loading')"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="guideName" label="导购" align="left">
          <div>
            工作门店：九堡线下门店
          </div>
          <div>
            登录手机：15811112222
          </div>
          <div>
            登录微信：微信昵称（微信id）
          </div>
        </el-table-column>
        <el-table-column prop="name" label="获客情况" align="left">
          <div>
            新增好友数：100
          </div>
          <div>
            新增会员数：90
          </div>
          <div>
            新增群数：30
          </div>
        </el-table-column>
        <el-table-column label="主动会话情况" align="left">
          <div>
            主动会话数：100
            私聊：90
            群聊：10
          </div>
          <div>
            客户回复：80
          </div>
          <div>
            客户回复率：80%
          </div>
        </el-table-column>
        <el-table-column prop="type" label="接待情况" align="left">
          <div>
            接待客户数：100
          </div>
          <div>
            响应数：90
          </div>
          <div>
            未回复客户数:10
          </div>
          <div>
            平均响应时间：3s
          </div>
        </el-table-column>
        <el-table-column label="朋友圈情况" align="left">
          <div>
            发朋友圈数：50
          </div>
          <div>
            被点赞数：900
          </div>
          <div>
            被评论数：30
          </div>
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
  </div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import { getErrorMsg } from '@/utils/toast'
import NsGuideDialog from '@/components/NsGuideDialog'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      activeTabName: '/Guide/ActivityAnalysis/List',
      // 类型
      typeOptions: [
        {
          value: '0',
          label: '不限'
        },
        {
          value: '1',
          label: '降序'
        },
        {
          value: '2',
          label: '升序'
        }
      ],
      statusOptions: [
        {
          value: '0',
          label: '不限'
        },
        {
          value: '1',
          label: '新增好友数'
        },
        {
          value: '2',
          label: '新增会员数'
        },
        {
          value: '3',
          label: '新增群数'
        },
        {
          value: '4',
          label: '主动会话数'
        },
        {
          value: '5',
          label: '客户回复'
        },
        {
          value: '6',
          label: '客户回复率'
        },
        {
          value: '7',
          label: '接待客户数'
        },
        {
          value: '8',
          label: '未回复客户数'
        },
        {
          value: '9',
          label: '响应数'
        },
        {
          value: '10',
          label: '平均首次响应时间'
        },
        {
          value: '11',
          label: '发朋友圈数'
        },
        {
          value: '12',
          label: '被点赞数'
        },
        {
          value: '13',
          label: '被评论数'
        }
      ],
      selectedArr: [],
      searchform: {
        date: '昨天',
        dateRange: '',
        time: [],
        name: '',
        type: '',
        state: '',
        guideIds: []
      },
      dataList: [

      ]

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
        .fetch(this.$api.guide.taskList, searchObj)
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
        taskId: val
      }
      await this.$http
        .fetch(this.$api.guide.taskBrandDel, obj)
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
        this.$refs.addDialogDom.showToggle(obj)
      })
    },
    // 提交搜索
    submitForm (formName) {
      this.searchObj.start = 0
      this.searchObj.searchMap.type = this.searchform.type
      this.searchObj.searchMap.state = this.searchform.state
      this.searchObj.searchMap.name = this.searchform.name

      // 组装搜索对象
      this.loadListFun()
    },
    // 选择门店
    handleSelectionChange (val) {
      this.selectedArr = val
    }
  },
  components: {
    NsGuideDialog
  }
}
</script>
<style scoped>

  @import "@theme/variables.pcss";

  .btn-detele {
    margin-left: var(--default-margin-base);
  }
</style>
