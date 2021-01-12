<template>
  <ns-page-table>
    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" maxlength="30" v-model.trim="quickSearchModel.name" placeholder="请输入活动名称" @keyup.enter.native="$quickSearchAction$('name')">
            <Icon type="search" className=" el-input__icon" style="padding: 5px;" slot="suffix" name="name" @click="$quickSearchAction$('name')"/>
          </el-input>
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <Icon :type=" _data._queryConfig.expand ? 'up' : 'down'"/>
          </ns-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 简单搜索-结束 -->

    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="活动名称：">
          <el-form-grid>
            <el-form-item >
              <el-input type="text" v-model.trim="model.name"> </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-form-grid>
            <el-form-item >
             <!-- <ns-datetime v-model="model.createTime"></ns-datetime>-->
              <el-date-picker
                v-model="model.createTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
              </el-date-picker>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="创建人：">
          <el-form-grid>
            <el-form-item>
              <ns-select v-model="model.creater"  filterable clearable :url="$api.marketing.weworkMarketing.getEmployee" />
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
        <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
      </div>
    </template>
    <!-- 高级搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <!-- 表格配置 不能添加 border 配置 -->
      <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

      <!-- 表格单元格宽度配置规范 -->
      <!-- 复选框/单选框 :width="50" -->
      <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
      <!-- 手机号 :width="120" -->
      <!-- 操作栏 单个按钮 :width="80"  多个按钮 :width="120" -->

      <el-table ref="table" :data="_data._table.data" class="template-table__main"
                stripe
                resizable v-loading.lock="_data._table.loadingtable" @selection-change="onHandleSelectChange"
                :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">

        <el-table-column :show-overflow-tooltip="true" type="default" prop="marketingType"
                         label="活动类型" dbcolumn="marketingType" column="marketingType" align="center"
                         :sortable="false" :width="120">
          <template slot-scope="scope">
            <template v-if="scope.row.marketingType === 1">微信好友营销</template>
            <template v-else-if="scope.row.marketingType === 2">微信群营销</template>
            <template v-else-if="scope.row.marketingType === 3">朋友圈营销</template>
            <template v-else-if="scope.row.marketingType === 5">微信群营销</template>
            <template v-else>微信好友营销</template>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="planName"
                         label="活动名称" dbcolumn="planName" column="planName" align="left"
                         :sortable="false">
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="createTime"
                         label="创建时间" dbcolumn="createTime" column="createTime" align="center"
                         sortable="0" :width="200">
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="userName"
                         label="创建人" dbcolumn="userName" column="userName" align="left"
                         :sortable="false">
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="tradeTagName"
                         label="营销对象" dbcolumn="tradeTagName" column="tradeTagName" align="left"
                         :sortable="false">
          <template slot-scope="scope">
            {{scope.row.userGroupIds.split(',').length}}
            <template v-if="scope.row.customerType === 1"> 个客户分群</template>
            <template v-else-if="scope.row.customerType === 2">
              <template v-if="scope.row.marketingType === 3"> 个员工
              </template>
              <template v-else> 个员工全部好友</template>
            </template>
            <template v-else-if="scope.row.customerType === 3"> 个微信群</template>
            <template v-else> 个群主</template>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="executeTime"
                         label="执行时间" dbcolumn="executeTime" column="executeTime" align="center"
                         sortable="2" :width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.executeMode == 2">
              {{scope.row.executeTime ? scope.row.executeTime: '-'}}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                         width="145">
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
                     :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                     :layout="true? 'total, sizes, prev, pager, next, jumper':'total'" @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </template>
    <!-- 分页-结束 -->
  </ns-page-table>
</template>

<script>
import NsTableActivityExamine from './src/NsTableActivityExamine'
export default NsTableActivityExamine
</script>
