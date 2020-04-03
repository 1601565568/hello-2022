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
            <el-form-item label="聚合码名称：" required>
              <el-form-grid size="xlg">
                <el-input
                  type="text"
                  placeholder="请输入聚合码名称"
                  v-model="personalQrcode.name"
                  maxlength="30"
                  show-word-limit
                  onkeyup="this.value=this.value.replace(/\s+/g,'')"
                />
              </el-form-grid>
            </el-form-item>
            <el-form-item label="聚合码类型：" required>
              <el-form-grid size="small">
                <el-form-item prop="sex">
                  <el-radio-group v-model="personalQrcode.type" @change="checkChange()">
                    <el-radio v-for="(typeName, index) in QrCodeTypeNames"  :key="typeName" :label="index" >{{typeName}} </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="子码设置：" required>
              <el-form-grid>
                <ns-button type='text' @click="choosePersonnel(personalQrcode.type)">+ 选择{{QrCodeTypeNames[personalQrcode.type]}}</ns-button>
              </el-form-grid>
              <ElFormGrid v-if="personalQrcode.type === 0">
                已选择<span class="text-primary">{{tableData.length}}</span>个员工
              </ElFormGrid>
            </el-form-item>
            <ElFormItem :rules="rules">
              <div class="message-detail" >
                <ElTable :data="tableData" class="message-detail__table">
                  <ElTableColumn prop="style" label="名称" align="center" width="80">
                    <template slot-scope="scope">
                      {{ scope.row.name }}
                    </template>
                  </ElTableColumn>
                  <ElTableColumn prop="style" label="微信账号" v-if="memberManagePlan == 1 && personalQrcode.type == 0" align="center" width="150">
                    <template slot-scope="scope">
                      {{ scope.row.userName?scope.row.userName:'-' }}({{ scope.row.userId?scope.row.userId:'-' }})
                    </template>
                  </ElTableColumn>
                  <ElTableColumn prop="style" label="子码" align="center" width="150">
                    <template slot-scope="scope">
                      <img v-if="scope.row.image" :src="scope.row.image" width="50px" height="50px" class="company-upload__avatar">
                    </template>
                  </ElTableColumn>
                  <ElTableColumn prop="num" v-if="memberManagePlan == 2  || (memberManagePlan == 1 && personalQrcode.type != 0)" align="center" width="150">
                    <template slot="header">
                      每日添加好友次数
                      <el-tooltip content="该子码每日最多添加好友数量。如一个子码归属于多个聚合码中，子码每日最多添加人数以设置最大数为基准。子码在当前聚合码中添加好友数量达到最大时该子码在该聚合码中不再显示。">
                        <Icon type="question-circle"/>
                      </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.num" type="number" onkeyup="this.value=this.value.replace(/\D|^0/g,'')" onafterpaste="this.value=this.value.replace(/\D|^0/g,'')"></el-input>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn label="操作" align="center" :width="80">
                    <template slot-scope="scope">
                      <ns-button type="text" size="small" @click="handleDelete(scope, item)">删除</ns-button>
                    </template>
                  </ElTableColumn>
                </ElTable>
              </div>
            </ElFormItem>
            <el-form-item label="渠道设置：" v-if="memberManagePlan == 1">
              <el-form-grid>
                <el-select v-model="personalQrcode.channelCode" filterable placeholder="请选择">
                  <el-option
                    v-for="item in channelList"
                    :key="item.channel_code"
                    :label="item.channel_name"
                    :value="item.channel_code">
                  </el-option>
                </el-select>
              </el-form-grid>
            </el-form-item>
<!--            <el-form-item label="好友验证：" v-if="memberManagePlan == 1" required>-->
<!--              <el-form-grid size="xxmd">-->
<!--                <el-form-item prop="sex">-->
<!--                  <el-radio-group v-model="personalQrcode.isvalidate">-->
<!--                    <el-radio :label="1">关闭</el-radio>-->
<!--                    <el-radio :label="2">开启</el-radio>-->
<!--                  </el-radio-group>-->
<!--                </el-form-item>-->
<!--              </el-form-grid>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="验证信息关键字：" v-if="memberManagePlan == 2 && personalQrcode.isvalidate == 2" required>-->
<!--              <el-form-grid>-->
<!--                <el-input   style="width:400px;" maxlength="50" type="textarea" autofocus=true v-model="personalQrcode.keyword" placeholder="请输入验证信息关键字，关键字之间用英文逗号割开，最多输入50个关键字" clearable></el-input>-->
<!--              </el-form-grid>-->
<!--            </el-form-item>-->
            <el-form-item label="子码展示方式：" v-if="memberManagePlan == 2" required>
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
      </el-form>
    </el-scrollbar>
    <div class="message-container">
    <!---->
    <!--选择好友弹窗开始-->
    <ElDialog width="600px" height="500px" title="选择子码" :visible.sync="dialogVisible" :show-scroll-x=false :show-scroll-y=false>
      <div v-if="personalQrcode.type === 0">
        <ElRow :gutter="10" class="code-container">
          <ElCol :span="12" class="code-container__item">
            <div class="code-title">可选员工</div>
            <ElInput
              placeholder="请输入员工姓名"
              suffix-icon="el-icon-search"
              v-model="treeSelect" @click="initEmpTree()" class="code-space">
            </ElInput>
            <div class="scoll_left">
              <ElScrollbar>
                <ElTree
                  :data="tree.selectData"
                  ref="selectTree"
                  show-checkbox
                  :filter-node-method="selectFilterNode"
                  node-key="id"
                  :default-expand-all=false
                  :default-checked-keys="employeeIds"
                  @check="check"
                  :props="tree.leftDefaultProps" class="code-space">
            <span class="code-detail clearfix" slot-scope="{ node, data }">
              <span class="code-detail__text">{{ node.label }}</span>
              <span>{{ data.children ? '/' + data.children.length : '' }}</span>
            </span>
                </ElTree>
              </ElScrollbar>
            </div>
          </ElCol>
          <ElCol :span="12" class="code-container__item">
            <div class="code-title">已选员工</div>
<!--            <ElInput-->
<!--              placeholder="请输入员工姓名"-->
<!--              suffix-icon="el-icon-search"-->
<!--              v-model="tree.selected" class="code-space">-->
<!--            </ElInput>-->
            <div class="scoll_left">
              <ElScrollbar>
                <ElTree
                  :data="tree.selectedData"
                  ref="selectedTree"
                  :filter-node-method="tree.selectedFilterNode"
                  node-key="id"
                  :expand-on-click-node="false" class="code-space">
            <span class="code-detail clearfix" slot-scope="{ node, data }">
              <span class="code-detail__text">{{ node.label }}</span>
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
              </ElScrollbar>
            </div>

          </ElCol>
        </ElRow>
      </div>
      <div v-if="personalQrcode.type === 1">
        <div class="giveaway-add__item--info">
          <ns-button type="text" @click="handleAdd()">添加自定义图片</ns-button>
        </div>
        <template>
          <el-table :data="addTableData" style="width: 100%">
            <el-table-column label="名称" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" maxlength="15" placeholder="请输入二维码名称，限15字"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="子码" width="120">
              <template slot-scope="scope">
                  <el-upload
                    :action="sgUploadFile('test')"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="scope.row.image" :src="scope.row.image" width="50px" height="50px" class="company-upload__avatar">
                    <Icon type="plus" @click='setCurrentUploadRowIndex(scope.row.index)' className="company-upload__tip" v-else/>
                  </el-upload>
              </template>
            </el-table-column>
            <el-table-column width="200">
              <template slot="header">
                失效时间
                <el-tooltip content="子码的失效时间，失效后将不再展示，不设置默认时效为永久。">
                  <Icon type="question-circle"/>
                </el-tooltip>
              </template>
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
                <ns-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</ns-button>
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
    </div>
    <div class="form-save__unique">
      <ns-button type="primary" @click="onSave()">保存</ns-button>
      <ns-button @click="cancel()">取消</ns-button>
    </div>
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

  @component-namespace message {
    @b container {
      @e card {
        margin-top: var(--default-margin-base);
      }
    }
    @b composition {
      display: flex;
      @e left {
        width: 68%;
      }
      @e right {
        flex-shrink: 0;
        margin: 0 auto;
        >>> .el-scrollbar__wrap {
          height: 410px;
          padding-bottom: 20px;
        }
      }
    }
    @b detail {
      padding: 20px 20px 0;
      margin-bottom: 20px;
      border: 1px dashed var(--theme-base-border-color-primary);
      border-radius: 6px;
      width: 559px;
      @e btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        >>> .el-tag {
          cursor: text;
        }
      }
      @e table {
        margin-top: var(--default-margin-larger);
      }
      >>> .ElImage {
        background-color: unset;
      }
    }
    @b item {
      display: flex;
      align-items: center;
      @m title {
        line-height: 18px;
      }
      @m image {
        margin: 7px 0;
      }
      @m add {
        line-height: 60px;
        height: 60px;
      }
      @m opposite {
        width: 76px;
        height: 46px;
        position: relative;
      }
      @e broadcast {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 8px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, .4);
        border-radius: 50%;
      }
    }
    @b circle {
      width: 0;
      height: 0;
      border-width: 4px;
      border-style: solid;
      border-color: transparent transparent transparent var(--theme-color-white);
    }
    @b prompt {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: var(--default-margin-larger) 0;
      @e mass {
        text-align: center;
        padding: var(--default-padding-larger) 25px;
        cursor: pointer;
        border-right: 1px solid var(--theme-base-border-color-primary);
      &:hover {
        .message-hovericolor {
          color: var(--theme-color-primary);
        }
      }
    &:last-child {
       border-right: 0;
     }
      @m topspace {
        margin-top: var(--default-margin-small);
      }
    }
    >>> .el-popover {
      padding: 0;
    }
  }
  }
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
  .scoll_left{
    height: 338px;
    overflow: auto;
  }
  .scoll_left::-webkit-scrollbar{
    display:none;
  }
</style>
