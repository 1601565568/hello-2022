<template>
  <div>
    <ns-page-table>
      <!-- 按钮 -->
        <template slot="buttons">
          <ns-table-operate-button :buttons="_data._table.table_buttons"></ns-table-operate-button>
        </template>
      <!-- 简单搜索 -->
      <!-- el-form 需添加 @submit.native.prevent 配置 -->
      <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
      <template slot="searchSearch">
        <el-form :model="model" :inline="true" @submit.native.prevent  class="pull-right">
          <el-form-item v-show="_data._queryConfig.expand === false">
            <el-input ref="quickText" style="width: 250px" v-model="model.code" placeholder="请输入配置项编码" @keyup.enter.native="$quickSearchAction$('code')" clearable>
            </el-input>
            <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
            <ns-button @click="$resetInputAction$()">重置</ns-button>
          </el-form-item>
          <el-form-item>
            <ns-button type="text" @click="$handleTabClick">
              {{collapseText}}
              <Icon className="el-icon--right" v-if="_data._queryConfig.expand" fontType="el-icon-arrow-up"/>
              <Icon className="el-icon--right" v-else fontType="el-icon-arrow-down"/>
            </ns-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 简单搜索-结束 -->
      <!-- 高级搜索开始 -->
      <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">

        <el-form-item label="配置项编码：">
          <el-form-grid size="xmd">
            <el-input ref="quickText" style="width: 150px" v-model="model.code" placeholder="请输入配置项编码" @keyup.enter.native="$quickSearchAction$('code')" clearable>
            </el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="配置项值：">
          <el-form-grid>
            <el-input ref="quickText" style="width: 150px" v-model="model.value" placeholder="请输入配置项值" @keyup.enter.native="$quickSearchAction$('value')" clearable>
            </el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="配置项类型：">
          <el-form-grid>
            <!--<el-input ref="quickText" style="width: 150px" v-model="model.appid" placeholder="请输入appid" @keyup.enter.native="$quickSearchAction$('type')" clearable>-->
            <!--</el-input>-->
            <el-select ref="quickText" v-model="model.type" placeholder="请选择配置项类型" @keyup.enter.native="$quickSearchAction$('type')" clearable>
              <el-option v-for="types in typeList" :label="types.label" :value="types.value" :key="types.value"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
      </el-form>

      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
        <ns-button @click="$resetInputAction$()">重置</ns-button>
      </div>
    </template>
      <!-- 高级搜索结束 -->
      <!-- 表格 -->
      <template slot="table">
        <el-table ref="table" :data="_data._table.data" class="template-table__main"
                  stripe
                  resizable v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column prop="code" label="配置项编码" width="250"></el-table-column>
          <el-table-column prop="value" label="配置项值" width="400"></el-table-column>
          <el-table-column label="配置项类型" align="center">
            <template slot-scope="{row}">
              <span v-if="row.type === 0">其它</span>
              <span v-if="row.type === 1">ID</span>
              <span v-if="row.type === 2">秘钥</span>
              <span v-if="row.type === 3">域名</span>
              <span v-if="row.type === 4">路由</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="300"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="right">
            <template slot-scope="scope">
              <span class="tmp-cell__buttons">
                <ns-button type="text" @click="onSaveOpen(scope.row)">编辑</ns-button>
                <ns-button type="text" @click="onDelete(scope.row)">删除</ns-button>
              </span>
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
    </ns-page-table>
    <!-- 初始弹窗开始 -->
    <el-dialog size="small" :title="titleText"
               :visible.sync="dialogFormVisible"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
      <el-form :model="model" ref="form" label-width="150px" :rules="rules" placement="right">
        <el-form-item label="配置项编码：" prop="code" required>
          <el-input type="text" placeholder="请输入配置项编码" v-model="model.code" ></el-input>
        </el-form-item>
        <el-form-item label="配置项值：" prop="value" required>
          <el-input type="text" placeholder="请输入配置项值" v-model="model.value"></el-input>
        </el-form-item>
        <el-form-item label="配置项类型：" prop="type" required>
          <el-select  v-model="model.type" filterable clearable placeholder="请选择配置项类型">
            <el-option v-for="(types) in typeList" :label="types.label" :value="types.value" :key="types.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="text" placeholder="请输入备注" v-model="model.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog()">取消</ns-button>
        <ns-button type="primary" @click="onSave">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 初始弹窗结束 -->
  </div>
</template>
<script>
import index from './src/index'
export default index
</script>
<style scoped>
.dialog_mian_topText p sapn{
  color:grey;
}
.dialog_mian_topText p{
  height: 30px;
  line-height: 30px;
}
</style>
