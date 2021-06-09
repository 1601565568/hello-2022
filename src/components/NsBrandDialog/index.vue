<template>
  <el-dialog
    :lock-scroll="false"
    title="选择品牌"
    width="400px"
    :append-to-body="appendToBody"
    :visible="visible"
    @close="close"
  >
    <el-input placeholder="请输入品牌名称" v-model="searchName">
      <Icon type="ns-search-copy" slot="suffix" style="font-size: 24px; margin-top: 2px"></Icon>
    </el-input>
    <el-radio-group v-model="brandId">
      <el-radio
        v-for="item in brandList"
        :key="item.brandId"
        :label="item.brandId"
      >
        {{item.brandName}}
      </el-radio>
    </el-radio-group>
    <div slot="footer" class="dialog-footer">
      <ns-button @click="close">取 消</ns-button>
      <ns-button type="primary" @click="confirm">确 定</ns-button>
    </div>
  </el-dialog>
</template>

<script>
/**
 * 品牌选择弹窗
 */
export default {
  props: {
    visible: Boolean,
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    brandList () {
      const brands = this.$store.state.user.remumber.remumber_login_info.productConfig.brands
      if (this.searchName) {
        return brands.filter(item => item.brandName.indexOf(this.searchName) > -1)
      }
      return brands
    }
  },
  data () {
    return {
      searchName: '',
      brandId: ''
    }
  },
  methods: {
    close () {
      this.searchName = ''
      this.$emit('update:visible', false)
    },
    confirm () {
      this.close()
      this.$emit('confirm', this.brandId)
    }
  }
}
</script>

<style scoped>
>>> .el-input__suffix::before {
  display: none;
}

>>> .el-radio__input.is-checked + .el-radio__label {
  color: #606266;
}

>>> .el-radio {
  margin-top: 8px;
  line-height: 32px !important;
}

>>> .el-radio__label {
  font-size: 14px;
}

.el-radio-group {
  .el-radio {
    max-width: 100%;
    display: block;
    padding-left: 8px;
  }
}
</style>
