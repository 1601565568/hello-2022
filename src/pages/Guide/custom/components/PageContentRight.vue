<template>
  <div class="PageContentRight">
    <div class="form-item_tip">
      小程序页面将根据下面排序顺序显示
    </div>
    <el-collapse class="common-collapse" v-model="activeNames">
      <template v-for="(item, index) in pageModuleType">
        <el-collapse-item :key="index">
          <template slot="title">
            <div class="common-title" @click="onShowEdit()">
              <span>{{ item.settingName }}{{ item.status }}</span>
              <div class="switch" @click="onclick">
                <el-switch v-model="item.status" active-color="#0091FA">
                </el-switch>
              </div>
            </div>
          </template>
          <div @click="onShowEdit()" class="editWarpper">
            <component
              :is="formatSettingType(item.settingType)"
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
