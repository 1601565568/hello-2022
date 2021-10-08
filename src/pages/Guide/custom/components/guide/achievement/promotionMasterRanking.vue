<template>
  <CardTitle title="我的裂变大师TOP5">
    <img slot="image" class="dataIcon" src="../../../image/guideIcon.png" />
    <div slot="content" class="storeGuideTop">
      <div class="list" v-for="(item, index) in 5" :key="index">
        <div class="topIndex">
          <img v-if="index === 0" src="../../../image/guide1.png" />
          <img v-else-if="index === 1" src="../../../image/guide2.png" />
          <img v-else-if="index === 2" src="../../../image/guide3.png" />
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="list-user">
          <img class="list-user__pic" src="../../../image/defultheadPic.png" />
          <div>
            <div class="list-user__name">用户名</div>
            <div class="list-user__num">活动名称：活动活动活动活动...</div>
          </div>
        </div>
        <div class="list-number">{{ index }}</div>
      </div>
    </div>
  </CardTitle>
</template>
<script>
import CardTitle from './cardTitle'
export default {
  name: 'promotionMasterRanking',
  components: { CardTitle },
  data () {
    return {}
  }
}
</script>
<style scoped lang="scss">
.storeGuideTop {
  .list {
    display: flex;
    margin-left: 16px;
    height: 75px;
    border-bottom: 1px solid #e8e8e8;
    &:last-child {
      border-bottom: 1px solid transparent;
    }
    .topIndex {
      width: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
      color: #8c8c8c;
      img {
        width: 24px;
        height: 24px;
      }
    }
    .list-user {
      margin-left: 24px;
      display: flex;
      align-items: center;
      .list-user__pic {
        width: 48px;
        height: 48px;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 12px;
      }
      .list-user__name {
        font-size: 15px;
        color: #262626;
      }
      .list-user__num {
        font-size: 13px;
        color: #8c8c8c;
      }
    }
    .list-number {
      font-weight: bold;
      line-height: 75px;
      margin-left: 35px;
      font-size: 17px;
      color: #262626;
    }
  }
}
</style>
