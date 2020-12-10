<template>
  <div class="pageRightEdit">
    <el-checkbox
      class="checkbox checkboxAll"
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
      >全选</el-checkbox
    >
    <div class="addMenu"><i class="el-icon-plus"></i><span>新增菜单</span></div>
    <template v-for="(item, index) in data">
      <div class="checkboxWarpper" :key="index">
        <img class="draw" src="../../image/draw.png" />
        <el-checkbox
          class="checkbox"
          @change="onChangeCheckbox(item, index)"
          :value="formatCheckbox(item.status)"
          >{{ item.itemName }}</el-checkbox
        >
        <span
          class="editIcon"
          v-if="
            item.itemName === '总收益' || item.itemName === '本月收益和今日收益'
          "
          ><Icon type="edit"
        /></span>
      </div>
    </template>
    <el-dialog
      title="新增菜单"
      :visible.sync="addMenuShow"
      width="758px"
    >
      <AddMenu />
      <!-- <compileMenu
        :editDisabled="editDisabled"
        :editMenu="editMenu"
        ref="compileMenu"
      ></compileMenu> -->
      <div slot="footer" class="dialog-footer">
        <ns-button @click="cancel()">取 消</ns-button>
        <ns-button type="primary" @click="addMenuShowConfirm()"
          >确 定</ns-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import AddMenu from '../pageComponents/addMenu'
export default {
  components: { AddMenu },
  props: {
    childrenEditData: {
      type: Array
    }
  },
  data () {
    return {
      data: JSON.parse(JSON.stringify(this.childrenEditData)),
      checkAll: false,
      isIndeterminate: false,
      addMenuShow: true
    }
  },
  watch: {
    childrenEditData: {
      handler (newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          this.data = JSON.parse(JSON.stringify(newValue))
        }
      },
      deep: true,
      immediate: true
    },
    data: {
      handler (val) {
        this.$emit('change', val)
        this.formatCheckAllStatus(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    formatCheckbox (status) {
      return status === 1
    },
    onChangeCheckbox (item, index) {
      let setItem = JSON.parse(JSON.stringify(item))
      setItem.status = setItem.status === 1 ? 0 : 1
      this.$set(this.data, index, setItem)
    },
    formatCheckAllStatus (val) {
      let length = val.length
      let i = 0
      val.forEach(item => {
        if (item.status === 1) {
          i = i + 1
        }
      })
      if (i === length) {
        this.checkAll = true
        this.isIndeterminate = false
      } else if (i > 0 && i < length) {
        this.checkAll = false
        this.isIndeterminate = true
      } else {
        this.checkAll = false
        this.isIndeterminate = false
      }
    },
    handleCheckAllChange (val) {
      let arr = []
      arr = this.data.map(item => {
        return {
          ...item,
          status: val ? 1 : 0
        }
      })
      this.data = arr
    }
  }
}
</script>
<style>
.pageRightEdit .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #0091fa;
  border-color: #0091fa;
}
.pageRightEdit .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #0091fa;
  border-color: #0091fa;
}
.pageRightEdit .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #262626;
}
.pageRightEdit .el-radio__label,
.el-checkbox__label {
  font-size: 14px !important;
  color: #262626 !important;
}
.checkboxAll {
  font-weight: bold;
}
</style>
<style scoped lang="scss">
.checkbox {
  display: block;
  padding-top: 9px;
  height: 40px;
  margin-left: 0px;
}
.checkboxWarpper {
  position: relative;
  display: flex;
  align-items: center;
  .draw {
    width: 16px;
    height: 16px;
    margin-right: 24px;
  }
}
.checkboxWarpper .editIcon {
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translate(0%, -50%);
}
.addMenu {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 6px;
  cursor: pointer;
  color: #606266;
  border: 1px dashed #d9d9d9;
  span {
    display: inline-block;
    margin-left: 10px;
  }
  &:hover {
    border: 1px dashed #0091fa;
  }
}
</style>
