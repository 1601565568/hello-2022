<template xmlns:el="http://www.w3.org/1999/html">
  <div calss="NsTable_main">
    <div class="template-page__row-left" v-loading="treeLoading">
      <el-input v-model="filterTreeText" placeholder="搜索分组" suffix-icon="el-icon-search" style="width: 180px"/>
      &nbsp;
      <i class="el-icon-plus" @click="showEditGroupDlg(null, true, true)"/>
      <el-tree :data="groupList" ref="groupTree" node-key="id" :expand-on-click-node="false"
               :filter-node-method="onFilterNode" @node-click="onClickNode" highlight-current>
        <span class="custom-tree-node" slot-scope="{ node, data }"
              @mouseover="setCurrentNodeId(data.id)"
              @mouseleave="setCurrentNodeId(0)">
          <span style="width:100px">
            {{ node.label }}
          </span>
          <span v-if="data.ext1!=null" v-show="isShowTreeNodePlus(data.id)">
            <i class="el-icon-plus" v-if="data.parentId==0" @click.stop="showEditGroupDlg(data,true,false)"/>
            <i class="el-icon-edit-outline" size="mini" @click.stop="showEditGroupDlg(data,false,false)"/>
            <i class="el-icon-delete" size="mini" @click.stop="showRemoveGroupDlg(data)" v-show="data.children==null"/>
          </span>
        </span>
      </el-tree>
    </div>
    <div class="template-page__row-right">
      <ns-page-table>
        <!-- 按钮 -->
        <template slot="buttons">
          <ns-table-operate-button :buttons="_data._table.table_buttons"/>
        </template>
        <!-- 按钮-结束 -->

        <!-- 搜索 -->
        <template slot="searchSearch">
          <el-form :model="model" :inline="true" @submit.native.prevent class="pull-right">
            <el-form-item>
              <el-form-grid block class="text-info">
                <span style="marr">
                  <i class="el-icon-info"></i>
                  只对敏感词创建时间后的聊天记录进行监控统计&nbsp;&nbsp;
                </span>
                <el-input ref="quickText" style="width: 250px" name="name" v-model="model.name" placeholder="搜索敏感词"
                          @keyup.enter.native="$searchAction$()" clearable>
                </el-input>
                <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
                <ns-button @click="$resetInputAction$()">重置</ns-button>
              </el-form-grid>
            </el-form-item>
          </el-form>
        </template>
        <!-- 搜索-结束 -->

        <!-- 表格 -->
        <template slot="table">
          <el-table ref="table" :data="_data._table.data" stripe row-key="id" v-loading.lock="_data._table.loadingtable"
                    :element-loading-text="$t('prompt.loading')">
            <el-table-column prop="name" label="敏感词" align="left"/>
            <el-table-column prop="groupName" label="分组" align="left"/>
            <el-table-column prop="guideCount" align="right" :render-header="renderHeaderGuideCount">
              <template slot-scope="scope">
                <span @click="clickCount(scope.row,1)"><font color="#409EFF">{{scope.row.guideCount}}</font></span>
              </template>
            </el-table-column>
            <el-table-column prop="customerCount" align="right" :render-header="renderHeaderCustomerCount">
              <template slot-scope="scope">
                <span @click="clickCount(scope.row,0)"><font color="#409EFF">{{scope.row.customerCount}}</font></span>
              </template>
            </el-table-column>
            <el-table-column prop="creatorName" label="创建人" align="left"/>
            <el-table-column prop="createTime" label="创建时间" align="left"/>
            <el-table-column prop="status,row" :show-overflow-tooltip="true" label="操作" align="right">
              <template slot-scope="scope">
                <ns-button style="color:#0091FA" @click="removeWord(scope.row)" type="text">删除</ns-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 表格-结束 -->

        <!-- 分页 -->
        <template slot="pagination">
          <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                         :page-sizes="_data._pagination.sizeOpts"
                         :total="_data._pagination.total"
                         :current-page.sync="_data._pagination.page"
                         :page-size="_data._pagination.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         @size-change="$sizeChange$"
                         @current-change="$pageChange$">
          </el-pagination>
        </template>
        <!-- 分页-结束 -->
      </ns-page-table>
    </div>

    <!-- 删除分组 -->
    <template>
      <el-dialog title="确认" :visible.sync="removeGroupDialogVisible" :width="removeGroupDlgWidth"
                 :height="removeGroupDlgHeight">
        <el-form :model="removeGroupModel" ref="removeGroupForm">
          <div class="el-header"/>
          <div class="el-main">
            <p v-html="removeGroupText" style="font-size:15px"/>
            <p></p>
            <div v-show="removeGroupSelectVisible">
              <p><font size="2" color="blue">* 请将组内敏感词转移到其他分组</font></p>
              <p></p>
              <el-form-item prop="targetGroupId" v-if="isShowSelecntInRemoveGroup"
                            :rules="[{ required: true, message: '请选择目标分组', trigger: 'change' }]">
                <el-select placeholder="请选择目标分组" v-model="removeGroupModel.targetGroupId" clearable filterable
                           style="width:220px">
                  <el-option
                    v-for="item in groupOptionsInRemoveGroupDlg" :key="item.value" :label="item.label"
                    :value="item.value">
                  <span style="color: #8492a6; " v-if="item.prefix != ''">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span>{{ item.prefix }} -</span>
                  </span>
                    <span style="">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="el-footer" style="text-align: right">
            <ns-button @click="removeGroupDialogVisible=false">取消</ns-button>
            <ns-button type="primary" @click="submitRemoveGroup()">确定</ns-button>
          </div>
        </el-form>
      </el-dialog>
    </template>
    <!-- 删除分组 结束 -->

    <!-- 敏感词详情 -->
    <template>
      <el-dialog title="新增敏感词" :visible.sync="wordDetailDlgVisible" width="350px" height="240px">
        <el-form :model="wordDetailForm" ref="wordDetailForm" :rules="wordDetailRules">
          <table cellspacing="0" cellpadding="0">
            <tr>
              <td width="70px">
                <font color='red'>*</font>敏感词:
              </td>
              <td>
                <el-form-item prop="name">
                  <el-input v-model="wordDetailForm.name" style="width:220px"/>
                </el-form-item>
              </td>
            </tr>
            <tr style="height: 10px">
              <td></td>
              <td><font color="gray" size="1">字数限制五个字</font></td>
            </tr>
            <tr>
              <td>
                <font color='red'>*</font>选择分组:
              </td>
              <td>
                <el-form-item prop="groupId">
                  <el-select placeholder="请选择分组" v-model="wordDetailForm.groupId" clearable filterable
                             style="width:220px">
                    <el-option
                      v-for="item in groupOptionsInWordDlg" :key="item.value" :label="item.label"
                      :value="item.value">
                  <span style="color: #8492a6; " v-if="item.prefix != ''">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span>{{ item.prefix }} -</span>
                  </span>
                      <span style="">{{ item.label }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                &nbsp;&nbsp;创建人:
              </td>
              <td>
                {{wordDetailForm.creatorName}}
              </td>
            </tr>
            <tr>
              <td colspan="2">&nbsp;</td>
            </tr>
          </table>
          <div class="el-footer" style="text-align: right">
            <ns-button @click="wordDetailDlgVisible=false">取消</ns-button>
            <ns-button type="primary" @click="saveWord()" :disabled="saveWordDisabled">确定</ns-button>
          </div>
        </el-form>
      </el-dialog>
      <!-- 敏感词详情 结束 -->

      <!-- 二级分组详情 -->
      <template>
        <el-dialog :title="addGroupTitle" :visible.sync="groupDetailDlgVisible" width="300px" height="220px">
          <el-form :model="groupDetailForm" ref="groupDetailForm" :rules="groupDetailRules">
            <table cellspacing="1" cellpadding="2">
              <tr>
                <td>
                  <font color='red'>*</font> {{addGroupNameLabel}}:
                </td>
              </tr>
              <tr>
                <td>
                  <el-form-item prop="name">
                    <el-input v-model="groupDetailForm.name" style="width:270px"/>
                  </el-form-item>
                </td>
              </tr>
              <tr style="height: 10px">
                <td><font color="gray" size="1">不支持特殊符号，最多5个字</font></td>
              </tr>
              <tr>
                <td>&nbsp;</td>
              </tr>
            </table>
            <div class="el-footer" style="text-align: right">
              <ns-button @click="groupDetailDlgVisible=false">取消</ns-button>
              <ns-button type="primary" @click="saveGroup()" :disabled="saveGroupDisabled">确定</ns-button>
            </div>
          </el-form>
        </el-dialog>
      </template>
      <!-- 二级分组详情 结束 -->
    </template>
  </div>
</template>
<script>
  import index from './src/index'

  export default index
</script>
<style scoped>
  .custoremoveGroupClass {
    width: 400px;
    height: 300px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .template-page__row-left {
    width: 220px;
    position: absolute;
    left: 210px;
    top: 70px;
    z-index: 2;
    overflow: hidden;
  }

  .template-page__row-right {
    position: absolute;
    top: 70px;
    left: 0;
    z-index: 1;
    margin: 0;
    width: 100%;
  }

  .template-table {
    margin: 0 10px 0 440px;
  }

  @media screen and (min-width: 1624px) {
    .template-page__row-left {
      width: 220px;
      position: absolute;
      left: 210px;
      top: 90px;
      z-index: 2;
      overflow: hidden;
    }

    .template-page__row-right {
      position: absolute;
      top: 90px;
      left: 0;
      z-index: 1;
      width: 100%;
      margin: 0;
    }

    .el-header {
      height: 5px;
    }

    .el-main {
      text-align: center;
      font-size: 13px;
      vert-align: top;
      height: 150px;
    }

    .el-footer {
      text-align: right;
      vert-align: bottom;
    }
  }
</style>
