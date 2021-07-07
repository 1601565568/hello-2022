<template>
  <div class='recruiting-collapse'>
    <el-collapse :class='`common-collapse ${isOpen?"noOver":""}`' v-model='collapseList' @change='handleChange'>
      <el-collapse-item :title="title" :name="1">
        <el-row>
          <el-col :span='16' :class="[this.flag? 'collapse_left' : 'collapse-left']">
            <slot name='collapse-left'></slot>
          </el-col>
          <el-col :span='8' class='collapse-right'>
            <div class='phone-title'>{{phoneTitle}}</div>
            <Phone>
              <div class='mobile-header' v-if='phoneBar'>
                <img src='@/assets/phoneBar.png' class='header-img'/>
                <span class='phone-bar'>{{phoneBar}}</span>
              </div>
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
      collapseList: [1],
      isOpen: true
    }
  },
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    phoneTitle: {
      type: String,
      default: ''
    },
    phoneBar: {
      type: String
    }
  },
  components: { Phone },
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
  .common-collapse {
    margin-bottom: 16px;
  }
  .recruiting-collapse {
    padding-left: 16px;
    background-color: #fff;
  }
  .collapse-left, .collapse_left {
    padding-right: 40px;
  }
  .collapse_left{
    border-right: 1px solid #E8E8E8;
  }
  .collapse-right, .collapse_right {
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
  .collapse_right{
    border-left: none;
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
  .mobile-header {
    position: relative;
    .header-img {
      width: 100%;
      display: block;
    }
    .phone-bar {
      position: absolute;
      text-align: center;
      left: 0;
      right: 0;
      top: 45%;
    }
  }
</style>
