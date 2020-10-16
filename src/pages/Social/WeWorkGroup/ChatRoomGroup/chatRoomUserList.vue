<template>
  <div>
    <ns-page-table @add="$emit('add')" @failPassAgain="$emit('failPassAgain')"  @batchEdit="$emit('batchEdit')" :colButton='10'>
      <!-- 按钮 -->
      <template slot="buttons">
        <div>
          <span>群名称：{{groupName || '-'}}</span>
          <ns-button type="text" @click="goback" class="template-table__bar--back">返回上一级</ns-button>
        </div>
      </template>
      <!-- 按钮-结束 -->

      <!-- 简单搜索 -->
      <!-- el-form 需添加 @submit.native.prevent 配置 -->
      <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
      <template slot="searchSearch">
        <el-form :model="model" :inline="true" @submit.native.prevent class="pull-right">
          <el-form-item v-if="!searchType.advanced" label="昵称：">
            <el-input v-model="model.name" placeholder="请输入昵称" @keyup.enter.native="quickSearch()" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="!searchType.advanced">
            <ns-button type="primary" @click="quickSearch()">{{$t('operating.search')}}</ns-button>
            <ns-button @click="resetForm">{{$t('operating.reset')}}</ns-button>
          </el-form-item>
          <el-form-item>
            <ns-button type="text" @click="tabSearchType">
              {{searchType.tipText}}
              <Icon :type="searchType.advanced ? 'up' : 'down'"/>
            </ns-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 简单搜索-结束 -->
      <!-- 高级搜索 -->
      <template slot="advancedSearch" v-if="searchType.advanced">
        <el-form
          ref="table_filter_form"
          @keyup.enter.native="submitForm()"
          label-width="64px"
          class="surround-btn"
          :model="model"
          :inline="true"
        >
          <el-form-item label="昵称：">
            <el-input v-model="model.name" placeholder="请输入昵称" clearable></el-input>
          </el-form-item>
          <el-form-item label="是否好友：">
            <el-select v-model="model.ownerBind" placeholder="全部" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成员类型：" >
            <el-select v-model="model.type"  placeholder="全部" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="企业成员" value="1"></el-option>
              <el-option label="外部联系人" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上一次同步时间：" label-width="100px">
            <span>{{syncTime}}</span>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="submitForm">{{$t('operating.search')}}</ns-button>
          <ns-button @click="resetForm">{{$t('operating.reset')}}</ns-button>
          <ns-button :loading="loading" @click="syncUser()" class="resetbtn">同步</ns-button>
        </div>
      </template>
      <!-- 高级搜索-结束 -->

      <!-- 表格 -->
      <template slot="table">
        <!-- 表格配置 不能添加 border 配置 -->
        <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

        <!-- 表格单元格宽度配置规范 -->
        <!-- 复选框/单选框 :width="45" -->
        <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
        <!-- 手机号 :width="120" -->
        <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->

        <el-table
          ref="table"
          :data="dataList"
          :element-loading-text="$t('prompt.loading')"
          v-loading.lock="loading"
        >
          <el-table-column prop="personnel" label="头像" align="left" min-width="88">
            <template slot-scope="scope">
              <img class="customerImg" :class="{'cursor': !!scope.row.avatar}" :src="scope.row.avatar || 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/app/default-user.png'" alt="" @click="togglePreview(scope.row.avatar)">
            </template>
          </el-table-column>
          <el-table-column prop="personnels" min-width="100" :show-overflow-tooltip="true">
            <template slot="header">
              昵称
              <el-tooltip content="对于未添加任何员工为好友的群成员，无法获取头像、昵称">
                <Icon type="question-circle" />
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              {{scope.row.name?scope.row.name:'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="personnels" label="成员类型" min-width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.type && scope.row.type == 1?'企业成员': scope.row.type == 2? '外部联系人':'-' }}
            </template>
          </el-table-column>
          <el-table-column prop="owner_bind" label="是否群主好友" align="center" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.owner_bind && scope.row.owner_bind == 1?'是':'否' }}
            </template>
          </el-table-column>
          <el-table-column prop="ownerName" label="所属微信群" align="center" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.ownerName || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="join_time" label="入群时间" align="center" min-width="150">
            <template slot-scope="scope">
              {{ scope.row.join_time || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="join_scene" label="入群方式" align="center" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.join_scene && scope.row.join_scene == 1?'直接邀请入群': scope.row.join_scene == 2? '通过邀请链接入群': '通过扫描群二维码入群' }}
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
    <Preview ref="preview"/>
  </div>
</template>

<script>
import chatRoomUserList from './src/chatRoomUserList'
export default chatRoomUserList
</script>
<style scoped>
  @import "@theme/variables.pcss";
  .template-table__bar--back {
    margin-left: var(--default-margin-larger);
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
  .customerImg {
    width: 60px;
    height: 60px;
    border-radius: 4px;
  }
  .cursor {
    cursor: pointer;
  }
</style>
