<template>
  <el-dialog
    title="插件管理"
    :visible.sync="sVisible"
    class="dialog-chat"
    @closed="onClose"
    v-loading.lock="loading"
    :element-loading-text="$t('prompt.loading')">
    <div>
      <el-row>
        <el-form label-width="80px"
                 class="surround-btn"
                 :model="formModel"
                 ref="form"
                 novalidate='novalidate'
                 :rules='rules'>
          <el-form-item style='margin-bottom: 30px' label="插件：" prop="pluginId">
            <el-form-grid size="xmd">
              <el-input v-model="formModel.pluginId" placeholder='请输入插件id'>
              </el-input>
            </el-form-grid>
            <ns-button type="primary" size="small" @click="apply" :loading="saving" :disabled="saving">申请使用</ns-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <ns-page-table>
          <template slot="table">
            <el-table ref="table" :data="_data._table.data" class="template-table__main"
                      stripe
                      resizable v-loading.lock="_data._table.loadingtable"
                      :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
              <el-table-column :show-overflow-tooltip="true" type="default" prop="title"
                               label="名称" :sortable="false">
                <template slot-scope="scope">
                  <div class="avatar-name clearfix">
                    <div class="avatar-name__avatar"><img
                      :src='scope.row.headimgurl || NoImg' alt="头像"></div>
                    <div class="avatar-name__name">{{wordLimit(scope.row.nickname)}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" type="default" prop="appid"
                               label="id" :sortable="false" width="200px">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" type="default" prop="goods_code"
                               label="状态" :sortable="false" width="100px">
                <template slot-scope="scope">
                  {{getStatus(scope.row.status)}}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </ns-page-table>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import Index from './src/pluginManagement'
export default Index
</script>
<style scoped>
  @import "@/style/small/variables.pcss";

  @b avatar-name {
    height: 50px;
    display: flex;
    align-items: center;
    &:hover {
      .avatar-name__edit {
        visibility: visible;
      }
    }

    @e avatar {
      width: 50px;
      height: 50px;
      float: left;
      margin-right: var(--default-margin-larger);
      overflow: hidden;
      display: flex;
      align-items: center;
      @m circle {
        border-radius: 50%;
      }
      img {
        width: 100%;
      }
    }
    @e name {
      flex: 1;
      font-size: var(--default-font-size-base);
      max-height: 40px;
      white-space: normal;
      word-break: break-word;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      position: relative;
    }

    @e edit {
      visibility: hidden;
      cursor: pointer;
      font-size: var(--default-font-size-large);
      color: var(--theme-base-link-color-primary);
      &:hover {
        color: var(--theme-base-link-color-hover);
      }

      &:active {
        color: var(--theme-base-link-color-active);
      }
    }
  }
</style>
