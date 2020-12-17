<template>
  <!-- 导购工作台业绩 -->
  <div class="D-achievement__warpper">
    <div class="D-achievement__title">业绩展示</div>
    <div class="D-achievement__list" v-if="show">
      <div class="D-achievement__row" v-if="editData[0] && editData[0].status === 1">
        <div class="D-achievement__row__title">今日收益（元）</div>
        <div class="D-achievement__row__warpper">
          <span class="D-achievement__row__number">0</span>
        </div>
      </div>
      <div class="D-achievement__row" v-if="editData[0] && editData[0].status === 1">
        <div class="D-achievement__row__title">本月收益（元）</div>
        <div class="D-achievement__row__warpper">
          <span class="D-achievement__row__number">0</span>
        </div>
      </div>
      <div class="D-achievement__row" v-if="editData[1] && editData[1].status === 1">
        <div class="D-achievement__row__title">今日销售（元）</div>
        <div class="D-achievement__row__warpper">
          <span class="D-achievement__row__number">0</span>
        </div>
      </div>
      <div class="D-achievement__row" v-if="editData[2] && editData[2].status === 1">
        <div class="D-achievement__row__title">今日招募（人）</div>
        <div class="D-achievement__row__warpper">
          <span class="D-achievement__row__number">0</span><span>/ -</span>
        </div>
      </div>
      <div class="D-achievement__row" v-if="editData[3] && editData[3].status === 1">
        <div class="D-achievement__row__title">今日收益（元）</div>
        <div class="D-achievement__row__warpper">
          <span class="D-achievement__row__number">0</span><span>/ -</span>
        </div>
      </div>
    </div>
    <!-- {{editData}} -->
  </div>
</template>
<script>
import componentData from '../../mixins/componentData.js'
export default {
  name: 'performance',
  mixins: [componentData]
}
</script>
<style scoped lang="scss">
.D-achievement__warpper {
  background: #fff;
  padding: 0 16px;
  padding-bottom: 4px;
  margin-bottom: 8px;
  .D-achievement__title {
    height: 56px;
    line-height: 56px;
    font-size: 17px;
    color: #262626;
    font-weight: bold;
  }
  .D-achievement__list {
    display: flex;
    flex-wrap: wrap;
    .D-achievement__row {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 50%;
      height: 65px;
      margin-bottom: 4px;
      &:nth-of-type(2n) {
        position: relative;
        padding-left: 16px;
        &::after {
          position: absolute;
          content: '';
          left: 0;
          top: 0%;
          transform: translate(0%, 50%);
          width: 1px;
          height: 32px;
          background: #e8e8e8;
        }
      }
      .D-achievement__row__title {
        font-size: 12px;
        line-height: 20px;
        color: #262626;
      }
      .D-achievement__row__warpper {
        display: flex;
        align-items: center;
      }
      .D-achievement__row__number {
        font-size: 17px;
        font-weight: bold;
        color: #0091fa;
      }
    }
  }
}
</style>
