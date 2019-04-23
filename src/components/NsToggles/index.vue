<template>
  <div class="tmp-toggles">
    <div class="tmp-choose__content"  ref="toggleContent">
      <slot></slot>
    </div>
    <div class="tmp-toggles__footer" v-show="isOverflow"
         @click="handleToggleFooter"
         @mouseenter="hovering = true"
         @mouseleave="hovering = false">
      <transition name="arrow-slide">
        <i :class="[toggleIconClass, { 'hovering': hovering }]"></i>
      </transition>
      <transition name="text-slide">
        <span v-show="hovering">{{ controlText }}</span>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusToggles',
  data () {
    return {
      isExpanded: false,
      isOverflow: false,
      hovering: false
    }
  },
  props: {
    maxHeight: {
      type: Number,
      default: 180
    }
  },
  computed: {
    // 选择商品 列表展开收缩切换结构 状态值
    toggleIconClass () {
      return this.isExpanded ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
    },
    controlText () {
      return this.isExpanded ? '收缩' : '展开'
    }
    // 选择商品 列表展开收缩切换结构 状态值/end
  },
  methods: {
    showToggleModel () {
      if (this.$refs.toggleContent.clientHeight > this.maxHeight || this.$refs.toggleContent.clientHeight === 0) {
        // 设置内容区域高度超出隐藏
        this.$refs.toggleContent.style.overflow = 'hidden'
        this.$refs.toggleContent.style.maxHeight = this.maxHeight + 'px'
        // 显示底部
        this.isOverflow = true
      }
    },
    handleToggleFooter () {
      this.isExpanded = !this.isExpanded
      if (this.isExpanded) {
        this.$refs.toggleContent.removeAttribute('style')
      } else {
        this.$refs.toggleContent.style.overflow = 'hidden'
        this.$refs.toggleContent.style.maxHeight = this.maxHeight + 'px'
      }
    }
  },
  mounted () {
    this.showToggleModel()
  }
}
</script>

<style scoped>
  @import "../../style/small/variables.pcss";
  @component-namespace tmp{
    @b toggles {
      margin-top: var(--default-margin-small);
      @e footer {
        border-top: solid 1px var(--theme-base-border-color-primary);
        height: 30px;
        box-sizing: border-box;
        background-color: var(--theme-bg-color-primary);
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        text-align: center;
        color: var(--theme-font-color-secondary);
        cursor: pointer;
        position: relative;

        i {
          position: absolute;
          font-size: var(--default-font-size-small);
          line-height: 30px;
          transition: .3s;
          &.hovering {
            transform: translateX(-24px);
          }
        }
        span {
          position: absolute;
          transform: translateX(-10px);
          font-size: var(--default-font-size-small);
          line-height: 30px;
          transition: .3s;
          display: inline-block;
        }

        &:hover {
          color: var(--theme-color-primary);
        }

        & .text-slide-enter,
        & .text-slide-leave-active {
          opacity: 0;
          transform: translateX(10px);
        }

      }
    }
    @b choose {
      @e goods {
        margin: var(--default-margin-base) 0 0;
        padding-left: var(--default-padding-base);
        background-color: var(--theme-bg-color-primary);
        li {
          list-style: none;
          .g-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 90%;
            display: inline-block;
            vertical-align: top;
          }
          i {
            color: var(--theme-color-primary);
            display: none;
          }
          &:hover {
            i {
              display: inline-block;
              cursor: pointer;
            }
          }
        }
      }
      @e result {
        .title {
          margin: 0;
          font-size: var(--default-font-size-small);
          color: #999
        }
        @b toggles {
          @e goods {
            background-color: transparent;
            padding: 0;
            li {
              padding-right: 20px;
              position: relative;
              .g-name {
                max-width: 100%
              }
              i {
                position: absolute;
                display: inline-block;
                right: 0;
                top: 0
              }
            }
          }
        }
      }
    }
  }

</style>
