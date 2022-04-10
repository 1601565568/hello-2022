<template>
  <div class='detail-container'>
    <h3 class='header-text'>
      <img :src='backIcon' class='back-icon' @click='handleBack'/>
      {{info.guideName}}的朋友圈详情
    </h3>
    <div class='container detail'>
      <img :src="info.guidePic" class='usericon'/>
      <div class='name'>{{info.guideName}}</div>
      <div v-if='info.shopName' class='shop'>
        所属门店：{{info.shopName}}
      </div>
      <div class='text-content'>{{info.textContent}}</div>
      <template v-if='info.imageMediaId'>
         <Picture :imgList='info.imageMediaId ? info.imageMediaId.split(","):[]'/>
      </template>
      <template v-if='info.videoMediaId'>
         <Video :videoUrl='info.videoMediaId' :posterUrl='info.videoThumbMediaId'/>
      </template>
      <template v-if='info.linkTitle'>
         <Link :url='info.linkUrl' :title='info.linkTitle' :image='info.imageMediaId ? info.imageMediaId.split(",")[0]:""'/>
      </template>
      <div class='footer'>
        <div class='date'>{{info.createTime}}</div>
        <ns-button v-if='info.visibleType !== 1' type='text' @click='changeDrawer(true)'>
          <span class="iconfont icon-kejiankehu" ></span>
          <span class='text'>可见客户</span>
        </ns-button>
      </div>
    </div>
    <el-row class='list' :gutter='16'>
      <el-col :span="12">
        <LikeTable :type='1'/>
      </el-col>
      <el-col :span="12">
        <LikeTable :type='0'/>
      </el-col>
    </el-row>
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
import CostomDetail from './src/CostomDetail'
import ElDrawer from '@nascent/nui/lib/drawer'
import LikeTable from './components/detail/LikeTable'
import FriendDrawer from './components/detail/FriendDrawer'
import DetailCommon from './mixins/DetailCommon'
import Picture from './components/friendsStyle/Picture'
import Video from './components/friendsStyle/Video'
import Link from './components/friendsStyle/Link'
CostomDetail.components = {
  LikeTable, FriendDrawer, ElDrawer, Picture, Video, Link
}
CostomDetail.mixins = [DetailCommon]
export default CostomDetail
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
      padding-left: 72px;
    }
    .usericon {
      height:48px;
      width: 48px;
      position: absolute;
      top: 16px;
      left: 16px;
      border-radius: 4px;
    }
    .name {
      font-size: 14px;
      color: #262626;
      line-height: 22px;
      font-weight: 500;
      margin-bottom: 4px;
    }
    .shop {
      font-size: 14px;
      color: #8C8C8C;
      line-height: 22px;
      margin-bottom: 12px;
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
  }
}
</style>
