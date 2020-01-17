<template>
  <div>
    <el-dialog
      title="代码模板"
      :visible.sync="dialogVisible"
      width="900px">
      <ns-page-table :colButton="6">
        <!-- 按钮 -->
        <template slot="buttons">
          <ns-table-operate-button :buttons="_data._table.operate_buttons">
          </ns-table-operate-button>
        </template>
        <!-- 按钮-结束 -->
        <!-- 表格 -->
        <template slot="table">
          <!-- 表格单元格宽度配置规范 -->
          <!-- 复选框/单选框 :width="45" -->
          <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
          <!-- 手机号 :width="120" -->
          <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->

          <el-table ref="table" :data="_data._table.data" class="template-table__main"
                    stripe
                    resizable v-loading.lock="_data._table.loadingtable"
                    :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
            <el-table-column prop="template_id" align="center" label="模板ID"></el-table-column>
            <el-table-column prop="push_time" align="center" label="创建时间"></el-table-column>
            <el-table-column prop="version" align="center" label="版本号"></el-table-column>
            <el-table-column prop="developer" label="开发者"></el-table-column>
            <el-table-column prop="user_desc" label="代码备注"></el-table-column>
            <el-table-column label="状态" width='120' align="center">
              <template slot-scope="scope">
                <div>
                  <div v-if="scope.row.status === 0">未上传</div>
                  <div v-else-if="scope.row.status === 1">待审核</div>
                  <div v-else-if="scope.row.status === 2">审核中</div>
                  <div v-else-if="scope.row.status === 3">审核成功</div>
                  <div v-else-if="scope.row.status === 4">已发布</div>
                  <div v-else-if="scope.row.status === -1">审核失败</div>
                  <div v-else-if="scope.row.status === 2">被覆盖</div>
                  <div v-else>未知</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                             width="120">
              <template slot-scope="scope">
                <ns-table-column-operate-button :buttons="_data._table.table_buttons" :prop="scope">
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
    </el-dialog>
    <el-dialog
      title="提交审核"
      :visible.sync="auditDialogVisible"
      width="900px">
      <!-- 弹窗内容 -->
      <el-form label-width="120px"
               class="form-main"
               :model="model"
               ref="form">
        <el-form-item label="标题：">
          <el-form-grid size="lg">
            <el-form-item prop="title">
              <el-input v-model="model.title" placeholder="小程序页面的标题,标题长度不超过32"></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="页面配置：" prop="pageStr">
          <el-form-grid size="lg">
            <el-select v-model="model.pageStr" :placeholder="$t('prompt.select')">
              <el-option
                v-for="page in pageList"
                :key="page" :label="page" :value="page">
              </el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="类目：" prop="categoryId">
          <el-form-grid size="lg">
            <el-select v-model="model.categoryId" :placeholder="$t('prompt.select')">
              <el-option
                v-for="category in categoryList" :key="category.value" :label="category.label" :value="category.value">
              </el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="标签：">
          <el-form-grid size="xlg">
            <el-form-item prop="tags">
              <el-input v-model="model.tags" type="textarea"
                        placeholder="小程序的标签，多个标签用空格分隔，标签不能多于10个，标签长度不超过20"></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <!-- 弹窗内容-结束 -->
      <span slot="footer" class="dialog-footer">
        <ns-button @click="auditDialogVisible = false">取 消</ns-button>
        <ns-save @click="submitTemplate">提交</ns-save>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import { getErrorMsg } from '@/utils/toast'
export default {
  name: 'templateList',
  mixins: [tableMixin],
  data: function () {
    let that = this
    let operateButtons = [
      {
        'func': function () {
          that.refreshTemplate()
        },
        'name': '同步最新'
      }]
    let tableButtons = [
      {
        'func': function (obj) {
          that.templateId = obj.row.template_id
          that.getPageList()
          that.getCategoryList()
          that.auditDialogVisible = true
        },
        'name': '提交审核',
        'visible': ''
      },
      {
        'func': function (obj) {
          that.templateToRelease()
        },
        'icon': '$.noop',
        'name': '发布',
        'visible': 'scope.row.status === 3'
      }
    ]

    return {
      dialogVisible: false,
      auditDialogVisible: false,
      appId: null,
      templateId: null,
      pageList: [],
      categoryList: [],
      categoryTempList: [], // 类目临时表
      model: {
        categoryId: null,
        pageStr: null,
        title: null,
        tags: null
      },
      quickSearchModel: {},
      rules: Object.assign({}, {}, {}),
      url: this.$api.isv.getCodeTemplateList,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchMap: {}
      }
    }
  },
  mounted: function () {
  },
  methods: {
    // 打开弹框
    openDialog: function (appId) {
      this.appId = appId
      if (!this._data._table.searchMap) {
        this._data._table.searchMap = {}
      }
      this._data._table.searchMap.appId = appId
      this.$reload()
      this.dialogVisible = true
    },
    // 刷新模板
    refreshTemplate: function () {
      let that = this
      that.$http.fetch(that.$api.isv.refreshCodeTemplate, { appId: that.appId }).then(() => {
        that.$reload()
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 提交代码的页面配置列表
    getPageList: function () {
      let that = this
      that.$http.fetch(that.$api.isv.getAppletPageList, { appId: that.appId }).then((resp) => {
        that.pageList = resp.result
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 获取授权小程序帐号的可选类目
    getCategoryList: function () {
      let that = this
      that.$http.fetch(that.$api.isv.getAppletCategoryList, { appId: that.appId }).then((resp) => {
        /*        let categoryTempList = [
                    {
                      'first_class': '工具',
                      'second_class': '备忘录',
                      'first_id': 1,
                      'second_id': 2
                    },
                    {
                      'first_class': '教育',
                      'second_class': '学历教育',
                      'third_class': '高等',
                      'first_id': 3,
                      'second_id': 4,
                      'third_id': 5
                    }]
                  that.categoryTempList = categoryTempList */
        let categoryTempList = resp.result
        if (categoryTempList && categoryTempList.length > 0) {
          for (let i = 0; i < categoryTempList.length; i++) {
            let object = {
              value: null,
              label: null
            }
            object.value = i
            object.label = categoryTempList[i].first_class
            if (categoryTempList[i].second_class) {
              object.label += '|' + categoryTempList[i].second_class
            }
            if (categoryTempList[i].third_class) {
              object.label += '|' + categoryTempList[i].third_class
            }
            that.categoryList.push(object)
          }
        }
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 提交审核
    submitTemplate: function () {
      let that = this
      let params = {}
      params.appId = that.appId
      params.templateId = that.templateId
      params.title = that.model.title
      params.tags = that.model.tags
      params.pageStr = 'index'
      let category = that.categoryTempList[that.model.categoryId]
      if (category) {
        params.categoryStr = JSON.stringify(category)
      }
      that.$http.fetch(that.$api.isv.submitTemplateToAudit, params).then(() => {
        that.auditDialogVisible = false
        that.$reload()
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 发布
    templateToRelease: function () {
      let that = this
      apiRequestConfirm('发布模板').then(() => {
        that.$http.fetch(that.$api.isv.templateToRelease, { appId: that.appId }).then(() => {
          that.$reload()
        }).catch((resp) => {
          that.$notify.error(getErrorMsg('查询失败', resp))
        })
      }).catch(() => {
      })
    }
  }
}
</script>
