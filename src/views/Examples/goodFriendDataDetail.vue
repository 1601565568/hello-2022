<template>
  <div class="talk-chat">
    <ns-button type="text primary" @click="dialogVisible = true" class="talk-main__header--btn">
      详情
    </ns-button>
    <!-- 详情弹窗-->
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="662px" class="detail-dialog">
      <div class="detail-dialog__content">
        <el-form label-width="70px" class="detail-leftside">
          <el-form-item label="微信号：">
            <el-form-grid class="hidden">baiyu19900408baiyu19900408baiyu19900408baiyu19900408baiyu19900408baiyu19900408</el-form-grid>
          </el-form-item>
          <el-form-item label="微信昵称：">
            <el-form-grid class="hidden">长安自在风长安自在风长安自在风长安自在风长安自在风长安自在风长安自在风长安自在风长安自在风长安自在风</el-form-grid>
          </el-form-item>
          <el-form-item label="性别：">
            <el-form-grid>男</el-form-grid>
          </el-form-item>
          <el-form-item label="地区：">
            <el-form-grid class="hidden">中国 / 浙江 / 杭州市中国 / 浙江 / 杭州市</el-form-grid>
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
                <div>赞我：0；赞他：0</div>
                <div>评我：0；评他：0；</div>
              </div>
              <div class="detail-lasttime">
                <div class="detail-leftside__chat--black">最后联系时间：</div>
                <div>发：2019-05-28 15:27:22</div>
                <div>接：2019-05-29 16:00:01</div>
              </div>
            </el-form-grid>
          </el-form-item>
          <el-form-item label-width="30px" class="margintop">
            <el-form-grid class="detail-leftside__chat">
              <div>
                <span class="detail-leftside__chat--black">入会时间：</span>
                <span>2019-05-28 15:27:22</span>
              </div>
              <div class="detail-addtime">
                <span class="detail-leftside__chat--black">添加好友时间：</span>
                <span>2019-05-28 15:27:22</span>
              </div>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="专属导购：" label-width="100px">
          <el-form-grid>赵云澜</el-form-grid>
        </el-form-item>
          <el-form-item label="是否与专属导购为好友关系：" label-width="210px">
            <el-form-grid>是</el-form-grid>
          </el-form-item>
        </el-form>
        <div class="detail-rightside">
          <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="detail-rightside__img" alt="商品图片">
        </div>
      </div>
    </el-dialog>
    <!-- 详情弹窗-->
  </div>
</template>
<script>
import ElTag from 'nui-v2/lib/tag'
export default {
  components: {
    ElTag
  },
  data() {
    return {
      dialogVisible: false
    }
  }
}
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
