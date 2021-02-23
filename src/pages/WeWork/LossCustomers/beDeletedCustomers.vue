<template>
  <div>
    <ns-page-table :colButton="0">
      <!-- 简单搜索 -->
      <template slot="searchSearch">
        <el-form
          :inline="true"
          label-width="60px"
        >
          <el-form-item v-show="searchType.advanced === false">
            <el-input
              ref="quickText"
              v-model="model.customerNick"
              placeholder="请输入好友昵称"
              clearable
            />
          </el-form-item>
          <el-form-item v-show="searchType.advanced === false">
            <ns-button type="primary" @click="submitForm()">搜索</ns-button>
            <ns-button @click="resetForm()" class="resetbtn">重置</ns-button>
          </el-form-item>
          <el-form-item>
            <ns-button type="text" @click="tabSearchType" style="padding-left: 10px;opacity: 0.5;color: #002041;">
              {{searchType.tipText}}
              <Icon :type="searchType.advanced ? 'up' : 'down'" />
            </ns-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 高级搜索 -->
      <template slot="advancedSearch" v-if="searchType.advanced">
        <el-form :model="model" :inline="true" label-width="60px" align="right">
          <el-form-item label="好友昵称：">
            <el-input
              v-model="model.customerNick"
              placeholder="请输入好友昵称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="选择员工：" label-width="80px">
            <ElFormGrid>
              <NsGuideDialog :auth="false"
                             :guideUrl="this.$api.weWork.guide.findGuideList"
                             type="primary" btnTitle="选择员工" dialogTitle="选择员工" v-model="model.guideIds"></NsGuideDialog>
            </ElFormGrid>
            <ElFormGrid>
              已选择<span class="text-primary">{{model.guideIds ? model.guideIds.length : 0}}</span>个员工
            </ElFormGrid>
          </el-form-item>
          <el-form-item label="删除时间：" label-width="80px">
            <el-date-picker
              :clearable=false
              v-model="model.deleteTime"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <ns-button type="primary" @click="submitForm()">搜索</ns-button>
            <ns-button @click="resetForm()" class="resetbtn">重置</ns-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 简单搜索-结束 -->

      <!-- 表格 -->
      <template slot="table">
        <!-- 表格配置 不能添加 border 配置 -->
        <!-- 表格单元格宽度配置规范 -->
        <!-- 表格配置 需添加 stripe （实现斑马纹效果） -->
        <el-table
          ref="table"
          :data="dataList"
          stripe
          :element-loading-text="$t('prompt.loading')"
          v-loading.lock="loading"
        >
          <el-table-column prop="customerAvatar" label="好友头像" align="left" min-width="100">
            <template slot-scope="scope">
              <el-avatar :src="scope.row.customerAvatar || require('@nascent/ecrp-ecrm/src/assets/images/no-img.png')" :size="60" shape="square" />
            </template>
          </el-table-column>
          <el-table-column prop="customerNick" label="好友昵称" align="left" min-width="100">
            <template slot-scope="scope">
              {{scope.row.customerNick || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="customerGender" label="性别" align="left" min-width="100">
            <template slot-scope="scope">
              {{scope.row.customerGender || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="guideName" label="所属员工" align="left" min-width="100">
            <template slot-scope="scope">
              {{scope.row.guideName || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="shopName" label="员工门店" align="left" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.shopName || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="deleteTime" label="删除时间" align="left" min-width="100">
            <template slot-scope="scope">
              {{scope.row.deleteTime || '-'}}
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
import beDeletedCustomers from './src/beDeletedCustomers'
import NsGuideDialog from '@/components/NsGuideDialog'
import ElAvatar from '@nascent/nui/lib/avatar'
beDeletedCustomers.components = {
  NsGuideDialog,
  ElAvatar
}
export default beDeletedCustomers
</script>
<style scoped>
 @import "@theme/variables.pcss";
</style>
