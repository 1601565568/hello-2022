<template>
  <header class="nav">
      <router-link class="nav-logo" :to="{ name: 'index'}">
        <img src="../../assets/logo.png" alt="客道" />
      </router-link>
    <div class="nav-menu">
      <div v-for='(item,index) in $store.state.operate.menus'
            :index="item.name"
            :key='item.path'
            v-if='!item.hidden && item.name != "examples"'
            class="nav-menu__item" :class="item.name === activeName ? 'is-selected-item' : ''">
        <router-link :to="item.path" class="nav-menu__item--link">
          <i :class="'iconfont icon-' + item.icon"></i>
          <p class="link-name">{{item.title}}</p>
        </router-link>
      </div>
    </div>
    <!-- <div class="nav-tool">
      <div class="head-nav-info">
        <el-dropdown @command="onHandleViewCommand" trigger="click">
          <div class="brand-btn">
            <span class="brand-name">{{$store.state.user.brand.name}}</span><i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown" style='left : 1643px'>
            <el-dropdown-item v-for="(brand ,index) in $store.state.user.brands"
                              :key="index" :command="brand.viewId">{{brand.viewName}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="go-nascent-cloud" title="返回云平台">
          <a :href="cloudUrl"><i class="iconfont icon-yunpingtai2"></i></a>
      </div>
      <div class="userinfo" :title="$store.state.user.remumber.remumber_login_info.nick">
        <el-dropdown
          trigger="click"
          @command='setDialogInfo'>
            <span class="el-dropdown-link">
              <i class="user-icon iconfont icon-admin"></i>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command='logout'>退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div> -->
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
    this.setBrandsInView()
    this.onBackCloud()
    this.activeName = this.$route.matched[0].name
  },
  methods: {
    onBackCloud: function () {
      let that = this
      that.$http.fetch(that.$api.core.access.getCloudPlatformAddress)
        .then((resp) => {
          that.cloudUrl = resp.result
        })
    },
    /**
       * 退出登录
       */
    logout () {
      this.$store.dispatch('user/logout').then((resp) => {

      }).catch(() => {
        this.$notify.error('退出失败，系统异常！')
      })
    },
    /**
       * 弹出框-修改密码或者系统设置
       * @param {string} cmditem 弹框类型
       */
    setDialogInfo (cmditem) {
      if (!cmditem) {
        // console.log('test')
        this.$message('菜单选项缺少command属性')
        return
      }
      switch (cmditem) {
        case 'logout':
          this.logout()
          break
      }
    },
    /**
       * 设置品牌视角
       */
    setBrandsInView () {
      let brand = this.$store.state.user.brand
      if (!brand) {
        brand = {
          id: -1,
          name: '未创建视角',
          brandType: -1
        }
        this.$store.dispatch('user/update_user_brand', {
          brand: brand
        })
      }
    },
    /**
       * 视角切换
       * @param brandId 品牌id
       */
    changeView (brand) {
      let params = {
        brandId: brand.id,
        brandType: brand.brandType
      }
      let that = this
      return this.$http.fetch(this.$api.core.changeView, params).then(() => {
        that.$store.dispatch('user/update_user_brand', {
          brand: brand
        })
      })
    },
    /**
       * 处理视角切换命令
       * @param command
       */
    onHandleViewCommand: function (command) {
      // 判断是否品牌视角有改变
      if (command !== this.$store.state.user.brand.id) {
        this.$store.state.user.brands.forEach(item => {
          // 判断是否相等
          if (item.viewId === command) {
            let that = this
            // 视角切换接口
            this.changeView({ id: item.viewId, name: item.viewName, brandType: item.viewType }).then(() => {
              that.$emit('brand-change', command)
            })
          }
        })
      }
    }
  },
  watch: {
    $route () {
      this.activeName = this.$route.matched[0].name
    }
  }
}
</script>

<style scoped>
   @import "@/style/small/variables.pcss";
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
    .logout {
      width: var(--head-nav-height);
      height: var(--head-nav-height);
      line-height: var(--head-nav-height);
      text-align: center;
      cursor: pointer;
    }
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
      .iconfont{
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
    .iconfont{
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
      &.icon-yunpingtai2{
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
      .iconfont{
        font-size: 22px;
        margin-bottom: 3px;
      }
    }
  }
</style>
