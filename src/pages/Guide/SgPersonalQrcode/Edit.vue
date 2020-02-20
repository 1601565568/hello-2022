<template>
  <div style="background-color: white">
    <el-scrollbar ref="integralRuleHeight" outsider>
      <el-form label-width="150px" ref="form">
        <!-- 会员招募码配置开始 -->
        <div class="form-grid">
          <div class="form-grid__title">
            <div class="bluepillar"></div>
            {{ title }}
          </div>
          <div class="form-grid__content">
            <el-form-item label="聚合码名称：" required  size="xxs">
              <el-form-grid>
                <el-input  autofocus=true v-model="personalQrcode.name" placeholder="" clearable></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="子码设置：" required>
              <el-form-grid>
                <el-input  autofocus=true v-model="personalQrcode.name" placeholder="" clearable></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="子码展示方式：" required>
              <el-form-grid size="xxmd">
                <el-form-item prop="sex">
                  <el-radio-group v-model="personalQrcode.showType">
                    <el-radio :label="1">随机展示</el-radio>
                    <el-radio :label="2">轮流展示</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </div>
        </div>
        <ns-button @click="reload()" >取消</ns-button>
        <ns-button type="primary" @click="onSave">确定</ns-button>
      </el-form>
    </el-scrollbar>
  </div>
</template>
<script>
import Edit from './src/Edit'
import index from './src/List'

Edit.components = {
  index
}
export default Edit
</script>
<style scoped>
  @import "@theme/variables.pcss";

  .dialog_mian_topText p sapn{
    color:grey;
  }
  .dialog_mian_topText p{
    line-height: 30px;
    height: 30px;
  }
  .form-grid__title {
    font-size: var(--default-font-size-base);
    padding: var(--default-padding-larger) 0;
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
    font-weight: 700;
    display: flex;
    align-items: center;
  }
  .bluepillar {
    width: 4px;
    height: 12px;
    margin-right: var(--default-margin-small);
    background-color: #0091FA;
  }
  .form-save__unique {
    padding: var(--default-padding-small) 0 var(--default-padding-small) 61px;
    border-top: 1px solid var(--theme-base-border-color-primary);
    background-color: var(--theme-color-white);
    border-bottom-left-radius: var(--default-radius-mini);
    border-bottom-right-radius: var(--default-radius-mini);
  }
  >>> .template-table__bar {
    margin-bottom: 0;
  }
  .form-grid {
    border-radius: var(--default-radius-mini);
  }
</style>
