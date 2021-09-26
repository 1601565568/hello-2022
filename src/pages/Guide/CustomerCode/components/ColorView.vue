<template>
  <div class="item-view">
    <el-form
      label-width="100px"
      label-position="left"
      size="medium"
      class="normal-from">
      <el-form-item
        label="选择配色方案"
        class="larger-item"
      >
      <div class="color-view">
        <div class="color-sel">
          <div v-for="(item,index) in colorList" :key="index">
            <div :class="colorIndex === index ? 'color-sel-base color-sel-base-user': 'color-sel-base'" @click="colorClick(index)">
              <div :style="{background:item.one}" class="color-base"></div>
              <div :style="{background:item.two}" class="color-base"></div>
              <div :style="{background:item.three}" class="color-base"></div>
            </div>
          </div>
        </div>
        <div class="color-more" @click="getMoreColor">更多配色方案</div>
      </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'colorView',
  data () {
    return {
      colorIndex: 0,
      colorList: [
        {
          one: '#FFB6C1',
          two: '#FFC0CB',
          three: '#DC143C'
        },
        {
          one: '#FFB6C1',
          two: '#FFC0CB',
          three: '#DC143C'
        },
        {
          one: '#FFB6C1',
          two: '#FFC0CB',
          three: '#DC143C'
        }
      ]
    }
  },
  methods: {
    colorClick (index) {
      this.colorIndex = index
    },
    getMoreColor () {
    }
  }
}
</script>

<style scoped>
.item-view {
  margin-top: 24px;
  margin-bottom: 24px;
}
.color-view {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.color-more {
  font-size: 14px;
  color: #0392FB;
  line-height: 22px;
}
.color-sel {
  display: flex;
  flex-direction: row;
}

.color-sel-base {
  display: flex;
  flex-direction: row;
  width: 148px;
  height: 60px;
  border: 2px solid #EEEEEE;
  border-radius: 4px;
  margin-right: 16px;
}
.color-sel-base-user {
  border: 2px solid #0392FB;
}
.color-base {
  width: 33.33%;
  height: 100%;
}
</style>
