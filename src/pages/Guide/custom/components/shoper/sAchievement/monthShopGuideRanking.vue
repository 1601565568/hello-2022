<template>
  <CardTitle title="集团门店榜单TOP5">
    <img slot="image" class="dataIcon" src="../../../image/groupIcon.png" />
    <div slot="content" class="storeGuideTop" v-if="show">
      <div class="tabs">
        <template v-for="(item, index) in editData">
          <div class="tabs-list" v-if="item.status === 1" :key="index">
            {{ item.itemName }}
          </div>
          <!-- <div class="tabs-list">招募榜</div>
          <div class="tabs-list">加好友榜</div> -->
        </template>
      </div>
      <div class="list" v-for="(item, index) in 5" :key="index">
        <div class="topIndex">
          <img v-if="index === 0" src="../../../image/groupTop1.png" />
          <img v-else-if="index === 1" src="../../../image/groupTop2.png" />
          <img v-else-if="index === 2" src="../../../image/groupTop3.png" />
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="list-user">
          导购线下门店
        </div>
        <div class="list-number">0</div>
      </div>
    </div>
  </CardTitle>
</template>
<script>
import CardTitle from './cardTitle'
import componentData from '../../mixins/componentData.js'
export default {
  components: { CardTitle },
  mixins: [componentData],
  data () {
    return {}
  }
}
</script>
<style scoped lang="scss">
.storeGuideTop {
  .tabs {
    display: flex;
    margin-bottom: 8px;
    height: 47px;
    border-bottom: 1px solid #e8e8e8;
    .tabs-list {
      flex: 1;
      text-align: center;
      line-height: 47px;
      font-size: 15px;
      color: #595959;
      &:nth-of-type(1) {
        color: #ff532a;
        position: relative;
        &::before {
          position: absolute;
          content: '';
          bottom: 0px;
          left: 50%;
          transform: translate(-50%, 0%);
          background: #ff532a;
          width: 40px;
          height: 2px;
        }
      }
    }
  }
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
      min-width: 70%;
      margin-left: 24px;
      font-size: 15px;
      color: #262626;
      display: flex;
      align-items: center;
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
