<template>
  <div class="pageRightEdit" :class="[fuscous==='QA'?fuscousQA:fuscousIcon]">
    <div class="checkboxWarpper">
      <el-checkbox
        class="checkbox checkboxAll"
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        >全选</el-checkbox
      >
    </div>
    <div class="addMenu" @click="onAddMenu">
      <i class="el-icon-plus"></i><span>新增菜单</span>
    </div>
    <draggable v-model="data" animation="300" handle=".draw">
      <transition-group>
        <template v-for="(item, index) in data">
          <div class="checkboxWarpper" :key="index">
            <img class="draw" src="../../image/draw.png" />
            <el-checkbox
              class="checkbox"
              @change="onChangeCheckbox(item, index)"
              :value="formatCheckbox(item.status)"
              >{{ item.itemName }}</el-checkbox
            >
            <el-tooltip
              v-if="item.editable === 1"
              effect="dark"
              content="编辑"
              placement="top"
              class="editIcon"
            >
              <span @click="onEditMenu(item.info, index)"
                ><Icon type="edit"/></span
            ></el-tooltip>
            <el-tooltip
              v-if="item.editable === 1"
              effect="dark"
              content="删除"
              placement="top"
              class="editIcon code-delete"
            >
              <span @click="onEditDelMenu(index)"
                ><Icon type="delete"
              /></span>
              ></el-tooltip
            >
            <el-tooltip
              v-if="
                item.itemName === '切换账户'
              "
              effect="dark"
              content="编辑"
              placement="top"
            >
              <span class="editIcon" @click="onPageRewardSetting(item)"
                ><Icon type="edit"
              /></span>
            </el-tooltip>

            <!-- <span
              class="editIcon code-delete"
              @click="onEditDelMenu(index)"
              v-if="item.editable === 1"
            >
              <Icon type="delete" />
            </span> -->
          </div>
        </template>
      </transition-group>
    </draggable>
    <template v-if="addMenuShow">
      <el-dialog
        title="新增菜单"
        :visible.sync="addMenuShowModal"
        width="758px"
      >
        <AddMenu :tools="tools" ref="AddMenu" :addMenuData="addMenuData" />
        <div slot="footer" class="dialog-footer">
          <ns-button @click="cancel()">取 消</ns-button>
          <ns-button type="primary" @click="addMenuShowConfirm()"
            >确 定</ns-button
          >
        </div>
      </el-dialog>
    </template>
    <template v-if="editMenuShow">
      <el-dialog
        title="编辑菜单"
        :visible.sync="editMenuShowModal"
        width="758px"
      >
        <AddMenu ref="editMenu" :tools="tools" :addMenuData="addMenuData" />
        <div slot="footer" class="dialog-footer">
          <ns-button @click="cancel()">取 消</ns-button>
          <ns-button type="primary" @click="oneditMenuShowConfirm()"
            >确 定</ns-button
          >
        </div>
      </el-dialog>
    </template>
    <DelTips
      :tipsShow="delMeunShow"
      @onCancel="cancel"
      @onConfirm="onConfirmDelMenu"
      ><slot>确认是否删除菜单?</slot></DelTips
    >
    <!-- <el-dialog :visible.sync="delMeunShow" width="30%">
      <div class="tipsShowTitle" slot="title">提示信息</div>
      <div class="tipsShowContent">
        <span class="ns-warm-cricle">!</span>确认是否删除菜单?
      </div>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="cancel()">取 消</ns-button>
        <ns-button type="primary" @click="onConfirmDelMenu">确 定</ns-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import AddMenu from '../pageComponents/addMenu'
import { uuid } from '@/utils/uuid.js'
import draggable from 'vuedraggable'
import DelTips from '../pageComponents/delTips'
export default {
  components: { AddMenu, draggable, DelTips },
  props: {
    childrenEditData: {
      type: Array
    }
  },
  data () {
    return {
      tools: [
        {
          tooltip: '导购账号',
          img:
            'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/icon/icon-daogou.png',
          type: 'tag',
          title: `{workId}`,
          text: '导购账号',
          id: 'workId',
          value: '导购账号'
        },
        {
          img:
            'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/icon/guideNumer.png',
          type: 'tag',
          title: `{workNumber}`,
          text: '导购工号',
          id: 'workNumber',
          value: '导购工号'
        },
        {
          img:
            'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/icon/guideID.png',
          type: 'tag',
          text: '导购ID',
          title: `{guideId}`,
          id: 'guideId',
          value: '导购ID'
        },
        {
          img:
            'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/icon/distributionStore.png',
          type: 'tag',
          text: '导购工作门店',
          title: `{shopId}`,
          id: 'shopId',
          value: '导购工作门店'
        }
      ],
      data: JSON.parse(JSON.stringify(this.childrenEditData)),
      checkAll: false,
      isIndeterminate: false,
      addMenuShow: false,
      editMenuShow: false,
      delMeunShow: false, // 删除菜单
      addMenuShowModal: false, // 新增菜单
      editMenuShowModal: false, // 编辑菜单
      index: 0, // 编辑状态下记录点击的下标
      delIndex: null, // 删除记录点击下标
      addMenuData: {},
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
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
    onPageRewardSetting (item) {
      this.$emit('onPageRewardSetting', item.itemCode)
    },
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
    },
    onAddMenu () {
      let _this = this
      let obj = {
        appid: null,
        icon: '',
        name: '',
        pageUrl: '',
        type: 1
      }
      this.addMenuData = obj
      this.addMenuShow = true
      this.$nextTick(() => {
        _this.addMenuShowModal = true
      })
    },
    addMenuShowConfirm () {
      let _this = this
      let save = this.$refs.AddMenu.onSave()
      save.then(res => {
        let obj = {
          editable: 1,
          info: res,
          isDefaultMenu: 0,
          itemCode: uuid(32),
          itemName: res.name,
          sort: 1,
          sortable: 1,
          status: 1
        }
        this.data.push(obj)
        this.cancel()
        // this.addMenuShowModal = false
        // this.addMenuShow = false
      })
    },
    cancel () {
      let _this = this
      this.editMenuShowModal = false
      this.addMenuShowModal = false
      this.delMeunShow = false
      // setTimeout(() => {
      _this.addMenuShow = false
      _this.editMenuShow = false
      // }, 100)
    },
    onEditMenu (info, index) {
      this.index = index
      let _this = this
      this.editMenuShow = true
      this.addMenuData = JSON.parse(JSON.stringify(info))
      this.$nextTick(() => {
        _this.editMenuShowModal = true
      })
    },
    oneditMenuShowConfirm () {
      let _this = this
      let save = this.$refs.editMenu.onSave()
      save.then(res => {
        let obj = {
          ...this.data[this.index],
          info: res,
          itemName: res.name
        }
        this.$set(this.data, this.index, obj)
        this.cancel()
      })
    },
    onEditDelMenu (index) {
      this.delIndex = index
      this.delMeunShow = true
    },
    // 删除菜单确认按钮
    onConfirmDelMenu () {
      this.data.splice(this.delIndex, 1)
      this.cancel()
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
  padding: 0 16px;
  position: relative;
  display: flex;
  align-items: center;
  .draw {
    width: 16px;
    height: 16px;
    margin-right: 24px;
    &:hover {
      cursor: move;
    }
  }
}
.checkboxWarpper .editIcon {
  display: inline-block;
  position: absolute;
  top: 50%;
  right: 46px;
  color: #8c8c8c;
  transform: translate(0%, -50%);
}
.checkboxWarpper .editIcon:hover {
  color: #262626;
}
.checkboxWarpper:hover {
  cursor: pointer;
  background: #fbfbfb;
  border-radius: 2px;
}
.checkboxWarpper .code-delete {
  right: 16px;
}
.addMenu {
  margin: 0 16px;
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
    color: #0091fa;
  }
  &:hover .el-icon-plus {
    color: #0091fa;
  }
}
img {
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}
// .tipsShowTitle {
//   padding-top: 5px;
//   font-size: 16px;
//   font-weight: bold;
//   color: #303133;
// }
// .tipsShowContent {
//   padding: 16px 5px;
//   color: #595959;
//   font-size: 14px;
// }
// .ns-warm-cricle {
//   display: inline-block;
//   text-align: center;
//   line-height: 14px;
//   width: 14px;
//   height: 14px;
//   border-radius: 50%;
//   background: #ffaa00;
//   color: #fff;
//   margin-right: 10px;
// }
</style>
<style scoped>
.fuscousQA >>> .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #2153D4;
    border-color: #2153D4;
}
.fuscousQA >>> .addMenu:hover{
   border: 1px dashed #2153D4;
    color: #2153D4
}
.fuscousQA >>> .el-checkbox__input.is-checked .el-checkbox__inner{
  background-color: #2153D4;
    border-color: #2153D4;
}
.fuscousQA >>> .addMenu:hover .el-icon-plus{
   color: #2153D4!important
}
.fuscousIcon >>> .el-checkbox__input.is-checked .el-checkbox__inner{
  background-color: #0091fa;
    border-color: #0091fa;
}
</style>
