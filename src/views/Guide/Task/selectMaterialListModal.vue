
<template>
<!-- 素材选择列表--弹窗  wanrengang 20180808 -->
<div class="addSCBox">
  <el-dialog
  title="素材选择"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="800px"
  :before-close="handleClose">
    <div class="comDialogBoxCon">
      <div class="mt10">
        <el-table
        :data="dataList"
        :lock-scroll="false"
        v-loading="loading"
        :element-loading-text="$t('prompt.loading')"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
        >
            <el-table-column prop="content" label="素材内容">
              <template slot-scope="scope">
                <listItemShow :itemObj="scope.row" :appendToBody="true"></listItemShow>
              </template>
            </el-table-column>
          <el-table-column width="100" label="素材类型">
            <template slot-scope="{row}">
              <span v-if="row.m_type === 0">文章素材</span>
              <span v-else>图文素材</span>
            </template>
          </el-table-column>
            <el-table-column prop="subdivision_name" align="left" width="120" label="分组名称"></el-table-column>
            <el-table-column prop="create_time" label="发布时间" align="center" width="160"></el-table-column>
            <el-table-column  width="80" label="操作">
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
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import listItemShow from '../Material/components/listItemShow'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [listPageMixin],
  props: {
    callBack: Function
  },
  components: {
    listItemShow
  },
  data () {
    return {
      loading: false, // 防重复提交
      dataList: [],
      dialogVisible: false,
      selectObj: {}
    }
  },
  methods: {
    showToggle (obj) {
      if (obj.id) {
        this.selectObj = obj
      }
      this.dialogVisible = true
      this.loadListFun()
    },
    // 选择素材
    selectMaterialFun (obj) {
      this.dialogVisible = false
      this.$props.callBack(obj)
    },
    // 分组
    async loadListFun () {
      // 素材列表
      await this.$http
        .fetch(this.$api.guide.materialFindListByBrandId, this.searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    handleClose () {
      this.dataList = []
      this.searchObj.start = 0
      this.dialogVisible = false
    }
  }
}
</script>
