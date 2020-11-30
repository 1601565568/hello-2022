<template>
  <div class='recruiting-collapse'>
    <el-collapse class='common-collapse' v-model='collapseList'>
      <el-collapse-item :title="title" :name="1">
        <el-row>
          <el-col :span='16' class='collapse-left'>
            <slot name='collapse-left'></slot>
          </el-col>
          <el-col :span='8' class='collapse-right'>
            <div class='phone-title'>{{phoneTitle}}</div>
            <Phone>
              <slot name='collapse-right'></slot>
            </Phone>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import Phone from './Phone'
export default {
  data () {
    return {
      collapseList: [1]
    }
  },
  props: {
    title: {
      type: String
    },
    phoneTitle: {
      type: String,
      default: '效果展示'
    }
  },
  components: { Phone }
}
</script>

<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .common-collapse {
    margin-bottom: 16px;
  }
  .recruiting-collapse {
    padding-left: 16px;
    background-color: #fff;
  }
  .collapse-left {
    padding-right: 40px;
  }
  .collapse-right {
    position: relative;
    &::before {
      position: absolute;
      content: ' ';
      border-left: 1px solid #E8E8E8;
      left:0;
      top: -56px;
      bottom: 0;
    }
  }
  .phone-title {
    font-size: 16px;
    color: #262626;
    text-align: center;
    line-height: 24px;
    position: absolute;
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
</style>
