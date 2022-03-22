<template>
  <div class="tree-container">
    <el-input ref="quickText" v-model="shopTreePage.areaName" placeholder="请输入区域名称" clearable>
      <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name"/>
    </el-input>
    <el-scrollbar ref='pageLeft' wrapStyle="overflow-x:hidden;" style="padding-bottom: 10px;height:calc( 100% - 80px )" >
      <el-tree
        class="filter-tree"
        ref="shopTree"
        :data="digitalShopList"
        highlight-current
        node-key="id"
        :show-checkbox="false"
        :default-expand-all="false"
        :expand-on-click-node="false"
        :current-node-key="areaId"
        :default-expanded-keys="[areaId]"
        :filter-node-method="onFilterNode"
        :render-content="renderNode"
        @node-click="onClickNode"
        :class="[fuscous==='QA'?fuscousQA:fuscousIcon]"
      >
        <div class="subdivision-tree-node" slot-scope="{ node }">
          <span>{{node.label}}</span>
          <span v-if="node.label === '全部'">
          <el-tooltip content="查看所有的线下门店">
              <i class="question-circle"><Icon type="question-circle" /></i>
          </el-tooltip>
        </span>
        </div>
      </el-tree>
    </el-scrollbar>
    <el-pagination v-if='digitalShopList && digitalShopList.length' style='text-align: center' small
                    :total="shopTreePage.total"
                    :page-size="shopTreePage.size"
                    layout="prev, slot, next, jumper"
                    :current-page.sync="shopTreePage.page"
                    @current-change="initDigitalShopList">
      <span>{{shopTreePage.page + '/' + (Math.ceil(shopTreePage.total/ shopTreePage.size) || 1)}}</span>
    </el-pagination>
  </div>
</template>
<script>
export default {
  data () {
    return {
      shopTreePage: {
        total: 0,
        page: 1,
        size: 50,
        areaName: ''
      },
      digitalShopList: [],
      areaId: '',
      areaName: '',
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },
  props: ['value'],
  methods: {
    // 区域列表
    initDigitalShopList (page) {
      this.shopTreePage.page = page || 1
      var _this = this
      this.$http
        .fetch(_this.$api.guide.shop.findDigitalShopList, {
          start: (this.shopTreePage.page - 1) * this.shopTreePage.size,
          length: this.shopTreePage.size,
          searchMap: {
            areaName: this.shopTreePage.areaName
          }
        })
        .then(resp => {
          if (resp.success && resp.result !== null) {
            this.shopTreePage.total = Number(resp.result.recordsTotal)
            this.digitalShopList = resp.result.data
            if (this.digitalShopList && this.digitalShopList.length) {
              this.areaId = this.digitalShopList[0].id
              this.areaName = this.digitalShopList[0].label
              this.$emit('input', this.areaId)
              this.$emit('inputName', this.areaName)
              setTimeout(() => {
                this.$refs.shopTree.setCurrentKey(this.areaId)
              }, 2000)
            }
          }
        })
        .catch(resp => {
          _this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    onClickNode (data) {
      this.areaId = data.id
      this.areaName = data.label
      this.$emit('input', this.areaId)
      this.$emit('inputName', this.areaName)
    },
    renderNode (h, { node, data, store }) {
      return (
        <span
          style={`display: flex;
        align-items: center;`}
        >
          {data.id !== -1 ? <Icon class="icon" type="cate" /> : null}
          <span
            title={node.label}
            class={`area-tree__item`}
            style={`font-size: ${data.id === -1 ? 14 : 12}px;width: 80%;
            margin-left:3px;
            display: inline-block;
            text-overflow:ellipsis;
            white-space: nowrap;
            word-break:break-all;
            overflow: hidden;`}
          >
            {node.label}
          </span>
        </span>
      )
    },
    // 树节点过滤
    onFilterNode (value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) {
        return true
      }
      // 如果传入的value和data中的label相同说明是匹配到了
      if (data.label.indexOf(value) !== -1) {
        return true
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node)
    },
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode (value, data, node) {
      const level = node.level
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false
      }
      // 先取当前节点的父节点
      let parentData = node.parent
      // 遍历当前节点的父节点
      let index = 0
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.label.indexOf(value) !== -1) {
          return true
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent
        index++
      }
      // 没匹配到返回false
      return false
    }
  },
  mounted () {
    this.initDigitalShopList(1)
  },
  watch: {
    value (newVal) {
      this.areaId = newVal
    },
    'shopTreePage.areaName' (val) {
      this.$refs.shopTree.filter(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.tree-container {
  height: 100%;
  position: absolute;
  left: 5px;
  top: 5px;
  bottom: 5px;
  right: 5px;
  z-index: 2;
  overflow: hidden;
}
</style>
<style scoped>
.template-page__row-left >>> .el-pagination {
    border-radius: none;
    box-shadow: 0;
}
.fuscousQA >>>.el-tree-node__content:hover{
  color: #2153D4;
}
.fuscousIcon >>>.el-tree-node__content:hover{
  color: #1a9cfb;
}
</style>
