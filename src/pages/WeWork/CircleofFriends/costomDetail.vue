<template>
  <div class='detail-container'>
    <h3 class='header-text'>
      <img :src='backIcon' class='back-icon' @click='handleBack'/>
      朋友圈详情
    </h3>
    <div class='detail'>
      <div class='user-content'>
        <img src='' />
        <div></div>
      </div>
      <div class='container'>
        <EmojiText :text='data' pre='EMOJI_'/>
        <div class='date'>
          <div>2020/07/18 12:00</div>
          <ns-button type='text'>
            <span class="iconfont icon-kejiankehu"></span>
            可见客户
          </ns-button>
        </div>
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
  </div>
</template>
<script>
import CostomDetail from './src/CostomDetail'
import LikeTable from './components/detail/LikeTable'
import CommonTable from './components/detail/CommonTable'
CostomDetail.components = {
  LikeTable, CommonTable
}
export default CostomDetail
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.detail-container {
  .header-text {
    background: #fff;
    padding: 0 16px;
    font-size: 16px;
    color: #262626;
    height: 48px;
    line-height: 48px;
    display: flex;
    align-items: center;
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
    .user-content {

    }
  }
}
</style>
