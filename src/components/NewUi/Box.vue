<template>
  <el-row :class='`collapse-content ${showBottom?"border-b":""}`'>
    <el-col :span='16' class='collapse-left'>
      <h3 class='collapse-title' v-if='title'>{{title}}</h3>
      <slot name='collapse-left'></slot>
    </el-col>
    <el-col :span='8' :class='`collapse-right ${!phoneTitle?"no-top":""} ${noborder?"noborder":""}`'>
      <slot name='collapse-right'></slot>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data () {
    return {
      collapseList: [1],
      isOpen: true
    }
  },
  props: {
    title: {
      type: String
    },
    phoneTitle: {
      type: String,
      default: '效果展示'
    },
    showBottom: {
      type: Boolean,
      default: false
    },
    noborder: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChange (value) {
      const result = !!value.length
      if (result) {
        setTimeout(() => {
          this.isOpen = !!value.length
        }, 500)
      } else {
        this.isOpen = result
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .collapse-content {
    padding-bottom: 24px;
    position: relative;
    &::after {
      clear: both;
    }
    &.border-b::before {
      content: " ";
      background: #fff;
      height: 24px;
      position: absolute;
      display: block;
      z-index: 9;
      left:0;
      right: 42px;
      bottom: 0;
      border-bottom:1px solid #E8E8E8;
    };
  }
  .collapse-title {
    font-size: 14px;
    color: #303133;
    line-height: 22px;
    padding: 13px 0 29px 0;
  }
  .collapse-left {
    padding-right: 40px;
  }
  .collapse-right {
    &::before {
      position: absolute;
      content: ' ';
      border-left: 1px solid #E8E8E8;
      left:66.7%;
      top: -56px;
      bottom: 0;
    }
    &.no-top::before {
      position: absolute;
      content: ' ';
      border-left: 1px solid #E8E8E8;
      left:66.7%;
      top: 0px;
      bottom: 0;
    }
    &.noborder:before {
      border:none;
    }
  }
</style>
