<template>
  <div>
    <ns-page-table :colButton="14">
      <!-- 操作按钮 -->
      <template slot="buttons">
        <div class="library-header">
          <ns-button
            v-for="item in operate_buttons"
            :key="item.name"
            :type="item.type"
            @click="item.func"
          >
            <Icon v-if="item.icon" :type="item.icon"/>
            <span>{{item.name}}</span>
          </ns-button>
          <el-checkbox :disabled="isEmpty" :indeterminate="indeterminate" v-model="checkAll" @change="onSelectAll">全选当页</el-checkbox>
        </div>
      </template>
      <!-- 快捷搜索 -->
      <template slot="searchSearch">
        <el-form :model="model" :inline="true" @submit.native.prevent class="pull-right">
          <el-form-item v-show="!quickObj.expanded" label="标题：">
            <el-input
              ref="quickText"
              v-model="model.name"
              placeholder="请输入文件夹或素材标题"
              @keyup.enter.native="quickSearch()"
              style="width: 180px"
              clearable
            >
              <!-- <Icon type="search" slot="suffix" class="el-input__icon" @click="quickSearch()"/> -->
            </el-input>
          </el-form-item>
          <el-form-item v-if="!quickObj.expanded">
            <ns-button type="primary" @click="quickSearch">{{$t('operating.search')}}</ns-button>
            <ns-button @click="resetAction">{{$t('operating.reset')}}</ns-button>
          </el-form-item>
          <el-form-item>
            <ns-button type="text" @click="handleSearchType">
              {{quickObj.collapseText}}
              <Icon :type="quickObj.expanded ? 'up' : 'down'"/>
            </ns-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 高级搜索 -->
      <template slot="advancedSearch" v-if="quickObj.expanded">
        <el-form
          ref="table_filter_form"
          @keyup.enter.native="searchAction"
          label-width="80px"
          class="surround-btn library-advance__search"
          :model="model"
          :inline="true"
        >
          <el-form-item label="标题：">
            <el-input type="text" v-model="model.name" placeholder="请输入文件夹或素材标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="素材内容：">
            <el-input type="text" v-model="model.content" placeholder="请输入素材内容" clearable></el-input>
          </el-form-item>
          <el-form-item label="货号：">
            <el-input type="text" v-model="model.outerId" placeholder="请输入货号" clearable></el-input>
          </el-form-item>
          <el-form-item label="发布时间：">
            <el-date-picker
              v-model="model.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请输入开始日期"
              end-placeholder="请输入结束日期">
            </el-date-picker>
          </el-form-item>
          <!-- 标签 - 动态请求数据 -->
          <el-form-item label="标签：">
            <el-select
              v-model="model.subdivisionId"
              placeholder="请选择"
              filterable
              clearable
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="未打标" :value="-1"></el-option>
              <el-option
                v-for="item in labelList"
                :key="item.subdivisionId"
                :label="item.subdivisionName"
                :value="item.subdivisionId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="发布方："
            prop="sourceId"
          >
            <shop-select-load
              v-model="model.sourceId"
              clearable
              :insertList='insertList'
            />
          </el-form-item>
          <!-- <el-form-item label="素材类型：" prop="mType">
            <el-select
              v-model="model.mType"
              @change="onMtypeChange"
              placeholder="请选择素材类型"
              clearable
            >
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item v-if="model.mType === 1" label="带码状态：" prop="codeType">
            <el-select
              v-model="model.codeType"
              placeholder="请选择带码状态"
              clearable
            >
              <el-option
                v-for="item in codeTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="searchAction">{{$t('operating.search')}}</ns-button>
          <ns-button @click="resetAction">{{$t('operating.reset')}}</ns-button>
        </div>
      </template>
      <template slot="table">
        <!-- 面包屑 -->
        <el-row type="flex" class="library-breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              v-for="(item, index) in breadcrumb"
              :key="item.id"
            >
              <span @click="onExchange(item)">{{item.name}}</span>
              <span v-if="index === breadcrumb.length - 1 && searching">中的搜索结果</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
          <div class="library-breadcrumb__right">
            <el-radio-group v-model="listMode">
              <el-radio-button label="list">
                <Icon type="liebiao"/>
              </el-radio-button>
              <el-radio-button label="waterfall">
                <Icon type="pubuliu"/>
              </el-radio-button>
            </el-radio-group>
          </div>
        </el-row>
        <!-- 列表 -->
        <el-scrollbar ref="fullScreen" class="library-wrapper">
          <div v-if="listMode === 'list'">
            <el-table
              ref="multipleTable"
              :data="table.data"
              :element-loading-text="$t('prompt.loading')"
              v-loading.lock="table.loading"
              stripe
              resizable
              @selection-change="onHandleSelectChange"
            >
              <el-table-column type="selection" align="center" :width="50"></el-table-column>
              <el-table-column label="标题" show-overflow-tooltip :min-width="190">
                <template slot-scope="scope">
                  <span :class="scope.row.isDirectory === 1 ? 'library-table__folder' : 'library-table__material'" @click="onEnter(scope.row)">
                    <Icon type="wenjianjia-new" />
                    <span v-html="strToRichText(scope.row.name)"></span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="内容" prop="content" :min-width="275">
                <template slot-scope="scope">
                  <span v-if="scope.row.isDirectory === 1">{{scope.row.description || '-'}}</span>
                  <table-item v-else :data="scope.row" @preview="togglePreview" :icon='true' :lengths='scope.row.mediaList && scope.row.mediaList.length'></table-item>
                </template>
              </el-table-column>
              <el-table-column label="标签" :min-width="200">
                <template slot-scope="scope">
                  <span v-if="scope.row.isDirectory === 1">-</span>
                  <el-select
                    v-else
                    v-model="scope.row.subdivisionIds"
                    placeholder="未打标"
                    :filter-method="subdivisionFilter"
                    @visible-change="subdivisionVisible"
                    @change="((val)=>{updateSubs(val,scope.row)})"
                    filterable
                    multiple
                    collapse-tags
                    style="width: 180px"
                  >
                    <el-option
                      v-for="item in subdivisionList"
                      :key="item.subdivisionId"
                      :label="item.subdivisionName"
                      :value="item.subdivisionId">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="生效时间" prop="sourceName" :min-width="130"></el-table-column>
              <el-table-column label="失效时间" prop="sourceName" :min-width="130"></el-table-column>
              <el-table-column label="当前状态" prop="sourceName" :min-width="130">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.currentStatus"
                    class="tablescope"
                    inactive-text="下架"
                    active-color="#0091FA"
                    inactive-color="#8C8C8C"
                    active-text="上架"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="发布方" prop="sourceName" :min-width="130"></el-table-column>
              <el-table-column label="编辑人" prop="addName" :min-width="130">
                  <template slot-scope="scope">
                    {{ scope.row.addName || '-' }}
                  </template>
              </el-table-column>
              <el-table-column label="发布时间" prop="createTime" :min-width="180"></el-table-column>
              <el-table-column label="操作" fixed="right" :width="150" >
                <template slot-scope="scope" >
                  <div v-if="scope.row.materialScriptType === 2">
                    <ns-table-column-operate-button :buttons="table.operate_buttons" :prop="scope" :width="250"></ns-table-column-operate-button>
                  </div>
                  <div v-else>
                    <ns-table-column-operate-button :buttons="table.operate_buttons.slice(0,4)" :prop="scope" :width="250"></ns-table-column-operate-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else>
            <catalogue
              :folders="waterfall.folders"
              :materials="waterfall.materials"
              :operate_buttons="waterfall.operate_buttons"
              :labelList="labelList"
              :selectRows="selectRows"
              @onSelect="onSelect"
              @onRemove="onRemove"
              @onEnter="onEnter"
              @preview="togglePreview"
              @subdivisionChange="subdivisionChange"
            ></catalogue>
          </div>
        </el-scrollbar>
      </template>
      <template slot="pagination">
        <el-pagination
          v-if="enable"
          :page-sizes="pagination.sizeOpts"
          :total="pagination.total"
          :current-page="pagination.page"
          :page-size="pagination.size"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          class="template-table__pagination"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </template>
    </ns-page-table>
    <new-folder ref="newFolder" @submit="loadList"></new-folder>
    <folder-tree ref="folderTree" @submit="refreshList"></folder-tree>
    <label-make ref="labelMake" @setSubdivision="setSubdivision"></label-make>
    <label-manage ref="labelManage"></label-manage>
    <preview ref="preview"></preview>
    <DetailList ref="detailList" :matericalTitle="matericalTitle"/>
  </div>
</template>
<script>
import Index from './src/index'
export default Index
</script>
<style>
@import "./styles/catalogue.css";
</style>
<style scoped>
  @import "@theme/variables.pcss";
  @import './styles/image.css';
  .el-icon-arrow-down {
    font-size: 12px;
  }
  @component-namespace library {
    @b wrapper {
      >>> .el-dropdown {
          cursor: pointer;
          color: #409EFF;
          margin-left: 5px;
        }
    }
    @b header {
      margin: 0 0 -5px -5px;
      >>> .el-button {
        margin: 0 0 var(--default-margin-small) var(--default-margin-small);
        height: 28px;
        vertical-align: middle;
        svg + span {
          margin-left: var(--default-margin-small);
        }
      }
      >>> .el-checkbox {
        margin: 0 0 var(--default-margin-small) var(--default-margin-small);
        vertical-align: middle;
      }
    }
    @b advance {
      @e search {
        padding-right: 150px;
        >>> .el-input,
        >>> .el-select {
          width: 180px;
        }
        >>> .el-date-editor--datetimerange {
          width: 445px;
          &.el-input__inner {
            .el-range-input {
              flex: 1;
            }
            .el-icon-circle-close::before {
              vertical-align: middle;
            }
          }
        }
      }
    }
    @b breadcrumb {
      display: flex;
      margin: var(--default-margin-larger) 0;
      padding: var(--default-padding-larger) var(--default-padding-small);
      background-color: #fff;
      border-radius: var(--default-radius-mini);
      align-items: center;
      overflow: hidden;
      @e right {
        float: right;
        svg {
          width: 14px;
          height: 14px;
        }
        >>> .el-radio-button--small .el-radio-button__inner {
          padding: 6px 23px;
        }
      }
      >>> .el-breadcrumb {
        flex: 1;
        .el-breadcrumb__inner {
          color: var(--theme-font-color-secondary);
          cursor: pointer;
          &:hover {
            color: var(--theme-color-primary);
          }
          span + span {
            margin-left: var(--default-margin-larger);
          }
        }
        .el-breadcrumb__item {
          line-height: 28px;
          &:last-child .el-breadcrumb__inner {
            cursor: default;
            color: #303133;
            &:hover {
              color: #303133;
            }
            span:last-child {
              color: var(--theme-font-color-regular);
            }
          }
        }
      }
    }
    @b table {
      @e folder {
        cursor: pointer;
        svg {
          margin: -4px var(--default-margin-small) -4px 0;
          font-size: 24px;
          color: var(--theme-color-primary);
          vertical-align: middle;
          &+span {
            vertical-align: middle;
          }
        }
      }
      @e material {
        white-space: pre-wrap;
        svg {
          display: none;
        }
      }
    }
    >>> .el-table {
      td {
        padding: var(--default-padding-larger) 0;
        .el-select .el-input__inner {
          padding-right: 26px;
        }
      }
      tr.hover-row {
        td {
          background-color: #F5FBFF;
        }
      }
    }
  }
</style>
