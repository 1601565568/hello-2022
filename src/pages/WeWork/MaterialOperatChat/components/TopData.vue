<template>
  <div class="material-data">
    <div class="top-view">
      <div class="title">
        附码图片累计数据
        <span class="sub-title">（数据截止昨日）</span>
      </div>
    </div>
    <div class="data-view">
      <el-row :gutter="15">
        <template v-for="item in list">
          <el-col :key="item.name" :span="6">
            <div class="base-cell" :class="item.claseName">
              <div class="text">{{ item.name }}</div>
              <div class="subTitle">昨日次数</div>
              <div class="number">{{ item.yData }}</div>
              <div class="subTitle">总次数</div>
              <div class="number">{{ item.data }}</div>
            </div>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopData',
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      defaultList: [
        { name: '发送次数', data: 0, yData: 0, claseName: 'one' },
        { name: '被浏览次数', data: 0, yData: 0, claseName: 'two' },
        { name: '转化订单数', data: 0, yData: 0, claseName: 'three' },
        { name: '转化金额', data: 0, yData: 0, claseName: 'four' }
      ]
    }
  },
  computed: {
    list () {
      return this.dataList.length > 0 ? this.dataList : this.defaultList
    }
  }
}
</script>

<style scoped lang="scss">
.material-data {
  background-color: white;
  padding-bottom: 24px;
  .top-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    height: 56px;
  }
  .title {
    font-size: 16px;
    color: #262626;
    line-height: 56px;
    font-weight: 500;
    padding-left: 16px;
  }
  .unDoneData {
    width: 116px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    font-size: 14px;
    color: #595959;
    text-align: center;
    line-height: 22px;
    font-weight: 400;
    line-height: 32px;
    margin-right: 16px;
    cursor: pointer;
  }
}
.data-view {
  margin-left: 16px;
  margin-right: 16px;
}
.base-cell {
  color: #ffffff;
  border-radius: 4px;
  display: flex;
  padding: 16px;
  flex-direction: column;
  .number {
    font-size: 24px;
    color: #ffffff;
    line-height: 32px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .subTitle {
    font-size: 12px;
    color: #ffffff;
    font-weight: 400;
  }
  .text {
    font-size: 16px;
    color: #ffffff;
    line-height: 24px;
    font-weight: 400;
    margin-bottom: 10px;
  }
}
.one {
  background-image: linear-gradient(270deg, #a0e35e 0%, #67c230 100%);
}
.two {
  background-image: linear-gradient(269deg, #4eb3fc 0%, #0091fa 100%);
}
.three {
  background-image: linear-gradient(270deg, #f7bd5b 0%, #f49f10 100%);
}
.four {
  background-image: linear-gradient(269deg, #8b4efc 0%, #6a00fa 100%);
}
</style>
