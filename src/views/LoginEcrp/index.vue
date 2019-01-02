<template>
<div class="content-ecrp_login" >
    <el-form  status-icon  ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="pass">
        <el-input type="password"  auto-complete="off" v-model='userName'></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="checkPass">
        <el-input type="password"  auto-complete="off" v-model='password'></el-input>
      </el-form-item>
      <el-form-item>
        <ns-button type="primary" @click="submit">提交</ns-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
   export default {
     data: function () {
       return {
         userName: 'admin',
         password: '123456'
       }
     },
     mounted: function () {

     },
     methods: {
       submit () {
         let parms = {userName: this.userName, password: this.password}
         let that = this
         this.$http.fetch(this.$api.core.access.operateLogin, parms)
          .then(resp => {
            that.$http.fetch(that.$api.core.access.getCloudSession)
              .then((data) => {
                that.$store.commit('operate/UPDATE_OPERATE_MENUS', {
                  menus: data.menus
                })
                that.$router.push({name: 'ADD_PAGES'})
              })
              .catch(resp => {

              })
          })
          .catch(resp => {

          })
       }
     }
   }
</script>

<style scoped>
.content-ecrp_login{
  position: fixed;
  z-index: 9999;
  height: 100%;
  background: white;
  width: 100%;
}
.el-form{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
</style>