
<template>
<div class="addSCBox">
  <el-dialog
  :title="titleText"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="880px"
  :before-close="handleClose">
    <el-form ref="searchform" :model="saveObj"  :inline="true">
      <el-table
        ref="multipleTable"
        :data="dataList"
        v-loading="tableLoading"
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
            内容类型
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

        <el-table-column  width="200"  align="center">
          <template slot="header">
            发送顺序
            <el-tooltip content="调整发送顺序">
              <Icon type="question-circle"/>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <i class='sort' :class="scope.$index?'topShow':'topHid'" v-if="0 != scope.$index" @click='exchangeSort(1,scope.row.id)'><Icon type="zhiding"/></i>
            <i class='sort' :class="scope.$index?'topShow':'topHid'" v-if="0 != scope.$index" @click='exchangeSort(2,scope.row.id)'><Icon type="top-arr"/></i>
            <i class='sort' :class="scope.$index!==dataList.length-1?'topShow':'topHid'" v-if="scope.$index != dataList.length-1" @click='exchangeSort(3,scope.row.id)'><Icon type="down-arr"/></i>
            <i class='sort' :class="scope.$index!==dataList.length-1?'topShow':'topHid'" v-if="scope.$index != dataList.length-1" @click='exchangeSort(4,scope.row.id)'><Icon type="zhidi"/></i>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="100"
          align="center">
          <template slot-scope="scope">
            <ns-button @click="AddShowToggle(scope.row)" type="text">编辑</ns-button>
            <a href="javascript:" @click="delsTipFun(scope.row.id)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-form>
      <el-form-item style="margin-top: 20px">
        <ns-button type='text'>+添加欢迎语内容</ns-button><span style="margin-left: 20px; color: #8c939d">欢迎语最多添加10条</span>
      </el-form-item>
      <el-form-item label="使用范围：">
        <span>已选123名员工</span><ns-button type='text'>+选择员工</ns-button><span style="margin-left: 10px; color: #8c939d">设置使用该欢迎语的员工</span>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">取 消</ns-button>
      <ns-button type="primary" :loading="loading" @click="saveFun">确 定</ns-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import { getErrorMsg } from '@/utils/toast'
export default {
  props: {
    callBack: Function
  },
  data () {
    return {
      titleText: '新增欢迎语',
      searchform: {},
      tableLoading: false,
      loading: false, // 防重复提交
      editId: null,
      dataList: [],
      dialogVisible: false
    }
  },
  created: function () {},
  methods: {
    showToggle (obj) {
      if (obj.id) {
        this.editId = obj.id
        this.loadListFun(obj.id)
        this.titleText = '编辑欢迎语'
      } else {
        this.titleText = '新增欢迎语'
      }
      this.saveObj = JSON.parse(JSON.stringify(obj))
      this.dialogVisible = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    delImgFun (index) {
      this.imgList.splice(index, 1)
    },

    // 加载列表
    async loadListFun (id) {
      if (!id) {
        return
      }
      this.tableLoading = true
      let params = { id: id }
      await this.$http
        .fetch({
          url: '/Guide/speech/getSubSpeech',
          method: 'post'
        }, params)
        .then(resp => {
          this.dataList = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.tableLoading = false
    },
    // 调整发送顺序
    async exchangeSort (type, id) {
      this.tableLoading = true
      let params = { id: id, type: type, parentId: this.editId }
      await this.$http
        .fetch({
          url: '/Guide/speech/adjustmentOrder',
          method: 'post'
        }, params)
        .then(resp => {
          this.loadListFun(this.editId)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.tableLoading = false
    },
    // 提交保存
    saveFun () {
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.doSave()
        }
      })
    },
    async doSave () {
      this.loading = true
      await this.$http
        .fetch(this.$api.guide.materialGroudDeit, this.saveObj)
        .then(resp => {
          this.handleClose()
          // 回调刷新列表
          this.$props.callBack()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
    },
    handleClose () {
      this.$refs.searchform.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
