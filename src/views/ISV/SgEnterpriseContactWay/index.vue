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
            <el-input ref="quickText" style="width: 250px" v-model="model.guideName" placeholder="请输入导购姓名" @keyup.enter.native="$quickSearchAction$('guideName')" clearable>
            </el-input>
            <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
            <ns-button @click="$resetInputAction$()">重置</ns-button>
          </el-form-item>
          <el-form-item>
            <ns-button type="text" @click="$handleTabClick">
              {{collapseText}}
              <i :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} ">
              </i>
            </ns-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 简单搜索-结束 -->
      <!-- 高级搜索开始 -->
      <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">

        <el-form-item label="导购姓名：">
          <el-form-grid size="xmd">
            <el-input ref="quickText" style="width: 150px" v-model="model.guideName" placeholder="导购姓名" @keyup.enter.native="$quickSearchAction$('guideName')" clearable>
            </el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="集团Id ：">
          <el-form-grid>
            <el-input ref="quickText" style="width: 150px" v-model="model.groupId" placeholder="请输入集团Id" @keyup.enter.native="$quickSearchAction$('groupId')" clearable>
            </el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="虚拟店铺Id：">
          <el-form-grid>
            <el-input ref="quickText" style="width: 150px" v-model="model.brandId" placeholder="请输入虚拟店铺Id" @keyup.enter.native="$quickSearchAction$('brandId')" clearable>
            </el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="门店Id：">
          <el-form-grid>
            <el-input ref="quickText" style="width: 150px" v-model="model.shopId" placeholder="请输入门店Id" @keyup.enter.native="$quickSearchAction$('shopId')" clearable>
            </el-input>
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
          <el-table-column prop="groupId" label="集团Id" ></el-table-column>
          <el-table-column prop="guideId" label="导购Id" ></el-table-column>
          <el-table-column prop="guideName" label="导购姓名" ></el-table-column>
          <el-table-column prop="shopName" label="门店名称" ></el-table-column>
          <el-table-column prop="shopId" label="门店Id" ></el-table-column>
          <el-table-column prop="brandId" label="虚拟门店Id" ></el-table-column>
          <el-table-column prop="configId" width="260" label="联系我configId" ></el-table-column>
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
                       :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                       layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                       @current-change="$pageChange$">
        </el-pagination>
      </template>
    </ns-page-table>
    <!-- 初始弹窗开始 -->
    <el-dialog size="small" width="500px" :title="titleText"
               :visible.sync="dialogFormVisible"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
      <el-form :model="model" label-width="170px" ref="form" :rules="rules" >
          <el-form-item v-if="!model.id" label="导购ID："  required>
            <el-input  type="text" placeholder="请输入导购ID" v-model="model.guideId" ></el-input>
          </el-form-item>
          <el-form-item v-if="model.id" label="企业微信联系我configId："  required>
            <el-input  type="text" placeholder="请输入configId" v-model="model.configId" ></el-input>
          </el-form-item>
          <el-form-item v-if="model.id" label="外部客户添加不需要验证："  required>
            <el-radio v-model="model.skipVerify" :label="true">是</el-radio>
            <el-radio v-model="model.skipVerify" :label="false">否</el-radio>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog()">取消</ns-button>
        <ns-button type="primary" @click="onSave()">保存</ns-button>
      </div>
    </el-dialog>
    <!-- 初始弹窗结束 -->
  </div>
</template>
<script>
  import index from './src/index'
  export default index
</script>
<style>
.dialog_mian_topText p sapn{
  color:grey;
}
.dialog_mian_topText p{
  height: 30px;
  line-height: 30px;
}
</style>
