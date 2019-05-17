<template>
  <div class="page-activity">
    11111
  </div>
</template>
<script>
export default {
  name: 'ManageActivity',
  components: {

  },
  data () {
    return {
      tabList: [
        {
          title: '当前活动',
          url: '/current'
        },
        {
          title: '往期活动',
          url: '/past'
        }
      ]
    }
  },
  watch: {
    $route (current) {
      // this.showHeader = current.path !== '/current'
    }
  },
  methods: {
    navigate (id, url) {
      this.$mui.openPage({
        id: id,
        url: url,
        waitting: true
      })
    },
    getSwitchTab (item) {
      console.log(item)
      this.$router.replace(item.url)
    }
  },
  mounted () {
    console.log('change')
  }
}
</script>
