<template>
  <CardTitle title="裂变大师活动新增趋势">
    <img
      slot="image"
      class="dataIcon"
      src="../../../image/customerCodeIcon.png"
    />
    <div slot="cardTitleother" class="cardTitleother">
      <p>近7天</p>
      <p>近30天</p>
    </div>
    <div slot="content" class="customerCodeChat">
      <img src="../../../image/eachart.jpg" />
    </div>
  </CardTitle>
</template>
<script>
import CardTitle from './cardTitle'
export default {
  name: 'guestCodeTrending',
  components: { CardTitle }
}
</script>
<style lang="scss" scoped>
.cardTitleother {
  display: flex;
  height: 100%;
  align-items: center;
  font-size: 15px;
  color: #595959;
  p {
    height: 100%;
    line-height: 3.5;
    text-align: center;
    &:first-child {
      color: #0091fa;
      position: relative;
      &::before {
        position: absolute;
        content: '';
        width: 40px;
        height: 2px;
        left: 0;
        bottom: 0;
        background: #0091fa;
      }
    }
    &:last-child {
      margin-left: 25px;
    }
  }
}
.customerCodeChat {
  padding: 16px;
  img {
    width: 100%;
  }
}
</style>
