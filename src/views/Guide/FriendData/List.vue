<template>
  <div>
    <NsTableFriend ref="mainTable" :url=$api.guide.friendData.findList @add="onRedactFun"
                    @sendWechatMsg="sendWechatMsg" @removeDuplicate="removeDuplicate"
                   @onRedactFun="onRedactFun"  @handleSelectionChange="handleSelectionChange">
    </NsTableFriend>
    <!-- 好友详情-->
    <el-dialog
      title="详情"
      :visible.sync="dialogFormVisible"
      width="662px" class="detail-dialog" v-model="friendDetail">
      <div class="detail-dialog__content">
        <el-form label-width="70px" class="detail-leftside">
          <el-form-item label="微信号：">
            <el-form-grid class="hidden">{{friendDetail.wid}}</el-form-grid>
          </el-form-item>
          <el-form-item label="微信昵称：">
            <el-form-grid class="hidden">{{friendDetail.nick}}</el-form-grid>
          </el-form-item>
          <el-form-item label="性别：">
            <el-form-grid>{{friendDetail.gender>=0?friendDetail.gender>0?'男':'女':'未知'}}</el-form-grid>
          </el-form-item>
          <el-form-item label="地区：">
            <el-form-grid class="hidden">{{friendDetail.areaName}}</el-form-grid>
          </el-form-item>
          <el-form-item label="标签：" class="margintop">
            <el-tag>超级会员</el-tag>
            <el-tag>白领</el-tag>
            <el-tag>邓林之阴</el-tag>
            <el-tag>超级会员</el-tag>
            <el-tag>白领</el-tag>
            <el-tag>邓林之阴</el-tag>
            <el-tag>超级会员</el-tag>
            <el-tag>白领</el-tag>
            <el-tag>邓林之阴</el-tag>
            <el-tag>超级会员</el-tag>
            <el-tag>白领</el-tag>
            <el-tag>邓林之阴</el-tag>
          </el-form-item>
          <el-form-item label-width="30px" class="margintop">
            <el-form-grid class="detail-leftside__chat">
              <div>
                <div class="detail-leftside__chat--black">朋友圈互动次数：</div>
                <div>赞我：{{friendDetail.likeNum}}；赞他：{{friendDetail.likeHimNum}}；</div>
                <div>评我：{{friendDetail.commentsNum}}；评他：{{friendDetail.commentsHimNum}}；</div>
              </div>
              <div class="detail-lasttime">
                <div class="detail-leftside__chat--black">最后联系时间：</div>
                <div>发：{{friendDetail.sendConversationTime?friendDetail.sendConversationTime:'-'}}</div>
                <div>接：{{friendDetail.receiveConversationTime?friendDetail.receiveConversationTime:'-'}}</div>
              </div>
            </el-form-grid>
          </el-form-item>
          <el-form-item label-width="30px" class="margintop">
            <el-form-grid class="detail-leftside__chat">
              <div>
                <span class="detail-leftside__chat--black">入会时间：</span>
                <span>{{friendDetail.addTime}}</span>
              </div>
              <div class="detail-addtime">
                <span class="detail-leftside__chat--black">添加好友时间：</span>
                <span>{{friendDetail.createTime}}</span>
              </div>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="专属导购：" label-width="100px">
            <el-form-grid>{{friendDetail.name}}</el-form-grid>
          </el-form-item>
          <el-form-item label="是否与专属导购为好友关系：" label-width="210px">
            <el-form-grid>{{friendDetail.name?'是':'否'}}</el-form-grid>
          </el-form-item>
        </el-form>
        <div class="detail-rightside">
          <img :src="friendDetail.head" class="detail-rightside__img" alt="微信头像">
        </div>
      </div>
    </el-dialog>




  </div>
</template>

<script>
import List from './src/List'
import NsTableFriend from './NsTableFriend'
List.components = {
  NsTableFriend
}
export default List
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  @component-namespace detail {
    @b dialog {
      @e content {
        position: relative;
        padding: 0 30px 30px;
      }
    }
    @b leftside {
      padding-top: 10px;
      @e chat {
        display: flex;
        @m black {
          color: var(--theme-font-color-secondary);
        }
      }
    }
    @b lasttime {
      margin-left: 180px;
    }
    @b addtime {
      margin-left: 105px;
    }
    @b rightside {
      width: 84px;
      height: 84px;
      position: absolute;
      top: 5px;
      right: 25px;
      @e img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  .hidden {
    width: 70%;
    text-overflow : ellipsis;
    white-space : nowrap;
    overflow : hidden;
  }
  .margintop {
    margin-top: 20px;
  }
  >>> .el-form-item__label {
    font-size: var(--default-font-size-base);
    color: var(--theme-font-color-secondary);
  }
  >>>.el-dialog__body {
    color: var(--theme-font-color-primary);
  }
</style>
