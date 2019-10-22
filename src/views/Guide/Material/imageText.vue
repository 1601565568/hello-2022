
<template>
<!-- 门店工作统计  wanrengang 20180716 -->
<div>
   <div class="template-table">
      <!-- 简单搜索start -->
  <div class="template-table__bar">
      <el-row class="template-table__bar-base">
         <!-- 左边上角操作区域 -->

        <el-col :span="7">
            <ns-button type="primary" @click="AddShowToggle({})">新增</ns-button>
            <ns-button type="primary" v-if="color" @click="setGroudShowToggle">批量设置分组</ns-button>
            <ns-button type="primary" disabled v-else  >批量设置分组</ns-button>
            <ns-button type="primary" v-if="color" @click="deleteSubdivision">删除</ns-button>
            <ns-button disabled type="primary" v-else >删除</ns-button>
        </el-col>
        <el-col :span="17">
          <!-- 右上角操作区域 -->
          <div class="float-right tabSearchBtn">
            <ns-button @click="tabSearchType" style="padding: 5px 0 5px 10px;opacity: 0.5;color: #002041;" type="text">{{searchType.tipText}}<Icon :type="searchType.advanced ? 'up' : 'down'"/></ns-button>
          </div>
          <el-form ref="searchform" class="float-right" @submit.native.prevent v-if="!searchType.advanced" :inline="true" :model="searchform">
            <el-form-item label="素材内容：" prop="content">
              <el-input v-model="searchform.content" placeholder="请输入素材内容" @keyup.enter.native="submitForm('searchform')" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
              <ns-button @click="resetForm('searchform')">重置</ns-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
  <!-- 简单搜索end-->
<!-- 高级搜索start -->
  <div class="template-table-search" v-show="searchType.advanced">
      <div class="template-table__bar-more">
        <el-form ref="searchform" label-width="80px" @submit.native.prevent class="surround-btn" :model="searchform"  :inline="true">
          <el-form-item label="素材内容：" prop="content">
            <el-input v-model="searchform.content" placeholder="请输入素材内容" @keyup.enter.native="submitForm('searchform')" clearable></el-input>
          </el-form-item>
          <el-form-item label="分组：" prop="subdivisionId">
                <el-select v-model="searchform.subdivisionId" placeholder="请选择分组" clearable>
                  <el-option v-for="item in groudList"
                  :key="item.subdivision_id"
                  :label="item.subdivision_name"
                  :value="item.subdivision_id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="发布方：" prop="sourceId">
              <el-select  v-model="searchform.sourceId" placeholder="请选择发布方" clearable filterable >
                  <el-option v-for="item in sourceList"
                  :key="item.id"
                  :label="item.shopName"
                  :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="带码状态：" prop="codeType">
              <el-select  v-model="searchform.codeType" placeholder="请选择带码状态" clearable>
                  <el-option v-for="item in codeTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发布时间：" prop="time">
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
      @selection-change="handleSelectionChange"
      >
      <el-table-column
        type="selection"
        align="center" :width="50">
      </el-table-column>
      <el-table-column
        label="内容"
      >
      <template slot-scope="scope">
        <listItemShow :itemObj="scope.row"></listItemShow>
      </template>
      </el-table-column>
      <el-table-column prop="subName" label="分组" width="190" align="left">
        <template slot-scope="scope">
          <el-select @change="setGroudFun(scope.row.id,scope.row.subdivision_id)" v-model="scope.row.subdivision_id" placeholder="请选择">
            <el-option v-for="item in groudList"
                       :key="item.subdivision_id"
                       :label="item.subdivision_name"
                       :value="item.subdivision_id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column  prop="code_type_text" label="带码状态" align="left" width="190">

      </el-table-column>
      <el-table-column prop="source_name" label="发布方" align="left" width="190">

      </el-table-column>
      <el-table-column prop="create_time" label="发布时间 " width="150" align="left">
      </el-table-column>
      <el-table-column
        label="操作"
        width="80"
        align="right"
      >
      <template slot-scope="scope">
        <ns-button @click="AddShowToggle(scope.row)" type="text">编辑</ns-button>
        <a class="text-error" style="color:#f00" href="javascript:" @click="delsTipFun(scope.row.id)">删除</a>
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
  <setGroudModal ref="setGroudDialogDom" :callBack="loadListFun"></setGroudModal>
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import addModal from './addModal'
import setGroudModal from './setGroudModal'
import listItemShow from './components/listItemShow'
import moment from 'moment'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      activeTabName: '/guide/Material/List',
      sourceList: [
        {
          id: 0,
          shopName: this.$store.state.user.remumber.remumber_login_info.companyName
        }
      ],
      groudList: [],
      statusOptions: [
        {
          // 状态
          value: '1',
          label: '正常营业'
        },
        {
          value: '-1',
          label: '已暂定'
        },
        {
          value: '-2',
          label: '已关店'
        }
      ],
      selectedArr: [],
      color: false,
      searchform: {
        codeType: null,
        content: null,
        mType: 1,
        sourceId: null,
        subdivisionId: null,
        timeEnd: null,
        timeStart: null,
        time: []
      },
      codeTypeList: [{ name: '无', id: 0 }, { name: '图中附码', id: 1 }, { name: '单独码', id: 2 }],
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
    this.searchObj.searchMap.mType = 1
    this.loadListFun()
    this.loadGroudListFun()
    this.loadBrandListFun()
  },

  methods: {
    // 逐条设置分组
    async setGroudFun (id, groudId) {
      this.loading = true
      await this.$http
        .fetch(this.$api.guide.materialSetGroud, { ids: id, subdivision_id: groudId })
        .then(resp => {
          this.$notify.success('更新成功')
          // 回调刷新列表
          this.loadListFun()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
    },
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.guide.materialList, searchObj)
        .then(resp => {
          resp.result.data.map(item => {
            item.code_type_text = (item.code_type === 2 ? '单独码' : item.code_type === 1 ? '图片附码' : '无')
          })
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
      // 总条数
    },
    // 加载组列表
    async loadGroudListFun (data) {
      this.loading = true
      await this.$http
        .fetch(this.$api.guide.materialGroudListAll, {})
        .then(resp => {
          this.groudList = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
    },
    // 加载发布方列表
    async loadBrandListFun (data) {
      this.loading = true
      await this.$http
        .fetch(this.$api.guide.comGetBrandForShopList, { isOnline: 0 })
        .then(resp => {
          this.sourceList = this.sourceList.concat(resp.result)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
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
        .fetch(this.$api.guide.materialDel, obj)
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
        this.$refs.addDialogDom.showToggle(obj, this.groudList)
      })
    },
    // 打开弹窗--设置分组
    setGroudShowToggle () {
      if (this.selectedArr.length < 1) {
        this.$notify.error('请选择素材')
        return
      }
      // 传递保存时需要的参数
      this.$nextTick(() => {
        this.$refs.setGroudDialogDom.showToggle(this.selectedArr, this.groudList)
      })
    },
    // 打开弹窗--批量删除
    deleteSubdivision () {
      let that = this
      let obj = { materialIds: '' }
      let arry = []
      that.selectedArr.map(item => {
        arry.push(item.id)
      })
      obj.materialIds = arry.join(',')
      apiRequestConfirm('永久删除该数据')
        .then(() => {
          that.$http
            .fetch(that.$api.guide.material.batchDeleteMaterial, obj)
            .then(resp => {
              that.loadListFun()
              that.$notify.success('删除成功！')
            })
            .catch(resp => {
              that.$notify.error(getErrorMsg('删除失败', resp))
            })
        })
        .catch(() => {
          // 点击取消事件
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
      if (this.searchform.sourceId === '' || this.searchform.sourceId === null) {
        this.searchObj.searchMap.sourceId = null
      } else {
        this.searchObj.searchMap.sourceId = this.searchform.sourceId
      }
      this.searchObj.searchMap.subdivisionId = this.searchform.subdivisionId
      if (this.searchform.subdivisionId === '' || this.searchform.subdivisionId === null) {
        this.searchObj.searchMap.subdivisionId = null
      } else {
        this.searchObj.searchMap.subdivisionId = this.searchform.subdivisionId
      }
      this.searchObj.searchMap.content = this.searchform.content
      if (this.searchform.codeType === '' || this.searchform.codeType === null) {
        this.searchObj.searchMap.codeType = null
      } else {
        this.searchObj.searchMap.codeType = this.searchform.codeType
      }
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
    // 选择门店
    handleSelectionChange (val) {
      this.selectedArr = val
      val.length > 0 ? this.color = true : this.color = false
    }
  },
  components: {
    addModal,
    listItemShow,
    setGroudModal
  }
}
</script>
<style scoped>
.mt10{
  border-radius: 3px 3px 0 0 !important
}
</style>
