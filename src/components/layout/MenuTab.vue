<template>
  <div class="menu-tab">
    <router-link  v-for="(sub,index) in thatTabList" class="menu-tab__item" :class="[$route.matched[3].name===sub.name ? 'is-active': '']"
                  :key='sub.path'
                  :to="sub.path">
      {{sub.title}}
    </router-link>
  </div>
</template>
<script>
  import TreeParentSearch from 'utils/TreeParentSearch'
  export default {
    data () {
      return {
        thatTabList: []
      }
    },
    methods: {
      getThatTabList () {
        this.thatTabList = TreeParentSearch(this.$store.state.user.menus, 'name', 'children', this.$route.name)
      }
    },
    created () {
      this.getThatTabList()
    },
    watch: {
      '$route' () {
        this.getThatTabList()
      }
    }

  }
</script>

<style scoped>
  @import "../../style/small/variables.pcss";
  @component-namespace menu {
    @b tab {
      background-color: var(--theme-color-white);
      border-bottom: 1px solid var(--theme-base-border-color-primary);
      @e item {
        box-sizing: border-box;
        display: inline-block;
        list-style: none;
        font-size: var(--default-font-size-base);
        font-weight: 500;
        color: var(--theme-font-color-primary);
        position: relative;
        padding: var(--default-padding-base) var(--default-padding-xlarger);
        line-height: 30px;
      &.router-link-active {
      &:before {
         content: ' ';
         position: absolute;
         bottom: 0;
         left: 20px;
         right: 20px;
         border-bottom: 2px solid var(--theme-color-primary);
       }
        color: var(--theme-color-primary);
      }
    }
  }
  }
</style>
