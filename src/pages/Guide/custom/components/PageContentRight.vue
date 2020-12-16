<template>
  <div class="PageContentRight">
    <div class="form-item_tip">
      小程序页面将根据下面排序顺序显示
    </div>
    <el-collapse class="common-collapse" v-model="activeNames">
      <template v-for="(item, index) in pageModuleType">
        <el-collapse-item :key="index" :disabled="!item.itemList">
          <template slot="title">
            <div class="common-title" @click="onShowEdit(item.settingCode)" :class="{'common-title__disabled': !item.itemList} ">
              <span>{{ item.settingName }}{{ item.status }}</span>
              <div class="switch" @click="onclick">
                <el-switch :value="formatStatus(item.status)" active-color="#0091FA" @change="(data)=> {handlerChange(data, item)}">
                </el-switch>
              </div>
            </div>
          </template>
          <div @click="onShowEdit(item.settingCode)" class="editWarpper" v-if="item.itemList">
            <component
              :is="formatSettingType(item.settingType)"
              v-if="item.itemList"
              :childrenEditData="item.itemList"
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
    </el-collapse>
    {{ pageModuleType }}
  </div>
</template>
<script>
import PageContentRight from './src/PageContentRight.js'
import CheckBox from './PageContentRightComponents/checkBox'
import menuSet from './PageContentRightComponents/menuSet'
import Upload from './PageContentRightComponents/Upload'
PageContentRight.components = {
  CheckBox,
  menuSet,
  Upload
}
export default PageContentRight
</script>
<style>
.common-collapse /deep/ .el-collapse-item.is-disabled .el-collapse-item__header {
  cursor: pointer;
}
.common-title__disabled + i {
  display: none;
}
</style>

<style scoped lang="scss">
@import './style/PageContentRight.css';
.common-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.editWarpper {
  padding: 16px 32px;
}
.form-item_tip {
  background: #f2f9fe;
  border-radius: 2px;
  padding: 9px 16px;
  font-size: 14px;
  color: #595959;
  line-height: 22px;
}
</style>
