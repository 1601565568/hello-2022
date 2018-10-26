<template>
  <el-cascader
    :placeholder="msg"
    :options="options"
    filterable
    clearable
    v-bind="$attrs"
    v-on="listeners"
    v-bind:value="value"
    :props="props"
  ></el-cascader>
</template>

<script>
  import store from 'store/dist/store.legacy.min.js'
  export default {
    name: 'NsArea',
    data () {
      return {
        options: [],
        msg: this.placeholder
      }
    },
    props: {
      placeholder: {
        type: String,
        default () {
          return this.$t('prompt.loading')
        }
      },
      value: {
        type: [Array],
        default () {
          return []
        }
      },
      props: {
        children: 'children',
        label: 'label',
        value: 'id',
        disabled: 'disabled'
      }
    },
    methods: {
      getArea () {
        let areaData = store.get('DS_area')
        if (areaData) {
          this.msg = this.$t('prompt.select')
          this.options = areaData
        } else {
          this.$http.fetch(this.$api.core.common.queryAreaAll).then(data => {
            this.msg = this.$t('prompt.select')
            this.options = data
            store.set('DS_area', data)
          })
        }
      }
    },
    created () {
      this.getArea()
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
