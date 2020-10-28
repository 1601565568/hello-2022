<template>
  <ns-select-tree  :label="label" placeholder="请选择分类" :data="treeData" :tree-props="treeProps"
                  v-model="treeSelectedValue" :rules='rules' :prop='prop' :disabled='disabled' :size="size">

  </ns-select-tree>
</template>
<script>
import nsSelectTree from '../NsSelectTree'

export default {
  components: {
    nsSelectTree
  },
  model: {
    prop: 'categoryPath',
    event: 'change'
  },
  props: {
    batch: {
      type: Boolean,
      default: false
    },
    categoryPath: String,
    label: {
      type: String,
      default: '文件夹：'
    },
    size: {
      type: String,
      default: 'xmd'
    },
    treeProps: {
      type: Object,
      default () {
        return {
          children: 'children',
          label: 'label',
          value: 'id'
        }
      }
    },
    getDirectoryTreeUrl: Object,
    rules: Array,
    prop: String,
    disabled: Boolean
  },
  data () {
    return {
      treeSelectedValue: '',
      treeData: [{
        id: '',
        label: '无'
      }]
    }
  },
  watch: {
    categoryPath (newValue) {
      this.treeSelectedValue = newValue
    },
    treeSelectedValue (newValue) {
      this.$emit('change', newValue)
    }
  },
  mounted () {
    if (this.batch) {
      this.init()
    }
  },
  destroyed () {
  },
  methods: {
    init () {
      this.$http.fetch(this.getDirectoryTreeUrl)
        .then(data => {
          this.treeData = this.treeData.concat(data.result)
          this.$nextTick(() => {
            this.treeSelectedValue = this.categoryPath
          })
        })
        .catch(error => {
          this.$notify.error('分类列表查询失败：' + (error && error.msg ? error.msg : '网络异常'))
        })
    }
  }
}
</script>
