<template>
  <div v-loading="loading"
      element-loading-text="数据导入中，请稍等…">
    <page-table title='朋友圈看板'>
      <template slot="search">
        <div class="searchWarpper">
          <el-form :inline="true" class="form-inline_top ">
            <el-form-item label="类型：">
              <el-select v-model="model.type" @change="fnEdit">
                <el-option
                  v-for="item in statusOptionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="el-form__change" placeholder="近一月">
              <el-date-picker
                v-model="searchDate"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="请选择开始日期"
                end-placeholder="请选择结束日期"
                :default-time="['00:00:00', '23:59:59']"
                align="right"
                @change="selectTime"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="选择员工：">
              <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" dialogTitle="选择员工" v-model="model.guideIdList" @input="NsGuideDialog">
                <template slot='selfBtn'>
                  <div class='self-btn'>
                    {{(model.guideIdList&&model.guideIdList.length)?`已选择${model.guideIdList.length}个员工`:'全部'}}
                    <Icon type="geren" class='guideIds-icon'></Icon>
                  </div>
                </template>
              </NsGuideDialog>
            </el-form-item>
            <el-form-item label="" class="el-form__change">
              <el-input
                v-model="model.content"
                style="width:200px"
                placeholder="请输入内容"
                @keyup.enter.native="handleSearch"
              >
                <Icon
                  type="ns-search-copy"
                  slot="suffix"
                  class="search-icon"
                  @click="handleSearch"
                />
              </el-input>
            </el-form-item>
          </el-form>
          <NsButton class="add-button" size="large" @click="exportFile">导出CSV文件</NsButton>
        </div>
      </template>
      <template slot="button">
        <ns-button size='large' @click="handleExport">导出CSV文件</ns-button>
      </template>
      <template slot="table">
        <template>
          <el-table
            :data="getList"
            class="new-table_border"
            :row-style="tableRowClassName"
            style="width: 100%"
          >
            <el-table-column prop="textContent" label="内容">
              <template slot-scope="scope">

                <!-- 图片和视频类型 -->
                <div class="scope-title" v-if="scope.row.imageMediaId || scope.row.videoMediaId">
                  <!-- 图片显示 -->
                  <div class="friendPic" v-if="scope.row.imageMediaId.length > 0 && scope.row.linkTitle == null ">
                    <img
                      :src="scope.row.imageMediaId[0] "
                      class="scope-title_img"
                    />
                    <span v-if="scope.row.imageMediaId.length > 1">{{scope.row.imageMediaId.length}}</span>
                  </div>
                  <!-- 视频类型 -->
                  <div class="table-video" v-if="scope.row.videoMediaId">
                    <video
                      :poster="scope.row.videoThumbMediaId" :src="scope.row.videoMediaId"
                    >
                      您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
                    </video>
                    <div class="tableItem-video__mask">
                      <div class="tableItem-video__wrapper">
                        <Icon type="begin" />
                      </div>
                    </div>
                  </div>
                  <div class="scope-title_text">
                    <span>{{ scope.row.textContent }}</span>
                  </div>
                </div>
                <div class="friendShare" v-if="scope.row.linkTitle">
                  <div class="share-type">
                    <a
                      class="Abox"
                      :href="scope.row.linkUrl"
                      target="_blank"
                    >
                    <!-- 图片显示 -->
                  <div class="friendPic" v-if="scope.row.imageMediaId">
                    <img
                      :src="scope.row.imageMediaId[0]"
                      class="scope-title_img"
                    />
                  </div>
                    <p class="share-text">
                     {{scope.row.linkTitle}}
                     </p>
                     </a>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createType" label="类型">
              <template slot-scope="scope">
                {{statusOptionList[scope.row.createType + 1].label}}
              </template>
            </el-table-column>
            <el-table-column prop="guideName" label="员工">
            </el-table-column>
            <el-table-column prop="shopName" label="门店" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="createTime" label="时间"> </el-table-column>
            <el-table-column prop="address" label="操作"  width="80px">
              <template slot-scope="scope">
                <ns-button
                  type="text"
                  @click="handleEdit(scope.row, scope.$index)"
                  >查看</ns-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </template>
      <template slot="pagination">
        <el-pagination
          v-if="pagination.enable"
          class="template-table__pagination"
          :page-sizes="pagination.sizeOpts"
          :total="pagination.total"
          :current-page="pagination.page"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="$sizeChange$"
          @current-change="$pageChange$"
        >
        </el-pagination>
      </template>
    </page-table>
    <el-drawer
      :modal="false"
      size="480px"
      @close="handleClose"
      :visible.sync="drawer"
      :with-header="false"
    >
      <ItemDrawer :momentIdSend="momentId" :drawerDate="drawerDate" @onPrev="onPrevUp" @onNext="onPrevDown" @onClose="handleClose" :waiting="loading"/>
    </el-drawer>
    <!-- :data="itemDate"
           @onClose="handleClose"
        @onPreview="handleAnalysis"
        @onDelect="handleEnd"
        @onEdit="handleDetail"
        @onNext="getOhterGuide('next', handleShowDetail)"
        @onPrev="getOhterGuide('prev', handleShowDetail)" -->
  </div>
</template>
<script>
import List from './src/List'
import NsGuideDialog from '@/components/NsGuideDialog'
import PageTable from '@/components/NewUi/PageTablePro'
import ElDrawer from '@nascent/nui/lib/drawer'
import ItemDrawer from './components/ItemDrawer'

List.components = {
  PageTable,
  NsGuideDialog,
  ElDrawer,
  ItemDrawer
}
export default List
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.template-table {
  padding: 12px 16px 16px 16px;
}
.titleText {
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  font-weight: 700;
  width: 200px;
  height: 24px;
  margin-top: 8px;
}
.searchWarpper {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
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
  width: 130px;
  height: 27px;
  margin-left: 10px;
  border-right: 1px solid #dcdfe6;
}
.template-search__box > div + span {
  margin-left: var(--default-margin-small);
}
.NsGuideDialog {
  float: right;
}
.scope-title {
  display: flex;
  .friendPic {
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 8px;
    .scope-title_img {
      width: 100%;
      height: 100%;
    }
    span {
      position: absolute;
      right: 0;
      bottom: 0;
      display: inline-block;
      width: 16px;
      height: 16px;
      color: #ffffff;
      text-align: center;
      line-height: 16px;
      border-radius: 4px 0px 4px 0px;
      background: rgba(0, 0, 0, 0.45);
    }
  }
  .table-video {
    position: relative;
    width: 86px;
    height: 48px;
    border-radius: 3px;
    margin-right: 8px;
    > video {
      width: 100%;
      height: 100%;
      border-radius: 3px;
      -o-object-fit: cover;
      object-fit: cover;
    }
    .tableItem-video__mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.25);
      // cursor: pointer;
      border-radius: 3px;
    }
    .tableItem-video__wrapper {
      position: relative;
      top: 50%;
      left: 50%;
      margin-left: -11px;
      margin-top: -11px;
      width: 22px;
      height: 22px;
      border-radius: 22px;
      background-color: rgba(255, 255, 255, 0.4);
      > svg {
        margin: 5px 0 0 6px;
        font-size: 12px;
        color: #fff;
      }
    }
  }
  .scope-title_text {
    flex: 1;
    // margin-left: 8px;
    display: flex;
    align-items: center;
    span {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
.friendShare {
  .share-type {
    height: 56px;
    padding: 4px 8px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    // > img {
    //   border-radius: 3px;
    //   width: 48px;
    //   height: 48px;
    // }
    .Abox {
     display: flex;
     align-items: center;
     pointer-events: none;
     color: #262626;
     .friendPic {
        width: 48px;
        height: 48px;
        img {
          width: 100%;
        }
     }
    }
    .share-text {
      flex: 1;
      margin-left: 4px;
      span {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
  }
}
.template-table__bar-base .el-form .el-form-item {
    margin: 0 !important;
    margin-bottom: 5px !important;
    margin-left: 16px !important;
}
.search-icon {
    font-size: 24px;
    color: #959595;
    margin-top: 1px;
}
.self-btn {
    font-size: 14px;
    width: 130px;
    color: #606266;
    display: flex;
    /* align-content: center; */
    align-items: center;
    justify-content: space-between;
    .guideIds-icon {
      color: #c0c4cc;
    }
  }
</style>
