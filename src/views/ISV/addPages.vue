<template>
  <div>
    <!-- <ns-button @click='aaaaa'>session过期</ns-button> -->
    <ns-page-table>
      <!-- 按钮 -->
      <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.table_buttons"></ns-table-operate-button>
      </template>
      <!-- 表格 -->
      <template slot="table">
        <el-table ref="table" :data="_data._table.data" class="template-table__main" stripe resizable v-loading.lock="_data._table.loadingtable" :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column prop="name" label="菜单标题"></el-table-column>
          <el-table-column prop="code" label="菜单编码" align="left" width="280"></el-table-column>
          <el-table-column prop="url" label="页面路径" align="left" width="250"></el-table-column>
          <el-table-column label="ID" align="left" width="139" prop="id"></el-table-column>
          <el-table-column prop="parent_id" label="父级ID"  align="left"></el-table-column>
          <el-table-column prop="description" label="页面描述"  align="left"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="right" width="112">
            <template slot-scope="scope">
              <span class="tmp-cell__buttons">
                <ns-button type="text" @click="onSaveOpen(scope.row)">编辑</ns-button>
                <ns-button v-if="scope.row.appid !== 'wxd018c65db8b66408' && scope.row.appid !== 'wx088d6dbeea9c68c3'" type="text" @click="onDelete(scope.row)">删除</ns-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 表格-结束 -->
      <!-- 分页 -->
      <!-- <template slot="pagination">
        <el-pagination
          v-if="_data.pagination.enable"
          class="template-table__pagination"
          :page-sizes="_data.pagination.sizeOpts"
          :total="_data.pagination.total"
          :current-page="_data.pagination.page"
          :page-size="_data.pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="$sizeChange$"
          @current-change="$pageChange$">
          </el-pagination>
      </template> -->
      <!-- 分页-结束 -->
      <!-- <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.table_button"></ns-table-operate-button>
      </template> -->
    </ns-page-table>
    <!-- 最新弹窗模板详情开始 -->
    <el-dialog width="40%" :title="titleText" :visible.sync="dialogFormVisible" :modal-append-to-body="false" @before-close="closeDialog()">
      <el-form :model="model" ref="form" label-width="150px" :rules="rules" placement="right">
        <el-form-item label="菜单标题：" prop="name" required>
          <el-input type="text" placeholder="请输入页面标题" v-model="model.name" ></el-input>
        </el-form-item>
        <el-form-item label="父级菜单：" prop="parent_id" required>
          <el-input type="number" placeholder="请输入父菜单ID" v-model="model.parent_id" ></el-input>
        </el-form-item>
        <el-form-item label="菜单编码：" prop="code" required>
          <el-input type="text" placeholder="请输入菜单编码" v-model="model.code" ></el-input>
        </el-form-item>
        <el-form-item label="页面路径：" prop="url" required>
          <el-input type="text" placeholder="请输入页面路径" v-model="model.url" ></el-input>
        </el-form-item>
        <el-form-item label="页面描述：" prop="description">
          <el-input type="text" placeholder="请输入页面描述" v-model="model.description" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="dialogFormVisible = false">取消</ns-button>
        <ns-button type="primary" @click="onSave">确定</ns-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import tableMixin from 'web-crm/src/mixins/table'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'

export default {
  name: 'index',
  mixins: [tableMixin],
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    let that = this
    let tableButtons = [
      {
        'func': function () {
          that.onSaveOpen({})
        },
        'name': '新增'
      }
    ]
    return {
      model: {

      },
      menuArr: [],
      obj: {
        appId: null
      },
      pagination,
      appObj: {},
      appid: null,
      presentObj: {},
      titleText: '',
      titleTexts: '小程序代码模版',
      authorizationText: '微信号授权',
      miniProgramText: '小程序信息',
      autidText: '提交审核',
      url: this.$api.core.access.getListSession,
      payTotal: null,
      rechargeTotal: null,
      dialogFormVisible: false,
      newestDialog: false,
      authorization: false,
      miniProgram: false,
      dialogAutid: false,
      weixinUrl: null,
      _table: {
        table_buttons: tableButtons
      },
      rules: {
        'name': [{ required: true, message: '请输入菜单名称' }],
        'parent_id': [{ required: true, message: '请输入父菜单ID' }],
        'code': [{ required: true, message: '请输入菜单编码' }],
        'url': [{ required: true, message: '请输入页面配置路径' }]
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
  methods: {
    menuChage () {
    },
    aaaaa () {
      this.$http.fetch(this.$api.overView.exit)
    },
    onSaveOpen (row) { // 新增或编辑
      if (row.id) {
        this.dialogFormVisible = true
        this.titleText = '编辑页面'
        this.model = Object.assign({}, row)
      } else {
        this.titleText = '新增页面'
        this.model = {}
        this.dialogFormVisible = true
      }
      // this.newestDialog = true
    },
    onAuthorization () {
      this.authorization = true
    },
    onUpdate () {},
    onRelieve () {},
    onAutid (appid) {
      this.presentObj.appId = appid
      this.dialogAutid = true
      var that = this
      // 查询小程序可选类目
      that.$http.fetch(that.$api.guide.sgwxaccount.getAppletCategoryList, that.presentObj).then((resp) => {
      }).catch((resp) => {
        that.$notify.error(resp.msg || '保存失败')
      })
      // 查询小程序页面配置
      that.$http.fetch(that.$api.guide.sgwxaccount.getAppletPageList, that.presentObj).then((resp) => {
      }).catch((resp) => {
        that.$notify.error(resp.msg || '保存失败')
      })
    },
    onPresent () { // 提交审核
      var that = this
      that.$http.fetch(that.$api.guide.sgwxaccount.submitTemplateToAudit, that.presentObj).then(() => {

      }).catch((resp) => {
        that.$notify.error(resp.msg || '保存失败')
      })
    },
    onPublish (latestStatus) { // 发布小程序
      var that = this
      if (latestStatus === 3) {
        this.$confirm('是否确认发布小程序', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http.fetch(that.$api.guide.sgwxaccount.templateToRelease, that.obj).then(() => {

          }).catch((resp) => {
            that.$notify.error(resp.msg || '保存失败')
          })
        })
      } else if (latestStatus === 1 || latestStatus === 2 || latestStatus === 5) {
        this.$confirm('小程序版本尚未审核通过', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        })
      }
    },
    onSave () {
      let that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          that.$http.fetch(that.$api.core.access.saveOrUpdateMenu, that.model).then(() => {
            that.dialogFormVisible = false
            that.$notify.success('保存成功')
            that.$reload()
            that.$http.fetch(that.$api.core.access.getCloudSession)
              .then((data) => {
                that.$store.commit('operate/UPDATE_OPERATE_MENUS', {
                  menus: data.menus
                })
              })
              .catch(resp => {

              })
          }).catch((resp) => {
            that.$notify.error(resp.msg || '保存失败')
          })
        }
      })
    },
    onDelete (row) {
      apiRequestConfirm('永久删除该数据')
        .then(() => {
          let that = this
          that.$http.fetch(that.$api.core.access.deleteMenu, { id: row.id }).then(() => {
            that.dialogFormVisible = false
            that.$notify.success('删除成功')
            that.$reload()
            that.$http.fetch(that.$api.core.access.getCloudSession)
              .then((data) => {
                that.$store.commit('operate/UPDATE_OPERATE_MENUS', {
                  menus: data.menus
                })
              })
              .catch(resp => {

              })
          }).catch((resp) => {
            that.$notify.error(resp.msg || '删除失败')
          })
        }).catch(() => {
        // 点击取消事件
        })
    },
    /**
     * 处理请求参数
     * @param params
     * @returns {*}
     */
    $handleParams: function (params) {
      this.param = params
      if (params.searchMap && params.searchMap.time && params.searchMap.time.length > 0) {
        params.searchMap.timeStart = params.searchMap.time[0]
        params.searchMap.timeEnd = params.searchMap.time[1]
      }
      delete params.searchMap.time
      return params
    },
    $queryList$: function (params) {
      let that = this
      let tableConfig = this._data._table
      tableConfig.loadingtable = true
      return this.$http.fetch(this.url).then((resp) => {
        that._data._table.data = resp.result.menus
        that._data.pagination.total = parseInt(resp.result.menus.length)
        if (that._data.pagination.total > 0) {
          that._data._table.key = 1
        } else if (that._data.pagination.total === 0) {
          that._data._table.key = 2
        }
      }).catch(() => {
        that.$notify.error('网络异常，获取数据失败！')
      }).finally(() => {
        tableConfig.loadingtable = false
      })
    }
  }
}
</script>
<style>
.el-input__inner[type="number"] {
    text-align: left !important ;
}
.dialog_mian {
  padding: 10px 30px 30px;
}
.dialog_mian_logo {
  display: flex;
  justify-items: inherit;
  align-items: center;
}
.dialog_mian_logo img {
  margin-right: 5px;
}
.dialog_mian_topText p sapn {
  color: grey;
}
.dialog_mian_topText p {
  height: 30px;
  line-height: 30px;
}
.shanghu {
  color: #ff8c00 !important;
}
/* img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
} */
<!-- .authorization {
  border-bottom: 1px solid #888888;
}
-- > .newestDialog {
  padding: 0 10px;
}
<!-- .newestDialog .el-dialog__header {
  border-bottom: 1px solid #888;
}
-- > .newestDialog .el-dialog__body {
  padding: 0 !important;
}
.el-row {
  padding-top: 15px;
}
<!-- .el-row {
  padding-top: 15px;
  border-bottom: 8px solid #eee;
}
-- > .dialog_mian {
  padding: 10px 20px;
}
</style>
