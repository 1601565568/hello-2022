<template>
  <el-dialog
    title="草稿箱"
    :visible.sync="dialogVisible"
    width="1000px" height="600px">
    <el-table ref="table" :data="tableList" class="template-table__main"
              stripe
              resizable v-loading.lock="loadingTable"
              :element-loading-text="$t('prompt.loading')">
      <el-table-column prop="draft_id" align="center" label="草稿ID"></el-table-column>
      <el-table-column prop="create_time" align="center" label="上传时间"></el-table-column>
      <el-table-column prop="user_version" align="center" label="版本号"></el-table-column>
      <el-table-column prop="user_desc" label="描述"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                       width="120">
        <template slot-scope="scope">
          <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                          :prop="scope">
          </ns-table-column-operate-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  import tableMixin from 'mixins/table'

  export default {
    name: 'draftList',
    mixins: [tableMixin],
    data: function () {
      let that = this
      let tableButtons = [
        {
          'func': function (obj) {
            that.addDraftToTemplate(obj.row.template_id)
          },
          'name': '设为模板',
          'visible': ''
        }
      ]

      return {
        dialogVisible: false,
        loadingTable: false,
        tableList: [],
        _table: {
          table_buttons: tableButtons,
          operate_buttons: [],
          quickSearchMap: {}
        }
      }
    },
    mounted: function () {
    },
    methods: {
      // 打开弹框
      openDialog: function () {
        let that = this
        that.dialogVisible = true
        that.loadingTable = true
        that.$http.fetch(that.$api.isv.getTemplateDraftList)
        .then((resp) => {
          that.tableList = resp.result
          that.loadingTable = false
        }).catch((resp) => {
          that.$notify.error(resp.msg)
          that.loadingTable = false
        })
      },
      // 将草稿设置为模板
      addDraftToTemplate: function (draftId) {
        let that = this
        that.$http.fetch(that.$api.isv.addDraftToTemplate, {draftId: draftId})
        .then(() => {
          that.$notify.success('设置成功')
        }).catch((resp) => {
          that.$notify.error(resp.msg)
        })
      }
    }
  }
</script>
