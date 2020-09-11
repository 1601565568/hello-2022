<template>
  <div>
    <ns-page-table @add="$emit('add')" @failPassAgain="$emit('failPassAgain')"  @batchEdit="$emit('batchEdit')" :colButton='10'>
      <!-- 按钮 -->
      <template slot="buttons">
        <!--<ns-table-operate-button :buttons="_data._table.operate_buttons">
        </ns-table-operate-button>-->
        <p> 聚合码标题:{{remark}}</p> <router-link  :to="{name:'chatRoomGroup'}">返回上一级</router-link>
      </template>
      <!-- 按钮-结束 -->

      <!-- 简单搜索 -->
      <!-- el-form 需添加 @submit.native.prevent 配置 -->
      <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
      <template slot="searchSearch">
        <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent  class="pull-right">
          <el-form-item label="群名称:">
            <el-form-grid size="xmd">
              <el-input  autofocus=true v-model="model.name" placeholder="群名称" @keyup.enter.native="submitForm()" clearable></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="群主:">
            <el-select v-model="model.owner" placeholder="请选择群主" clearable>
              <el-option v-for="item in ownerList"
                         :key="item.owner"
                         :label="item.ownerName"
                         :value="item.owner">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否可加入:" >
            <el-select v-model="model.canJoin" clearable>
              <el-option label="可加入" value="1"></el-option>
              <el-option label="不可加入" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <ns-button type="primary" @click="submitForm()" class="searchbtn">搜索</ns-button>
            <ns-button @click="resetForm()" class="resetbtn">重置</ns-button>

          </el-form-item>
        </el-form>
      </template>
      <!-- 简单搜索-结束 -->

      <!-- 表格 -->
      <template slot="table">
        <!-- 表格配置 不能添加 border 配置 -->
        <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

        <!-- 表格单元格宽度配置规范 -->
        <!-- 复选框/单选框 :width="45" -->
        <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
        <!-- 手机号 :width="120" -->
        <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->

        <el-table ref="table" :data="dataList">
          <el-table-column prop="personnel" label="群名称" align="left" min-width="88">
            <template slot-scope="scope">
              {{scope.row.name?scope.row.name:'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="personnels" label="群人数" align="left" min-width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.person_num?scope.row.person_num:'-'}}
            </template>
          </el-table-column>
            <el-table-column prop="personnels" label="群主" align="left" min-width="100" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.owner_name?scope.row.owner_name:'-'}}({{scope.row.owner_work_num}})
              </template>
            </el-table-column>
          <el-table-column prop="num"  label="是否可加入" align="right" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.can_join && scope.row.can_join == 1?'是':'否' }}
            </template>
          </el-table-column>
          <el-table-column prop="num"  label="群状态" align="right" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.is_delete && scope.row.is_delete == 1?'删除':'正常' }}
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建时间" align="center" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.create_time?scope.row.create_time:'-' }}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="160px">
            <template slot-scope="scope">
                <ns-table-column-operate-button-ext :buttons="_data._table.table_buttons" :prop="scope">
                </ns-table-column-operate-button-ext>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 表格-结束 -->
      <!-- 分页 -->
      <template slot="pagination">
        <el-pagination v-if="pagination.enable" class="template-table-pagination"
                       :page-sizes="pagination.sizeOpts"
                       :total="pagination.total"
                       :current-page.sync="pagination.page"
                       :page-size="pagination.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange">
        </el-pagination>
      </template>
      <!-- 分页-结束 -->
    </ns-page-table>
  </div>
</template>

<script>
import chatRoomList from './src/chatRoomList'
export default chatRoomList
</script>
<style>
  @import "@theme/variables.pcss";
  .del-btn {
    color: var(--theme-color-danger)
  }
</style>
<style scoped>
  @import "@theme/variables.pcss";

  .scope_row_count{
    color: blue;
  }

  .tips {
    color: var(--theme-color-danger)
  }

  >>> .table-header-icon {
    font-size: var(--default-font-size-base);
    font-weight: normal;
    padding-left: var(--default-padding-base);
    cursor: pointer;
  }
  >>> .el-dropdown-link {
    margin-left: 5px !important;
  }
  .searchbtn {
    margin-left: 11px;
  }
  .resetbtn {
    margin-left: var(--default-margin-larger);
  }
</style>
