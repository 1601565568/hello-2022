<template>
  <CardTitle title="门店导购榜单TOP5">
    <img slot="image" class="dataIcon" src="../../../image/guideIcon.png" />
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
          <img v-if="index === 0" src="../../../image/guide1.png" />
          <img v-else-if="index === 1" src="../../../image/guide2.png" />
          <img v-else-if="index === 2" src="../../../image/guide3.png" />
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="list-user">
          <img class="list-user__pic" src="../../../image/defultheadPic.png" />
          <div>
            <div class="list-user__name">导购姓名</div>
            <div class="list-user__num">
              {{
                editData[1] && editData[0].status === 1
                  ? '销售数'
                  : editData[1] && editData[1].status === 1
                  ? '招募数'
                  : '新加好友数'
              }}：0
            </div>
          </div>
        </div>
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
      width: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
      color: #8c8c8c;
      img {
        width: 25px;
        height: 25px;
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
  }
}
</style>
