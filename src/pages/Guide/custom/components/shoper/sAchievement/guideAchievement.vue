<template>
  <CardTitle title="门店业绩">
    <img slot="image" class="dataIcon" src="../../../image/s-dataIcon.png" />
    <div slot="content" class="guideAchievement">
      <div class="total-revenue profit">
        <div class="text">总收益(元)</div>
        <div class="number">0</div>
      </div>
      <div class="guideAchievement-profit">
        <div class="profit">
          <div class="text">销售提成（元）</div>
          <div class="number">0</div>
        </div>
        <div class="profit">
          <div class="text">招募会员（元）</div>
          <div class="number">0</div>
        </div>
        <div class="profit">
          <div class="text">新加好友（元）</div>
          <div class="number">0</div>
        </div>
      </div>
      <div class="srollView">
        <div class="srollView-list__warpper">
          <div class="srollView-list">
            <div class="srollView-list__title">完成销售（完成： - ）</div>
            <div class="srollView-list__number"><span>0</span>/0</div>
            <div class="srollView-list__progress"></div>
            <div class="srollView-list__line"></div>
            <div class="srollView-list__store">
              <div>
                <img
                  class="allStaff"
                  src="../../../image/allStaff.png"
                />全店员工统计
              </div>
              <img src="../../../image/arrowRightIcon.png" />
            </div>
          </div>
          <div class="srollView-list">
            <div class="srollView-list__title">招募新客户（完成： - ）</div>
            <div class="srollView-list__number"><span>0</span>/0</div>
            <div class="srollView-list__progress"></div>
            <div class="srollView-list__line"></div>
            <div class="srollView-list__store">
              <div>
                <img
                  class="allStaff"
                  src="../../../image/allStaff.png"
                />全店员工统计
              </div>
              <img src="../../../image/arrowRightIcon.png" />
            </div>
          </div>
          <div class="srollView-list">
            <div class="srollView-list__title">新加好友（完成： - ）</div>
            <div class="srollView-list__number"><span>0</span>/0</div>
            <div class="srollView-list__progress"></div>
            <div class="srollView-list__line"></div>
            <div class="srollView-list__store">
              <div>
                <img
                  class="allStaff"
                  src="../../../image/allStaff.png"
                />全店员工统计
              </div>
              <img src="../../../image/arrowRightIcon.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </CardTitle>
</template>
<script>
import CardTitle from './cardTitle'
export default {
  components: { CardTitle }
}
</script>

<style scoped lang="scss">
.guideAchievement {
  margin-bottom: 8px;
  color: #262626;
  background: #fff;
  .guideAchievement-title {
    padding: 0 16px;
    display: flex;
    align-items: center;
    height: 55px;
    font-size: 17px;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 8px;
    .dataIcon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    span {
      font-size: 17px;
    }
  }
  .profit {
    height: 67px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .total-revenue {
    padding: 0 16px;
  }
  .text {
    font-size: 12px;
  }
  .number {
    font-size: 20px;
    color: #ff532a;
  }
  .guideAchievement-profit {
    display: flex;
    margin-bottom: 8px;
    > div {
      position: relative;
      padding-left: 16px;
      flex: 1;
      &::before {
        content: '';
        position: absolute;
        width: 1px;
        left: 0;
        height: 32px;
        background: #e8e8e8;
      }
    }
    > div:nth-of-type(1)::before {
      display: none;
    }
  }
  .srollView-list__store {
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      display: flex;
      align-items: center;
    }
    .allStaff {
      margin-right: 6px;
      width: 16px;
      height: 16px;
    }
  }
  .srollView {
    overflow-x: scroll;
    overflow-y: hidden;
    padding-bottom: 12px;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 100px;
      background: rgba(38, 38, 38, 0.45);
    }
  }
  .srollView-list__warpper {
    width: 706px;
    display: flex;
    padding: 0 16px;
  }
  .srollView-list {
    padding: 12px 16px;
    margin-right: 8px;
    flex: 1;
    height: 142px;
    background: #f5f5f5;
    border-radius: 4px;
    &:last-child {
      margin-right: 0;
    }
    .srollView-list__title {
      margin-bottom: 7px;
      font-size: 12px;
      color: #595959;
    }
    .srollView-list__number {
      font-size: 12px;
      color: #8c8c8c;
      margin-bottom: 13px;
      span {
        font-size: 20px;
        color:#3BB200;
      }
    }
    .srollView-list__progress {
      height: 4px;
      background: #e8e8e8;
      border-radius: 4px;
    }
    .srollView-list__line {
      margin-top: 16px;
      margin-bottom: 12px;
      width: 100%;
      height: 1px;
      background: #e8e8e8;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 1px;
        top: 0;
        right: -16px;
        background: #e8e8e8;
      }
      &::before {
        content: '';
        position: absolute;
        width: 16px;
        height: 1px;
        top: 0;
        left: -16px;
        background: #e8e8e8;
      }
    }
  }
}
</style>
