<template>
  <div>
    <el-form-grid :size="size">
      <el-input type="number" v-model="paymentStart" :disabled="disabled">
        <span v-if="append" slot="append">{{append}}</span>
      </el-input>
    </el-form-grid>
    <el-form-grid>
      {{separator}}
    </el-form-grid>
    <el-form-grid :size="size">
      <el-input  type="number"  v-model="paymentEnd" :disabled="disabled">
        <span v-if="append" slot="append">{{append}}</span>
      </el-input>
    </el-form-grid>
  </div>
</template>

<script>
export default {
  name: 'NsNumber',
  props: {
    value: Array,
    size: {
      type: String,
      default: 'md'
    },
    min: Number,
    max: Number,
    separator: {
      type: String,
      default: '~'
    },
    append: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      paymentStart: this.value[0] ? this.value[0] : '',
      paymentEnd: this.value[1] ? this.value[1] : ''
    }
  },
  watch: {
    value: function (val) {
      this.paymentStart = val[0] ? val[0] : ''
      this.paymentEnd = val[1] ? val[1] : ''
    },
    paymentStart: function (val) {
      this.$emit('input', [val, this.paymentEnd])
    },
    paymentEnd: function (val) {
      this.$emit('input', [this.paymentStart, val])
    }
  },
  methods: {
    getText () {
      return this.paymentStart + this.separator + this.paymentEnd
    }
  }
}
</script>
