<template>
  <div class="template-page">
    <ns-table-role-manage ref="table" @add="onAdd" @shop-update="onUpdateShow"></ns-table-role-manage>
    <el-dialog :title="title" :visible.sync="visible"  width="950px" height="580px" class="add-role"
               :close-on-click-modal="false" :before-close="onClose">
      <el-steps :active="stepsActive" finish-status="success" simple>
        <el-step title="1、基本设置"></el-step>
        <el-step title="2、功能授权"></el-step>
        <el-step title="3、店铺授权"></el-step>
        <el-step title="4、数据权限"></el-step>
      </el-steps>
      <!-- 基本设置 -->
      <div v-show="stepsActive == '0'" style="margin-left: 120px">
        <el-form label-width="120px"
                 ref='role'
                 :model="roleModel.role" :rules="roleModel.roleRule">
          <el-form-item class='edit-form'
                        label="角色名称：" prop="roleName" placeholder="请输入角色名称">
            <el-form-grid size="xlg">
                <el-input v-model.trim="roleModel.role.roleName"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item class='edit-form'
                        label="描述：" placeholder="请输入描述" prop="remark">
            <el-form-grid size="xlg">
                 <el-input type="textarea" v-model.trim="roleModel.role.remark"></el-input>
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <!-- 功能授权 -->
      <div v-show="stepsActive == '1'">
        <el-scrollbar ref="roleManageTreeHeight">
          <el-tree ref="tree" :data="dataTree" node-key="id" default-expand-all
                   @node-collapse="onCloseNode"
                   show-checkbox draggable>
          </el-tree>
        </el-scrollbar>
      </div>
      <!-- 基础数据授权 -->
      <div v-show="stepsActive == '2'">
        <el-form label-width="120px"
                 ref='form_data'
                 :model="shop.selectShop">
          <div class="form-chose">
            <div class="form-chose__item">
              <div class="form-chose__item-title">
                选择品牌</div>
              <div class="form-chose__item-body">
                <el-scrollbar ref="roleManageHeight">
                  <el-checkbox-group v-model="shop.selectShop.brands" class="form-chose__group" :min="1" @change="handleBrand">
                    <el-checkbox-button v-for="brand in shop.brandList" :label="brand.value" :key="brand.value">{{brand.label}}
                    </el-checkbox-button>
                  </el-checkbox-group>
                </el-scrollbar>
              </div>
            </div>
            <div class="form-chose__item">
              <div class="form-chose__item-title">
                选择店铺 <div style="float:right"><span>已选{{shopNum}}店铺</span></div>
              </div>
              <div style="margin:5px">
                <el-form-grid size="md">
                  <ns-select  v-model="shop.selectShop.platform" filterable clearable :placeholder="$t('prompt.select')"
                              :multiple="true" :url="$api.core.common.queryPlatForm" @change="change"></ns-select>
                </el-form-grid>
                <el-form-grid size="md">
                  <ns-droptree v-model="shop.selectShop.areaRegion" :data="area" show-checkbox clearable @change="change"></ns-droptree>
                </el-form-grid>
                <el-form-grid size="md">
                  <ns-select  v-model="shop.selectShop.channel" filterable clearable :placeholder="$t('prompt.select')"
                              :multiple="true" :url="$api.core.channel.queryOptionChannel" @change="change">
                  </ns-select>
                </el-form-grid>
                <el-form-grid size="md">
                  <el-input placeholder="请输入店铺名称" v-model="shop.selectShop.shopName" class="input-with-select">
                    <ns-button slot="append" icon="el-icon-search" @click="search"></ns-button></el-input>
                </el-form-grid>
              </div>
              <div class="text-left form-chose__item-btn">
                <el-checkbox v-model="shop.indexSelect" :indeterminate="isIndeterminate" @change="handleCheckIndexChange">本页全选</el-checkbox>
                <el-checkbox v-model="shop.allSelect" :indeterminate="isAllIndeterminate" @change="handleAllChange">全部全选</el-checkbox>
              </div>
              <div class="form-chose__item-body">
                <div>
                  <template v-if="shopIndex.length == 0">
                    <ns-no-data height="200">{{$t('prompt.noData')}}</ns-no-data>
                  </template>
                  <template v-else>
                    <el-checkbox-group v-model="shop.selectShops" @change="handleIndex">
                      <el-checkbox v-for="shop in shopIndex" :label="shop.value" :key="shop.value">{{shop.label}}</el-checkbox>
                    </el-checkbox-group>
                  </template>
                </div>
                <div class="dialog-footer">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="shop.paginationShop.currentPage"
                    :page-sizes="shop.paginationShop.sizeOpts"
                    :page-size="shop.paginationShop.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    @next-click="nextClick"
                    :total="shop.paginationShop.total">
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
          <el-form-item label="数据加密：">
            <el-form-grid>
              <el-switch active-text="启用" inactive-text="禁用" on-value="0" off-value="1"
                         v-model="shop.isViewInfo">
              </el-switch>
              <el-tooltip content="对手机号、姓名等敏感信息进行加密（加*号显示）" placement="right" effect="light"><i class="el-icon-info"></i></el-tooltip>
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <!-- 业务数据授权 -->
      <div v-show="stepsActive == '3'" style="margin-left: 120px">
        <el-form>
          <el-radio-group v-model="powerRadio">
          <el-form-item>
            <el-form-grid>
              <el-radio :label="1">仅本人</el-radio>
              <template v-if="powerRadio ==1">本人操作权限：可读可写</template>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <el-form-grid>
              <el-radio :label="2">仅所在部门</el-radio>
            </el-form-grid>
            <el-form-grid v-if="powerRadio == 2">
              本人操作权限：可读可写&nbsp;&nbsp;&nbsp;非本人数据操作权限：
              <el-checkbox-group class="el-inline-block" v-model="readWrite">
                <el-checkbox v-for="option in readWriteOptions" :label="option.value" :key="option.value" :disabled="option.value == 1">{{option.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <el-form-grid>
              <el-radio :label="3">所在部门及下属部门</el-radio>
            </el-form-grid>
            <el-form-grid v-if="powerRadio == 3">
              本人操作权限：可读可写&nbsp;&nbsp;&nbsp;非本人数据操作权限：
              <el-checkbox-group class="el-inline-block" v-model="readWrite">
                <el-checkbox v-for="option in readWriteOptions" :label="option.value" :key="option.value" :disabled="option.value == 1">{{option.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <el-form-grid>
              <el-radio  :label="4">全部数据</el-radio>
            </el-form-grid>
            <el-form-grid v-if="powerRadio == 4">
              本人操作权限：可读可写&nbsp;&nbsp;&nbsp;非本人数据操作权限：
              <el-checkbox-group class="el-inline-block" v-model="readWrite">
                <el-checkbox v-for="option in readWriteOptions" :label="option.value" :key="option.value" :disabled="option.value == 1">{{option.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-grid>
          </el-form-item>
         </el-radio-group>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <ns-button @click="onClose">{{$t('operating.cancel')}}</ns-button>
        <ns-button @click="onUp" v-if="stepsActive != 0">上一步</ns-button>
        <ns-button @click="onDown" v-if="stepsActive != 3" type="primary">下一步</ns-button>
        <ns-save v-if="stepsActive == '3'" @click="onSave" :loading="saveLoading"></ns-save>
       </div>
    </el-dialog>
  </div>
</template>

<script>
import NsTableRoleManage from './NsTableRoleManage'
import index from './src/index'
import NsShopSelect from 'web-crm/src/components/NsShopSelect'
import NsDroptree from 'web-crm/src/components/NsDroptree'
index.components = {
  NsShopSelect,
  NsDroptree,
  NsTableRoleManage
}
export default index
</script>
<style scoped>
  @import "@/style/small/variables.pcss";
  @component-namespace add {
    @b role {
      /* el-form 样式 */
      >>> .el-form {
        padding-top: var(--default-padding-base);
        .el-form-item {
        &:last-child {
           margin-bottom: 0;
         }
        }
      }
      >>> .el-dialog__body {
        >.el-scrollbar {
          >.el-dialog__wrap.el-scrollbar__wrap {
            .el-scrollbar__bar.is-vertical {
              top: -1px;
              bottom: -1px;
              background: var(--theme-color-white);
            }
          }
        }
      }
      @component-namespace form {
        @b chose {
          display: flex;
          border: 1px solid var(--theme-base-border-color-primary);
          @e item {
            &:first-child {
              width: 170px;
              text-align: center;
              border-right: 1px solid var(--theme-base-border-color-primary);
              .el-button {
                margin: var(--default-margin-base) 0 0;
            &:last-child {
               margin-bottom: var(--default-margin-base);
             }
            }
          }
            &:last-child {
               flex: 1;
              .form-chose__item-title {
                padding-left: var(--default-padding-base);
              span {
                color: var(--theme-font-color-secondary);
              }
            }
            .form-chose__item-btn {
              padding: var(--default-padding-base);
            }
            .form-chose__item-body {
              padding: var(--default-padding-small);
            }
          }
          }
          @e item-title {
            border-bottom: 1px solid var(--theme-base-border-color-primary);
          }
          @e item-title {
            padding: var(--default-padding-base);
          }
          @e group {
            padding: 8px;
            >>> .el-checkbox-button {
              width: 100%;
              border-radius: var(--default-radius-mini);
              &:not(:last-child) {
                margin-bottom: 8px;
              }
              &:last-child {
                margin-bottom: 3px;
              }
              &.is-focus {
                .el-checkbox-button__inner {
                  border-left: 1px solid var(--theme-color-primary);
                }
              }
              .el-checkbox-button__inner {
                width: 100%;
                border-left: 1px solid var(--theme-base-border-color-primary);
                box-shadow: none;
                border-radius: var(--default-radius-mini);
                overflow: hidden;
              }
            }
          }
        }
      }
    }
  }

</style>
