<template>
  <div class="configuration-container">
    <div class="configuration-container__item">
      <div class="configuration-title">
        外部沟通场景配置
      </div>
      <div class="configuration-introduce">请企业微信管理员登录企业微信官方后台（http://work.weixin.qq.com），完成以下功能配置</div>
      <ElTable :data="chatData" stripe>
        <ElTableColumn prop="configuration" label="配置功能" :width="200" show-overflow-tooltip/>
        <ElTableColumn prop="operating" label="说明">
          <template slot-scope="scope">
            <div v-for="child in scope.row.explanation" :key="child.key">
              {{child.explain}}
              <Icon type="ns-thick-copy" className="text-primary configuration-copy" @click="copy(child.value)" v-if="child.type !== 0"/>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" :width="80" align="center">
          <template slot-scope="scope">
            <NsTableColumnOperateButton :buttons="tableButtons" :prop="scope" />
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
    <div class="configuration-container__item">
      <div class="configuration-title">
          运营场景配置
      </div>
      <div class="configuration-introduce">请企业微信管理员登录企业微信官方后台（http://work.weixin.qq.com），完成以下功能配置</div>
      <ElTable :data="operationData" stripe>
        <ElTableColumn prop="configuration" label="配置功能" :width="200" show-overflow-tooltip/>
        <ElTableColumn prop="operating" label="说明">
          <template slot-scope="scope">
            <div v-for="child in scope.row.explanation" :key="child.url">
              {{child.explain}}
              <Icon type="neirongguanli" className="text-primary configuration-copy" @click="copy(child.value)" v-if="child.type !== 0"/>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" :width="80" align="center">
          <template slot-scope="scope">
            <NsTableColumnOperateButton :buttons="tableButtons" :prop="scope" />
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chatData: [{
        configuration: '侧边栏功能',
        explanation: [{
          explain: '企业微信后台（客户联系-聊天工具-聊天工具栏管理），可配置应用页面到聊天工具栏，方便成员在与客户的聊天中查看和使用，提高服务效率',
          type: 0,
          url: 'https://work.weixin.qq.com/wework_admin/frame#customer/chatMenu'
        }]
      }, {
        configuration: '会员画像',
        explanation: [{
          explain: '企业微信后台（我的企业-外部沟通管理），可配置在企业微信中查看外部联系人时，可查看企业应用中的客户详情',
          type: 0,
          url: 'https://work.weixin.qq.com/wework_admin/frame#profile/wxcontacts/mngConfigView'
        }]
      }],
      operationData: [{
        configuration: '配置使用范围和规则',
        explanation: [{
          explain: '企业微信后台（客户联系-配置），可配置客户联系、客户群、客户朋友圈的使用范围，范围内成员的客户、客户群和发表的内容可由企业统一管理',
          type: 0,
          url: 'https://work.weixin.qq.com/wework_admin/frame#customer/group'
        }]
      }, {
        configuration: '分配离职成员的资源',
        explanation: [{
          explain: '企业微信后台（客户联系-配置），成员离职后，可分配他的客户、客户群给其他成员',
          type: 0,
          url: 'https://work.weixin.qq.com/wework_admin/frame#customer/pending'
        }]
      }],
      tableButtons: [
        {
          'name': '配置',
          'func': function (scope) {
            window.open(scope.row.explanation[0].url)
          }
        }
      ]
    }
  },
  methods: {
    copy (msg) {
      let url = msg
      let oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    },
    init () {
      const customerDetail = 'customerDetail'
      this.$http.fetch(this.$api.guide.operationConfig.getWeWorkSidebarConfig).then((res) => {
        if (res.result && res.msg) {
          res.result.forEach((item) => {
            if (item.key === customerDetail) {
              this.chatData[1].explanation.push({
                ...item,
                explain: `客户详情：${item.value}`
              })
            }
            this.chatData[0].explanation.push(item)
          })
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";

  @component-namespace configuration {
    @b container {
      @e item {
        margin-bottom: var(--default-margin-larger);
        border-radius: var(--default-radius-mini);
        background-color: var(--theme-color-white);
        overflow: hidden;
        >>> .el-table {
          border-bottom-left-radius: var(--default-radius-mini);
          border-bottom-right-radius: var(--default-radius-mini);
          overflow: hidden;
          &::before, .el-table--group::after, .el-table--border::after {
            background-color: unset;
          }
        }
      }
    }
    @b title {
      font-size: var(--default-font-size-base);
      padding: 9px var(--default-padding-larger);
      border-bottom: 1px solid var(--theme-base-border-color-light);
    }
    @b introduce {
      color: var(--theme-color-primary);
      padding: 0 var(--default-padding-larger);
      margin-top: var(--default-margin-small);
    }
    @b copy {
      position: relative;
      top: 1px;
      cursor: pointer;
    }
  }
</style>
