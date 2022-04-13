<template>
  <div class='detail-container'>
    <h3 class='header-text'>
      <img :src='backIcon' class='back-icon' @click='handleBack'/>
      朋友圈详情
    </h3>
    <div class='container detail'>
      <div class='text-content'>{{info.textContent}}</div>
      <template v-if='info.linkTitle'>
         <Link :url='info.linkUrl' :title='info.linkTitle' :image='info.imageMediaId ? info.imageMediaId.split(",")[0]:""'/>
      </template>
      <template v-else-if='info.videoMediaId'>
         <Video :videoUrl='info.videoMediaId' :posterUrl='info.videoThumbMediaId'/>
      </template>
      <template v-else-if='info.imageMediaId'>
         <Picture :imgList='info.imageMediaId ? info.imageMediaId.split(","):[]'/>
      </template>
      <div class='footer'>
        <div class='date'>{{info.createTime}}</div>
        <ns-button v-if='info.visibleType !== 1' type='text' @click='changeDrawer(true)'>
          <span class="iconfont icon-kejiankehu" ></span>
          <span class='text'>可见客户</span>
        </ns-button>
      </div>
    </div>
    <div class='list'>
      <div class='list-header'>
        成员执行情况（总计：{{_data._pagination.total}}人 已发表人数：{{ext.published}}人 未发表人数：{{ext.unpublished}}人）
      </div>
      <page-table>
        <template slot='search'>
          <el-form :inline="true" class='form-inline_top'>
            <el-form-item label="发表状态：">
              <el-select v-model="model.publishStatus" placeholder="请选择" @change='(value)=>{changeSearchfrom({status:value})}'>
                <el-option
                  v-for="item in PublishStatuList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="`选择${aliasGuideName}：`">
              <GuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" type="primary" btnTitle="" :dialogTitle="`选择${aliasGuideName}`" v-model="guideIds" @input="handleChangeGuide">
                <template slot='selfBtn'>
                  <div class='self-btn'>
                    {{(guideIds&&guideIds.length)?`已选择${guideIds.length}个${aliasGuideName}`:'全部'}}
                    <Icon type="geren" class='guideIds-icon'></Icon>
                  </div>
                </template>
              </GuideDialog>
            </el-form-item>
          </el-form>
        </template>
        <template slot='button'>
          <ns-button size='large' @click="exportClick" id="exportButton">导&nbsp;出</ns-button>
        </template>
        <template slot='table'>
          <template>
            <el-table
              :data="_data._table.data"
              class="new-table_border"
              v-loading.lock="_data._table.loadingtable"
              style="width: 100%">
              <el-table-column
                prop="guideName"
                :label="aliasGuideName">
              </el-table-column>
              <el-table-column
                v-if='cloudPlatformType === "ecrp"'
                prop="workNumber"
                label="工号">
              </el-table-column>
              <el-table-column
                v-if='cloudPlatformType === "ecrp"'
                prop="shopName"
                label="所属门店">
                <template slot-scope="scope">
                  <el-popover
                    placement="top-start"
                    width="300"
                    trigger="hover"
                    :disabled="scope.row.shopName && scope.row.shopName.length <= 15"
                  >
                    <div>{{ scope.row.shopName }}</div>
                    <span
                      slot="reference"
                      v-if="scope.row.shopName && scope.row.shopName.length <= 15"
                      >{{ scope.row.shopName }}</span
                    >
                    <span
                      slot="reference"
                      v-if="scope.row.shopName && scope.row.shopName.length > 15"
                      >{{
                        scope.row.shopName.substr(0, 15) + '...'
                      }}</span
                    >
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                prop="publishStatus"
                label="发表状态">
                <template slot-scope="scope">
                  <div>{{PublishStatuMap[scope.row.publishStatus]}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="likeNum"
                label="点赞数">
              </el-table-column>
              <el-table-column
                prop="commentNum"
                label="评论数">
              </el-table-column>
              <el-table-column
                prop="employeeNumber"
                label="操作">
                <template slot-scope="scope">
                  <ns-button type='text' @click='handleDetail(scope.row.userId)'>详情</ns-button>
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
    </div>
    <el-drawer
      :modal="false"
      size="500px"
      @close="changeDrawer(false)"
      :visible.sync="drawer"
      :with-header="false"
    >
      <FriendDrawer @onClose='changeDrawer(false)'/>
    </el-drawer>
  </div>
</template>
<script>
import Detail from './src/Detail'
import ElDrawer from '@nascent/nui/lib/drawer'
import LikeTable from './components/detail/LikeTable'
import GuideDialog from '@/components/NewUi/GuideDialog'
import FriendDrawer from './components/detail/FriendDrawer'
import DetailCommon from './mixins/DetailCommon'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import PageTable from '@/components/NewUi/PageTable'
import Picture from './components/friendsStyle/Picture'
import Video from './components/friendsStyle/Video'
import Link from './components/friendsStyle/Link'
Detail.components = {
  LikeTable, FriendDrawer, ElDrawer, PageTable, GuideDialog, Picture, Video, Link
}
Detail.mixins = [DetailCommon, tableMixin]
export default Detail
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.detail-container {
  .header-text {
    margin:-10px -10px 0 -10px;
    background: #fff;
    padding: 0 16px;
    font-size: 16px;
    color: #262626;
    height: 48px;
    line-height: 48px;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  .back-icon {
    height: 16px;
    width: 16px;
    cursor: pointer;
    margin-right: 16px;
  }
  .detail {
    padding: 16px;
    background:#fff;
    &.container {
      position: relative;
    }
    .text-content {
      font-size: 14px;
      color: #262626;
      line-height: 22px;
      font-weight: 400;
      margin-bottom: 8px;
    }
    .footer {
      display: flex;
      align-items: center;
      .date {
        font-size: 14px;
        color: #606266;
        line-height: 22px;
        margin-right:16px;
      }
      .iconfont {
        color:#8c8c8c;
        font-size: 20px;
      }
      .text {
        font-size: 14px;
        position: relative;
        top:-3px;
      }
    }
  }
  .list {
    margin-top: 16px;
    background-color: #fff;
  }
  .list-header {
    padding:16px 16px 0;
    line-height: 16px;
    font-size: 16px;
    color: #262626;
    font-weight: 500;
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
</style>
