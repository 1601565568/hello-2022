<template>
  <div class='recruiting-collapse'>
    <el-collapse :class='`common-collapse ${isOpen?"noOver":""}`' v-model='collapseList' @change='handleChange'>
      <el-collapse-item :title="title" :name="1" :disabled='disabled'>
        <template slot='title'>
          <slot name='title'></slot>
        </template>
        <PhoneBox :phoneTitle='phoneTitle' :phoneBar='phoneBar' :isShowPhone='isShowPhone'>
          <template slot='collapse-left'>
            <slot name='collapse-left'></slot>
          </template>
          <template slot='collapse-right'>
            <slot name='collapse-right'></slot>
          </template>
          <template slot='collapse-right__bottom'>
            <slot name='collapse-right__bottom'></slot>
          </template>
        </PhoneBox>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import PhoneBox from './PhoneBox'
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
    // 是否禁用下拉
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: { PhoneBox },
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
</style>
