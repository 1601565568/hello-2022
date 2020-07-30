<template>
  <div>
    <ns-page-table :colButton="16">
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
          <el-checkbox>全选当页</el-checkbox>
        </div>
      </template>
      <!-- 快捷搜索 -->
      <template slot="searchSearch">
        <el-form :model="model" :inline="true" @submit.native.prevent class="pull-right">
          <el-form-item v-show="!_data._queryConfig.expand">
            <el-input
              ref="quickText"
              v-model="model.title"
              placeholder="请输入文件夹或素材标题"
              @keyup.enter.native="$quickSearchAction$(model.title)"
              style="width: 180px"
            >
              <Icon type="search" slot="suffix" class="el-input__icon" name="name" @click="$quickSearchAction$(model.title)"/>
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
      <!-- 高级搜索 -->
      <template slot="advancedSearch" v-if="_data._queryConfig.expand">
        <el-form
          ref="table_filter_form"
          @keyup.enter.native="$searchAction$"
          label-width="80px"
          class="surround-btn library-advance__search"
          :model="model"
          :rules="rules"
          :inline="true"
        >
          <el-form-item label="标题：">
            <el-input type="text" v-model="model.title" placeholder="请输入文件夹或素材标题"></el-input>
          </el-form-item>
          <el-form-item label="素材内容：">
            <el-input type="text" v-model="model.content" placeholder="请输入素材内容"></el-input>
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
              <el-option
                v-for="item in labelList"
                :key="item.subdivision_id"
                :label="item.subdivision_name"
                :value="item.subdivision_id">
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
          <el-form-item label="素材类型：" prop="type">
            <el-select
              v-model="model.type"
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
          </el-form-item>
          <el-form-item v-if="model.type === 1" label="带码状态：" prop="codeType">
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
          <ns-button type="primary" @click="$searchAction$">{{$t('operating.search')}}</ns-button>
          <ns-button @click="$resetInputAction$">{{$t('operating.reset')}}</ns-button>
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
              <span>{{item.name}}</span>
              <span v-if="index > 0 && index === breadcrumb.length - 1">中的搜索结果</span>
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
        <el-scrollbar ref="fullScreen">
          <div v-if="listMode === 'list'">
            <el-table
              ref="multipleTable"
              :data="_data._table.data"
              :element-loading-text="$t('prompt.loading')"
              v-loading.lock="_data._table.loadingtable"
              stripe
              resizable
              @selection-change="onHandleSelectChange"
            >
              <el-table-column type="selection" align="center" :width="50"></el-table-column>
              <el-table-column label="标题" :width="180">
                <template slot-scope="scope">
                  <!-- todo 进入文件夹 -->
                  <Icon v-if="scope.row.type === 0" class="library-table__file" type="wenjianjia-new" />
                  <span>{{scope.row.title}}</span>
                </template>
              </el-table-column>
              <el-table-column label="内容" prop="content" :min-width="275">
                <template slot-scope="scope">
                  <table-item :data="scope.row"></table-item>
                </template>
              </el-table-column>
              <el-table-column label="标签" :width="200">
                <template slot-scope="scope">
                  <span v-if="scope.row.type === 0">-</span>
                  <el-select
                    v-else
                    v-model="scope.row.subdivision_id"
                    placeholder="请选择"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="item in labelList"
                      :key="item.subdivision_id"
                      :label="item.subdivision_name"
                      :value="item.subdivision_id">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="发布方" prop="source_name" :width="130"></el-table-column>
              <el-table-column label="发布时间" prop="create_time" :width="180"></el-table-column>
              <el-table-column label="操作" :width="144" align="center" fixed="right">
                <template slot-scope="scope">
                  <ns-table-column-operate-button :buttons="_data._table.operate_buttons" :prop="scope"></ns-table-column-operate-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else>瀑布流</div>
        </el-scrollbar>
      </template>
      <template slot="pagination">
        <el-pagination
          v-if="_data._pagination.enable"
          class="template-table__pagination"
          :page-sizes="_data._pagination.sizeOpts"
          :total="_data._pagination.total"
          :current-page="_data._pagination.page"
          :page-size="_data._pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="$sizeChange$"
          @current-change="$pageChange$"
        >
        </el-pagination>
      </template>
    </ns-page-table>
    <new-folder ref="newFolder"></new-folder>
    <folder-tree ref="folderTree"></folder-tree>
    <label-make ref="labelMake"></label-make>
    <label-manage ref="labelManage"></label-manage>
  </div>
</template>
<script>
import Index from './src/index'
export default Index
</script>
<style scoped>
  @import "@theme/variables.pcss";
  @component-namespace library {
    @b header {
      >>> .el-button {
        svg + span {
        margin-left: var(--default-margin-small);
        }
      }
      >>> .el-checkbox {
        margin-left: var(--default-margin-small);
      }
    }
    @b advance {
      @e search {
        >>> .el-input,
        >>> .el-select {
          width: 180px;
        }
        >>> .el-date-editor--daterange.el-input__inner {
          width: 445px;
        }
      }
    }
    @b breadcrumb {
      display: flex;
      margin: var(--default-margin-larger) 0;
      padding: var(--default-padding-larger) var(--default-padding-small);
      background-color: #fff;
      border-radius: 4px;
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
          span + span {
            margin-left: var(--default-margin-larger);
          }
        }
        .el-breadcrumb__item {
          line-height: 28px;
          &:last-child .el-breadcrumb__inner {
            color: #303133;
            span:last-child {
              color: var(--theme-font-color-regular);
            }
          }
        }
      }
    }

    @b table {
      @e file {
        margin-right: var(--default-margin-small);
        font-size: 24px;
        color: var(--theme-color-primary);
        vertical-align: middle;
        &+span {
          vertical-align: middle;
        }
      }
    }
  }
</style>
