<template>
  <div>
    <!-- 页面顶部内容 - 标题、保存按钮、面包屑 -->
    <div class="nonMember-head">
      <div class="clearfix nonMember-head__title">
        <span class="nonMember-head__title-content">
          非会员页面配置
        </span>
        <div class="float-right">
          <NsButton type="primary" @click="save()">保存</NsButton>
        </div>
      </div>
    </div>
    <el-scrollbar ref="fullScreen">
      <div class="nonMember-config">
        <div class="nonMember-config__left">
          <div class="nonMember-config__head">配置功能</div>
          <div class="nonMember-config__left-content">
            <ElForm label-width="72px">
              <ElFormItem label="发送招募链接"> <!-- 修改文案后，需调整label-width 值，否则会导致label换行或与标题不对齐 -->
                <ElSwitch
                  v-model="value" />
                <div>
                  <span class="nonMember-config__left-content-tip">聊天对象非会员时支持发送招募链接</span>
                </div>
              </ElFormItem>
            </ElForm>
            <div class="nonMember-config__left-content-otherInfo">
              <h5 class="content-otherInfo__head">涉及位置</h5>
              <div class="content-otherInfo__others">
                聊天对象为好友且非会员时页面<br/>
                企微侧边栏功能：客户详情、客户标签<br/>
                客户信息：会员画像
              </div>
            </div>
          </div>
        </div>
        <div class="nonMember-config__right">
          <div class="nonMember-config__head text-center">效果展示</div>
          <div class="nonMember-config__right-content">
            <div class="nonMember-config__right-content-phone">
              <div class="nonMember-config__right-content-phone-info"></div>
              <div v-if="value" class="nonMember-config__right-content-phone-btn">发送招募链接</div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'

export default {
  mixins: [scrollHeight],
  components: {
  },
  data () {
    return {
      // 页面滚动条内容高度配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 56 // 顶部标题
      },
      value: true
    }
  },
  mounted () {
    // 加载页面设置函数
    let _this = this
    this.$http.fetch(this.$api.guide.notMemberSet.search).then((resp) => {
      if (resp.success) {
        _this.value = resp.result === 1
      }
    })
  },
  methods: {
    save () {
      this.$http.fetch(this.$api.guide.notMemberSet.update, { 'isShow': this.value ? 1 : 0 }).then((resp) => {
        if (resp.success) {
          this.$message('保存成功')
        }
      }).catch(error => {
        this.$notify.error(error.msg)
      })
    }
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";
  .nonMember-head {
    padding: 12px 16px;
    background: var(--theme-color-white);
    margin: -10px -10px 10px;

    .nonMember-head__title {
      .nonMember-head__title-content {
        line-height: 32px;
        color: #262626;
        font-size: var(--default-font-size-middle);
      }
      .float-right {
        padding-top: 2px;
      }
    }
  }
  >>> .el-scrollbar {
    border-radius: 5px;
  }
  .nonMember-config {
    display: flex;
    background: var(--theme-color-white);
    .nonMember-config__left {
      flex: 1;
      >>> .nonMember-config__left-content {
        padding: 16px 40px 40px;
        .el-form-item__label {
          color: #595959;
        }
        .el-form-item__content {
          padding-left: 16px;
        }
        .nonMember-config__left-content-tip {
          position: relative;
          padding-left: 16px;
          height: 28px;
          color: #595959;
          &::before {
            position: absolute;
            left: 0;
            top: 50%;
            margin-top: -5px;
            content: ' ';
            width: 8px;
            height: 8px;
            border-radius: 100%;
            background: #F2AA18;
          }
        }
        .nonMember-config__left-content-otherInfo {
          margin-top: 26px;
          padding: 10px 16px;
          background: #F2F9FE;
          border-radius: 2px;
          .content-otherInfo__head {
            color: #262626;
            line-height: 22px;
            font-size: var(--default-font-size-base);
          }
          .content-otherInfo__others {
            color: #595959;
            line-height: 22px;
          }
        }
      }
    }
    .nonMember-config__right {
      width: 400px;
      min-width: 400px;
      border-left: 1px solid #E8E8E8;
      .nonMember-config__right-content {
        padding: 16px 0 40px;
        .nonMember-config__right-content-phone {
          position: relative;
          margin: 0 auto;
          padding-top: 45px;
          width: 364px;
          height: 660px;
          background: url("./src/images/phone.png") 0 0 no-repeat;
          background-size: 100% 100%;
          .nonMember-config__right-content-phone-info {
            width: 338px;
            height: 571px;
            margin: 0 auto;
            background: url("./src/images/phone-info.png") 0 0 no-repeat;
            background-size: 100%;
          }
          .nonMember-config__right-content-phone-btn {
            position: absolute;
            top: 390px;
            left: 44px;
            right: 44px;
            width: 275px;
            height: 48px;
            line-height: 48px;
            font-size: var(--default-font-size-middle);
            text-align: center;
            color: #ffffff;
            background: var(--theme-color-primary);
            border-radius: 4px;
          }
        }
      }
    }
    .nonMember-config__head {
      line-height: 56px;
      padding: 0 40px;
      font-size: var(--default-font-size-middle);
      color: #262626;
    }
  }
</style>
