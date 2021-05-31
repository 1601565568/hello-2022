<template>
  <div>
    <ns-table-guide ref="table" :url=$api.guide.guide.findBrandListOnCondition @synchronousStores="onRedactFun" @scopeRowCount="scopeRowCount"
        @elIconMenu="elIconMenu" @batchElIconMenu="batchElIconMenu" @shopEdit="shopEdit" @allDelete="allDelete" @dimission="dimission" @showShop="showShop" @onDelsTipFun="onDelsTipFun" @onRedactFun="onRedactFun" @handleSelectionChange="handleSelectionChange">
    </ns-table-guide>
    <!-- 下载门店招募码开始 -->
    <el-dialog :title="title"  :visible.sync="memberBelongingShow" width="750px" >
      <div class="recruitingcode_title">
        <div class="recruitingcode">
          <Icon type="erweima"/>
        </div>
        <div class="explanation">
          <div>
            <template><el-checkbox v-model="checked"></el-checkbox></template>
            <span class="explanation__member">
              会员注册时是否需要关注公众号
            </span>
          </div>
          <div>勾选此选项，则下载为微信公众号二维码；否则，下载为会员开卡二维码。</div>
          <span v-if="batchDownLoad" class="text-primary">
            <Icon type="exclamation-circle"/>&nbsp;未关联VIP体系的门店，不会下载门店招募码
          </span>
        </div>
      </div>
      <div>
        <el-table
          ref="multipleTable"
          :data="dataList"
          tooltip-effect="dark"
          stripe>
          <el-table-column label="尺寸">
            <template slot-scope="scope">
              <div> {{scope.row.introduce.size}}</div>
              <div> {{scope.row.introduce.distance}}</div>
            </template>
          </el-table-column>
          <el-table-column label="公众号二维码" align="center">
            <template slot='header' scope='header'>
              <span>
                <span>{{header.column.label}}</span>
                  <el-popover placement="bottom" trigger="click">
                    <div>
                        <img src="../../../assets/putongerweima.png" class="photosize">
                      </div>
                    <Icon type="question-circle" slot="reference"/>
                  </el-popover>
              </span>
            </template>
            <template slot-scope="scope">
              <div v-if="checked" :fixScopeBug="scope.testId">
                <div v-if="!batchDownLoad">
                  <a :href="url+0+'&shopId='+succeedObj.shopId+'&size='+ scope.row.size">
                    <i class="download">
                      <Icon type="xiazai"/>
                    </i>
                  </a>
                </div>
                <div v-if="batchDownLoad">
                  <a :href="batchUrl+0+'&shopId='+succeedObj.shopId+'&size='+ scope.row.size+'&shopIds='+ batchShopIds">
                    <i class="download">
                      <Icon type="xiazai"/>
                    </i>
                  </a>
                </div>
              </div>
              <div v-else>
                <i class="download text-secondary  cursor-no-drop">
                  <Icon type="xiazai"/>
                </i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="会员卡二维码" align="center">
            <template slot='header' scope='header'>
              <span>
                <span>{{header.column.label}}</span>
                 <el-popover placement="bottom" trigger="click">
                    <div>
                         <img src="../../../assets/putongerweima.png" class="photosize">
                      </div>
                    <Icon type="question-circle" slot="reference"/>
                  </el-popover>
              </span>
            </template>
            <template slot-scope="scope">
              <div v-if="!checked" :fixScopeBug="scope.testId">
                <div v-if="!batchDownLoad">
                  <a :href="url+1+'&shopId='+succeedObj.shopId+'&size='+ scope.row.size">
                    <i class="download"><Icon type="xiazai"/></i>
                  </a>
                </div>
                <div v-else>
                  <a :href="batchUrl+1+'&shopId='+succeedObj.shopId+'&size='+ scope.row.size+'&shopIds='+ batchShopIds">
                    <i class="download">
                      <Icon type="xiazai"/>
                    </i>
                  </a>
                </div>
              </div>
              <div v-else>
                <i class="download text-secondary cursor-no-drop" >
                  <Icon type="xiazai"/>
                </i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <ns-button @click="memberBelongingShow = false">关闭</ns-button>
      </div>
    </el-dialog>
    <!-- 下载门店招募码结束 -->
    <!-- 数字门店查看详情开始 -->
    <el-dialog :title="memberBelongingtitle"  :visible.sync="scopeRowCountShow" width="1000px" >
      <el-table ref="table" :data="shopFindList" stripe>
        <el-table-column prop="name" label="数字门店&ID" align="left">
          <template slot-scope="scope">
            {{scope.row.shop_name || '-'}}
            <p>ID:{{scope.row.shop_id}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="shop_status" label="状态" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.shopStatus > 0 ? 'text-success' : scope.row.shopStatus === -1 ? 'text-error' : ''">
              {{scope.row.shopStatus === 0?'删除':scope.row.shopStatus === 1?'正常':scope.row.shopStatus ===
              -1?'暂停':'关店'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="contact_json" label="联系方式" align="left">
          <template slot-scope="scope">
            {{scope.row.contact_json || '-'}}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <ns-button class="scopeRowCountShow_button" @click="scopeRowCountShow = false">关闭</ns-button>
      </div>
    </el-dialog>
    <!-- 数字门店查看详情结束 -->
  </div>
</template>

<script>
import List from './src/List'
import NsTableGuide from './NsTableGuide'
List.components = {
  NsTableGuide
}
export default List
</script>
<style scoped>
  @import "@theme/variables.pcss";

  >>>.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
    display: inline-block;
  }
  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }
  .recruitingcode_title{
    display: flex;
    justify-content: flex-start;
    padding: 0 var(--default-padding-larger);
  }
  .recruitingcode{
    font-size: 34px;
    font-weight: 600;
    color: var(--theme-color-primary);
    position: relative;
    top: 1px;
  }
  .explanation {
    margin-left: var(--default-margin-larger);
    .explanation__member {
      margin-left: var(--default-margin-mini);
    }
  }
  .download{
    font-size: var(--dafault-font-size-xlarge);
  }
  .photosize {
    width: 140px;
    height: 140px;
  }
  /* 去掉分页器的阴影 */
  >>> .el-pagination {
    box-shadow: none;
  }
  .cursor-no-drop {
    cursor: no-drop;
  }
</style>
