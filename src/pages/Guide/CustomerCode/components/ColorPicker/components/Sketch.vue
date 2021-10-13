<template>
  <div role="application" aria-label="Sketch color picker" :class="['vc-sketch', disableAlpha ? 'vc-sketch__disable-alpha' : '']">
    <div class="vc-sketch-saturation-wrap">
      <saturation v-model="colors" @change="childChange"></saturation>
    </div>
    <div class="color-view">
      <div class="vc-sketch-sliders">
        <div class="vc-sketch-hue-wrap">
          <hue v-model="colors" @change="childChange"></hue>
        </div>
      </div>
    </div>
    <!-- <div class="color-view">
      <div class="vc-sketch-sliders">
        <div class="vc-sketch-alpha-wrap">
          <alpha v-model="colors" @change="childChange"></alpha>
        </div>
      </div>
    </div> -->
    <div class="vc-sketch-field" v-if="!disableFields">
      <div class="vc-sketch-field--double">
        <ed-in label="hex" labelText="HEX" :value="hex" @change="inputChange"></ed-in>
      </div>
      <div class="vc-sketch-field--single">
        <ed-in label="r" labelText="R" :value="colors.rgba.r" @change="inputChange"></ed-in>
      </div>
      <div class="vc-sketch-field--single">
        <ed-in label="g" labelText="G" :value="colors.rgba.g" @change="inputChange"></ed-in>
      </div>
      <div class="vc-sketch-field--single">
        <ed-in label="b" labelText="B" :value="colors.rgba.b" @change="inputChange"></ed-in>
      </div>
      <div class="vc-sketch-field--single" v-if="!disableAlpha">
        <ed-in label="a" labelText="Alpha" :value="colors.a" :arrow-offset="0.01" :max="1" @change="inputChange"></ed-in>
      </div>
    </div>
  </div>
</template>

<script>
import colorMixin from '../mixin/color'
import editableInput from './common/EditableInput.vue'
import saturation from './common/Saturation.vue'
import hue from './common/Hue.vue'
// import alpha from './common/Alpha.vue'

const presetColors = [
  '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
  '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2',
  '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF',
  'rgba(0,0,0,0)'
]

export default {
  name: 'Sketch',
  mixins: [colorMixin],
  components: {
    saturation,
    hue,
    'ed-in': editableInput
  },
  props: {
    presetColors: {
      type: Array,
      default () {
        return presetColors
      }
    },
    disableAlpha: {
      type: Boolean,
      default: true
    },
    disableFields: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hex () {
      let hex
      if (this.colors.a < 1) {
        hex = this.colors.hex8
      } else {
        hex = this.colors.hex
      }
      return hex.replace('#', '')
    },
    activeColor () {
      var rgba = this.colors.rgba
      return 'rgba(' + [rgba.r, rgba.g, rgba.b, rgba.a].join(',') + ')'
    }
  },
  methods: {
    handlePreset (c) {
      this.colorChange({
        hex: c,
        source: 'hex'
      })
    },
    childChange (data) {
      this.colorChange(data)
    },
    inputChange (data) {
      if (!data) {
        return
      }
      if (data.hex) {
        this.isValidHex(data.hex) && this.colorChange({
          hex: data.hex,
          source: 'hex'
        })
      } else if (data.r || data.g || data.b || data.a) {
        this.colorChange({
          r: data.r || this.colors.rgba.r,
          g: data.g || this.colors.rgba.g,
          b: data.b || this.colors.rgba.b,
          a: data.a || this.colors.rgba.a,
          source: 'rgba'
        })
      }
    }
  }
}
</script>

<style>
.vc-sketch {
  margin-bottom: 32px;
  margin-top: 32px;
  position: relative;
  width: 100%;
  height: 224px;
  /* padding: 10px 10px 0; */
  /* box-sizing: initial .; */
  background: #fff;
  display: flex;
  flex-direction: row;
  /* border-radius: 4px; */
  /* box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 8px 16px rgba(0, 0, 0, .15); */
}

.vc-sketch-saturation-wrap {
  width: 400px;
  height: 224px;
  border: 1px solid #979797;
  border-radius: 2px;
  position: relative;
}

.vc-sketch-controls {
  display: none;
  /* display: flex; */
}

.vc-sketch-sliders {
  width: 18px;
  height: 224px;
}

.vc-sketch-sliders .vc-hue,
.vc-sketch-sliders .vc-alpha-gradient {
  border-radius: 9px;
}

.vc-sketch-hue-wrap {
  position: relative;
  height: 100%;
  border-radius: 9px;
}

.vc-sketch-alpha-wrap {
  position: relative;
  height: 100%;
  border-radius: 9px;
  /* margin-top: 4px;
  overflow: hidden; */
}

.vc-sketch-color-wrap {
  width: 24px;
  height: 24px;
  position: relative;
  margin-top: 4px;
  margin-left: 4px;
  border-radius: 3px;
}

.vc-sketch-active-color {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15), inset 0 0 4px rgba(0, 0, 0, .25);
  z-index: 2;
}

.vc-sketch-color-wrap .vc-checkerboard {
  background-size: auto;
}

.vc-sketch-field {
  display: flex;
  padding-top: 4px;
  flex-direction: column;
  margin-left: 32px;
  /* display: none; */
}

.vc-sketch-field .vc-input__input {
  height: 32px;
  background: #FFFFFF;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  padding: 5px 8px;
  width: 80px;
  /* width:41px; */
  /* padding: 4px 0 3px 10%; */
  /* text-align: center; */
  /* width: 90%; */
  /* padding: 4px 0 3px 10%;
  border: none;
  box-shadow: inset 0 0 0 1px #ccc;
  font-size: 10px; */
}

.vc-sketch-field .vc-input__label {
  font-size: 14px;
  color: #262626;
  font-weight: 400;
  line-height: 32px;
  margin-left: 8px;
}

.vc-sketch-field--single {
  flex: 1;
  /* padding-left: 6px; */
}

.vc-sketch-field--double {
  flex: 2;
}

.vc-sketch-presets {
  margin-right: -10px;
  margin-left: -10px;
  padding-left: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.vc-sketch-presets-color {
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  display: inline-block;
  margin: 0 10px 10px 0;
  vertical-align: top;
  cursor: pointer;
  width: 16px;
  height: 16px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15);
}

.vc-sketch-presets-color .vc-checkerboard {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15);
  border-radius: 3px;
}

.vc-sketch__disable-alpha .vc-sketch-color-wrap {
  height: 10px;
}

.color-view {
  display: flex;
  margin-left: 32px;
}
</style>
