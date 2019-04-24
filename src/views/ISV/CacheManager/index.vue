<template>
  <div>
    <div class="the_head_button">
      <ns-button :type="buttoncolor===0?'primary':'button'" @click="cacheManagement ">缓存管理</ns-button>
      <ns-button :type="buttoncolor===1?'primary':'button'" @click="encryptionTools">加密工具</ns-button>
    </div>
    <div v-if="buttoncolor===0">
      <el-form>
        <el-form-item label="输入要缓存中的key值：" required>
          <el-autocomplete style="width: 350px"
            v-model="cacheKey" popper-append-to-body
            clearable
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入key值"
            @select="handleSelect">
          </el-autocomplete>
          <ns-button type="primary" @click="findKeyValue">查询</ns-button>
          <ns-button type="primary" @click="removeCacheKey">删除</ns-button>
          <ns-button type="primary" @click="removeAllCacheKey">删除全部</ns-button>
        </el-form-item>
        <el-form-item label="缓存key对应的值" >
          <el-input
            readonly
            type="textarea" v-model="cacheVlaue"
            placeholder="暂无数据"
            :autosize="{ minRows: 4, maxRows: 100}">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="buttoncolor===1">
      <el-form>
        <el-form-item label="内容：" required>
          <el-input type="text" style="width: 250px" v-model="obj.data"
            placeholder="请输入内容">
          </el-input>
        </el-form-item>
        <el-form-item label="类型：" required>
            <el-form-grid size="xxmd">
              <el-radio-group v-model="obj.type">
                <el-radio :label="0">加密</el-radio>
                <el-radio :label="1">解密</el-radio>
              </el-radio-group>
            </el-form-grid>
          </el-form-item>
        <el-form-item label="自定义密钥：" >
          <el-input type="text" style="width: 250px" v-model="obj.cryptKey"
            placeholder="暂无数据">
          </el-input>
        </el-form-item>
        <el-form-item label="结果：" >
          <el-input
            readonly
            type="textarea" v-model="result"
            placeholder="暂无数据"
            :autosize="{ minRows: 4, maxRows: 100}">
          </el-input>
        </el-form-item>
      </el-form>
      <ns-button type="primary" @click="generate">生成</ns-button>
      <ns-button type="button" @click="reset">重置</ns-button>
    </div>
  </div>
</template>
<script>
import NavHead from '@/components/layout/OperateNavHead'
import ElAutocomplete from 'nui-v2/lib/autocomplete'
export default {
  components: {
    NavHead,
    ElAutocomplete
  },
  data () {
    return {
      cacheKey: null,
      keys: [],
      cacheVlaue: null,
      timeout: null,
      buttoncolor: 0,
      result: null,
      obj: {
        cryptKey: null,
        data: null,
        type: 0
      }
    }
  },
  methods: {
    generate () { // 生成按钮
      let _this = this
      if (this.obj.data === null) {
        this.$notify.error('内容为必填项！')
      } else if (this.obj.cryptKey !== null && this.obj.cryptKey.length % 8 !== 0) {
        this.$notify.error('自定义密钥长度必须为8的整数倍！')
      } else {
        this.$http.fetch(_this.$api.guide.guide.encryptionAndDecryption, {
          'cryptKey': _this.obj.cryptKey,
          'data': _this.obj.data,
          'type': _this.obj.type
        }).then(resp => {
          if (resp.result) {
            _this.result = resp.result
          }
          _this.$notify.success('保存成功')
        }).catch(resp => {
          _this.$notify.error(resp.msg || '保存失败')
        })
      }
    },
    reset () { // 重置按钮
      this.obj.cryptKey = null
      this.obj.data = null
      this.obj.type = 0
    },
    cacheManagement () {
      this.buttoncolor = 0
    },
    encryptionTools () {
      this.buttoncolor = 1
    },
    querySearchAsync (queryString, cb) {
      var keys = this.keys
      var results = queryString ? keys.filter(this.createStateFilter(queryString)) : keys
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 200)
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().startsWith(queryString.toLowerCase()))
      }
    },
    handleSelect (item) {
      console.log(item)
    },
    findKeyValue () {
      let that = this
      that.$http.fetch(this.$api.isv.getCacheKeyValue, { 'cacheKey': that.cacheKey }).then(resp => {
        that.cacheVlaue = null
        if (resp.result && resp.result !== '') {
          try {
            that.cacheVlaue = JSON.stringify(JSON.parse(resp.result), null, '\t')
          } catch (e) {
            that.cacheVlaue = resp.result
          }
        }
      }).catch((resp) => {
        that.$notify.error(resp.msg)
      })
    },
    removeCacheKey () {
      let that = this
      that.$http.fetch(this.$api.isv.removeCacheKey, { 'cacheKey': that.cacheKey }).then(resp => {
        that.$notify.success('删除成功')
        that.cacheVlaue = null
      }).catch(resp => {
        that.$notify.error(resp.msg)
      })
    },
    removeAllCacheKey () {
      let that = this
      that.$http.fetch(this.$api.isv.removeAllCacheKey).then(resp => {
        that.$notify.success('删除成功')
      }).catch(resp => {
        that.$notify.error('删除失败')
      })
    },
    async encryptionAndDecryption () { // 导购列表查询
      let _this = this
      await this.$http.fetch(_this.$api.guide.guide.encryptionAndDecryption, _this.obj).then(resp => {
        if (resp.result) {
          _this.result = resp.result
        }
        _this.$notify.success('保存成功')
      }).catch(resp => {
        _this.$notify.error(resp.msg || '保存失败')
      })
    }
  },
  mounted () {
    let that = this
    that.$http.fetch(this.$api.isv.findCacheKeys, { 'cacheKey': '*' }).then(resp => {
      if (resp.result && resp.result.length > 0) {
        this.keys = resp.result
      }
    })
  }
}
</script>
<style>
.the_head_button{
  padding:5px 5px;
  background-color:#fff;
  border-radius: 3px;
  margin-bottom: 20px;
}
</style>
