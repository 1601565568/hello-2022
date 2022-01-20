<template>
  <header class="nav">
    <a class="nav-logo" :href="$store.state.user.remumber.remumber_login_info.cloudUrl"
       :title="'返回云平台（'+ $store.state.user.remumber.remumber_login_info.companyName + '）'">
      <img src="@/assets/logo.png" />
    </a>
    <div class="nav-menu">
      <div v-for='(item) in $store.state.user.menus'
           :index="item.name"
           :key='item.path'
           class="nav-menu__item" :class="item.name === activeName ? 'is-selected-item' : ''">
        <router-link :to="item.path" class="nav-menu__item--link">
          <Icon className="menu-item__icon" :type="item.icon"/>
          <p class="link-name">{{item.title}}</p>
        </router-link>
      </div>
    </div>
    <div class="nav-tool">
      <NavToolSlot/>
      <div class="nav-brand" v-if="isShowBrandSelect" >
        <ElSelectLoad v-model="value" :props="props" :options="$store.state.user.brands" filterable @change="onHandleViewCommand"></ElSelectLoad>
      </div>
      <div class="nav-brand" v-if="isShowAreaSelect" >
        <ns-droptree ref="areaTree" :title="area.text" v-model="area" v-loading.lock="areaSelDisabled" :data="areaData" :droptreePopoverWidth="280" droptreePopoverPlacement="bottom-end" :clearable="false" :inputDisabled="areaSelDisabled" @current-change="onChangeArea"></ns-droptree>
      </div>
      <el-dropdown
        trigger="click"
        @command='setDialogInfo'>
        <div class="nav-avatar" :title="$store.state.user.remumber.remumber_login_info.name">
          <span class="nav-avatar__icon"><Icon type="admin" className="nav-avatar__icon--svg" /></span>
          <div class="nav-avatar__name">{{$store.state.user.remumber.remumber_login_info.name}}</div>
          <Icon fontType="el-icon-arrow-down" className="nav-avatar__dropdown"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command='logout'>退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import isRefresh from '@nascent/ecrp-ecrm/src/utils/isRefresh'
import ElSelectLoad from '@nascent/nui/lib/select-load'
import isShowArea from '@/layout/small/src/isShowArea'
import NavToolSlot from '@/layout/small/src/NavToolSlot'
import NsDroptree from '@nascent/ecrp-ecrm/src/components/NsDroptree'
export default {
  components: {
    ElSelectLoad,
    NavToolSlot,
    NsDroptree
  },
  data () {
    return {
      areaData: JSON.parse(JSON.stringify(this.$store.state.user.areaTree)),
      activeName: '',
      isShowBrandSelect: true,
      isShowAreaSelect: true,
      // Todo
      // value: this.$store.state.user.brand.name,
      area: {
        text: this.$store.state.user.area.name,
        value: this.$store.state.user.area.id
      },
      props: {
        label: 'corpName',
        value: 'corpId'
      },
      areaSelDisabled: false,
      originArea: {
        text: this.$store.state.user.area.name,
        value: this.$store.state.user.area.id
      }
    }
  },
  mounted () {
    this.activeName = this.$route.matched[0].name
    const areaId = this.$route.query.areaId
    this.onHandleAreaCommand(areaId || this.$store.state.user.area.id)
    // Todo
    // let corpId = this.$route.query.corpId
    // if (corpId) {
    //   this.onHandleViewCommand(corpId)
    // } else {
    //   // 获取当前企业微信的信息
    //   this.changeView(this.$store.state.user.brand)
    // }
    let that = this
    window.onbeforeunload = function (e) {
      e = e || window.event
      // 兼容IE8和Firefox 4之前的版本
      let returnValue = null
      if (e && !that.$store.state.common.is_refresh) {
        e.returnValue = '关闭提示'
      } else if (!that.$store.state.common.is_refresh) {
        returnValue = '关闭提示'
      }
      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return returnValue
    }
  },
  methods: {
    /**
     * 退出登录
     */
    logout () {
      this.$store.dispatch('user/logout').catch(() => {
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

    // 客道处理企微
    /**
     * 企业微信切换
     * @param corpID 企业微信Id
     */
    changeView (corp) {
      // alert('111corpId')
      const params = {
        corpId: corp.id,
        brandType: corp.brandType
      }
      return this.$http.cancel().fetch(this.$api.core.access.changeView, params).then((resp) => {
        this.updateCorpStorage(corp)
      }).catch((resp) => {
        this.$notify.error(resp.message || '切换企业微信失败')
      })
    },
    /**
     * 处理企业微信切换命令
     * @param command
     */
    onHandleViewCommand: function (command) {
      const up = () => {
        this.$store.state.user.brands.forEach(item => {
          // alert('134corpId:' + item.corpId + 'command' + command)
          // 判断是否相等:
          if (item.corpId === command) {
            let that = this
            // 企业微信切换接口
            this.changeView({ id: item.corpId, name: item.corpName, brandType: item.agentId }).then(() => {
              that.$emit('brand-change', command)
            })
          }
        })
      }
      // 判断是否品牌视角有改变
      // console.log('??!!', command, this.$store.state.user.brand.id)
      if (command && command !== this.$store.state.user.brand.id) {
        isRefresh(this).then(() => {
          // console.log('??')
          up()
        }).catch(() => {})
      }
    },
    updateCorpStorage (corp) {
      this.$store.dispatch('user/update_user_brand', {
        brand: corp
      })
    },

    // ecrp处理区域
    /**
     * 区域切换
     * @param areaId 区域ID
     */
    changeArea (area) {
      this.areaSelDisabled = true
      this.originArea = {
        text: this.$store.state.user.area.name,
        value: this.$store.state.user.area.id
      }
      const params = {
        areaId: area.id,
        areaType: area.areaType
      }
      return this.$http.cancel().fetch(this.$api.core.access.changeArea, params).then((resp) => {
        if (resp.result) {
          area.gradeRuleStatus = resp.result.gradeRuleStatus
          area.areaHasJdShop = resp.result.areaHasJdShop
        }
        this.updateAreaStorage(area)
      }).catch((resp) => {
        this.$notify.waring(resp.msg || '切换区域失败，请重试！')
        this.area = $.extend(true, {}, this.originArea)
      }).finally(() => {
        this.areaSelDisabled = false
      })
    },
    /**
     * 处理视角切换命令
     * @param command
     */
    onHandleAreaCommand: function (command) {
      const that = this
      // 判断是否品牌视角有改变
      if (this.$store.state.user.area.id !== command) {
        isRefresh(this).then(() => {
          that.$store.state.user.areas.forEach(item => {
            // 判断是否相等
            if (item.areaId === command) {
              const area = {
                text: '',
                value: item.areaId
              }
              // 视角切换接口
              that.changeArea({ id: item.areaId, name: item.areaName, areaType: item.areaType }).then(() => {
                that.$set(that, 'area', area)
                that.$emit('area-change', command)
              })
            }
          })
        }).catch(() => {})
      }
    },
    onChangeArea (data) {
      this.onHandleAreaCommand(data.id)
    },
    updateAreaStorage (area) {
      this.$store.dispatch('user/update_user_area', {
        area: area
      })
    }
  },
  watch: {
    $route: {
      handler () {
        this.activeName = this.$route.matched[0].name
        console.log(this.$route, 'this.$route')
        this.isShowAreaSelect = isShowArea(this.$route)
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";

  @component-namespace nav {
    /* 导航栏基础样式 */
    .nav {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      height: var(--head-nav-height-s);
      background: var(--head-nav-bg);
      color: #fff;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1001;
      box-sizing: border-box;
      box-shadow: 0 2px 4px 0 #E3E3E3;
    }

    /* 产品logo */
    @b logo {
      width: 199px;
      height: 100%;
      text-align: center;
      position: relative;
      background-color: var(--logo-bg);
      img {
        vertical-align: middle;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    /* 一级菜单 */
    @b menu {
      flex: 1;
      display: flex;
      height: 100%;
      @e item {
        display: flex;
        justify-content: center;
        min-width: 86px;
        height: 100%;
        padding: 0;
        margin-right: 1px;
        cursor: pointer;
        text-align: center;
        color: var(--head-name-color);
        font-size: 14px;
        .menu-item__icon {
          margin: 0 auto 3px auto;
          font-size: 24px;
          color: var(--head-name-color);
        }

        @m link {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          .link-name {
            color: var(--head-name-color);
          }
        }

        &.is-selected-item, &:hover {
          position: relative;

          &::before {
            content: ' ';
            position: absolute;
            bottom: 4px;
            height: 4px;
            width: 28px;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            border-radius: 4px;
          }

          .link-name {
            color: var(--head-name-hover-color);
          }

          .menu-item__icon {
            color: var(--head-name-hover-color);
          }
        }
      }
    }

    /* 右侧工具栏 */
    @b tool {
      display: flex;
      align-items: center;
      padding-right: 15px;

      /* 右侧工具栏-图标 */
      .yunpingtai-icon {
        color: #fff;
        font-size: 30px;
        margin-right: 18px;
        margin-left: 24px;
        vertical-align: -5px;
      }

      /* 返回云平台 */
      .go-nascent-cloud {
        cursor: pointer;
      }

      /* 退出 */
      >>> .logout {
        width: var(--head-nav-height-s);
        height: var(--head-nav-height-s);
        line-height: var(--head-nav-height-s);
        text-align: center;
        cursor: pointer;
      }
    }

    /* 品牌下拉框 */
    @b brand{
      margin-right: calc(15px + 8px);
      width: 116px;
      height: 32px;
      text-align: center;
      cursor: pointer;
      border: 1px solid #fff;
      border-radius: 64px;
      color: #fff;
      >>> .el-input__inner {
        background: initial;
        border: none;
        color: #fff;
        padding-left: 10px;
        padding-right: 32px;
      }
      >>> .el-input__inner::placeholder {
        color: #60bafc;
      }
      >>> .el-input__suffix {
        background: initial;
        color: #fff;
      }
      >>> .el-input__suffix:before {
        border-left:initial;
      }
      >>> .el-select-dropdown .el-popper{
        max-width: 300px;
      }
    }
    >>> .el-input--small .el-input__inner{
      height: 30px;
      line-height: 30px;
    }
    >>> .el-select .el-input .el-select__caret {
      color: #fff;
      margin-top: 2px;
      font-size: 12px;
    }
    .el-popper[x-placement^=bottom] >>> .popper__arrow {
      top: -6px;
      left: 45% !important; /* 兼容下拉内容长短不一导致的箭头错位问题 */
      border-top-width: 0;
      border-bottom-color: #ebeef5;
    }

    /* 头像 */
    @b avatar {
      cursor: pointer;
      @e icon {
        display: inline-grid;
        padding: 2px;
        font-size: 26px;
        position: relative;
        left: -8px;
        border-radius: 100%;
        background: rgba(255, 255, 255, .2);
        @m svg{
          color: #fff;
          font-size: 20px;
          margin: 3px;
        }
      }
      @e name {
        display: inline-block;
        max-width: 76px;
        position: relative;
        left: -5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #fff;
      }
      @e dropdown {
        color: #fff;
        font-size: 12px;
        position: relative;
        right: 3px;
        top: -4px;
      }
    }
  }

</style>
