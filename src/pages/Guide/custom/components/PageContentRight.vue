<template>
  <div class="PageContentRight">
    <div :class="[fuscous==='QA'? 'form-item_tipQA':'form-item_tip']">
      小程序页面将根据下面排序顺序显示
    </div>
    <el-collapse
      class="common-collapse PageContentRight-common-collapse"
      v-model="activeNames"
    >
      <draggable
        v-model="pageModuleType"
        filter=".common-title__disabled__draggable"
        handle=".draggableIcon"
        animation="300"
        :move="onMove"
      >
        <transition-group>
          <template v-for="(item, index) in pageModuleType">
            <el-collapse-item
              :key="index"
              :name="item.sort"
              :disabled="!item.itemList"
              :class="{
                'common-title__disabled__draggable': item.sortable === 0
              }"
            >
              <template slot="title">
                <div
                  class="common-title"
                  @click="onShowEdit(item.settingCode)"
                  :class="{ 'common-title__disabled': !item.itemList }"
                >
                  <div class="draggableIcon draggablecursor" v-if="item.sortable === 1">
                    <img :src="draggableIcon" />
                  </div>
                  <div class="draggableIcon nodraggablecursor" v-else>
                    <img :src="noDraggableIcon" />
                  </div>
                  <span>{{ item.settingName }}</span>
                  <div class="switch" :class="[fuscous==='QA'?fuscousQA:fuscousIcon]" @click="onclick(item.settingCode)" >
                    <el-switch
                      :value="formatStatus(item.status)"
                      active-color="#0091FA"
                      inactive-color="#8C8C8C"
                      @change="
                        data => {
                          handlerChange(data, item)
                        }
                      "
                    >
                    </el-switch>
                  </div>
                </div>
              </template>
              <div
                @click="onShowEdit(item.settingCode)"
                class="editWarpper"
                v-if="item.itemList"
              >
                <div class="noEdit" v-if="item.status === 0">
                  开启后可编辑内容
                </div>
                <component
                  :is="formatSettingType(item.settingType)"
                  v-if="item.itemList"
                  :childrenEditData="item.itemList"
                  @onPageRewardSetting="onPageRewardSetting"
                  @change="
                    data => {
                      onChangeItem(data, index)
                    }
                  "
                ></component>
                <!-- <CheckBox /> -->
                <!-- <Upload /> -->
              </div>
            </el-collapse-item>
          </template>
        </transition-group>
      </draggable>
    </el-collapse>
  </div>
</template>
<script>
import PageContentRight from './src/PageContentRight.js'
import CheckBox from './PageContentRightComponents/checkBox'
import menuSet from './PageContentRightComponents/menuSet'
import Upload from './PageContentRightComponents/Upload'
import draggable from 'vuedraggable'
PageContentRight.components = {
  CheckBox,
  menuSet,
  Upload,
  draggable
}
export default PageContentRight
</script>

<style>
.common-collapse
  /deep/
  .el-collapse-item.is-disabled
  .el-collapse-item__header {
  cursor: pointer;
}
.common-title__disabled + i {
  display: none;
}
.PageContentRight-common-collapse /deep/ .el-collapse-item__content {
  padding-bottom: 0px !important;
}
</style>

<style scoped lang="scss">
@import './style/PageContentRight.css';
.common-title {
  width: 100%;
  padding-left: 80px;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.editWarpper {
  padding: 16px;
}
.form-item_tip,.form-item_tipQA {
  background: #f2f9fe;
  border-radius: 2px;
  padding: 9px 16px;
  font-size: 14px;
  color: #595959;
  line-height: 22px;
}
.form-item_tipQA{
background: #EBF2FD!important;
}
.draggableIcon {
  position: absolute;
  width: 50px;
  left: 4px;
  display: flex;
  align-items: center;
  top: 50%;
  height: 100%;
  padding-left: 12px;
  transform: translate(0, -50%);
  img {
    width: 16px;
    height: 16px;
    image-rendering: -moz-crisp-edges;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;
  }
}
.draggablecursor:hover {
  cursor: move;
}
.nodraggablecursor {
  cursor: no-drop;
}
.editWarpper {
  position: relative;
  .noEdit {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    left: 0;
    top: 0;
    z-index: 1002;
    opacity: 0;
    transition: opacity 0.5s;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    font-size: 14px;
    color: #595959;
  }
  &:hover .noEdit {
    opacity: 0.85;
  }
}
</style>
<style scoped>
.fuscousQA>>>.el-switch.is-checked .el-switch__core{
  background-color: #2153D4!important;
    border-color: #2153D4!important;
}
.fuscousIcon>>>.el-switch.is-checked .el-switch__core{
  background-color: #0091fa!important;
    border-color: #0091fa!important;
}
</style>
