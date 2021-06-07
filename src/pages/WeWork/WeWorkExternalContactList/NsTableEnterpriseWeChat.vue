<template>
  <div>
    <ns-page-table>
      <!-- 按钮 -->
      <template slot="buttons">
        <ns-button type="primary" @click="batchMarking">批量打标</ns-button>
        <ns-button type="primary" v-if="synFriend" :disabled="synButton" @click="synFriends">好友同步</ns-button>
        <ns-button type="primary" v-else disabled>同步中</ns-button>
      </template>
      <!-- 按钮-结束 -->

      <!-- 简单搜索 -->
      <!-- el-form 需添加 @submit.native.prevent 配置 -->
      <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
      <template slot="searchSearch">
        <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
          <el-form-item v-show="_data._queryConfig.expand === false">
            <el-input ref="quickText" v-model.trim="quickSearchModel.externalName" placeholder="请输入昵称">
              <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name" @click="$quickSearchAction$('externalName')"/>
            </el-input>
          </el-form-item>
          <el-form-item>
            <ns-button type="text" @click="$handleTabClick">
              {{collapseText}}
              <Icon :type="_data._queryConfig.expand ? 'up' : 'down'"/>
            </ns-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 简单搜索-结束 -->

      <!-- 高级搜索 -->
      <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
      <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
      <template slot="advancedSearch" v-if="_data._queryConfig.expand">
        <el-form ref="table_filter_form" label-width="80px" class="surround-btn"
                 :model="model" :rules="rules" :inline="true">
          <!--导购员工组件-->
          <el-form-item label="选择员工：">
            <div class="template-search__box">
            <span v-if="employees&&employees.length>0">
                已选择{{employees.length}}个
            </span>
              <span v-else>全部</span>
              <div style="float: right;">
                <NsGuideDialog
                  :isButton="false"
                  :validNull="true"
                  :auth="true"
                  type="primary"
                  btnTitle="选择"
                  dialogTitle="选择员工"
                  v-model="employees"
                ></NsGuideDialog>
              </div>
            </div>
          </el-form-item>
          <!--中台员工组件-->
          <!--        <el-form-item label="所属员工：">-->
          <!--          <el-form-grid>-->
          <!--            <ns-employee-select v-model="employees"></ns-employee-select>-->
          <!--          </el-form-grid>-->
          <!--        </el-form-item>-->
          <el-form-item label="昵称：">
            <el-form-grid size="xmd">
              <el-input  type="text" v-model.trim="model.externalName">
              </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="添加好友：" prop="time">
            <el-form-grid>
              <ns-datetime  v-model="model.addTime"></ns-datetime>
            </el-form-grid>
          </el-form-item>
          <!--        <el-form-item label="添加好友：">-->
          <!--          <el-form-grid>-->
          <!--            <ns-datetime type="datetime" width="160" v-model="model.addTime" format='yyyy-MM-dd' value-format='yyyyMMdd'>-->
          <!--            </ns-datetime>-->
          <!--          </el-form-grid>-->
          <!--        </el-form-item>-->
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="searchAction()">{{$t('operating.search')}}</ns-button>
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
          <el-table-column type="selection" align="center" :width="50">
          </el-table-column>
          <el-table-column type="default" prop="head_img"
                           label="头像" dbcolumn="head_img" column="head_img" align="left" :sortable="false" width="100">
            <template slot-scope="scope">
              <div v-if="!scope.row.head_img">
                <img src="./images/head_demo.svg" width="60" height="60"/>
              </div>
              <div v-else>
                <img :src="checkUrl(scope.row.head_img)" width="60" height="60"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="external_name"
                           label="昵称" dbcolumn="external_name" column="external_name" width="120" align="left" :sortable="false" >
            <template slot-scope="scope">
              <ns-wechat-emoji :data="scope.row.external_name ? scope.row.external_name : '-'"></ns-wechat-emoji>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="sex"
                           label="性别" :sortable="false" align="center" width="100">
            <template slot-scope="scope">
              {{scope.row.sex === 2 ? '女' : scope.row.sex === 1 ? '男' : '-'}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="guideName"
                           label="所属员工"  align="center" width="120">
          </el-table-column>
          <el-table-column type="default" prop="add_time"
                           label="添加好友时间" dbcolumn="add_time" column="add_time" sortable="add_time" width="150" align="left">
            <template slot-scope="scope">
              <div v-if="scope.row.add_time">
                {{scope.row.add_time.substring(0,10)}}<br/>
                {{scope.row.add_time.substring(10,19)}}
              </div>
            </template>
          </el-table-column>
          <!--        <el-table-column :show-overflow-tooltip="true" type="default" prop="add_friend_channel"-->
          <!--                         label="添加好友渠道" dbcolumn="add_friend_channel" column="add_friend_channel" width="120" align="left">-->
          <!--        </el-table-column>-->
          <el-table-column type="default" prop="group_tags"
                           label="企业标签" dbcolumn="group_tags" column="group_tags" align="left">
            <template slot-scope="scope">
              <template v-if="scope.row.group_tags">
                <el-tag style="margin-right: 5px;cursor: default"
                        v-for="(tag, index) in scope.row.group_tags.split('|').filter(i => i)"
                        :key="index">
                  <template v-if="tag.length > 10">
                    <el-tooltip :content="tag" effect="light"><span>{{tag.substring(0,10)+ '...'}}</span></el-tooltip>
                  </template>
                  <template v-else>
                    {{tag}}
                  </template>
                </el-tag>
              </template>
              <template v-else>
                -
              </template>
            </template>
          </el-table-column>
          <el-table-column type="default" prop="personal_tags"
                           label="个人标签" dbcolumn="personal_tags" column="personal_tags" :sortable="false" align="left">
            <template slot-scope="scope">
              <template v-if="scope.row.personal_tags">
                <el-tag style="margin-right: 5px;margin-top: 3px;cursor: default"
                        v-for="tag in scope.row.personal_tags.split('|').filter(i => i)"
                        :key="tag">
                  <template v-if="tag.length > 10">
                    <el-tooltip :content="tag" effect="light"><span>{{tag.substring(0,10)+ '...'}}</span></el-tooltip>
                  </template>
                  <template v-else>
                    {{tag}}
                  </template>
                </el-tag>
              </template>
              <template v-else>
                -
              </template>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="60">
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
                       :page-sizes="_data._pagination.sizeOpts"
                       :total="_data._pagination.total"
                       :current-page="_data._pagination.page"
                       :page-size="_data._pagination.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="$sizeChange$"
                       @current-change="$pageChange$">
        </el-pagination>
      </template>
      <!-- 分页-结束 -->

    </ns-page-table>
    <el-dialog
      title="批量打标"
      :visible.sync="showBatchMarkingVisible"
      response-limit :show-scroll-x=false
    >
      <div v-for="item in tagGroupList" v-bind:key="item.tagId" class="dialog-tag">
        <h3 class="dialog-tag__title padding-base">{{item.tagName}}</h3>
        <el-checkbox-group v-model="checkedTagList" class="padding-base">
            <span v-for="item1 in tagList" v-bind:key="item1.tagId">
              <el-checkbox v-if="item1.parentTagId === item.tagId" :key="item1.tagId" :value="item1.tagId" :label="item1.tagId">{{item1.tagName}}</el-checkbox>
            </span>
        </el-checkbox-group>
      </div>
      <span slot="footer">
        <ns-button @click="BatchMarkingClose">取消</ns-button>
        <ns-button type="primary" @click="saveBatchMarking">保存</ns-button>
      </span>
    </el-dialog>
    <NSUserDetails ref="NSUserDetails" :userDetails="userDetails"/>
  </div>
</template>

<script>
import NsTableEnterpriseWeChat from './src/NsTableEnterpriseWeChat'
import NsGuideDialog from '@/components/NsGuideDialog'
import NSUserDetails from '@/components/NSUserDetails'
import NsWechatEmoji from '@nascent/ecrp-ecrm/src/components/NsWechatEmoji'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
NsTableEnterpriseWeChat.components = {
  NsGuideDialog,
  NsWechatEmoji,
  NsDatetime,
  NSUserDetails
}
export default NsTableEnterpriseWeChat
</script>

<style scoped>
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
.dialog-tag__title {
  background-color: #f3f4f4;
}
</style>
