<!--
 * @Descripttion: 智能欢迎语列表组件
 * @Author: yuye.huang
 * @Date: 2020-02-29 20:52:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-04 10:33:08
 -->
<template>
  <ns-page-table ref="mainTable">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>

    <!-- 简单搜索 -->
    <template slot="searchSearch">
      <el-form
        @submit.native.prevent
        :model="quickSearchModel"
        class="pull-right"
        :inline="true"
      >
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input
            ref="quickText"
            v-model="model.content"
            placeholder="请输入欢迎语内容"
            style="width: 180px"
            @keyup.enter.native="$quickSearchAction$('content')"
            clearable
          />
          <!--  -->
          <ns-button type="primary" @click="$searchAction$()" class="searchbtn"
            >搜索</ns-button
          >
          <ns-button @click="$resetInputAction$()" class="resetbtn"
            >重置</ns-button
          >
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click.native.prevent="$handleTabClick">
            {{ collapseText }}
            <Icon :type="_data._queryConfig.expand ? 'up' : 'down'" />
          </ns-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 高级搜索 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form
        ref="table_filter_form"
        :model="model"
        label-width="80px"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item label="欢迎语内容：">
          <el-form-grid size="xmd">
            <el-input
              style="width:180px"
              autofocus="true"
              v-model.trim="model.content"
              placeholder="请输入欢迎语内容"
              clearable
            ></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="附件类型：">
          <el-form-grid size="xmd">
            <el-select
              v-model.trim="model.annexType"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in annexTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="`${item.value}`"
              >
              </el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="选择店铺：">
          <ElFormGrid>
            <NsShopDialog :auth="false" type="primary" btnTitle="选择店铺" v-model="model.shopIds"></NsShopDialog>
          </ElFormGrid>
          <ElFormGrid>
            已选择<span class="text-primary">{{model.shopIds? model.shopIds.length: 0}}</span>家店铺
          </ElFormGrid>
        </el-form-item>
        <el-form-item label="选择员工：">
          <ElFormGrid>
            <NsGuideDialog :auth="false"
                           :guideUrl="this.$api.weWork.guide.findGuideList"
                           type="primary" btnTitle="选择员工" dialogTitle="选择员工" v-model="model.guideIds"></NsGuideDialog>
          </ElFormGrid>
          <ElFormGrid>
            已选择<span class="text-primary">{{model.guideIds? model.guideIds.length: 0}}</span>个导购员工
          </ElFormGrid>
        </el-form-item>
        <el-form-item label="渠道：">
          <el-form-grid size="xmd">
            <el-input
              style="width:180px"
              v-model.trim="model.channelName"
              placeholder="请输入渠道名称"
              clearable
            ></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="门店：">
          <el-form-grid size="xmd">
            <el-input
              style="width:180px"
              v-model.trim="model.shopName"
              placeholder="请输入门店名称"
              clearable
            ></el-input>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click.native.prevent="$searchAction$()">{{
          $t("operating.search")
        }}</ns-button>
        <ns-button @click.native.prevent="$resetInputAction$()">{{
          $t("operating.reset")
        }}</ns-button>
      </div>
    </template>

    <template slot="table">
      <el-table
        ref="table"
        :data="_data._table.data"
        stripe
        v-loading.lock="_data._table.loadingtable"
        :element-loading-text="$t('prompt.loading')"
        @sort-change="onSortChange"
      >
        <el-table-column :show-overflow-tooltip="true" prop="title" align="left" min-width="120">
          <template slot="header">
            欢迎语
            <el-tooltip content="员工未设置欢迎语时，将使用默认欢迎语">
              <Icon type="question-circle" />
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span class="table-col--content">
              <!-- {{scope.row.content?scope.row.content:'-'}} -->
              <EmojiText v-if='scope.row.content' :text='scope.row.content' type='list'/>
              <span v-else>-</span>
              <ns-button v-if="scope.row.type === 9" type="primary" size="mini" round class="btn-append">
                默认
              </ns-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="annexList" label="附件">
          <template slot-scope="scope">
            <div class="message-icons-list" v-if="scope.row.annexType.length">
              <el-tooltip
                v-for="item in messageToolTipList(scope.row.annexType)"
                :key="item.type"
                class="message-icons-item"
                :content="item.tip"
                placement="top"
              >
                <Icon :type="item.icon" className="icon"/>
              </el-tooltip>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="scope"
          min-width="80"
          label="使用范围"
          align="left"
          >
          <template slot="header">
            使用范围
            <el-tooltip
              content="多个欢迎语情况下发送优先级：渠道欢迎语>员工欢迎语>门店欢迎语>默认欢迎语"
            >
              <Icon type="question-circle" />
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <div v-if="scope.row.type === 9">
              <span :class="[employees==='QA'?employeeQA:employeeScope]">全部员工</span>
            </div>
            <div
              v-else-if="
                scope.row.employeeCount <= 0 &&
                  scope.row.channelCount <= 0 &&
                  scope.row.shopCount <= 0
              "
            >
              -
            </div>
            <div v-else>
              <ns-button
                v-if="scope.row.shopCount > 0"
                :class="[employees==='QA'?employeeQA:employeeScope]"
                @click="onShowShopScope(scope.row)"
                type="text"
                >{{ scope.row.shopCount }}家门店
                {{ scope.row.employeeCount > 0 ? "," : "" }}
              </ns-button>
              <ns-button
               :class="[employees==='QA'?employeeQA:employeeScope]"
                @click="onShowEmployeeScope(scope.row)"
                v-if="scope.row.employeeCount > 0"
                type="text"
                >{{ scope.row.employeeCount }}名员工
                {{ scope.row.channelCount > 0 ? "," : "" }}
              </ns-button>
              <ns-button
                v-if="scope.row.channelCount > 0"
               :class="[employees==='QA'?employeeQA:employeeScope]"
                @click="onShowChannelScope(scope.row)"
                type="text"
                >{{ scope.row.channelCount }}个渠道
              </ns-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="30" >
          <template slot-scope="{ row }" >
            <el-switch
              :class="[employees==='QA'?stateQA:elState]"
              style="cursor:pointer"
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
              "
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          label="操作"
          align="center"
          width="160px"
        >
          <template slot-scope="scope">
            <ns-table-column-operate-button
              :buttons="
                scope.row.type === 9 &&
                String(scope.row.account ? scope.row.account : '') !== 'admin'
                  ? []
                  : _data._table.table_buttons
              "
              :prop="scope"
            >
            </ns-table-column-operate-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination
        v-if="_data._pagination.enable"
        class="template-table-pagination"
        :page-sizes="_data._pagination.sizeOpts"
        :total="_data._pagination.total"
        :current-page.sync="_data._pagination.page"
        :page-size="_data._pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="$sizeChange$"
        @current-change="$pageChange$"
      >
      </el-pagination>
    </template>
  </ns-page-table>
</template>

<script>
import NsTableWelcomeCode from './src/NsTableWelcomeCode.js'
import NsGuideDialog from '@/components/NsGuideDialog'
import NsShopDialog from '@/components/NsShopDialog'
import EmojiText from '@/components/NewUi/EmojiText'
NsTableWelcomeCode.components = {
  NsGuideDialog,
  NsShopDialog,
  EmojiText
}
export default NsTableWelcomeCode
</script>
<style scoped>
@import "@theme/variables.pcss";

.scope_row_count {
  color: blue;
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

  &:active, &:hover, &:focus {
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
    color:#383838;
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
