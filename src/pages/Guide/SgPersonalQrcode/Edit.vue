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
                <ns-button type='text' @click="choosePersonnel()">+选择子码</ns-button>
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
    <ElDialog width="600px" title="选择员工" :visible.sync="dialogVisible" :show-scroll-x=false>
      <div class="resignFormVisible_way">
        客户转移方式：
        <el-radio-group v-model="transferRadio">
          <el-radio @change="shiftChange" label="1">
            员工
<!--            <el-tooltip class="item" effect="light" content="" placement="bottom">-->
<!--              <i class="el-icon-question"></i>-->
<!--            </el-tooltip>-->
          </el-radio>
          <el-radio @change="shiftChange" label="2">
            自定义
<!--            <el-tooltip class="item" effect="light" content="" placement="bottom">-->
<!--              <i class="el-icon-question"></i>-->
<!--            </el-tooltip>-->
          </el-radio>
        </el-radio-group>
      </div>
      <div v-if="transferRadio === '1'">
        <ElRow :gutter="10" class="code-container">
          <ElCol :span="12" class="code-container__item">
            <div class="code-title">可选员工</div>
            <ElInput
              placeholder="请输入员工姓名"
              suffix-icon="el-icon-search"
              v-model="input" class="code-space">
            </ElInput>
            <div class="text-primary code-space">全部</div>
            <ElScrollbar>
              <ElTree
                ref="tree"
                :data="leftTreeData"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[1, 2]"
                :default-checked-keys="choosePerson"
                :props="leftDefaultProps"
                @check-change="handleCheckChange" class="code-space">
            <span class="code-detail clearfix" slot-scope="{ node, data }">
              <span class="code-detail__text">{{ node.label }}</span>
              <span>{{ data.children ? '/' + data.children.length : '' }}</span>
            </span>
              </ElTree>
            </ElScrollbar>
          </ElCol>
        </ElRow>
      </div>
      <div v-if="transferRadio === '2'">
        <div class="giveaway-add__item--info">
          <ns-button type="text" @click="handleAdd()">添加自定义子码</ns-button>
        </div>
        <template>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column label="名称" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" placeholder="请输入二维码名称，字数限制15字内"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="子码" width="180">
              <template slot-scope="scope">
                <div v-if="scope.row.img === null"></div>
                <el-popover trigger="hover" placement="top">
                  <p>限制上传图片大小5M，格式为png、jpg。提示文字“建议图片长宽比例为1:1，格式jpg/png，大小5MB以内</p>
<!--                  <div slot="reference" class="name-wrapper">-->
<!--                    <ns-button size="medium">+上传子码图片</ns-button>-->
<!--                  </div>-->
                  <el-upload
                    :action="this.$api.core.sgUploadFile('test')"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="scope.row.img" :src="scope.row.img" class="company-upload__avatar">
                    <Icon type="plus" className="company-upload__tip" v-else/>
                  </el-upload>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="失效时间" width="180">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.date"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <ns-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</ns-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <template slot="footer">
        <ns-button @click="dialogVisible = false">取消</ns-button>
        <ns-button type="primary" @click="onSaveChildQrcode()">确定</ns-button>
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
import ElUpload from '@nascent/nui/lib/upload'

Edit.components = {
  index,
  ElTree,
  ElUpload
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
