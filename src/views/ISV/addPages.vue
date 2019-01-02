<template>
 <div>
   <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
    <el-form-item label="名称">
      <el-input v-model="sizeForm.name"></el-input>
    </el-form-item>
    <!-- <el-form-item label="id">
      <el-input v-model="sizeForm.id"></el-input>
    </el-form-item> -->
    <el-form-item label="parent_id">
      <el-input v-model="sizeForm.parent_id"></el-input>
    </el-form-item>
    <el-form-item label="路径">
      <el-input v-model="sizeForm.url"></el-input>
    </el-form-item>
    <el-form-item label="CODE">
      <el-input v-model="sizeForm.code"></el-input>
    </el-form-item>
    <ns-button type="primary" @click="onSubmit">立即创建</ns-button>

  </el-form>

 </div>
</template>

<script>
  export default {
    name: 'detail',
    data () {
      return {
        sizeForm: {
          name: '',
          parent_id: '',
          url: '',
          type: 'MENU',
          description: '测试描述',
          sort: 1,
          code: '',
          icon: 'kehudongcha2'

        }
      }
    },
    methods: {
      onSubmit () {
        this.saveFun()
      },
      async saveFun () {
        // this.sizeForm.id = Number(this.sizeForm.id)
        await this.$http
        .fetch(this.$api.core.access.saveOrUpdateMenu, this.sizeForm)
        .then(resp => {

        })
        .catch(resp => {
          this.$notify.error(resp.msg)
        })
      },
      async deleteMenu () {
        let parms = {id: 17}
        await this.$http
        .fetch(this.$api.core.access.deleteMenu, parms)
        .then(resp => {

        })
        .catch(resp => {
          this.$notify.error(resp.msg)
        })
      }
    },
    mounted () {
      console.log('addpages:', this.$store)
    }
  }
</script>

