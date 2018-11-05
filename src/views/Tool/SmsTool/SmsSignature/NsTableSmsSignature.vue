<template>
  <ns-page-table ref="table" @open-dialog="$emit('open-dialog','add','新增签名配置')">
<!-- @open-dialog="onOpenDialog" @effective-change="onEffectiveChange" @default-change="onDefaultChange"-->
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>
    <!--按钮结束-->
    <!-- 简单搜索 开始 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true"  label-width="80px" @submit.native.prevent class="pull-right">
        <el-form-item label="签名：">
          <el-form-grid>
            <el-form-item prop="signatureName">
              <el-input  type="text" v-model.trim="model.signatureName" placeholder="请输入签名">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="创建人：">
          <el-form-grid>
            <el-form-item prop="userName">
              <el-input type="text" v-model.trim="model.userName" placeholder="请输入创建人">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
          <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 简单搜索 结束-->
    <!-- 高级搜索 开始 -->
    <!--<template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="签名：">
          <el-form-grid size="xs">
            <el-form-item prop="signatureName">
              <el-input  type="text" v-model="model.signatureName">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="创建者：">
          <el-form-grid size="xmd">
            <el-form-item prop="userName">
              <el-input type="text" v-model="model.userName">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
        <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
      </div>
    </template>-->
    <!-- 高级搜索 结束-->
    <!-- 表格主体 开始 -->
    <template slot="table">
      <!-- 表格 -->
      <!-- 表格配置 不能添加 border 配置 -->
      <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

      <!-- 表格单元格宽度配置规范 -->
      <!-- 复选框/单选框 :width="45" -->
      <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
      <!-- 手机号 :width="120" -->
      <!-- 操作栏 单个按钮 :width="80"  多个按钮 :width="120" -->

      <el-table ref="table" :data="_data._table.data" class="template-table__main"
                stripe
                resizable v-loading.lock="_data._table.loadingtable" @selection-change="onHandleSelectChange"
                :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <!--<el-table-column type="selection" align="center" :width="45">
        </el-table-column>-->
        <el-table-column  type="default" prop="signature_name"
                         label="签名" align="left" :sortable="false">
        </el-table-column>
        <el-table-column  type="default" prop="shopName" label="所属店铺"
                          align="center" :sortable="false">
          <template slot-scope="scope">
            <template v-if="scope.row.shop_name != '' && scope.row.shop_name != null">
              {{scope.row.shop_name}}
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
        <el-table-column  type="default" prop="user_name" label="创建人"
                         align="left" :sortable="false">
          <template slot-scope="scope">
            <template v-if="scope.row.user_name != '' && scope.row.user_name != null">
              {{scope.row.user_name}}
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
        <el-table-column  type="default" prop="create_time" label="创建时间"
                         align="center" width="150px" :sortable="false">
        </el-table-column>
        <!--<el-table-column  type="default" prop="isDefault" label="是否立即生效"
                         align="left" :sortable="false">
          <template slot-scope="scope">
            <template v-if="scope.row.sign_status == 1">
              <el-switch disabled :active-value="1" :inactive-value="0" v-model="scope.row.is_effective">
              </el-switch>
            </template>
            <template v-else>
              <el-switch :before-change="(call,currVal)=>{onEffectiveChange(call,currVal,scope.row)}"
                         :active-value="1" :inactive-value="0" v-model="scope.row.is_effective">
              </el-switch>
            </template>
          </template>
        </el-table-column>-->
        <el-table-column  type="default" prop="isDefault" label="是否默认"
                         align="left" :sortable="false" width="120px">
          <template slot-scope="scope">
            <el-switch :before-change="(call,currVal)=>{onDefaultChange(call,currVal,scope.row)}"
                       :active-value="1" :inactive-value="0" v-model="scope.row.is_default">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column  type="default" prop="isDefault" label="状态"
                         align="left" :sortable="false" width="120px"><!--字数较多 宽度稍微加宽-->
          <template slot-scope="scope">
            <span v-if='scope.row.sign_status ==0' class="text-warning">未审核</span>
            <span v-if='scope.row.sign_status ==1' class="text-primary">提交审核</span>
            <span v-if='scope.row.sign_status ==2' class="text-success">审核通过</span>
            <span v-if='scope.row.sign_status ==3' class="text-error">审核不通过</span>
          </template>
        </el-table-column>

        <el-table-column  label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                :prop="scope"></ns-table-column-operate-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 表格主体 结束 -->
    <!-- 分页 开始 -->
    <template slot="pagination">
      <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                     :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                     :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </template>
    <!-- 分页 结束 -->
  </ns-page-table>
</template>
<script>
  import NsTableSmsSignature from './src/NsTableSmsSignature'
  export default NsTableSmsSignature
</script>
