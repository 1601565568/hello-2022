<!--
 * @Descripttion: 智能欢迎语列表组件
 * @Author: yuye.huang
 * @Date: 2020-02-29 20:52:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-04 10:33:08
 -->
<template>
  <page-table title="欢迎语">
    <!-- 按钮 -->
    <template slot="button">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>
    <template slot="search">
      <el-form ref="table_filter_form"
               :model="model"
               :inline="true"
               @submit.native.prevent
               class='form-inline_top'>
        <el-form-item>
          <el-input v-model.trim="model.content"
                    placeholder="请输入欢迎语内容"
                    @keyup.enter.native="$searchAction$()">
            <Icon type="ns-search"
                  slot="suffix"
                  class='search-icon'
                  @click="$searchAction$()"></Icon>
          </el-input>
        </el-form-item>
        <el-form-item label="附件类型："
                      class='el-form__change'>
          <el-select v-model.trim="model.annexType"
                     placeholder="请选择"
                     @change='$searchAction$()'
                     clearable>
            <el-option v-for="item in annexTypeOptions()"
                       :key="item.value"
                       :label="item.label"
                       :value="`${item.value}`">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择店铺："
                      v-if="cloudPlatformType == 'ecrp'">
          <NsShopDialog :selfBtn='true'
                        :appendToBody='true'
                        :isButton="false"
                        :auth="false"
                        type="icon"
                        btnTitle=""
                        dialogTitle="选择店铺"
                        v-model="model.shopIds"
                        @input="handleChangeShop">
            <template slot='btnIcon'>
              <div class='self-btn'>
                {{(model.shopIds&&model.shopIds.length)?`已选择${model.shopIds.length}个门店`:'全部'}}
                <Icon type="shop"
                      class='guideIds-icon'></Icon>
              </div>
            </template>
          </NsShopDialog>
        </el-form-item>
        <!-- <el-form-item label="选择员工：">
          <ElFormGrid>
            <NsGuideDialog :auth="false"
                           :guideUrl="this.$api.weWork.guide.findGuideList"
                           type="primary"
                           btnTitle="选择员工"
                           dialogTitle="选择员工"
                           v-model="model.guideIds"></NsGuideDialog>
          </ElFormGrid>
          <ElFormGrid>
            已选择<span class="text-primary">{{model.guideIds? model.guideIds.length: 0}}</span>个导购员工
          </ElFormGrid>
        </el-form-item> -->
        <el-form-item :label="cloudPlatformType == 'ecrp'?'选择员工：':'企业微信成员：'">
          <NsGuideDialog :selfBtn='true'
                         :appendToBody='true'
                         :isButton="false"
                         :auth="true"
                         btnTitle=""
                         :dialogTitle="选择员工"
                         v-model="model.guideIds"
                         @input="handleChangeGuide"
                         :isOpenDialogAfterRequest='false'
                         v-if="cloudPlatformType == 'ecrp'">
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个员工`:'全部'}}
                <Icon type="geren"
                      class='guideIds-icon'></Icon>
              </div>
            </template>
          </NsGuideDialog>
          <NsGuideWeChatDialog :selfBtn='true'
                               :appendToBody='true'
                               :isButton="false"
                               :auth="true"
                               :switchAreaFlag="1"
                               btnTitle=""
                               dialogTitle="选择企业微信成员"
                               v-model="model.guideIds"
                               @input="handleChangeGuide"
                               :isOpenDialogAfterRequest='false'
                               v-else>
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个成员`:'全部'}}
                <Icon type="geren"
                      class='guideIds-icon'></Icon>
              </div>
            </template>
          </NsGuideWeChatDialog>
        </el-form-item>
        <el-form-item>
          <el-input v-model="model.channelName"
                    placeholder="请输入渠道名称"
                    @keyup.enter.native="$searchAction$()">
            <Icon type="ns-search"
                  slot="suffix"
                  class='search-icon'
                  @click="$searchAction$()"></Icon>
          </el-input>
        </el-form-item>

        <el-form-item v-if="cloudPlatformType == 'ecrp'">
          <el-input v-model.trim="model.shopName"
                    placeholder="请输入门店名称"
                    @keyup.enter.native="$searchAction$()"
                    clearable></el-input>
          <Icon type="ns-search"
                slot="suffix"
                class='search-icon'
                @click="$searchAction$()"></Icon>
        </el-form-item>
      </el-form>
    </template>

    <template slot="table">
      <el-table ref="table"
                :data="_data._table.data"
                class="new-table_border"
                v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')"
                @sort-change="onSortChange">
        <el-table-column :show-overflow-tooltip="true"
                         prop="title"
                         align="left"
                         min-width="120">
          <template slot="header">
            欢迎语名称
            <el-tooltip content="员工未设置欢迎语时，将使用默认欢迎语"
                        v-if="cloudPlatformType == 'ecrp'">
              <Icon type="question-circle" />
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span class="table-col--content">
              <!-- {{scope.row.content?scope.row.content:'-'}} -->
              <EmojiText v-if='scope.row.title'
                         :text='scope.row.title'
                         type='list' />
              <span v-else>-</span>
              <ns-button v-if="scope.row.type === 9"
                         type="primary"
                         size="mini"
                         round
                         class="btn-append">
                默认
              </ns-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         prop="title"
                         align="left"
                         min-width="120">
          <template slot="header">
            发送内容
          </template>
          <template slot-scope="scope">
            <span class="table-col--content">
              <!-- {{scope.row.content?scope.row.content:'-'}} -->
              <EmojiText v-if='scope.row.content'
                         :text='scope.row.content'
                         type='list' />
              <span v-else>-</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="annexList"
                         label="附件">
          <template slot-scope="scope">
            <div class="message-icons-list"
                 v-if="scope.row.annexType.length">
              <el-tooltip v-for="item in messageToolTipList(scope.row.annexType)"
                          :key="item.type"
                          class="message-icons-item"
                          :content="item.tip"
                          placement="top">
                <Icon :type="item.icon"
                      className="icon" />
              </el-tooltip>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="scope"
                         min-width="80"
                         label="使用范围"
                         align="left">
          <template slot="header">
            使用范围
            <el-tooltip v-if="cloudPlatformType == 'ecrp'"
                        content="多个欢迎语情况下发送优先级：渠道欢迎语>员工欢迎语>店铺欢迎语>默认欢迎语">
              <Icon type="question-circle" />
            </el-tooltip>
            <el-tooltip v-if="cloudPlatformType == 'kd'"
                        content="多个欢迎语情况下发送优先级：渠道欢迎语>成员欢迎语">
              <Icon type="question-circle" />
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <div v-if="scope.row.type === 9">
              <span :class="[employees==='QA'?employeeQA:employeeScope]" >全部{{variableName()}}</span>
            </div>
            <div v-else-if="
                scope.row.employeeCount <= 0 &&
                  scope.row.channelCount <= 0 &&
                  scope.row.shopCount <= 0
              ">
              -
            </div>
            <div v-else>
              <ns-button v-if="scope.row.shopCount > 0 && cloudPlatformType == 'ecrp' "
                         :class="[employees==='QA'?employeeQA:employeeScope]"
                         @click="onShowShopScope(scope.row)"
                         type="text">{{ scope.row.shopCount }}家门店
                {{ scope.row.employeeCount > 0 ? "," : "" }}
              </ns-button>
              <ns-button :class="[employees==='QA'?employeeQA:employeeScope]"
                         @click="onShowEmployeeScope(scope.row)"
                         v-if="scope.row.employeeCount > 0"
                         type="text">{{ scope.row.employeeCount }}名{{cloudPlatformType == 'ecrp'? '员工':'成员'}}
                {{ scope.row.channelCount > 0 ? "," : "" }}
              </ns-button>
              <ns-button v-if="scope.row.channelCount > 0"
                         :class="[employees==='QA'?employeeQA:employeeScope]"
                         @click="onShowChannelScope(scope.row)"
                         type="text">{{ scope.row.channelCount }}个渠道
              </ns-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime"
                         label="更新时间"
                         align="center"
                         sortable="custom">
        </el-table-column>
        <el-table-column label="状态"
                         align="center"
                         min-width="30">
          <template slot-scope="{ row }">
            <el-switch style="cursor:pointer"
            :class="[employees==='QA'?stateQA:elState]"
                       :disabled="
                row.type === 9 && String(row.account ? row.account : '') !== 'admin'
              "
                       :value="row.status"
                       :active-value="1"
                       :inactive-value="0"
                       :before-change="
                (call, currVal) => {
                  if (row.type === 9 && String(row.account ? row.account : '') !== 'admin') {
                    return;
                  }
                  onStatusChange(call, currVal, row);
                }
              "></el-switch>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         label="操作"
                         align="center"
                         width="160px">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="
                scope.row.type === 9 &&
                String(scope.row.account ? scope.row.account : '') !== 'admin'
                  ? []
                  : _data._table.table_buttons
              "
                                            :prop="scope">
            </ns-table-column-operate-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="_data._pagination.enable"
                     class="template-table-pagination"
                     :page-sizes="_data._pagination.sizeOpts"
                     :total="_data._pagination.total"
                     :current-page.sync="_data._pagination.page"
                     :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </template>
  </page-table>
</template>

<script>
import NsTableWelcomeCode from './src/NsTableWelcomeCode.js'
import NsGuideDialog from '@/components/NsGuideDialog'
import NsGuideWeChatDialog from '@/components/NsGuideWeChatDialog'
import NsShopDialog from '@/components/NsShopDialog'
import EmojiText from '@/components/NewUi/EmojiText'
import PageTable from '@/components/NewUi/PageTableMax'
NsTableWelcomeCode.components = {
  NsGuideDialog,
  NsShopDialog,
  EmojiText,
  NsGuideWeChatDialog,
  PageTable
}
export default NsTableWelcomeCode
</script>
<style scoped lang="scss">
@import "./styles/reset.css";
.search-icon {
  font-size: 25px;
}
.tips {
  color: var(--theme-color-danger);
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
.table-col--content {
  position: relative;
  display: inline-block;
  padding-right: 48px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  vertical-align: middle;
}
.btn-append {
  position: absolute;
  top: 50%;
  right: 0;
  margin-top: -12px;
  font-size: var(--default-font-size-small);
  transform: scale(0.84);
  width: 48px;
  cursor: default;

  &:active,
  &:hover,
  &:focus {
    background: var(--theme-font-color-info);
    border: 1px solid var(--theme-font-color-info);
  }
}

.message-icons-list {
  display: flex;
  align-items: center;
  height: 16px;
  font-size: 16px;
  width: 185px;
  .message-icons-item {
    margin-left: 4px;
    flex-shrink: 1;
  }

  .icon {
    font-size: 16px;
    color: #383838;
  }
}
.self-btn {
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
  margin-right: 8px;
  .guideIds-icon {
    color: #c0c4cc;
  }
}
.employee{
  color: #0091FA;
}
.employeeQA{
  color: #2153D4;
}
.elState.is-checked >>>  .el-switch__core{
    border-color: #41a2e8;
    background-color: #41a2e8;
}
.elStateQA.is-checked >>>  .el-switch__core{
    border-color: #2153D4;
    background-color: #2153D4;
}
</style>
