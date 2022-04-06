<template>
  <div class='detail-container'>
    <h3 class='header-text'>
      <img :src='backIcon' class='back-icon' @click='handleBack'/>
      朋友圈详情
    </h3>
    <div class='container detail'>
      <EmojiText :text='data.activityIntroductionHtml' pre='EMOJI_'/>
      <div class='date'>
        <div>2020/07/18 12:00</div>
        <ns-button type='text'>
          <span class="iconfont icon-kejiankehu"></span>
          可见客户
        </ns-button>
      </div>
    </div>
    <div class='list detail'>

    </div>
  </div>
</template>
<script>
import Detail from './src/Detail'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default Detail
</script>
<style lang="scss" scoped>

</style>
