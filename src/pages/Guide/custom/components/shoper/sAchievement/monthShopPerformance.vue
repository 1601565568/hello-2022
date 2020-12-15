<template>
  <CardTitle title="门店业绩" v-if="show">
    <img slot="image" class="dataIcon" src="../../../image/s-dataIcon.png" />
    <div slot="content" class="guideAchievement">
      <div
        class="total-revenue profit"
        v-if="editData[0] && editData[0].status === 1"
      >
        <div class="text">总收益(元)</div>
        <div class="number">0</div>
      </div>
      <div class="guideAchievement-profit">
        <div class="profit" v-if="editData[1] && editData[1].status === 1">
          <div class="text">销售提成（元）</div>
          <div class="number">0</div>
        </div>
        <div class="profit" v-if="editData[2] && editData[2].status === 1">
          <div class="text">招募会员（元）</div>
          <div class="number">0</div>
        </div>
        <div class="profit" v-if="editData[3] && editData[3].status === 1">
          <div class="text">新加好友（元）</div>
          <div class="number">0</div>
        </div>
      </div>
      <div class="srollView">
        <div
          class="srollView-list__warpper"
          v-if="srollViewList.length > 1"
          :style="{ width: srollViewWidth + 'px' }"
        >
          <template v-for="(item, index) in srollViewList">
            <div class="srollView-list" :key="index">
              <div class="srollView-list__title">
                {{ item.itemName }}（完成： - ）
              </div>
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
          </template>
        </div>
        <div v-else class="list__warpper">
          <template v-for="(item, index) in srollViewList">
            <div class="srollView-list" :key="index">
              <div class="srollView-list__title">
                {{ item.itemName }}（完成： - ）
              </div>
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
          </template>
        </div>
      </div>
    </div>
  </CardTitle>
</template>
<script>
import CardTitle from './cardTitle'
export default {
  name: 'monthShopPerformance',
  components: { CardTitle },
  props: {
    editData: {
      type: Array
    }
  },
  data () {
    return {
      show: true,
      srollViewList: []
    }
  },
  computed: {
    srollViewWidth: function () {
      if (this.srollViewList.length === 0) {
        return 0
      } else {
        return (
          this.srollViewList.length * 230 +
          24 +
          8 * this.srollViewList.length -
          1
        )
      }
    }
  },
  watch: {
    editData: {
      handler (newVal) {
        let length = newVal.length
        let i = 0
        newVal.forEach(item => {
          if (item.status === 1) {
            i = i + 1
          }
        })
        this.show = i <= length && i > 0
        this.getScollList()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getScollList () {
      let arr = [
        'sales-amount',
        'member-recruit-count',
        'add-friend-reward-count'
      ]
      let newArr = []
      for (let i = 0; i < this.editData.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (
            arr[j] === this.editData[i].itemCode &&
            this.editData[i].status === 1
          ) {
            newArr.push(this.editData[i])
          }
        }
      }
      this.srollViewList = newArr
    }
  }
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
    width: 730px;
    display: flex;
    padding: 0 16px;
  }
  .list__warpper {
    width: 100%;
    display: flex;
    padding: 0 12px;
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
        color: #3bb200;
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
