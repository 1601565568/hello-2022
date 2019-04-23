<template>
<div class="content-ecrp_login" >
  <div class='login_top' ></div>
  <div class='login_bot flex'>
    <p><span class='bot_com' @click="nextTo('http://www.miitbeian.gov.cn')">闽ICP备11001364号-4</span></p>
    <p>Copyright © 2017 <span class='bot_com' @click="nextTo('https://www.nascent.cn')">南讯软件</span> All Rights Reserved</p>
  </div>
  <div class="demo-ruleForm">
    <img src="../../assets/login.png" alt="" style='height:200px;width:795px'>
     <!-- class="demo-ruleForm" -->
    <el-form  status-icon  ref="ruleForm2" label-width="100px" style='margin-top:70px'>
      <el-form-item  prop="pass">
        <el-input type="text"  auto-complete="off" v-model='userName' placeholder='账号/手机号'></el-input>
      </el-form-item>
      <el-form-item  prop="checkPass">
        <el-input type="password"  auto-complete="off" v-model='password' placeholder='密码'></el-input>
      </el-form-item>
      <el-form-item>
        <ns-button type="success" @click="submit">登录</ns-button>
      </el-form-item>
    </el-form>
  </div>

  </div>
</template>
<script>
export default {
  data: function () {
    return {
      userName: '',
      password: ''
    }
  },
  mounted: function () {

  },
  methods: {
    nextTo (url) {
      window.location.href = url
    },
    submit () {
      let parms = { userName: this.userName, password: this.password }
      let that = this
      this.$http.fetch(this.$api.core.access.operateLogin, parms)
        .then(resp => {
          that.$http.fetch(that.$api.core.access.getCloudSession)
            .then((data) => {
              that.$store.commit('operate/UPDATE_OPERATE_MENUS', {
                menus: data.menus
              })
              that.$router.push({ name: 'ADD_PAGES' })
            })
            .catch(resp => {

            })
        })
        .catch(resp => {
          that.$notify.error('提示：' + resp.msg)
        })
    }
  }
}
</script>

<style scoped>
.content-ecrp_login{
  position: fixed;
  z-index: 2006;
  height: 100%;
  background: white;
  width: 100%;
}
.demo-ruleForm{
  position: absolute;
  padding-top:60px;
  left: 50%;
  top: 0;
  transform: translate(-50%,0);
}
.login_top{
  background-color: #017FCB;
  height: 90%;
}
.login_bot{
  background-color: #242c41;
  height: 10%;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}
.login_bot p{
  background-color: #242c41;
  height: 10%;
  color:#ffffff;
  font-size: 12px !important;
  height: 20px;
}
.login_bot .bot_com{
  color: #017fcb;
  text-decoration: underline;
  cursor:pointer;
}
</style>
<style>
.demo-ruleForm .el-form-item__content{
  margin-left: 0 !important;
  text-align:center;
}
.demo-ruleForm .el-form-item{
  margin-bottom:20px !important;
}
.demo-ruleForm .el-form-item__content button{
  width:320px;
  height:40px !important;
}
.demo-ruleForm .el-form-item__content .el-input{
  width:320px;
  height:40px !important;
}
.demo-ruleForm .el-form-item__content .el-input .el-input__inner{
  display: inline-block !important;
  height:40px !important;
}
</style>
