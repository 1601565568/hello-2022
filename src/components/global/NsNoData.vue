<template>
  <div :class="['noData-wrap--' + size]" class="noData-wrap" :style="{ 'height' : height + 'px'}">
    <div class="noData-wrap__content">
    <i :class="['icon-' + icon]" class="iconfont"></i>
    <p class="noData-wrap__text"><slot></slot></p>
    </div>
  </div>
</template>

<script>
/**
   * size,icon,height
   * @param {String} title   save/submit/determineine   save
   * 不开放的API  type、round
   */
export default {
  name: 'NsNoData',
  props: {
    size: {
      type: String,
      default: 'sm'
    },
    icon: {
      type: String,
      default: 'zanwushuju'
    },
    height: {
      type: String,
      default: null
    }
  }
}
</script>
<style scoped>
  @import "@/style/small/variables.pcss";
  @b noData-wrap {
    justify-content:center;
    color: var(--theme-font-color-secondary);
    display: flex;
    .iconfont {
      font-size: 70px;
    }
   @e content {
     align-self:center;
     text-align: center;
   }
   @e text{
      padding-top:10px;
      text-align: center;
    }

    @m sm {
     height: 150px;
    }
    @m md {
      height:500px;
    }
    @m lg {
      height:700px;
    }
    @m full {
      height:100%;
    }
  }
</style>
