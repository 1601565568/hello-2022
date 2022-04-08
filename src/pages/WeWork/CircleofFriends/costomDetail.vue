<template>
  <div class='detail-container'>
    <h3 class='header-text'>
      <img :src='backIcon' class='back-icon' @click='handleBack'/>
      朋友圈详情
    </h3>
    <div class='container detail'>
      <img :src="info.guidePic" class='usericon'/>
      <div class='name'>{{info.guideName}}</div>
      <div v-if='info.shopName' class='shop'>
        所属门店：{{info.shopName}}
      </div>
      <div class='text-content'>{{info.textContent}}</div>
      <div class='footer'>
        <div class='date'>{{info.createTime}}</div>
        <ns-button type='text'>
          <span class="iconfont icon-kejiankehu" ></span>
          <span class='text'>可见客户</span>
        </ns-button>
      </div>
    </div>
    <el-row class='list' :gutter='16'>
      <el-col :span="12">
        <LikeTable :likeList='likeList' :likeNum='likeNum'/>
      </el-col>
      <el-col :span="12">
        <CommonTable :commentList='commentList' :commentNum='commentNum'/>
      </el-col>
    </el-row>
    <el-drawer
      :modal="false"
      size="480px"
      @close="handleClose"
      :visible.sync="drawer"
      :with-header="false"
    >
      <FriendDrawer @onClose='handleClose'/>
    </el-drawer>
  </div>
</template>
<script>
import CostomDetail from './src/CostomDetail'
import ElDrawer from '@nascent/nui/lib/drawer'
import LikeTable from './components/detail/LikeTable'
import CommonTable from './components/detail/CommonTable'
import FriendDrawer from './components/detail/FriendDrawer'
CostomDetail.components = {
  LikeTable, CommonTable, FriendDrawer, ElDrawer
}
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
