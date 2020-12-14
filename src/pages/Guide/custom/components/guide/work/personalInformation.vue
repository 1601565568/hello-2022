<template>
  <!-- 导购工作台头部 -->
  <div class="D-head" v-if="show">
    <img
      v-if="editData[0] && editData[0].status === 1"
      class="D-head-useImage"
      src="../../../image/defultheadPic.png"
    />
    <div class="D-head-text">
      <div class="D-head-text__user">
        <div
          class="D-head-text__user__name"
          v-if="editData[1] && editData[1].status === 1"
        >
          导购姓名
        </div>
        <div
          class="D-head-text__user__number"
          v-if="editData[2] && editData[2].status === 1"
        >
          <img
            class="D-head-Jobnumber"
            src="../../../image/Jobnumber.png"
          />工号<span class="number">0001</span>
        </div>
      </div>
      <div
        class="D-head-text__user__number"
        v-if="editData[3] && editData[3].status === 1"
      >
        导购线下门店
      </div>
    </div>
  </div>
</template>
<script>
import componentData from '../../mixins/componentData.js'
export default {
  name: 'personalInformation',
  mixins: [componentData]
}
</script>
<style scoped lang="scss">
.D-head {
  display: flex;
  align-items: center;
  height: 96px;
  padding: 0 16px;
  background: #0091fa;
  margin-bottom: 8px;
  .D-head-useImage {
    width: 48px;
    margin-right: 16px;
    height: 48px;
    overflow: hidden;
    border-radius: 4px;
  }
  .D-head-text {
    color: #fff;
    display: flex;
    flex-direction: column;
    .D-head-text__user {
      display: flex;
      align-items: center;
      font-size: 17px;
      line-height: 25px;
    }
    .D-head-text__user__name {
      margin-right: 8px;
    }
    .D-head-text__user__number {
      font-size: 13px;
      .D-head-Jobnumber {
        width: 14px;
        height: 14px;
        margin-right: 5px;
      }
      .number {
        display: inline-block;
        margin-left: 5px;
      }
    }
  }
}
</style>
