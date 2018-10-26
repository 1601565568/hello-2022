<template>
  <div class="form-main">
    <el-tree :data="data" :props="defaultProps"
             show-checkbox
             @node-click="handleNodeClick">
      <div slot-scope="{node,data}" class="tree-node">
        <i class="tree-node__icon iconfont" v-if="data.keyWord" :class= data.keyWord></i>
        <span>{{ data.label}}</span>
      </div>
    </el-tree>

    <p class="text-info">Tree 父子级不互相关联，可多选--配置：show-checkbox、check-strictly、check-on-click-node、:expand-on-click-node="false"</p>
    <el-tree :data="data1"
             class="tree-strictly"
             show-checkbox
             check-on-click-node
             :expand-on-click-node="false"
             ref="strictlyTree"
             check-strictly
             @check-change="handleNodeClickStrictly">
    </el-tree>

    <p>{{checkedNode}}</p>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        data: [{
          id: 1,
          label: '一级 1',
          keyWord: 'icon-wenjianjia',
          children: [{
            label: '二级 1-1',
            keyWord: 'icon-yonghu2'
          }]
        }, {
          id: 2,
          label: '一级 2',
          keyWord: 'icon-wenjianjia',
          children: [{
            label: '二级 2-1',
            keyWord: 'icon-yonghu1'
          }, {
            label: '二级 2-2',
            keyWord: 'icon-yonghu1'
          }]
        }, {
          id: 3,
          label: '一级 3',
          keyWord: 'icon-wenjianjia',
          children: [{
            label: '二级 3-1',
            keyWord: 'icon-yonghu1'
          }, {
            label: '二级 3-2',
            keyWord: 'icon-yonghu1'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        data1: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 11,
            label: '二级 1-1',
            children: [{
              id: 111,
              label: '二级 1-1',
              children: [{
                id: 1111,
                label: '二级 1-1',
                children: [{
                  id: 11111,
                  label: '二级 1-1'
                }]
              }]
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 21,
            label: '二级 2-1'
          }, {
            id: 22,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 31,
            label: '二级 3-1'
          }, {
            id: 32,
            label: '二级 3-2'
          }]
        }],
        checkedNode: ''
      }
    },
    methods: {
      handleNodeClick (data) {
        console.log(data)
      },
      handleNodeClickStrictly (data) {
        this.checkedNode = this.$refs.strictlyTree.getCheckedNodes()
      }
    },
    created () {
    },
    mounted () {
    }
  }
</script>

<style scoped>
  @import "../../style/small/variables.pcss";





</style>
