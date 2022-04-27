
<template>
<!-- 门店工作统计  wanrengang 20180716 -->
<div>
  <el-tabs v-model="activeTabName" @tab-click="tabHandleClick">
    <el-tab-pane label="品牌任务" name="/Guide/Task/List"></el-tab-pane>
    <el-tab-pane label="门店任务" name="/Guide/Task/shopList"></el-tab-pane>
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
              <ns-button @click="tabSearchType" type="text" style="padding-left: 10px;opacity: 0.5;color: #002041;">
                {{searchType.tipText}}
                <Icon :type="searchType.advanced ? 'up' : 'down'"/>
              </ns-button>
            </div>
            <el-form ref="searchform" class="float-right" v-if="!searchType.advanced" :inline="true" :model="searchform"
                     @submit.native.prevent>
              <el-form-item label="任务名称：" prop="name">
                <el-input
                  v-model="searchform.name"
                  placeholder="请输入任务名称"
                  clearable
                  @keyup.enter.native="submitForm('searchform')"></el-input>
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
            <el-input v-model="searchform.name"  placeholder="请输入任务名称" clearable @keyup.enter.native="submitForm('searchform')"></el-input>
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
      <el-table-column prop="name" label="任务名称"></el-table-column>
      <el-table-column prop="name" label="指派门店"  align="right" width="80">
        <template slot-scope="{row}">
          <a @click="shopListModalDomShowToggle(row.id)" href="javascript:" v-if="row.targetIds === 0">全部门店</a>
          <a @click="shopListModalDomShowToggle(row.id)" href="javascript:" v-else>{{row.allNum}}家</a>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="任务类型" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.type === 0">营销</span>
          <span v-if="row.type === 1">回访</span>
          <span v-if="row.type === 2">分享</span>
          <span v-if="row.type === 3">日常</span>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" align="center" width="400">
        <template slot-scope="{row}">{{row.startTime}}至{{row.endTime}}</template>
      </el-table-column>
      <el-table-column label="执行次数" align="center" width="80">
          <template slot-scope="{row}">{{row.runType === 0?"一次性":"每日执行"}}</template>
        </el-table-column>
      <el-table-column prop="status" label="状态" align="left" width="100">
        <template slot-scope="{row}">
          <el-tag type="success" v-if="row.state === 1" class='scope-name_tag'>执行中</el-tag>
          <el-tag type="info" v-if="row.state === 3" class='scope-name_tag'>已完成</el-tag>
          <el-tag type="warning" v-if="row.state === 5" class='scope-name_tag'>未开始</el-tag>
          <el-tag type="danger" v-if="row.state === 6" class='scope-name_tag'>未完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        align="center"
      >
      <template slot-scope="scope">
        <ns-button @click="ViewProgress(scope.row)" type="text">查看任务进度</ns-button>
        <span v-if="scope.row.editAccess === 1" >
          <span v-if="scope.row.state === 5 || scope.row.state === 1" >
            <ns-button @click="EditShowToggle(scope.row)" type="text">编辑</ns-button>
          </span>
          <span v-if="scope.row.state === 5" >
            <a href="javascript:" @click="delsTipFun(scope.row.id)" class="btn-detele">删除</a>
          </span>
        </span>
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
  <addBrandTaskModal ref="addDialogDom" :callBack="loadListFun"></addBrandTaskModal>
  <showShopListModal ref="showShopListModalDom" ></showShopListModal>
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import addBrandTaskModal from './addBrandTaskModal'
import showShopListModal from './showShopListModal'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      activeTabName: '/Guide/Task/List',
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
          value: '3',
          label: '已完成'
        },
        {
          value: '5',
          label: '未开始'
        },
        {
          value: '6',
          label: '未完成'
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
    // 新建页面
    AddShowToggle (obj) {
      // 传递保存时需要的参数
      // this.$nextTick(() => {
      //   this.$refs.addDialogDom.showToggle(obj)
      // })
      this.$router.push('/Guide/Task/edit/0')
    },
    // 编辑页面
    EditShowToggle (obj) {
      // 传递保存时需要的参数
      // this.$nextTick(() => {
      //   this.$refs.addDialogDom.showToggle(obj)
      // })
      this.$router.push('/Guide/Task/edit/' + obj.id)
    },
    // 查看完整进度
    ViewProgress (obj) {
      this.$router.push('/Guide/Task/taskOverview/' + obj.id)
    },
    // 打开弹窗--查看指派门店
    shopListModalDomShowToggle (id) {
      this.$nextTick(() => {
        this.$refs.showShopListModalDom.showToggle(id)
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
    addBrandTaskModal,
    showShopListModal
    // setGroudModal
  }
}
</script>
<style scoped>

  @import "@theme/variables.pcss";

  .btn-detele {
    margin-left: var(--default-margin-base);
  }
  .scope-name_tag.el-tag {
    border-radius: 2px;
    &.el-tag--success {
      background: #F7FFF0;
      border: 1px solid #53BF1D;
      color: #262626;
    }
    &.el-tag--info {
      background: #F5F5F5;
      border: 1px solid #D9D9D9;
      color: #262626;
    }
    &.el-tag--warning {
      background: #FFFBE6;
      border: 1px solid #FFAE0D;
      color: #262626;
    }
  }
</style>
