
<template>
  <div class="ns-friend-detail">
    <el-dialog :title="dialogTitle"
               :visible.sync="visible"
               :show-scroll-x="false"
               :close-on-click-modal="false"
               :before-close="onDialogClose"
               width="1100px"
               :modal-append-to-body='appendToBody'
               :append-to-body='appendToBody'>
      <div>
        <div class="head-wechat">
          <div class="head-left">
            <img class="head-img" :src="friendInfo.avatar">
            <span v-if="isMan + '' !== '0'" class="iconfont head-sex" :class="isMan + '' === '1' ? 'icon-nan' : 'icon-nv'"></span>
          </div>
          <div class="head-right">
            <div class="name-info"><span class="name">{{friendInfo.name}}</span><span class="source" :class="isWx ? 'isWx' : 'isQyVx'">{{isWx ? '@微信' : friendInfo.corpName ? '@' + friendInfo.corpName : ''}}</span></div>
            <div class="job-info">
              <span v-if="!isWx" class="job-name">{{friendInfo.position}}</span>
              <template v-if="cloudPlatformType === 'ecrp'">
                <span class="vip-info" :class="isVip ? 'vip-block' : 'non-vip'">{{isVip ? '会员' : '非会员'}}</span>
                <span v-if="isVip" class="vip-detail" @click="showVipDetail">查看会员详情</span>
              </template>
            </div>
          </div>
        </div>

        <div>
          <ElTable v-loading="tableLoading"
                   ref="friendTable"
                   :data="friendData"
                   height="260"
                   class="new-table_border">
            <template v-if="cloudPlatformType === 'ecrp'">
              <ElTableColumn :show-overflow-tooltip="true"
                           prop="name"
                           label="所属员工"/>
              <ElTableColumn :show-overflow-tooltip="true"
                           prop="shopName"
                           label="工作门店"/>
            </template>
            <ElTableColumn :show-overflow-tooltip="true"
                           prop="name"
                           label="企业微信成员"
                           v-else/>
            <ElTableColumn :show-overflow-tooltip="true"
                           prop="addTime"
                           label="添加时间"/>
            <ElTableColumn :show-overflow-tooltip="true"
                           prop="addWay"
                           label="来源">
              <template slot-scope="scope">
                {{scope.row.addWay ? addWay[scope.row.addWay] ? addWay[scope.row.addWay] : '未知' : '未知'}}
              </template>
            </ElTableColumn>
            <ElTableColumn :show-overflow-tooltip="true"
                           prop="remarkMobile"
                           label="备注手机号">
              <template slot-scope="scope">
                <div v-if="scope.row.remarkMobile">
                  <span class="tag-item"
                      v-for="(num, index) in scope.row.remarkMobile.split('|').filter(i => i)"
                      :key="index">
                    <el-tooltip placement="top" :content="num" effect="light">
                      <span class="tool-tip">{{num}}{{index + 1 === scope.row.remarkMobile.split('|').filter(i => i).length ? '' : '、'}}</span>
                    </el-tooltip>
                  </span>
                </div>
                <template v-else>
                  -
                </template>
              </template>
            </ElTableColumn>
            <ElTableColumn :show-overflow-tooltip="true"
                           prop="remark"
                           label="备注名">
              <template slot-scope="scope">
                <ns-wechat-emoji :data="scope.row.remark ? scope.row.remark : '-'"></ns-wechat-emoji>
              </template>
            </ElTableColumn>
            <ElTableColumn :show-overflow-tooltip="true"
                           prop="description"
                           label="描述">
              <template slot-scope="scope">
                <ns-wechat-emoji :data="scope.row.description ? scope.row.description : '-'"></ns-wechat-emoji>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="groupTags" width="230"
                            label="企业标签">
              <template slot-scope="scope">
                <div v-if="scope.row.groupTags" class="detail-tags-container">
                  <el-tooltip placement="top-start" effect="light" popper-class="tooltip-content" :disabled="scope.row.groupTags.length < 12">
                    <div slot="content" class="tooltip-tags">
                      <div class="tag-item"
                          v-for="(tag, index) in scope.row.groupTags.split('|').filter(i => i)"
                          :key="index">
                          <span class="tool-tip">{{tag}}</span>
                      </div>
                    </div>
                    <div class="group-tags">
                      <el-tag class="tag-item"
                          v-for="(tag, index) in scope.row.groupTags.split('|').filter(i => i)"
                          :key="index">
                        <!-- <el-tooltip placement="top" :content="tag" effect="light" :disabled="tag.length < 10"> -->
                          <span class="tool-tip">{{tag}}</span>
                        <!-- </el-tooltip> -->
                      </el-tag>
                    </div>
                  </el-tooltip>
                  <span class="etc" v-if="scope.row.groupTags.length > 12">
                    …{{scope.row.groupTags.split('|').filter(i => i).length}}个
                  </span>
                </div>
                <template v-else>
                  -
                </template>
              </template>
            </ElTableColumn>
          </ElTable>
          <el-pagination v-if="pagination4Emp.enable"
                         class="template-table__pagination"
                         :page-sizes="pagination4Emp.sizeOpts"
                         :total="pagination4Emp.total"
                         :current-page="pagination4Emp.page"
                         :page-size="pagination4Emp.size"
                         :layout="true ? 'total, sizes, prev, pager, next' : 'total'"
                         @size-change="$sizeChange$"
                         @current-change="getFriendDetail">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import index from './src/index.js'
// index.components = {
// }
export default index
</script>

<style scoped>
@import "@theme/variables.pcss";
.el-input__suffix:before {
  display: none !important;
}
.ns-friend-detail .head-wechat {
  width: 100%;
  margin: 20px 0 16px 0;
  display: flex;
}
.ns-friend-detail .head-left{
  position: relative;
  margin-right: 16px;
  width: 60px;
  height: 60px;
}
.ns-friend-detail .head-img{
  width: 60px;
  height: 60px;
  border-radius: 4px;
}
.ns-friend-detail .head-sex{
  position: absolute;
  right: -8px;
  top: -8px;
  background-color: white;
  width: 24px;
  height: 24px;
  padding: 2px 0 0 3px;
  border-radius: 50%;
}
.ns-friend-detail .icon-nan{
  font-size: 20px;
  color: #1890FF;
}
.ns-friend-detail .icon-nv{
  font-size: 20px;
  color: #FF7073;
}
.ns-friend-detail .head-right .name-info{
  display: flex;
  align-items: center;
  height: 25px;
  margin-bottom: 8px;
}
.ns-friend-detail .head-right .name-info .name{
  font-size: 17px;
  color: #262626;
  font-weight: 500;
  margin-right: 4px;
}
.ns-friend-detail .head-right .name-info .source{
  font-size: 14px;
}
.isWx{
  color: #3FBD00;
}
.isQyVx{
  color: #FA8500;
}
.head-right .job-info{
  display: flex;
  align-items: center;
  height: 24px;
}
.head-right .job-name{
  font-size: 14px;
  color: rgba(0,0,0,0.45);
  margin-right: 8px;
}
.head-right .vip-info{
  padding: 2px 8px;
  border-radius: 2px;
  margin-right: 4px;
}
.head-right .vip-block{
  background: #EDFAE1;
  border: 1px solid rgba(194,240,153,1);
}
.head-right .non-vip{
  background: #FFF4E6;
  border: 1px solid rgba(255,216,168,1);
}
.head-right .vip-detail{
  font-size: 14px;
  color: #0094FC;
  cursor: pointer;
}

>>> .el-table th.el-table-column--selection > .cell {
  padding: 0 14px;
}
>>> .el-dialog__header {
  padding: 16px!important;
}
>>> .el-dialog__body{
  padding: 0 16px;
}
.el-pagination{
  padding-top: 16px;
  padding-bottom: 16px;
}
/* 表格 */
.new-table_border {
  >>> .el-table__header th {
    background-color: #f5f5f5;
    padding: 8px 0;
    .cell {
      position: relative;
      &:after {
        content: " ";
        position: absolute;
        background: #e8e8e8;
        width: 1px;
        right: 0;
        top: 0px;
        bottom: 0px;
      }
    }
    &:last-child {
      .cell:after {
        display: none;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.detail-tags-container {
  display: flex;
  align-items: center;
  .group-tags {
    max-width: 230px;
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
    height: 24px;
    /* text-overflow: ellipsis; */
    .tag-item {
      margin-right: 5px;
      cursor: default;
      background: #E6F2FF;
      border: 1px solid rgba(189,220,255,1);
      border-radius: 2px;
    }
    .tool-tip {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-shrink: 0;
      color: rgba(0,0,0,0.85);
    }
  }
  .etc {
    flex-shrink: 0;
    height: 24px;
    line-height: 22px;
    margin-left: 4px;
    padding: 0 8px;
    background: #F5F5F5;
    border-radius: 2px;
  }
}
// ::v-deep .el-tooltip__popper{
//   background: #FFFFFF;
//   box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.12);
//   border-radius: 2px;
//   border: none;
// }
.tooltip-content{
  background: #FFFFFF;
  box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.12);
  border-radius: 2px;
  border: none !important;
  .tooltip-tags{
    max-width: 376px;
    // overflow: hidden;
    // display: inline-block;
    // white-space: nowrap;
    /* text-overflow: ellipsis; */
    .tag-item {
      display: inline-block;
      margin-right: 5px;
      padding: 2px 8px;
      cursor: default;
      background: #E6F2FF;
      border: 1px solid rgba(189,220,255,1);
      border-radius: 2px;
    }
    .tool-tip {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-shrink: 0;
      color: rgba(0,0,0,0.85);
    }
  }
}
</style>
