<template>
  <div>
    <NsPageTable :colButton='10'>
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>
    <!--简单搜索-->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false" label="设备MEID/手机号：">
          <el-input ref="quickText" style="width: 180px" v-model="model.deviceKeyOrPhone" placeholder="请输入设备MEID/手机号"
                    @keyup.enter.native="$quickSearchAction$('deviceKeyOrPhone')" clearable>
          </el-input>
          <ns-button type="primary" @click="$searchAction$()" class="searchbtn">搜索</ns-button>
          <ns-button @click="$resetInputAction$()" class="resetbtn">重置</ns-button>
        </el-form-item>

        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <Icon :type="_data._queryConfig.expand ? 'up' : 'down'"/>
          </ns-button>
        </el-form-item>
      </el-form>
    </template>
    <!--高级搜索-->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">

        <el-form-item label="设备MEID：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.deviceKey" placeholder="请输入设备MEID" clearable></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="手机名称：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.deviceName" placeholder="手机名称" clearable></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.phone" placeholder="手机号码" clearable></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="绑定账号：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.account" placeholder="绑定账号" clearable></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="对方账号：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.mobile" placeholder="对方账号" clearable></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="时间：">
          <el-form-grid size="xlg">
            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss"  v-model="model.time" type="datetimerange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-grid>
        </el-form-item>

      </el-form>

      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
        <ns-button @click="$resetInputAction$()">重置</ns-button>
      </div>
    </template>
    <template slot="table">
      <!-- 表格配置 不能添加 border 配置 -->
      <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

      <!-- 表格单元格宽度配置规范 -->
      <!-- 复选框/单选框 :width="45" -->
      <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
      <!-- 手机号 :width="120" -->
      <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->

      <el-table ref="table"  :data="_data._table.data" stripe>
        <el-table-column prop="deviceKey" label="设备MEID" align="center" min-width="88">
          <template slot-scope="scope">
            {{scope.row.deviceKey?scope.row.deviceKey:'-'}}
          </template>
        </el-table-column>
        <el-table-column prop="deviceName" label="手机名称" align="left" min-width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="phone" label="手机号码" align="left" min-width="100"></el-table-column>
        <el-table-column prop="account" label="绑定账号" align="center" min-width="100"></el-table-column>
        <el-table-column prop="mobile" label="对方号码" align="left" min-width="100"></el-table-column>
        <el-table-column prop="status" label="呼叫类型" align="center" width="150">
          <template slot-scope="scope">
          <!-- 1：去电 2：来电 3：未接 4：拒接-->
            <div v-if="scope.row.status === 1">
              <p>呼出</p>
            </div>
            <div v-else-if ="scope.row.status === 2">
              <p>呼入</p>
            </div>
            <div v-else-if="scope.row.status === 3">
              <p>未接</p>
            </div>
            <div v-else-if="scope.row.status === 4">
              <p>拒接</p>
            </div>
            <div v-else>
              <p>未知</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center" min-width="100"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="center" min-width="100"></el-table-column>
        <el-table-column prop="time" label="时长" align="right" min-width="100">
          <template slot-scope="scope">
            <div>
              <p>{{scope.row.time}} s</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                         width="160px">
          <template slot-scope="scope">
            <ns-table-column-operate-button-ext :buttons="_data._table.table_buttons"
                                                :prop="scope">
            </ns-table-column-operate-button-ext>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 表格-结束 -->
    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                     :page-sizes="_data._pagination.sizeOpts"
                     :total="_data._pagination.total"
                     :current-page.sync="_data._pagination.page"
                     :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </template>
    </NsPageTable>
  </div>

</template>

<script>
import callList from './src/callList'
export default callList
</script>

<style scoped>
  @import "@theme/variables.pcss";
  .searchbtn {
    margin-left: 11px;
  }
  .resetbtn {
    margin-left: var(--default-margin-larger);
  }
</style>
