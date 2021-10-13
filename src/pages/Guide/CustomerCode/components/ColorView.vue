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
          <div class="color-sel-base" @click="getMoreColor">
            <div class="color-sel-base-cont">
              <div :style="{background:showColor.mainColor}" class="color-base"></div>
              <div :style="{background:showColor.bgColor}" class="color-base"></div>
              <div :style="{background:showColor.strColor}" class="color-base"></div>
            </div>
            <span class="iconfont icon-ns-arrow-down select-color-icon"></span>
          </div>
        </div>
      </div>
      </el-form-item>
    </el-form>
    <el-dialog
      title="选择配色方案"
      :visible.sync="dialogVisible"
      width="720px">
      <div>
        <div class="dialog-subtitle">预置配色方案</div>
        <div class="color-sel dialog-color-sel">
          <div v-for="(item,index) in colorList" :key="index">
            <div :class="dialogIndex === index ? 'color-sel-base dialog-color-sel-base color-sel-base-user': 'color-sel-base dialog-color-sel-base'" @click="dialogIndexClick(index)">
              <div class="color-sel-base-cont">
                <div :style="{background:item.mainColor}" class="color-base"></div>
                <div :style="{background:item.bgColor}" class="color-base"></div>
                <div :style="{background:item.strColor}" class="color-base"></div>
                <div class="mask-view">
                  <span @click.stop="eidtColor(index)" class="mask-base-view mask-base-view-hover-edit">编辑</span>
                  <span @click.stop="setColor(index)" class="mask-base-view mask-base-view-hover-set">使用</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
          <!-- box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .05); -->
        <div class="dialog-subtitle">自定义配色方案</div>
        <div :class="isEdit ? 'color-sel-base custom-color color-sel-base-user' : 'color-sel-base custom-color'">
          <div class="color-sel-base-cont custom-color-cont">
            <div :style="{background:customColor.mainColor,border: editWhere === 1 && isEdit ? '5px solid #ffffff':''}" class="color-base" @click.stop="editClickColor(1)"></div>
            <div :style="{background:customColor.bgColor,border: editWhere === 2 && isEdit ? '5px solid #ffffff':''}" class="color-base"  @click.stop="editClickColor(2)"></div>
            <div :style="{background:customColor.strColor,border: editWhere === 3 && isEdit ? '5px solid #ffffff':''}" class="color-base"  @click.stop="editClickColor(3)"></div>
          </div>
        </div>
        <div>
          <span class="custom-color-text">主题色</span>
          <span class="custom-color-text">背景色</span>
          <span class="custom-color-text">文字色</span>
        </div>
      </div>
      <div class="color-picker">
        <Sketch v-model="colors"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <ns-button @click="dialogVisible = false">保存该配色</ns-button> -->
        <ns-button type="primary" @click="saveColor">使用该配色</ns-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sketch from './ColorPicker'
export default {
  name: 'colorView',
  components: {
    Sketch
  },
  props: {
    value: Object
  },
  computed: {
    showColor () {
      return this.value
    }
  },
  data () {
    return {
      colorIndex: 0,
      dialogIndex: 0,
      colorList: [
        {
          mainColor: '#F96C39',
          bgColor: '#FFA30E',
          strColor: '#FFFFFF'
        },
        {
          mainColor: '#FF544E',
          bgColor: '#FF8C5C',
          strColor: '#FFFFFF'
        },
        {
          mainColor: '#32A7FF',
          bgColor: '#D6EDFE',
          strColor: '#FFFFFF'
        },
        {
          mainColor: '#7234F0',
          bgColor: '#769EFF',
          strColor: '#FFFFFF'
        },
        {
          mainColor: '#804AC3',
          bgColor: '#1A0240',
          strColor: '#FFFFFF'
        },
        {
          mainColor: '#7FC3AD',
          bgColor: '#DFF2EE',
          strColor: '#FFFFFF'
        },
        {
          mainColor: '#E9607F',
          bgColor: '#FFE6E9',
          strColor: '#FFFFFF'
        },
        {
          mainColor: '#B9A873',
          bgColor: '#F1EFE2',
          strColor: '#FFFFFF'
        }
      ],
      dialogVisible: false,
      colors: {
        hex: '#FF3434',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
        rgba: { r: 247, g: 247, b: 247, a: 1 },
        a: 1
      },
      colorPicker: false,
      showMask: false,
      customColor: {
        mainColor: '#F96C39',
        bgColor: '#FFA30E',
        strColor: '#FFFFFF'
      },
      isEdit: false,
      editWhere: null
    }
  },
  watch: {
    colors: {
      handler (newValue, oldValue) {
        if (!this.isEdit) return
        if (this.editWhere === 1) this.customColor.mainColor = newValue.hex
        if (this.editWhere === 2) this.customColor.bgColor = newValue.hex
        if (this.editWhere === 3) this.customColor.strColor = newValue.hex
      },
      deep: true
    }
  },
  methods: {
    selctColor (item) {
      let index = -1
      for (let i = 0; i < this.colorList.length; i++) {
        let color = this.colorList[i]
        if (
          item.mainColor === color.mainColor &&
          item.bgColor === color.bgColor &&
          item.strColor === color.strColor
        ) {
          index = i
        }
      }
      if (index !== -1) {
        this.dialogIndex = index
        this.isEdit = false
      } else {
        this.dialogIndex = null
        this.isEdit = true
        this.customColor.mainColor = item.mainColor
        this.customColor.bgColor = item.bgColor
        this.customColor.strColor = item.strColor
      }
    },
    editClickColor (index) {
      if (!this.isEdit) return
      this.editWhere = index
    },
    setColor (index) {
      this.setCustomer(index)
      this.setShowColor(index)
      this.dialogIndex = index
      this.isEdit = false
    },
    eidtColor (index) {
      this.setCustomer(index)
      this.dialogIndex = null
      this.isEdit = true
      this.editWhere = 1
    },
    setShowColor (index) {
      const item = this.colorList[index]
      this.showColor.mainColor = item.mainColor
      this.showColor.bgColor = item.bgColor
      this.showColor.strColor = item.strColor
    },
    setCustomer (index) {
      const item = this.colorList[index]
      this.customColor.mainColor = item.mainColor
      this.customColor.bgColor = item.bgColor
      this.customColor.strColor = item.strColor
    },
    leaveMaskView () {
      this.showMask = false
    },
    showMaskView (index) {
      if (this.dialogIndex === index) {
        this.showMask = true
      }
    },
    saveColor () {
      if (this.isEdit) {
        this.showColor.mainColor = this.customColor.mainColor
        this.showColor.bgColor = this.customColor.bgColor
        this.showColor.strColor = this.customColor.strColor
      } else if (this.dialogIndex >= 0) {
        const item = this.colorList[this.dialogIndex]
        this.showColor.mainColor = item.mainColor
        this.showColor.bgColor = item.bgColor
        this.showColor.strColor = item.strColor
      }
      this.dialogVisible = false
    },
    colorClick (index) {
      this.colorIndex = index
    },
    getMoreColor () {
      this.dialogVisible = true
    },
    dialogIndexClick (index) {
      this.dialogIndex = index
      if (this.isEdit) this.isEdit = false
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
  cursor: pointer;
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
  position: relative;
}
.color-sel-base-cont {
  display: flex;
  flex-direction: row;
  width: 132px;
  height: 44px;
  border: 2px solid #979797;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
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
  box-sizing: border-box;
}
.dialog-subtitle {
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  margin-bottom: 16px;
}
.custom-color {
  width: 678px;
  height: 132px;
}

.custom-color-cont {
  width: 662px;
  height: 116px;
}

.custom-color-text {
  margin-top: 8px;
  display: inline-block;
  width: 33.33%;
  text-align: center;
  font-size: 14px;
  color: #8C8C8C;
  line-height: 22px;
}
.mask-view {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(151,151,151,0.6);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  font-size: 14px;
  color: #FFFFFF;
  align-items: center;
  opacity: 0;
}
.mask-base-view {
  width: 60px;
  height: 36px;
  border-radius: 2px;
  line-height: 36px;
  text-align: center;
  display: inline-block;
  opacity: 1;
}

.mask-base-view-hover-edit:hover {
  background: rgba(255,255,255,0.45);
}
.mask-base-view-hover-set:hover {
  background: rgba(255,255,255,0.45);
}
.color-sel-base-cont:hover .mask-view {
  opacity: 1;
}
.select-color-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  color: white;
  margin-top: -16px;
  margin-left: -8px;
  font-size: 16px;
}
</style>
