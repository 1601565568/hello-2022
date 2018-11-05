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
    <div @click="toggleShow" style="color:#1a9cfb;cursor:pointer;padding:2px 20px 5px;" onMouseEnter="this.style.color='#e6a23c'" onmouseleave="this.style.color='#1a9cfb'">{{showAll ? '取消' : '全部'}}</div>
    <div v-if="!showAll">
    <el-option v-for="item in options" :key="item[props.value]" :label="item[props.label]"
               :value="item[props.value]"  v-if="item[props.relevance]"></el-option>
    </div>
    <div v-else>
      <el-option v-for="item in options" :key="item[props.value]" :label="item[props.label]"
                 :value="item[props.value]"></el-option>
    </div>
  </el-select>
</template>

<script>
  export default {
    name: 'NsSelectRelevance',
    props: {
      url: Object,
      params: Object,
      isDefault: Boolean,
      value: '',
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
            value: 'value',
            relevance: 'relevance'
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
        showAll: false,
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
      toggleShow () {
        this.showAll = !this.showAll
      },
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
