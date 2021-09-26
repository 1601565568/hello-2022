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
          <div v-for="(item,index) in colorList.slice(0, 3)" :key="index">
            <div :class="colorIndex === index ? 'color-sel-base color-sel-base-user': 'color-sel-base'" @click="colorClick(index)">
              <div class="color-sel-base-cont">
                <div :style="{background:item.one}" class="color-base"></div>
                <div :style="{background:item.two}" class="color-base"></div>
                <div :style="{background:item.three}" class="color-base"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="color-more" @click="getMoreColor">更多配色方案</div>
      </div>
      </el-form-item>
    </el-form>
    <el-dialog
      title="选择配色方案"
      :visible.sync="dialogVisible"
      width="720px">
      <div>
        <div class="dialog-subtitle">选择配色方案</div>
        <div class="color-sel dialog-color-sel">
          <div v-for="(item,index) in colorList" :key="index">
            <div :class="dialogIndex === index ? 'color-sel-base dialog-color-sel-base color-sel-base-user': 'color-sel-base dialog-color-sel-base'" @click="dialogIndexClick(index)">
              <div class="color-sel-base-cont">
                <div :style="{background:item.one}" class="color-base"></div>
                <div :style="{background:item.two}" class="color-base"></div>
                <div :style="{background:item.three}" class="color-base"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="dialog-subtitle">自定义配色方案</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="dialogVisible = false">保存该配色</ns-button>
        <ns-button type="primary" @click="dialogVisible = false">使用该配色</ns-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'colorView',
  data () {
    return {
      colorIndex: 0,
      dialogIndex: null,
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
        },
        {
          one: '#FFB6C1',
          two: '#FFC0CB',
          three: '#DC143C'
        }
      ],
      dialogVisible: false
    }
  },
  methods: {
    colorClick (index) {
      this.colorIndex = index
    },
    getMoreColor () {
      this.dialogVisible = true
    },
    dialogIndexClick (index) {
      this.dialogIndex = index
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
.dialog-color-sel {
  flex-wrap: wrap;
}

.color-sel-base {
  width: 148px;
  height: 60px;
  border: 2px solid #EEEEEE;
  border-radius: 4px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.color-sel-base-cont {
  display: flex;
  flex-direction: row;
  width: 132px;
  height: 44px;
  border: 2px solid #979797;
  border-radius: 2px;
}

.dialog-color-sel-base {
  margin-bottom: 16px;
}
.color-sel-base-user {
  border: 2px solid #0392FB;
}
.color-base {
  width: 33.33%;
  height: 100%;
}
.dialog-subtitle {
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  margin-bottom: 16px;
}
</style>
