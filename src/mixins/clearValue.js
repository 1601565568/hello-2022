// 监听列表页条件搜索清除值时搜索参数仍为''空的问题;
export default {
  watch: {
    model: {
      handler () {
        for (let it in this.model) {
          if (this.model[it] === '') {
            this.model[it] = null
          }
        }
      },
      deep: true
    }
  }
}
