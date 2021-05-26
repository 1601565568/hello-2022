
<template>
<!-- 素材选择列表--弹窗  wanrengang 20180808 -->
<div class="addSCBox">
  <el-dialog
  title="素材选择"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="1000px"
  :before-close="handleClose">
    <div>
      <div class="library-form">
        <el-form
          ref="table_filter_form"
          @keyup.enter.native="searchAction"
          label-width="80px"
          :model="model"
          :inline="true"
        >
          <el-form-item label="标题：">
            <el-input type="text" v-model="model.name" placeholder="请输入素材标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="素材内容：">
            <el-input type="text" v-model="model.content" placeholder="请输入素材内容" clearable></el-input>
          </el-form-item>
          <el-form-item label="标签：">
            <el-select
              v-model="model.subdivisionId"
              placeholder="请选择"
              filterable
              clearable
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="未打标" :value="-1"></el-option>
              <el-option
                v-for="item in labelList"
                :key="item.subdivisionId"
                :label="item.subdivisionName"
                :value="item.subdivisionId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="素材类型：" prop="mType">
            <el-select
              v-model="model.mType"
              placeholder="请选择素材类型"
              clearable
            >
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件夹：" >
            <span class="mr5"><span class="catalogueStr" :title=catalogueStr>{{catalogueStr}}</span></span>
            <ns-button type="primary" @click="toggleFolder">选择文件夹</ns-button>
          </el-form-item>
        </el-form>
        <div class="library-form__btns">
          <ns-button type="primary" @click="searchAction">{{$t('operating.search')}}</ns-button>
          <ns-button @click="resetAction">{{$t('operating.reset')}}</ns-button>
        </div>
      </div>
      <div class="library-body">
        <el-table
          v-loading="loading"
          :data="dataList"
          :element-loading-text="$t('prompt.loading')"
          height="500"
        >
          <el-table-column label="标题" prop="name" :min-width="190" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="内容" prop="content" :min-width="275">
            <template slot-scope="scope">
              <table-item :data="scope.row" @preview="togglePreview"></table-item>
            </template>
          </el-table-column>
          <el-table-column width="110" label="素材类型">
            <template slot-scope="{row}">
              <span v-if="row.mType === 0">文章素材</span>
              <span v-else-if="row.mType === 1">图文素材</span>
              <span v-else>视频素材</span>
            </template>
          </el-table-column>
          <el-table-column prop="subdivisionName" label="标签" width="145">
            <template slot-scope="{row}">
              {{row.subdivisionName || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间" width="160"></el-table-column>
          <el-table-column width="80" label="操作">
            <template slot-scope="{row}">
              <span v-if="row.id === selectObj.id">已选择</span>
              <a v-else href="javascript:" class="text-primary" @click="selectMaterialFun(row)">选择</a>
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
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">关闭</ns-button>
    </span>
  </el-dialog>
  <preview ref="preview"></preview>
  <folder-tree
    ref="folderTree"
    title="选择文件夹"
    :showNewFoler="false"
    :selectedByFirst="false"
    @submit="handleFolder"
  >
    <template slot="extraTitle">
      <el-tooltip popper-class="table-body__tooltip" placement="bottom" content="选中后会显示直属于该文件夹的素材（不包括它子文件夹下素材）">
        <Icon type="question-circle" class="ml5"/>
      </el-tooltip>
    </template>
  </folder-tree>
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import TableItem from '../Material/Library/components/TableItem'
import Preview from '@/components/NsPreview'
import FolderTree from '../Material/Library/components/FolderTree'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [listPageMixin],
  props: {
    callBack: Function,
    hasShopArr: Array
  },
  components: { TableItem, Preview, FolderTree },
  data () {
    const model = {
      parentId: null,
      mType: '',
      name: '',
      content: '',
      subdivisionId: '',
      isDisableGlobalSearch: 1,
      isDirectory: 0
    }
    return {
      // 筛选项
      model: { ...model },
      originModel: { ...model },
      dialogVisible: false,
      labelList: [],
      typeList: [{ name: '全部', id: '' }, { name: '图文素材', id: 1 }, { name: '视频素材', id: 2 }, { name: '文章素材', id: 0 }],
      selectObj: {},
      catalogue: []
    }
  },
  computed: {
    catalogueStr () {
      return this.catalogue.length ? this.catalogue[this.catalogue.length - 1].name : '全部'
    }
  },
  methods: {
    // 显示文件夹
    toggleFolder () {
      this.$refs.folderTree.show(null, this.catalogue)
    },
    handleFolder ({ checked, catalogue }) {
      this.catalogue = catalogue
      this.model.parentId = catalogue[catalogue.length - 1].id
    },
    showToggle (obj) {
      if (obj && obj.id) {
        this.selectObj = obj
      }
      this.dialogVisible = true
      this.model = { ...this.originModel }
      this.catalogue = []
      this.getAllLabel()
      this.searchAction(false)
    },
    // 删除素材
    cancleToggle () {
      this.selectObj = {}
    },
    // 重置
    resetAction () {
      this.model = { ...this.originModel }
      this.catalogue = []
      this.searchAction()
    },
    // 搜索
    searchAction (isChangePage = true) {
      let params = {}
      Object.keys(this.model).forEach(k => {
        if (this.model[k] !== '' && this.model[k] !== null) {
          params[k] = this.model[k]
        }
      })
      this.searchObj.searchMap = params
      if (isChangePage) {
        this.pagination.page = 1
      }
      this.loadListFun()
    },
    // 选择素材
    selectMaterialFun (obj) {
      this.dialogVisible = false
      this.$props.callBack(obj)
    },
    // 分组
    async loadListFun () {
      this.loading = true
      this.$http
        .fetch(this.$api.guide.findMaterialListByShare, this.searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        }).finally(() => {
          this.loading = false
        })
    },
    handleClose () {
      this.dataList = []
      this.searchObj.start = 0
      this.dialogVisible = false
    },
    togglePreview (current, list, type) {
      this.$refs.preview.toggleShow(current, list, type)
    },
    getAllLabel () {
      this.$http
        .fetch(this.$api.guide.materialGroudListAll, {})
        .then(resp => {
          this.labelList = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    }
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";
  @component-namespace library {
    @b form {
      display: flex;
      @e btns {
        margin-left: var(--default-margin-larger);
      }
      >>> .el-form {
        flex: 1;
        .el-input, .el-select {
          width: 180px;
        }
      }
    }
    @b body {
      margin-top: var(--default-margin-small);
    }
  }
  .catalogueStr {
    display: inline-block;
    max-width: 182px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1;
  }
</style>
