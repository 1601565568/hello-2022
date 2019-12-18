<template>
  <header class="nav">
      <router-link class="nav-logo" :to="{ name: 'index'}">
        <img src="@/assets/logo.png" alt="客道" />
      </router-link>
    <div class="nav-menu">
      <template v-for='(item) in $store.state.operate.menus'>
         <div :index="item.name"
              :key='item.path'
              v-if='!item.hidden && item.name != "examples"'
              class="nav-menu__item" :class="item.name === activeName ? 'is-selected-item' : ''">
          <router-link :to="item.path" class="nav-menu__item--link">
            <Icon className="icon" type="item.icon"/>
            <p class="link-name">{{item.title}}</p>
          </router-link>
        </div>
      </template>
    </div>
  </header>
</template>

<script>
export default {
  name: 'NavHead',
  data () {
    return {
      activeName: '',
      cloudUrl: ''
    }
  },
  mounted () {
    this.activeName = this.$route.matched[0].name
  },
  methods: {
  },
  watch: {
    $route () {
      this.activeName = this.$route.matched[0].name
    }
  }
}
</script>

<style scoped>
   @import "@theme/variables.pcss";
  .nav {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    height: var(--head-nav-height);
    background: var(--head-nav-bg);
    color:#fff;
    position: fixed;
    top: 0;
    left:0;
    right: 0;
    z-index: 1001;
    box-sizing: border-box;
    box-shadow: 0 2px 4px 0 #E3E3E3;
    @media screen and (max-width: 1625px){
      >>> .logout{
        width: var(--head-nav-height-s);
        height: var(--head-nav-height-s);
        line-height: var(--head-nav-height-s);
      }
    }
    .head-nav-info {
      padding-left: var(--default-padding-base);
      padding-top: 3px;
      >>> .el-dropdown {
        .el-button {
          padding: var(--default-padding-base) var(--default-padding-base) var(--default-padding-base) var(--default-padding-larger);
          border-radius: 3px;
        }
      }
    }
  }
  @b nav-logo{
    width: 199px;
    padding-left: 30px;
    img{
        width:144px;
       vertical-align: middle;
    }
  }
  @b nav-menu{
    flex:1;
    display: flex;
    height: 100%;
    @e item{
      display: flex;
      justify-content: center;
      min-width: 60px;
      height: 100%;
      padding: 0 25px;
      margin-right:1px;
      cursor: pointer;
      text-align: center;
      color: #fff;
      font-size: 14px;
      .icon{
        font-size: 24px;
        margin-bottom:8px;
        color: #fff;
      }
      &:hover{
        background: var(--head-item-hover-bg);
      }
      &.is-selected-item{
        background: var(--head-item-hover-bg);
      }
      @m link{
        display: flex;
        flex-direction: column;
        justify-content: center;
        .link-name{
          color: #fff;
        }
      }
    }
  }
  @b nav-tool{
    width: 265px;
    display: flex;
    align-items: center;
    padding-right: 15px;
    .icon-base {
      color: #fff;
      font-size: 30px;
      vertical-align: -5px;
      &.icon-admin{
          &.icon-admin{
          font-size: 24px;
          padding: 4px 4px 3px;
          &:before{
            position: relative;
            top:-1px;
          }
        }
      }
      &.icon-yunpingtai {
        margin-right:18px;
      }
    }
      >>> .el-dropdown {
        display: inline-block;
        color: #fff;
        cursor: pointer;
      }
  }
  @b user-icon{
    width: 40px;
    height: 38px;
    background: rgba(255,255,255,.2);
    border-radius: 100%;
  }
  @b brand-btn{
    margin-right: 24px;
    width: 116px;
    height: 32px;
    line-height: 31px;
    text-align: center;
    cursor: pointer;
    border: 1px solid #fff;
    border-radius:64px;
    color: #fff;
    .brand-name{
      width:80px;
      overflow: hidden;
      display: inline-block;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    i{
      vertical-align: 10px;
      margin-left: 0;
      margin-right:0;
    }
  }
  @b go-nascent-cloud{
    cursor: pointer;
  }
  @media screen and (max-width: 1625px){
    .nav{
      height: var(--head-nav-height-s);
    }
    .nav-menu__item{
      padding:0 15px;
    }
    .nav-menu__item{
      .icon{
        font-size: 22px;
        margin-bottom: 3px;
      }
    }
  }
</style>
