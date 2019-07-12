<template>
  <div>
    <NsTableFriend ref="mainTable" :url=$api.guide.friendData.findList @add="onRedactFun"
                    @sendWechatMsg="sendWechatMsg" @removeDuplicate="removeDuplicate"
                   @onRedactFun="onRedactFun"  @handleSelectionChange="handleSelectionChange">
    </NsTableFriend>
    <!-- 好友详情-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="460px" v-model="friendDetail"   @keyup.enter.native="onKeyUp" @keyup.esc.native="onKeyUp" >
      <div class="guideBox" style="overflow-x:hidden;overflow-y:auto;">
        <div>微信号:&emsp;&emsp;&emsp;&emsp;{{friendDetail.wname}}</div>
        <div>头像</div>
        <p>微信昵称:&emsp;&emsp;&nbsp;&nbsp;&nbsp;{{friendDetail.nick}}</p>
        <p>性别：&emsp;&emsp;&emsp;&emsp;{{friendDetail.gender>=0?friendDetail.gender>0?'男':'女':'未知'}}</p>
        <p>地区：&emsp;&emsp;&emsp;&emsp;{{friendDetail.areaName}}</p>
        <p>标签：</p>
        <div>朋友圈互动次数：
          <br>
          赞我：0; 赞他：0。
          <br>
          评我：0; 评他：0。
        </div>
        <p>入会时间：</p>
        <p>专属导购：</p> <span>添加好友时间</span>
        <p>是否与专属导购为好友关系：</p>
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

</style>
