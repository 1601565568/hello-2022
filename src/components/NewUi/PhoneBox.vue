<template>
  <!-- <el-row :class='`collapse-content ${showBottom?"border-b":""}`'>
    <el-col :span='16' class='collapse-left'>
      <h3 class='collapse-title' v-if='title'>{{title}}</h3>
      <slot name='collapse-left'></slot>
    </el-col>
    <el-col :span='8' :class='`collapse-right ${!phoneTitle?"no-top":""}`' v-if='isShowPhone'>
      <div class='phone-title'>{{phoneTitle}}</div>
      <Phone>
        <div class='mobile-header' v-if='phoneBar'>
          <img src='@/assets/phoneBar.png' class='header-img'/>
          <span class='phone-bar'>{{phoneBar}}</span>
        </div>
        <slot name='collapse-right'></slot>
      </Phone>
      <slot name='collapse-right__bottom'></slot>
    </el-col>
  </el-row> -->
  <Box :title='title' :phoneTitle='phoneTitle' :showBottom='showBottom'>
    <template slot='collapse-left'>
      <slot name='collapse-left'></slot>
    </template>
    <template slot='collapse-right'>
      <div class='phone-title' v-if='phoneTitle'>{{phoneTitle}}</div>
      <Phone>
        <div class='mobile-header' v-if='phoneBar'>
          <img src='@/assets/phoneBar.png' class='header-img'/>
          <span class='phone-bar'>{{phoneBar}}</span>
        </div>
        <slot name='collapse-right'></slot>
      </Phone>
      <slot name='collapse-right__bottom'></slot>
    </template>
  </Box>
</template>
<script>
import Phone from './Phone'
import Box from './Box'
export default {
  data () {
    return {
      collapseList: [1],
      isOpen: true
    }
  },
  props: {
    isShowPhone: {
      type: Boolean,
      default: true
    },
    title: {
      type: String
    },
    phoneTitle: {
      type: String,
      default: '效果展示'
    },
    phoneBar: {
      type: String
    },
    showBottom: {
      type: Boolean,
      default: false
    }
  },
  components: { Phone, Box },
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
  }
  .phone-title {
    font-size: 16px;
    color: #262626;
    text-align: center;
    line-height: 24px;
    overflow: hidden;
    left: 0;
    right: 0;
    top: -36px;
    z-index: 999;
    font-weight: bold
  }
  .poster-set_content {
    display: flex;
    align-items: flex-start;
    padding: 16px 0;
    .yellow-point {
      display: inline-block;
      background: #F2AA18;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-right: 8px;
      line-height: 20px;
      position: relative;
      top: 6px;
    }
    .prompt-text {
      font-size: 12px;
      color: #595959;
      line-height: 20px;
    }
  }
  .mobile-header {
    position: relative;
    .header-img {
      width: calc( 100% + 2px );
      position: relative;
      top: -1px;
      left: -1px;
      display: block;
    }
    .phone-bar {
      position: absolute;
      text-align: center;
      position: absolute;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      left: 85px;
      right: 80px;
      top: 45%;
    }
  }
</style>
