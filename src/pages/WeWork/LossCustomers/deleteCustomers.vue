<template>
  <div>
    <div class="instructions-content">
      <div class="instructions-content__info">
        Tips:{{cloudPlatformType === 'ecrp' ? '员工' : '成员'}}主动删除好友<br>
      </div>
    </div>
    <ns-page-table :colButton="0">
      <!-- 简单搜索 -->
      <template slot="searchSearch">
        <el-form
          @submit.native.prevent
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
        <el-form @submit.native.prevent :model="model" :inline="true" label-width="80px">
          <el-form-item label="好友昵称：">
            <el-input
              v-model="model.customerNick"
              placeholder="请输入好友昵称"
              clearable
            ></el-input>
          </el-form-item>
          <!--导购员工组件-->
          <el-form-item :label="cloudPlatformType === 'ecrp' ? '选择员工：' : '选择成员'">
            <div class="template-search__box">
            <span v-if="model.guideIds && model.guideIds.length>0">
                已选择{{model.guideIds.length}}个
            </span>
              <span v-else>全部</span>
              <div style="float: right;">
                <GuideDialog
                  :validNull="true"
                  :selfBtn='false'
                  :appendToBody='true'
                  :isButton="false"
                  :auth="false"
                  type="primary"
                  btnTitle="选择"
                  :dialogTitle="cloudPlatformType === 'ecrp' ? '选择员工' : '选择成员'"
                  v-model="model.guideIds"
                  @input="owenerChange"
                >
                </GuideDialog>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="删除时间：">
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
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="submitForm()">搜索</ns-button>
          <ns-button @click="resetForm()" class="resetbtn">重置</ns-button>
        </div>
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
          <el-table-column prop="customerAvatar" label="好友头像" align="left" :sortable="false" width="100">
            <template slot-scope="scope">
              <div v-if="!scope.row.customerAvatar">
                <img src="./images/head_demo.svg" width="60" height="60"/>
              </div>
              <div v-else>
                <img :src="checkUrl(scope.row.customerAvatar)" width="60" height="60"/>
              </div>
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
          <el-table-column prop="guideName" :label="cloudPlatformType === 'ecrp' ? '操作员工' : '操作成员'" align="left" min-width="100">
            <template slot-scope="scope">
              {{scope.row.guideName || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="shopName" v-if="cloudPlatformType === 'ecrp'" label="员工门店" align="left" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.shopName || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="deleteTime" label="删除时间" align="left" min-width="100">
            <template slot-scope="scope">
              {{scope.row.deleteTime || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <ns-table-column-operate-button :buttons="operateButtons"
                                              :prop="scope">
              </ns-table-column-operate-button>
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
    <NsFriendDetail ref="NsFriendDetail" :isShowView="false" :cloudPlatformType="cloudPlatformType"/>
  </div>
</template>

<script>
import deleteCustomers from './src/deleteCustomers'
import ElAvatar from '@nascent/nui/lib/avatar'
import NsFriendDetail from '@/components/NsFriendDetail'
import GuideDialog from '@/components/NewUi/GuideDialog'
deleteCustomers.components = {
  GuideDialog,
  ElAvatar,
  NsFriendDetail
}
export default deleteCustomers
</script>
<style scoped>
 @import "@theme/variables.pcss";
 .template-search__box {
   width: 182px;
   height: 28px;
   background: #ffffff;
   border: 1px solid #dcdfe6;
   border-radius: 3px;
   border-radius: 3px;
   display: flex;
 }
 .template-search__box span {
   width: 141px;
   height: 27px;
   margin-left: 10px;
   border-right: 1px solid #dcdfe6;
 }
 .template-search__box > div + span {
   margin-left: var(--default-margin-small);
 }
</style>
