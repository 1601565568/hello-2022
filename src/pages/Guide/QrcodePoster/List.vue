<template>
  <div>
    <page-table title='二维码海报'>
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="">
            <el-input v-model="model.loginAccount" placeholder="请输入创建人"  @keyup.enter.native="handleSearch">
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="model.title" placeholder="请输入海报名称"  @keyup.enter.native="handleSearch">
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot='button'>
        <ns-button type="primary" size='large' @click="handleDetail({})">新增海报</ns-button>
      </template>
      <template slot='table'>
        <template>
          <el-table
            :data="_data._table.data"
            class="new-table_border"
            @sort-change="sortChange"
            style="width: 100%">
            <el-table-column
              prop="title"
              label="海报名称">
            </el-table-column>
            <el-table-column
              prop="guideNames"
              width='100px'
              label="二维码海报">
              <template slot-scope="scope">
                <div class="scope-name scope-name_num box-padding"  :class="[fuscous==='QA'?fuscousQA:fuscousIcon]">
                  <Icon type="ns-file-picture" className="message-upload__tip" @click='handlePreview(scope.row)'/>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              sortable="custom"
              label="创建时间">
            </el-table-column>
            <el-table-column
              prop="loginAccount"
              label="创建人">
            </el-table-column>
            <el-table-column
              prop="address"
              width='125px'
              label="操作">
              <template slot-scope="scope">
                <ns-button type="text" @click='handleEdit({id:scope.row.id})'>编辑</ns-button>
                <ns-button type="text" @click='handleEnd(scope.row.id)'>删除</ns-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </template>
      <template slot='pagination'>
        <el-pagination v-if="_data._pagination.enable"
                        class="template-table__pagination"
                        :page-sizes="_data._pagination.sizeOpts"
                        :total="_data._pagination.total"
                        :current-page="_data._pagination.page"
                        :page-size="_data._pagination.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="$sizeChange$"
                        @current-change="$pageChange$">
          </el-pagination>
      </template>
    </page-table>
    <PreviewPoster :dialogVisible='dialogVisible' :url='dialogData.placard' @onClose='handleClose' appendToBody/>
  </div>
</template>
<script>
import List from './src/List'
import PageTable from '@/components/NewUi/PageTable'
import ElDrawer from '@nascent/nui/lib/drawer'
import PreviewPoster from '../components/PreviewPoster'
List.components = {
  PageTable, ElDrawer, PreviewPoster
}
export default List
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .scope-name_tip {
    color: #0091FA
  }
  .scope-title {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .scope-title_img {
    height: 86px;
    width: 48px;
    margin-right: 8px;
  }
  .search-icon {
    font-size: 22px;
    margin-top: 2px;
  }
  .scope-name_text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    &.more:after {
      content:'...'
    }
  }
  .scope-name_tag.el-tag {
    border-radius: 2px;
    &.el-tag--success {
      background: #F7FFF0;
      border: 1px solid #53BF1D;
      color: #262626;
    }
    &.el-tag--info {
      background: #F5F5F5;
      border: 1px solid #D9D9D9;
      color: #262626;
    }
    &.el-tag--warning {
      background: #FFFBE6;
      border: 1px solid #FFAE0D;
      color: #262626;
    }
  }
  .self-btn {
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #606266;
    .guideIds-icon {
      color:#C0C4CC;
    }
  }
  .box-padding {
    color:#0091FA;
    padding: 0 20px;
    font-size: 16px;
    cursor: pointer;
  }
  .flex-box {
    display: flex;
    align-items: center;
    .copy {
      margin-left: 17px;
      font-size: 14px;
    }
    &.bottom {
      align-items: flex-end;
      justify-content: flex-start;
    }
    .copy-img {
      width: 122px;
      height: 216px;
    }
  }
  .question-circle {
    margin-left: 5px;
  }
.fuscousQA {
color: #1965FF;
}
.fuscousIcon{
color: #0091FA;
}
</style>
<style lang="scss" scoped>

</style>
