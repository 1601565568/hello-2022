<template>
  <div>
    <template v-if='type===1'>
      <div class='picture-content content'>
        <div class='picture'>
          <img />
          <div class='picture-number'>6</div>
        </div>
        <div class='picture-desc over-row'>
          招商引流活动；推荐5人线下礼包
        </div>
      </div>
    </template>
    <template v-if='type===2'>
      <div class='video-content content'>
        <div class='picture video'>
          <img />
        </div>
        <div class='picture-desc over-row'>
          招商引流活动；推荐5人线下礼包
        </div>
      </div>
    </template>
    <!-- <template v-if='type===3'>
      <div class='acticle-content'>
        <div class='acticle-title'>
          无论是更注重自我表达的时髦理念，还是偏向清新柔和的1，职场不再仅仅
        </div>
        <div class='acticle content'>
          <img />
          <div class='acticle-desc'>
            超实用的衣物护理小知识，从此1每天穿新衣。
          </div>
        </div>
      </div>
    </template> -->
  </div>
</template>
<script>
export default {
  props: {
    type: {

    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
}
.over-row {
  word-break: break-all;
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.picture-content,.video-content {
  .picture {
    border: 1px solid #E8E8E8;
    border-radius: 4px;
    height: 48px;
    min-width: 48px;
    overflow: hidden;
    position: relative;
    &.video {
      min-width: 86px;
    }
    img {
      height: 100%;
      width: 100%
    }
    .picture-number {
      border-radius: 4px 0px 4px 0px;
      background-color: rgba(0,0,0,.45);
      height:16px;
      width: 16px;
      display: flex;
      text-align: center;
      justify-content: center;
      font-size: #fff;
      font-size: 10px;
    }
  }
  .picture-desc {
    font-size: 12px;
    color: #262626;
    line-height: 22px;
    margin-left: 8px;
  }
}
.acticle-content {
  .acticle-title {
    font-size: 12px;
    color: #262626;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .acticle {
    background: #F5F5F5;
    padding: 4px 8px;
    img {
      border-radius: 3px;
      height: 48px;
      min-width: 48px;
    }
    .acticle-desc {
      font-size: 12px;
      color: #606266;
      line-height: 20px;
      margin-left:4px;
    }
  }
}
</style>
