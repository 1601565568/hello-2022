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
      <template slot="searchSearch">
        <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
          <el-form-item v-show="_data._queryConfig.expand === false">
            <el-input ref="quickText" v-model.trim="quickSearchModel.externalName" placeholder="请输入昵称/备注名">
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
      <template slot="advancedSearch" v-if="_data._queryConfig.expand">
        <el-form ref="table_filter_form" label-width="80px" class="surround-btn"
                 :model="model" :rules="rules" :inline="true">
          <!--导购员工组件-->
          <el-form-item :label="`${cloudPlatformType === 'kd' ? '所属员工：' : '所属成员:'}`">
            <div class="template-search__box">
              <span v-if="employees&&employees.length>0">
                  已选择{{employees.length}}个
              </span>
              <span v-else>全部</span>
              <div style="float: right;">
                <NsGuideDialog
                  :isButton="false"
                  :validNull="true"
                  :echoStore='true'
                  :isNeedLink='true'
                  :auth="true"
                  :switchAreaFlag='1'
                  type="primary"
                  btnTitle="选择"
                  dialogTitle="选择员工"
                  v-model="employees"
                  v-if="cloudPlatformType === 'ecrp'"
                ></NsGuideDialog>
                <NsGuideWeChatDialog
                  :selfBtn='false'
                  :appendToBody='false'
                  :isButton="false"
                  :auth="true"
                  :switchAreaFlag="1"
                  type="primary"
                  btnTitle="选择"
                  dialogTitle="选择成员"
                  v-model="employees"
                  v-else>
                  <!-- <template slot='selfBtn'>
                    <div class='self-btn'>
                      {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个成员`:'全部'}}
                      <Icon type="geren"
                            class='guideIds-icon'></Icon>
                    </div>
                  </template> -->
                </NsGuideWeChatDialog>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="昵称/备注名：" label-width="100px">
            <el-form-grid size="xmd">
              <el-input  type="text" v-model.trim="model.externalName">
              </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="企业标签：">
            <ns-select v-model="model.tag" filterable clearable :props="propsSet" :params="selectParams" :url="$api.weWork.externalContact.queryCorpTagList" />
          </el-form-item>
          <el-form-item label="性别：">
            <el-select
              v-model="model.sexy"
              placeholder="请选择"
              clearable
            >
              <el-option label="全部" value="0"></el-option>
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源：">
            <el-select
              v-model="model.source"
              placeholder="请选择来源"
              clearable
            >
              <el-option
                v-for="(item, index) in sourceList"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-form-grid size="xmd">
              <el-input  type="text" v-model.trim="model.mobileNum">
              </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="添加时间：" prop="time">
            <el-form-grid>
              <ns-datetime  v-model="model.addTime"></ns-datetime>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="searchAction()">{{$t('operating.search')}}</ns-button>
          <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
        </div>
      </template>
      <!-- 高级搜索-结束 -->

      <!-- 表格 -->
      <template slot="table">
        <el-table ref="table" :data="_data._table.data" class="template-table__main"
                  stripe
                  resizable v-loading.lock="_data._table.loadingtable" @selection-change="onHandleSelectChange"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column type="selection" align="center">
          </el-table-column>
          <el-table-column prop="head_img"
                           label="头像" dbcolumn="head_img" column="head_img" align="left" :sortable="false">
            <template slot-scope="scope">
              <div v-if="!scope.row.head_img">
                <img src="./images/head_demo.svg" width="60" height="60"/>
              </div>
              <div v-else>
                <img :src="checkUrl(scope.row.head_img)" width="60" height="60"/>
              </div>
            </template>
          </el-table-column>
          <!-- Todo -->
          <!-- <el-table-column v-if="cloudPlatformType === 'kd'" :show-overflow-tooltip="true" prop="shopName"
                           label="绑定店铺" :sortable="false" align="center">
            <template slot-scope="scope">
              {{scope.row.sex ? scope.row.sex : '-'}}
            </template>
          </el-table-column> -->
          <el-table-column :show-overflow-tooltip="true" prop="external_name"
                           label="昵称/备注名" dbcolumn="external_name" column="external_name" align="left" :sortable="false" >
            <template slot-scope="scope">
              <ns-wechat-emoji :data="scope.row.external_name ? scope.row.external_name : '-'"></ns-wechat-emoji>
              <ns-wechat-emoji :data="scope.row.remark ? '/' + scope.row.remark : ''"></ns-wechat-emoji>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="sex"
                           label="性别" :sortable="false" align="center">
            <template slot-scope="scope">
              {{scope.row.sex === 2 ? '女' : scope.row.sex === 1 ? '男' : '-'}}
            </template>
          </el-table-column>
          <!-- Todo -->
          <el-table-column :show-overflow-tooltip="true" prop="remarkMobile"
                           label="备注手机号">
            <template slot-scope="scope">
              <div v-if="scope.row.remarkMobile">
                <span class="tag-item"
                    v-for="(num, index) in scope.row.remarkMobile.split('|').filter(i => i)"
                    :key="index">
                  <el-tooltip placement="top" :content="num" effect="light">
                    <span class="tool-tip">{{num}}{{index + 1 === scope.row.remarkMobile.split('|').filter(i => i).length ? '' : '、'}}</span>
                  </el-tooltip>
                </span>
              </div>
              <template v-else>
                -
              </template>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="guideName"
                           :label="cloudPlatformType === 'ecrp' ? '所属员工' : '所属成员'"  align="center">
          </el-table-column>
          <el-table-column prop="add_time"
                           label="添加时间" dbcolumn="add_time" column="add_time" sortable="add_time" align="left">
            <template slot-scope="scope">
              <div v-if="scope.row.add_time">
                {{scope.row.add_time.substring(0,10)}}<br/>
                {{scope.row.add_time.substring(10,19)}}
              </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="addWay"
                           label="来源" :sortable="false" align="center">
            <template slot-scope="scope">
              {{scope.row.addWay ? addWay[scope.row.addWay] ? addWay[scope.row.addWay] : '未知' : '未知'}}
            </template>
          </el-table-column>
          <el-table-column prop="group_tags" width="300"
                           label="企业标签">
            <template slot-scope="scope">
              <div v-if="scope.row.group_tags" class="group-tags-container">
                <div class="group-tags">
                  <el-tag class="tag-item"
                      v-for="(tag, index) in scope.row.group_tags.split('|').filter(i => i)"
                      :key="index">
                    <el-tooltip placement="top-start" :content="tag" effect="light" :disabled="tag.length < 10">
                      <span class="tool-tip">{{tag}}</span>
                    </el-tooltip>
                  </el-tag>
                </div>
                <span class="etc" v-if="scope.row.group_tags.length > 30">
                  等{{scope.row.group_tags.split('|').filter(i => i).length}}个标签
                </span>
              </div>
              <template v-else>
                -
              </template>
            </template>
          </el-table-column>
          <!-- Todo -->
          <!-- <el-table-column v-if="cloudPlatformType === 'kd'" :show-overflow-tooltip="true" prop="lastChatTime"
                           label="最后沟通时间" :sortable="false" align="center">
            <template slot-scope="scope">
              {{scope.row.sex ? scope.row.sex : '-'}}
            </template>
          </el-table-column> -->
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="100">
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
                       :page-sizes="[15, 25]"
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
    <NSUserDetails v-if="cloudPlatformType === 'ecrp'" ref="NSUserDetails" :userDetails="userDetails"/>
    <NsFriendDetail ref="NsFriendDetail" :cloudPlatformType="cloudPlatformType" @showVip="showVip"/>
  </div>
</template>

<script>
import NsTableEnterpriseWeChat from './src/NsTableEnterpriseWeChat'
import NsGuideDialog from '@/components/NsGuideDialog'
import NSUserDetails from '@/components/NSUserDetails'
import NsWechatEmoji from '@nascent/ecrp-ecrm/src/components/NsWechatEmoji'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import NsGuideWeChatDialog from '@/components/NsGuideWeChatDialog'
import NsFriendDetail from '@/components/NsFriendDetail'
NsTableEnterpriseWeChat.components = {
  NsGuideDialog,
  NsWechatEmoji,
  NsDatetime,
  NSUserDetails,
  NsGuideWeChatDialog,
  NsFriendDetail
}
export default NsTableEnterpriseWeChat
</script>

<style lang="scss" scoped>
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

.group-tags-container {
  display: flex;
  align-items: center;
  .group-tags {
    max-width: 300px;
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
    height: 24px;
    /* text-overflow: ellipsis; */
    .tag-item {
      margin-right: 5px;
      cursor: default;
      background: #E6F2FF;
      border: 1px solid rgba(189,220,255,1);
      border-radius: 2px;
    }
    .tool-tip {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-shrink: 0;
      color: rgba(0,0,0,0.85);
    }
  }
  .etc {
    flex-shrink: 0;
    margin-left: 3px;
  }
}
::v-deep .el-tooltip__popper.is-light{
  background: #FFFFFF;
  box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.12);
  border-radius: 2px;
  border: none;
}
</style>
