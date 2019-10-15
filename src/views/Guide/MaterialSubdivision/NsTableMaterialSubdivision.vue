<template>
  <div class="template-layout">

    <!-- 搜索 -->
    <div class="template-layout-right">
      <el-row>
        <el-col :span="24">
          <div class="template-table-bar">
            <el-row type="flex">
              <el-col :span="buttonRatio">
                <ns-button type='primary' class="pull-left" icon='plus' @click='onAddGroup(null)'>新建分组</ns-button>
                <ns-button type='primary' class="pull-left" icon='plus' @click='onUpdateGroup(null)'>删除分组</ns-button>
              </el-col>
              <el-col :span="inputRatio">
                <el-form :model="quickSearchModel" :inline="true" class="pull-right">
                  <el-form-item v-show="_data._queryConfig.expand === false">
                    <el-input ref="quickText" v-model="quickSearchModel.subName" placeholder="请输入查询分组名称">
                      <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix"
                            @click="$quickSearchAction$('subName')"/>
                    </el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
          <!-- 表格布局-->
          <el-table ref="table" :data="_data._table.data" class="template-table__main"
                    stripe
                    resizable v-loading.lock="_data._table.loadingtable" @selection-change="selsChange"
                    :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
            <el-table-column type="selection" align="center" :width="50"></el-table-column>
            <el-table-column prop="name" label="素材分组" align="left"></el-table-column>
            <el-table-column prop="update_time" label="更新时间" align="center" width="200"></el-table-column>
            <el-table-column prop="count" label="素材数" align="center" width="200"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="100">
              <template slot-scope="scope">
                <!--<ns-table-column-operate-button  :buttons="_data._table.table_buttons":prop="scope"></ns-table-column-operate-button>-->
                <div class="tmp-cell__buttons">
                  <ns-button type="text"  @click="on_Edit(scope.row)">编辑</ns-button>
                  <ns-button type="text"  @click="onDeleteMaterialSubdivisionById(scope.row.id, scope.row.name)">删除</ns-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                         :page-sizes="_data._pagination.sizeOpts"
                         :total="_data._pagination.total"
                         :current-page.sync="_data._pagination.page"
                         :page-size="_data._pagination.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         @size-change="$sizeChange$"
                         @current-change="$pageChange$">
          </el-pagination>
        </el-col>
      </el-row>
      <el-dialog size="small"
                 :visible.sync="dialogFormVisible"
                 :modal-append-to-body="false"
                 @before-close="closeDialog()">
        <el-form :model="model" ref="form" label-width="100px" :rules="rules" placement="right">
          <el-form-item label="分组名称：" required>
            <el-form-grid size="xmd">
              <el-form-item prop="name">
                <el-input type="text" placeholder="请输入分组名称" v-model="model.name" ></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <ns-button @click="dialogFormVisible = false">取消</ns-button>
          <ns-save type="primary" @click="onSave">保存</ns-save>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import NsTableMaterialSubdivision from './src/NsTableMaterialSubdivision'

export default NsTableMaterialSubdivision
</script>

<style scoped>

</style>
