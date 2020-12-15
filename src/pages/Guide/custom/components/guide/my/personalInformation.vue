<template>
  <div class="user" v-if="show">
    <img
      v-if="editData[0] && editData[0].status === 1"
      class="user-pic"
      src="../../../image/defultheadPic.png"
    />
    <div>
      <div class="user-name" v-if="editData[1] && editData[1].status === 1">
        导购姓名
      </div>
      <div class="user-name__text">
        <span v-if="editData[2] && editData[2].status === 1">导购昵称</span
        ><span v-if="editData[3] && editData[3].status === 1">12345678901</span>
      </div>
    </div>
  </div>
</template>
<script>
import componentData from '../../mixins/componentData.js'
export default {
  mixins: [componentData]
}
</script>
<style lang="scss" scoped>
.user {
  height: 96px;
  background: #0091fa;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #ffffff;
  margin-bottom: 8px;
  .user-pic {
    width: 48px;
    height: 48px;
    margin-right: 16px;
  }
  .user-name {
    font-size: 17px;
    margin-bottom: 2px;
  }
  .user-name__text {
    font-size: 13px;
    span {
      display: inline-block;
      margin-left: 4px;
    }
  }
}
</style>
