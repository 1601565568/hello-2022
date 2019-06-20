<template>
  <div>
    <ns-page-table :colButton="6">
      <!-- 按钮 -->
      <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.operate_buttons">
        </ns-table-operate-button>
      </template>
      <!-- 按钮-结束 -->
      <!-- 表格 -->
      <template slot="table">
        <!-- 表格配置 不能添加 border 配置 -->
        <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

        <!-- 表格单元格宽度配置规范 -->
        <!-- 复选框/单选框 :width="45" -->
        <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
        <!-- 手机号 :width="120" -->
        <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->

        <el-table ref="table" :data="_data._table.data" class="template-table__main"
                  stripe
                  resizable v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column prop="app_id" label="appId"></el-table-column>
          <el-table-column prop="create_time" label="创建时间"></el-table-column>
          <el-table-column label="状态" width='120' align="center">
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.status === 1">已授权</div>
                <div v-else>未授权</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                           width="200">
            <template slot-scope="scope">
              <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                              :prop="scope">
              </ns-table-column-operate-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 表格-结束 -->

      <!-- 分页 -->
      <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                       :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                       :current-page.sync="_data._pagination.page" :page-size="_data._pagination.size"
                       layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                       @current-change="$pageChange$">
        </el-pagination>
      </template>
      <!-- 分页-结束 -->
    </ns-page-table>

    <template-list ref="template"></template-list>
    <domain-setting ref="domain"></domain-setting>
    <draft-list ref="draft"></draft-list>
  </div>
</template>

<script>
import tableMixin from 'web-crm/src/mixins/table'
import TemplateList from './templateList'
import DomainSetting from './domainSetting'
import DraftList from './draftList'

export default {
  name: 'AppletTable',
  components: {
    DraftList,
    TemplateList,
    DomainSetting
  },
  mixins: [tableMixin],
  data: function () {
    let operateButtons = []
    let tableButtons = [
      {
        'func': function (obj) {
          this.$refs.draft.openDialog()
        },
        'icon': '$.noop',
        'name': '草稿箱'
      },
      {
        'func': function (obj) {
          this.$refs.template.openDialog(obj.row.app_id)
        },
        'icon': '$.noop',
        'name': '代码模板'
      },
      {
        'func': function (obj) {
          this.$refs.domain.openDialog(obj.row.id)
        },
        'icon': '$.noop',
        'name': '域名配置'
      }
    ]

    return {
      model: {},
      quickSearchModel: {},
      rules: Object.assign({}, {}, {}),
      url: this.$api.isv.getAppletList,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchMap: {}
      }
    }
  },
  mounted: function () {
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  methods: {}
}
</script>
