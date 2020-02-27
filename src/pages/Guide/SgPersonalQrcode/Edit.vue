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
                <ns-button type='text' @click="dialogVisible = true">+选择员工</ns-button>
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
            <el-form-item>
                <ns-button @click="reload()" >取消</ns-button>
                <ns-button type="primary" @click="onSave">确定</ns-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-scrollbar>
    <!---->
    <!--选择好友弹窗开始-->
    <ElDialog
      width="600px"
      title="选择员工"
      :visible.sync="dialogVisible"
      :show-scroll-x=false>
      <ElRow :gutter="10" class="code-container">
        <ElCol :span="12">
          <div class="code-title">可选员工</div>
          <ElInput
            placeholder="请输入员工姓名"
            suffix-icon="el-icon-search"
            v-model="input" class="code-space">
          </ElInput>
          <div class="text-primary code-space">全部 /666</div>
          <ElTree
            :data="treeData"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[1, 2]"
            :default-checked-keys="[5,8,10]"
            :props="defaultProps"
            @check-change="handleNodeCheck" class="code-space">
            <span class="code-detail clearfix" slot-scope="{ node, data }">
              <span class="code-detail__text">{{ node.label }}</span>
              <span>{{ data.children ? '/' + data.children.length : '' }}</span>
            </span>
          </ElTree>
        </ElCol>
        <ElCol :span="12">
          <div class="code-title">已选员工</div>
          <div class="text-primary code-space">全部 /666</div>
          <ElTree
            :data="chooseTreeData"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[1, 2]"
            :default-checked-keys="[3]"
            :expand-on-click-node="false" class="code-space">
            <span class="code-detail clearfix" slot-scope="{ node, data }">
              <span class="code-detail__text">{{ node.label }}</span>
              <span>{{ data.children ? '/' + data.children.length : '' }}</span>
              <span>
                <ns-button
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)">
                  <Icon type="delete" className="code-delete"/>
                </ns-button>
              </span>
            </span>
          </ElTree>
        </ElCol>
      </ElRow>
      <template slot="footer">
        <ns-button @click="dialogVisible = false">取消</ns-button>
        <ns-button type="primary" @click="onConfirm()">确定</ns-button>
      </template>
    </ElDialog>
    <!--选择好友弹窗结束-->
    <!---->
  </div>
</template>
<script>
import Edit from './src/Edit'
import index from './src/List'
import ElTree from '@nascent/nui/lib/tree'

Edit.components = {
  index,
  ElTree
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

  @component-namespace code {
    @b container {
      padding: 0 var(--default-padding-small);
    }
    @b title {
      font-weight: bold;
      line-height: 30px;
      background: var(--theme-bg-color-base);
      padding: 0 8px;
      border-radius: var(--default-radius-mini);
    }
    @b delete {
      margin-left: var(--default-margin-small);
    }
    @b space {
      margin-top: var(--default-margin-base);
    }
    @b detail {
      display: flex;
      align-items: center;
      @e text {
        max-width: 188px;
        margin-right: var(--default-margin-small);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
</style>
