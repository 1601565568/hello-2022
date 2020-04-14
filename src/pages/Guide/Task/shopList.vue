
<template>
<!-- 门店工作统计  wanrengang 20180716 -->
<div class="shopListbox">
  <el-tabs v-model="activeTabName" @tab-click="tabHandleClick">
    <el-tab-pane label="品牌任务" name="/Guide/Task/List"></el-tab-pane>
    <el-tab-pane label="门店任务" name="/Guide/Task/shopList"></el-tab-pane>
  </el-tabs>
   <div class="template-table">
      <!-- 简单搜索start -->
  <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->
          <el-col :span="7">   </el-col>
          <el-col :span="17">
            <!-- 右上角操作区域 -->
            <div class="float-right tabSearchBtn">
              <ns-button @click="tabSearchType" style="padding-left: 10px;opacity: 0.5;color: #002041;" type="text">{{searchType.tipText}}
                <Icon :type="searchType.advanced ? 'up' : 'down'"/>
              </ns-button>
            </div>
            <el-form ref="searchform" class="float-right" v-if="!searchType.advanced" :inline="true" :model="searchform" @submit.native.prevent>
              <el-form-item label="任务名称：" prop="name">
                <el-input @keyup.enter.native="submitForm('searchform')" v-model="searchform.name" placeholder="请输入任务名称" clearable></el-input>
              </el-form-item>

              <el-form-item>
                <ns-button type="primary" @click="submitForm('searchform')" >搜索</ns-button>
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
          <el-form-item label="任务名称：" prop="name">
            <el-input v-model="searchform.name" @keyup.enter.native="submitForm('searchform')" placeholder="请输入任务名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="类型：" prop="type">
              <el-select  v-model="searchform.type" placeholder="请选择类型" clearable>
                  <el-option v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态：" prop="state">
              <el-select  v-model="searchform.state" placeholder="请选择状态" clearable>
                  <el-option v-for="item in statusOptions"
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
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="name" align="right" label="分配导购" width="90">
        <template slot-scope="{row}">
          <!-- <a href="javascript:" v-if="row.guideIds === '0'" @click="shopListModalDomShowToggle(row.id,row.shopId)">全部导购</a> -->
          <a @click="shopListModalDomShowToggle(row.id,row.shopId)" href="javascript:">{{row.allNum}}人</a>
        </template>
      </el-table-column>

      <el-table-column label="执行时间" align="center" width="280">
        <template slot-scope="{row}">{{row.startTime}}至{{row.endTime}}</template>
      </el-table-column>
      <el-table-column prop="type" label="类型" align="center" width="60">
        <template slot-scope="{row}">
          <span v-if="row.type === 0">营销</span>
          <span v-if="row.type === 1">回访</span>
          <span v-if="row.type === 2">分享</span>
          <span v-if="row.type === 3">日常</span>
        </template>
      </el-table-column>

      <el-table-column label="执行次数" align="left" width="80">
        <template slot-scope="{row}">{{row.runType?"每日执行":"一次性"}}</template>
      </el-table-column>

      <el-table-column prop="createUserName" label="创建人" width="120"></el-table-column>
      <el-table-column prop="createShopName" label="创建门店"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.state === 1" class="text-primary">执行中</span>
          <span v-if="row.state === 4" class="text-warning">已过期</span>
          <span v-if="row.state === 2" class="text-error">终止</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
        align="center"
      >
      <template slot-scope="scope" class="operation">
          <ns-button @click="AddShowToggle(scope.row)" type="text">详情</ns-button>
          <ns-button @click="deleteToggle(scope.row)" type="text">删除</ns-button>
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
  <shopDetailModal ref="detailDialogDom" :callBack="loadListFun"></shopDetailModal>
  <guideListModal ref="guideListModalDom" ></guideListModal>
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import shopDetailModal from './shopDetailModal'
import guideListModal from './guideListModal'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      activeTabName: '/Guide/Task/shopList',
      // 类型
      typeOptions: [
        {
          value: '0',
          label: '营销'
        },
        {
          value: '1',
          label: '回访'
        },
        {
          value: '2',
          label: '分享'
        },
        {
          value: '3',
          label: '日常'
        }
      ],
      statusOptions: [
        {
          value: '1',
          label: '执行中'
        },
        {
          value: '4',
          label: '已过期'
        }
      ],
      selectedArr: [],
      searchform: {
        time: [],
        name: '',
        type: '',
        state: ''
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
        .fetch(this.$api.guide.taskShopList, searchObj)
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
        this.$refs.detailDialogDom.showToggle(obj)
      })
    },
    // 删除功能
    deleteToggle (obj) {
      apiRequestConfirm('永久删除该数据')
        .then(() => {
          this.deleteTask(obj)
        })
        .catch(() => {
        // 点击取消事件
        })
    },
    async deleteTask (val) {
      let obj = {
        taskId: val.id
      }
      await this.$http
        .fetch(this.$api.guide.guide.taskDeleteTask, obj)
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
    // 打开弹窗--分配导购
    shopListModalDomShowToggle (id, shipId) {
      this.$nextTick(() => {
        this.$refs.guideListModalDom.showToggle(id, shipId)
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
    shopDetailModal,
    guideListModal
    // setGroudModal
  }
}
</script>
<style scoped>
@component-namespace shopDetailBox {
  .operation{
    padding-right:0;
  }
}
</style>
