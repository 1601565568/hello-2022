<template>
  <el-dialog
    title="自创明细查看"
    :visible.sync="dialogVisible"
    width="658px"
  >
    <div class="dialog-view">
      <div class="guide-info">
        <span class="right">{{ metailInfo.shopName }}</span>
        <span class="right">{{ metailInfo.guideName }}</span>
        <span>{{ metailInfo.completionTime }}</span>
      </div>
      <div class="content-view">
        {{ metailInfo.content }}
      </div>
      <div class="images-view">
        <div v-for="(item, index) in metailInfo.mediaList" :key="index">
          <img class="base-one" :src="item.url" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'infoDialog',
  props: {
    metailInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-view {
  padding: 8px;
}
.guide-info {
  font-size: 14px;
  color: #262626;
  line-height: 44px;
  font-weight: 400;
  .right {
    margin-right: 32px;
  }
}
.content-view {
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  font-weight: 400;
  margin-bottom: 16px;
  margin-top: 16px;
}
.images-view {
  display: flex;
  flex-direction: row;
  width: 520px;
  flex-wrap: wrap;
  margin-bottom: 32px;
  .base-one {
    width: 160px;
    height: 160px;
    border-radius: 3px;
    margin-right: 8px;
    margin-bottom: 8px;
  }
}
</style>
