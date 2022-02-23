<template>
  <div>
    <div class="head-router">好友营销</div>
    <page-table :searchCol="24">
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="">
            <el-input v-model.trim="model.name" placeholder="请输入活动名称"  @keyup.enter.native="onSearch">
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="onSearch"></Icon>
            </el-input>
          </el-form-item>
          <el-form-item>
            <ns-select v-model="model.creater"  filterable clearable :url="$api.marketing.weworkMarketing.getEmployee"/>
          </el-form-item>
          <el-form-item>
            <ns-select v-model="model.status"  filterable clearable :url="$api.marketing.weworkMarketing.getActivityStatus"/>
          </el-form-item>
          <el-form-item label="创建时间：" class='el-form__change'>
            <el-date-picker
              v-model="model.createTime"
              type="datetimerange"
              @change="getCreateTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00','23:59:59']"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="执行时间：" class='el-form__change'>
            <el-date-picker
              v-model="model.execTime"
              type="datetimerange"
              @change="getExecTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00','23:59:59']"
              align="right">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
      <template slot='button'>
        <ns-table-operate-button :buttons="_data._table.operate_buttons">
        </ns-table-operate-button>
        <!-- <ns-button type="primary" size='large' @click="handleDetail({})">新建</ns-button> -->
      </template>
      <template slot='table'>
        <el-table ref="table" :data="_data._table.data" class="new-table_border"
                  v-loading.lock="_data._table.loadingtable" :element-loading-text="$t('prompt.loading')"
                  @sort-change="$orderChange$" :row-style="tableRowClassName">
          <el-table-column
            :show-overflow-tooltip="true"
            prop="planName"
            label="活动名称">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="createTime"
            label="创建时间"
            sortable="0" :width="200">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="auditTime"
            label="审核时间"
            sortable="1" :width="200">
            <template slot-scope="scope">
              <template v-if="scope.row.auditTime">
                {{scope.row.auditTime}}
              </template>
              <template v-else>-</template>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="executeTime"
            label="执行时间"
            sortable="2" :width="200">
            <template slot="header">
              <span>执行时间</span>
              <el-tooltip placement="top" effect="light" stype="">
                <Icon type="question-circle" theme="outlined" className="text-primary"/>
                <div slot="content">活动的实际执行时间。</div>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <template v-if="scope.row.executeTime">
                {{scope.row.executeTime}}
              </template>
              <template v-else>-</template>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="trade_tag_name"
            label="营销对象">
            <template slot-scope="scope">
              {{scope.row.userGroupIds.split(',').length}}
              <template v-if="scope.row.customerType === 1"> 个客户分群</template>
              <template v-else> 个员工全部好友</template>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="userName"
            label="创建人">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="status"
            label="活动状态">
            <template slot-scope="scope">
              <template v-if="scope.row.planStatus === 6">
                {{scope.row.status}}（已执行{{scope.row.successNum}}个,失败{{scope.row.failNum}}个）
              </template>
              <template v-else-if="scope.row.planStatus === 3">
                {{scope.row.status}}
                <el-tooltip placement="top" effect="light" stype="">
                  <Icon type="question-circle" theme="outlined" className="text-primary"/>
                  <div slot="content">{{scope.row.failReason}}</div>
                </el-tooltip>
              </template>
              <template v-else-if="scope.row.planStatus === 7">
                {{scope.row.status}}
                <el-tooltip placement="top" effect="light" stype="">
                  <Icon type="question-circle" theme="outlined" className="text-primary"/>
                  <div slot="content">{{scope.row.remark}}</div>
                </el-tooltip>
              </template>
              <template v-else>
                {{scope.row.status}}
              </template>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            label="操作"
            width="145">
            <template slot-scope="scope">
              <ns-table-column-operate-button
                :buttons="_data._table.table_buttons"
                :prop="scope">
              </ns-table-column-operate-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                      :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                      :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                      :layout="true? 'total, sizes, prev, pager, next, jumper':'total'" @size-change="$sizeChange$"
                      @current-change="$pageChange$">
        </el-pagination>
      </template>
    </page-table>
    <!-- <ns-page-table> -->
      <!-- 按钮 -->
      <!-- <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.operate_buttons">
        </ns-table-operate-button>
      </template> -->
      <!-- 按钮-结束 -->

      <!-- <template slot="searchSearch">
        <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
          <el-form-item v-show="_data._queryConfig.expand === false">
            <el-input ref="quickText" v-model.trim="quickSearchModel.name" placeholder="请输入活动名称" @keyup.enter.native="$quickSearchAction$('name')">
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
      </template> -->
      <!-- 简单搜索-结束 -->

      <!-- 高级搜索 -->
      <!-- <template slot="advancedSearch" v-if="_data._queryConfig.expand">
        <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
                :model="model" :rules="rules" :inline="true">
          <el-form-item label="活动名称：">
            <el-form-grid>
              <el-form-item >
                <el-input type="text" v-model.trim="model.name"> </el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="创建人：">
            <el-form-grid>
              <el-form-item>
                <ns-select v-model="model.creater"  filterable clearable :url="$api.marketing.weworkMarketing.getEmployee"/>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="活动状态：">
            <el-form-grid>
              <el-form-item>
                <ns-select v-model="model.status"  filterable clearable :url="$api.marketing.weworkMarketing.getActivityStatus"/>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-form-grid>
              <el-form-item >
                <ns-datetime v-model="model.createTime"></ns-datetime>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="执行时间：">
            <el-form-grid>
              <el-form-item >
                <ns-datetime v-model="model.execTime"></ns-datetime>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
          <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
        </div>
      </template> -->
      <!-- 高级搜索-结束 -->

      <!-- 表格 -->
      <!-- <template slot="table"> -->
        <!-- 表格配置 不能添加 border 配置 -->
        <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

        <!-- 表格单元格宽度配置规范 -->
        <!-- 复选框/单选框 :width="50" -->
        <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
        <!-- 手机号 :width="120" -->
        <!-- 操作栏 单个按钮 :width="80"  多个按钮 :width="120" -->

        <!-- <el-table ref="table" :data="_data._table.data" class="template-table__main"
                  stripe
                  resizable v-loading.lock="_data._table.loadingtable" @selection-change="onHandleSelectChange"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column :show-overflow-tooltip="true" type="default" prop="planName"
                          label="活动名称" dbcolumn="planName" column="planName" align="left"
                          :sortable="false">
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" prop="createTime"
                          label="创建时间" dbcolumn="createTime" column="createTime" align="center"
                          sortable="0" :width="200">
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" prop="auditTime"
                          label="审核时间" dbcolumn="auditTime" column="auditTime" align="center"
                          sortable="1" :width="200">
            <template slot-scope="scope">
              <template v-if="scope.row.auditTime">
                {{scope.row.auditTime}}
              </template>
              <template v-else>-</template>
            </template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" prop="executeTime"
                          label="执行时间" dbcolumn="executeTime" column="executeTime" align="center"
                          sortable="2" :width="200">
            <template slot="header">
              <span>执行时间</span>
              <el-tooltip placement="top" effect="light" stype="">
                <Icon type="question-circle" theme="outlined" className="text-primary"/>
                <div slot="content">活动的实际执行时间。</div>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <template v-if="scope.row.executeTime">
                {{scope.row.executeTime}}
              </template>
              <template v-else>-</template>
            </template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" prop="trade_tag_name"
                          label="营销对象" dbcolumn="trade_tag_name" column="trade_tag_name" align="left"
                          :sortable="false">
            <template slot-scope="scope">
              {{scope.row.userGroupIds.split(',').length}}
              <template v-if="scope.row.customerType === 1"> 个客户分群</template>
              <template v-else> 个员工全部好友</template>
            </template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" prop="userName"
                          label="创建人" dbcolumn="userName" column="userName" align="left"
                          :sortable="false">
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" prop="status"
                          label="活动状态" dbcolumn="status" column="status" align="center"
                          :sortable="false">
            <template slot-scope="scope">
              <template v-if="scope.row.planStatus === 6">
                {{scope.row.status}}（已执行{{scope.row.successNum}}个,失败{{scope.row.failNum}}个）
              </template>
              <template v-else-if="scope.row.planStatus === 3">
                {{scope.row.status}}
                <el-tooltip placement="top" effect="light" stype="">
                  <Icon type="question-circle" theme="outlined" className="text-primary"/>
                  <div slot="content">{{scope.row.failReason}}</div>
                </el-tooltip>
              </template>
              <template v-else-if="scope.row.planStatus === 7">
                {{scope.row.status}}
                <el-tooltip placement="top" effect="light" stype="">
                  <Icon type="question-circle" theme="outlined" className="text-primary"/>
                  <div slot="content">{{scope.row.remark}}</div>
                </el-tooltip>
              </template>
              <template v-else>
                {{scope.row.status}}
              </template>
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
        </el-table> -->
      <!-- </template> -->
      <!-- 表格-结束 -->

      <!-- 分页 -->
      <!-- <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                      :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                      :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                      :layout="true? 'total, sizes, prev, pager, next, jumper':'total'" @size-change="$sizeChange$"
                      @current-change="$pageChange$">
        </el-pagination>
      </template> -->
      <!-- 分页-结束 -->
    <!-- </ns-page-table> -->
  </div>
</template>

<script>
import NsTableFriendMessage from './src/NsTableFriendMessage'

export default NsTableFriendMessage
</script>

<style lang="scss" scoped>
@import "./styles/reset.css";
.head-router{
  margin: -10px -10px 16px;
  padding-left: 16px;
  height: 48px;
  line-height: 48px;
  background: #fff;
  font-size: 16px;
  color: #262626;
}
::v-deep .btn-content{
  min-width: 70px;
}
</style>
