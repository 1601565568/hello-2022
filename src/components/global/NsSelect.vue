<template>
  <el-select ref="nsselect"
             v-bind:value="currentValue"
             v-bind="$attrs"
             :placeholder="placeholder"
             :size="size"
             :disabled="disabled"
             :multiple="multiple"
             :multiple-limit="multipleLimit"
             :filterable="filterable"
             :clearable="clearable"
             v-on="listeners">
    <el-option v-for="item in options" :key="item[props.value]" :label="item[props.label]"
               :value="item[props.value]"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'NsSelect',
  props: {
    url: Object,
    params: Object,
    isDefault: Boolean,
    value: ,
    data: {
      type: [Array],
      default: function () {
        return []
      }
    },
    props: {
      type: Object,
      default: function () {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    clearable: Boolean,
    filterable: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    multiple: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    multipleLimit: {
      type: Number,
      default: function () {
        return 0
      }
    },
    size: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: this.data,
      // 双向绑定值-必须
      currentValue: this.value
    }
  },
  watch: {
    currentValue: function (val) {
      this.$emit('input', val)
    },
    value: function (val) {
      this.currentValue = val
    }
  },
  methods: {
    getText (format) {
      return this.$refs.nsselect.getText(format)
    },
    refresh () {
      if (this.url) {
        this.loadOptions(this.options, this.url)
      }
    },
    /**
       * 是否选中默认值
       */
    selectDefault () {
      // 是否选中默认值
      if (this.isDefault) {
        this.options.forEach((option) => {
          if (option.isDefault === 1) {
            this.currentValue = option.value
          }
        })
      }
    },
    /**
       * 异步加载下拉数据
       */
    loadOptions (data, url) {
      data.splice(0)
      this.$http.fetch(url, this.params).then((resp) => {
        this.options = resp.result ? resp.result : []
        this.selectDefault()
      }).catch((resp) => {
      })
    }
  },
  created () {
    if (this.url) {
      this.loadOptions(this.options, this.url)
    }
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners
      }
    }
  }
}
</script>
