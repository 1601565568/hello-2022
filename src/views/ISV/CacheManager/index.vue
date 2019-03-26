<template>
  <div>
    <el-form>
      <el-form-item label="输入要缓存中的key值：" required>
        <el-autocomplete style="width: 250px"
          v-model="cacheKey" popper-append-to-body
          clearable
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入key值"
          @select="handleSelect">
        </el-autocomplete>
        <ns-button type="primary" @click="findKeyValue">查询</ns-button>
        <ns-button type="primary" @click="removeCacheKey">删除</ns-button>
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
</template>
<script>
  export default {
    data () {
      return {
        cacheKey: null,
        keys: [],
        cacheVlaue: null,
        timeout: null
      }
    },
    methods: {
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
        that.$http.fetch(this.$api.isv.getCacheKeyValue, {'cacheKey': that.cacheKey}).then(resp => {
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
        that.$http.fetch(this.$api.isv.removeCacheKey, {'cacheKey': that.cacheKey}).then(resp => {
          that.$notify.success('删除成功')
          that.cacheVlaue = null
        }).catch(resp => {
          that.$notify.error(resp.msg)
        })
      }
    },
    mounted () {
      let that = this
      that.$http.fetch(this.$api.isv.findCacheKeys, {'cacheKey': '*'}).then(resp => {
        if (resp.result && resp.result.length > 0) {
          this.keys = resp.result
        }
      })
    }
  }
</script>
