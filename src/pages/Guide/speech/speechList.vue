<template>
<div>
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
            <el-form ref="searchform" class="float-right" @submit.native.prevent v-if="!searchType.advanced" :inline="true" :model="searchform">
              <el-form-item label="欢迎语：" prop="subdivision_name">
                <el-input v-model="searchform.content" placeholder="请输入欢迎语内容" @keyup.enter.native="submitForm('searchform')" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <ns-button type="primary" @click="submitForm('searchform')" class="searchbtn">搜索</ns-button>
                <ns-button @click="resetForm('searchform')" class="resetbtn">重置</ns-button>
              </el-form-item>
            </el-form>
        </el-col>
      </el-row>
  <!-- 简单搜索end -->
<!-- 高级搜索start -->
  <div class="template-table-search" v-show="searchType.advanced">
      <div class="template-table__bar-more">
        <el-form ref="searchform" label-width="80px" @submit.native.prevent class="surround-btn" :model="searchform"  :inline="true">
          <el-form-item label="欢迎语：" prop="subdivision_name">
            <el-input v-model="searchform.content" placeholder="请输入欢迎语" @keyup.enter.native="submitForm('searchform')" clearable></el-input>
          </el-form-item>
          <el-form-item label="附带：">
            <el-form-grid>
              <el-select placeholder="全部" v-model="searchform.type" clearable @clear="setJobNull">
                <el-option label="全部" value=""></el-option>
                <el-option label="图片" :value="0"></el-option>
                <el-option label="链接" :value="1"></el-option>
                <el-option label="小程序" :value="2"></el-option>
                <el-option label="文字" :value="3"></el-option>
              </el-select>
            </el-form-grid>
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
  <div>
    <el-table
      ref="multipleTable"
      :data="dataList"
      v-loading="loading"
      :element-loading-text="$t('prompt.loading')"
      tooltip-effect="dark"
      stripe
      style="width: 100%"
      >
      <el-table-column label="序号" width="100">
         <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>

      <el-table-column  width="200"  align="center" prop="content">
        <template slot="header">
          欢迎语
          <el-tooltip content="配置后，客户将在添加员工为微信好友时，发送欢迎语">
            <Icon type="question-circle"/>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column  width="200"  align="center">
        <template slot="header">
          附带
        </template>
        <template slot-scope="scope">
          <p v-if="scope.row.type == 0">
            图片
          </p>
          <p v-if="scope.row.type == 1">
            链接
          </p>
          <p v-if="scope.row.type == 2">
            小程序
          </p>
          <p v-if="scope.row.type == 3">
            文字
          </p>
        </template>
      </el-table-column>

      <el-table-column >
        <template slot="header">
          使用范围
        </template>
        <template slot-scope="scope">
          {{scope.row.count}}名员工
        </template>
      </el-table-column>

      <el-table-column prop="update_time" label="更新时间 " width="200" align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
        align="center"
      >
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
import moment from 'moment'
import { getErrorMsg } from '@/utils/toast'
import addModal from './addModal'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      activeTabName: '/guide/MaterialSubdivision/List',
      selectedArr: [],
      searchform: {
        content: null,
        type: null
      },
      dataList: []
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
        .fetch({
          url: '/Guide/speech/findList',
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
    },
    exchangeSort (type, subdivisionId) {
      let parms = { type, subdivisionId }
      this.$http
        .fetch(this.$api.guide.materialExchangeSort, parms)
        .then(resp => {
          this.loadListFun()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    // 删除
    delsTipFun (val) {
      apiRequestConfirm('永久删除该欢迎语吗？')
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
          url: '/Guide/speech/delete',
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
    // 打开弹窗--编辑
    AddShowToggle (obj) {
      // 传递保存时需要的参数
      this.$nextTick(() => {
        this.$refs.addDialogDom.showToggle(obj)
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
    // 重置搜索
    resetForm (formName) {
      for (let attr in this.searchform) {
        this.searchform[attr] = null
      }
      // this.$refs[formName].resetFields()
      this.submitForm()
    },
    // 提交搜索
    submitForm (formName) {
      this.searchObj.searchMap.content = this.searchform.content
      this.searchObj.searchMap.type = this.searchform.type
      this.loadListFun()
    },
    // 选择门店
    handleSelectionChange (val) {
      this.selectedArr = val
    }
  },
  computed: {},
  components: {
    addModal
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";

  .topHid{
    visibility: hidden
  }
  .sort{
    font-size: var(--default-font-size-base);
    color: var(--theme-color-primary);
    cursor: pointer;
  }
  .searchbtn {
    margin-left: var(--default-margin-base);
  }
  .resetbtn {
    margin-left: 11px;
  }
</style>
<style scoped>
  .has-gutter .el-table_2_column_9::after{
    content: "》";
    color: blue;

  }
</style>
