  <template>
    <div>
      <ns-page-table @edit="$emit('edit')" @add="$emit('add')" @batch-edit="$emit('batch-edit')" :colButton="6">
        <!-- 按钮 -->
        <template slot="buttons">
          <ns-table-operate-button :buttons="_data._table.table_buttons">
          </ns-table-operate-button>
        </template>
        <!-- 按钮-结束 -->

        <!-- 简单搜索 -->
        <!-- el-form 需添加 @submit.native.prevent 配置 -->
        <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
        <template slot="searchSearch">
          <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
            <el-form-item v-show="_data._queryConfig.expand === false">
              <el-input ref="quickText" v-model.trim="quickSearchModel.memberWechatNick" placeholder="请输入微信昵称" @keyup.enter.native="$quickSearchAction$('memberWechatNick')">
                <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name" @click="$quickSearchAction$('memberWechatNick')"/>
              </el-input>
            </el-form-item>
            <el-form-item>
              <ns-button type="text" @click="$handleTabClick">
                {{collapseText}}
                <Icon :type="_data._queryConfig.expand ? 'up' : 'down'"/>
              </ns-button>
            </el-form-item>
          </el-form>
        </template>
        <!-- 简单搜索-结束 -->

        <!-- 高级搜索 -->
        <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
        <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
        <template slot="advancedSearch" v-if="_data._queryConfig.expand">
          <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
                   :model="model" :rules="rules" :inline="true">
            <el-form-item label="微信昵称：">
              <el-form-grid size="xmd">
                <el-input  type="text" v-model.trim="model.memberWechatNick">
                </el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="成员类型：">
              <el-form-grid size="xmd">
                <el-select v-model="model.memberType" filterable clearable
                           :multiple="false">
                  <el-option label="不限" value="">
                  </el-option>
                  <el-option label="企业成员" value="1">
                  </el-option>
                  <el-option label="外部成员" value="2">
                  </el-option>
                </el-select>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="是否好友：">
              <el-form-grid size="xmd">
                <el-select v-model="model.ownerBind" filterable clearable
                           :multiple="false">
                  <el-option label="不限" value="">
                  </el-option>
                  <el-option label="是" value="1">
                  </el-option>
                  <el-option label="否" value="0">
                  </el-option>
                </el-select>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="入群方式：">
              <el-form-grid size="xmd">
                <el-select v-model="model.joinScene" filterable clearable
                           :multiple="false">
                  <el-option label="不限" value="">
                  </el-option>
                  <el-option label="直接邀请入群" value="1">
                  </el-option>
                  <el-option label="邀请链接入群" value="2">
                  </el-option>
                  <el-option label="扫码入群" value="3">
                  </el-option>
                </el-select>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="入群时间：" prop="time">
              <el-form-grid>
                <ns-datetime  v-model="model.joinTime"></ns-datetime>
              </el-form-grid>
            </el-form-item>
          </el-form>
          <div class="template-table__more-btn">
            <ns-button type="primary" @click="searchAction()">{{$t('operating.search')}}</ns-button>
            <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
          </div>
        </template>
        <!-- 高级搜索-结束 -->

        <template slot="table">
          <div class="template-table__bar" v-if="_data._table.ext">
            <div class="customer-info control-form">
              <div class="control-item">
                <label class="control-label">群名称：</label>
                <div class="control-content">
                  <ns-wechat-emoji :data="_data._table.ext.title"></ns-wechat-emoji>
                </div>
              </div>
              <div class="control-item" style="color: #909399;">
                <label class="control-label">群主：</label>
                <div class="control-content">
                  <span>{{_data._table.ext.chatroomLeaderNick}}</span>
                </div>
                <label class="control-label">建群时间：</label>
                <div class="control-content">
                  {{_data._table.ext.buildTime && _data._table.ext.buildTime.substring(0,10)}}
                </div>
                <label class="control-label">群公告：</label>
                <div class="control-content">
                  <template v-if="_data._table.ext.notice &&  _data._table.ext.notice.length > 40">
                    <el-tooltip effect="light">
                      <div slot="content" style="width: 500px;">{{_data._table.ext.notice}}</div>
                      <span>{{_data._table.ext.notice.substring(0,40)+ '...'}}</span>
                    </el-tooltip>
                  </template>
                  <template v-else>
                    {{_data._table.ext.notice}}
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- 表格 -->
          <el-table ref="table" :data="_data._table.data" class="template-table__main" resizable
                    v-loading.lock="_data._table.loadingtable"
                    stripe
                    :element-loading-text="$t('prompt.loading')"
                    @sort-change="$orderChange$" @selection-change="onHandleSelectChange">
            <el-table-column type="default" prop="member_head_img"
                             label="头像" dbcolumn="member_head_img" column="member_head_img" align="center"
                             width="80" :sortable="false">
              <template slot-scope="scope">
                <div v-if="!scope.row.member_head_img">
                  <img src="./images/head_demo.svg" width="60" height="60"/>
                </div>
                <div v-else>
                  <img :src="checkUrl(scope.row.member_head_img)" width="60" height="60"/>
                </div>
              </template>
            </el-table-column>

            <el-table-column :show-overflow-tooltip="true" type="default" prop="out_nick"
                             label="昵称" :sortable="false" align="left">
              <template slot-scope="scope">
                <ns-wechat-emoji :data="scope.row.member_wechat_nick ? scope.row.member_wechat_nick : '-'"></ns-wechat-emoji>
              </template>
            </el-table-column>

            <el-table-column :show-overflow-tooltip="true" type="default" prop="member_wechat_no"
                             label="成员类型" :sortable="false" align="center">
              <template slot-scope="scope">
                {{scope.row.member_type === 1 ? '企业成员' : scope.row.member_type === 2 ? '外部成员' : '-'}}
              </template>
            </el-table-column>

            <el-table-column :show-overflow-tooltip="true" type="default" prop="owner_bind"
                             label="是否好友" :sortable="false" width="80" align="center">
              <template slot-scope="scope">
                <span v-if='scope.row.owner_bind === 1'>
                  是
                </span>
                <span v-else-if='scope.row.owner_bind === 0'>
                  否
                </span>
                <span v-else>
                  -
                </span>
              </template>
            </el-table-column>

            <el-table-column :show-overflow-tooltip="true" type="default" prop="title"
                             label="所属微信群" :sortable="false" align="center">
              <template slot-scope="scope">
                {{scope.row.title ? scope.row.title : '暂无群名称'}}
              </template>
            </el-table-column>

            <el-table-column type="default" prop="join_time"
                             label="入群时间" :sortable="false" width="150" align="left">
              <template slot-scope="scope">
                <div v-if="scope.row.join_time">
                  {{scope.row.join_time.substring(0,10)}}
                </div>
              </template>
            </el-table-column>

            <el-table-column :show-overflow-tooltip="true" type="default" prop="join_scene"
                             label="入群方式" :sortable="false" align="left">
              <template slot-scope="scope">
                {{scope.row.join_scene === 1 ? '直接邀请入群' : scope.row.join_scene === 2 ? '邀请链接入群' : scope.row.join_scene === 3 ? '扫码入群' : '-'}}
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template slot="pagination">
          <!-- 分页 -->
          <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                         :page-sizes="_data._pagination.sizeOpts"
                         :total="_data._pagination.total"
                         :current-page="_data._pagination.page"
                         :page-size="_data._pagination.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         @size-change="$sizeChange$"
                         @current-change="$pageChange$">
          </el-pagination>
        </template>
  </ns-page-table>
    </div>
  </template>
<script>
import NsTableWeChatMember from './src/NsTableEnterpriseWeChatMember'

export default NsTableWeChatMember
</script>
<style scoped>
  @import "@theme/variables.pcss";
  .control-item {
    display: table;
    line-height: 20px;
    .control-label {
      display: table-cell;
      text-align: left;
    }
    .control-content {
      position: relative;
      margin-right: 20px;
    }
  }
</style>
