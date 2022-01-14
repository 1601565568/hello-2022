<template>
<div>
  <div v-if="memberManagePlan == 2" class="nav_warpper">
    <div class="nav-avatar" @click="customerService" title="智慧客服端下载">
      <!--    <span class="nav-avatar__icon">-->
      <Icon type="customer-service" class="admin_icon" style="font-size: 20px;color:#fff"  className="nav-avatar__icon--svg" />
      <!--    </span>-->
    </div>
    <div class="line"></div>
    <el-dialog title="智慧客服客户端下载" :visible.sync="customerVisible" width="500px" class="detail-dialog">
      <div class="text_link">{{customerServiceUrl}}</div>
      <div class="copy_link" @click='copy(customerServiceUrl)'>
        <Icon type="copy-paste" class="admin_icon" style="font-size: 13px" className="nav-avatar__icon--svg" />
        <span>复制链接</span>
      </div>
      <span slot="footer">
      <ns-button class="btn"  @click="onConfirm">关闭</ns-button>
    </span>
    </el-dialog>
  </div>
</div>
</template>

<script>

export default {
  data () {
    return {
      customerVisible: false,
      memberManagePlan: 1, // 企业方案1：企微2：个号
      customerServiceUrl: null
    }
  },
  mounted () {
    this.$http.fetch(this.$api.core.common.getRecruitVersion).then(data => {
      this.memberManagePlan = data.result.memberManagePlan
    })
  },
  methods: {
    customerService () {
      this.$http.fetch(this.$api.core.common.findCustomerServiceUrl).then(data => {
        if (data.success) {
          this.customerServiceUrl = data.result
          this.customerVisible = true
        } else if (data.success && !data.result) {
          this.$message.error('未获取到智慧客服地址')
        } else {
          this.$message.error('获取智慧客服地址失败')
        }
      })
    },
    onConfirm () {
      this.customerVisible = false
    },
    // 复制
    copy (msg) {
      let url = msg
      let oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      // console.log(oInput.value)
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    }
  }
}
</script>

<style scoped>
  .nav_warpper {
    display: flex;
    align-items: center;
  }
  .nav-avatar{
    cursor: pointer;
    /*padding-top: 6px;*/
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background: rgba(255, 255, 255, .2);
    border-radius: 50%;
    margin-right: 10px;
  }
  .line{
    width: 1px;
    height: 16px;
    margin-right: 20px;
    background: rgba(255,255,255,.5);
  }
  .admin_icon {
    cursor: pointer;
    /*margin-right: 5px;*/
    font-size: 26px
  }
  .text_link{
    margin-top: 20px;
    padding: 15px 15px;
    padding-right: 24px;
  }
  .copy_link{
    margin-bottom: 26px;
    color: #0094FC;
    padding: 0 5px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 26px;
  }
  .copy_link span{
    cursor: pointer;
    display: inline-block;
    margin-left: 5px;
    cursor: pointer;
  }
  .btn{
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>
