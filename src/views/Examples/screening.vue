<template>
  <div class="groupData">
    <el-row style="margin-top: 20px">
      <ns-button type="primary" @click="dialogVisible = true">好友排重筛选</ns-button>
    </el-row>

    <!-- 好友排重筛选弹窗-->
    <el-dialog
      title="好友排重筛选"
      :visible.sync="dialogVisible"
      width="600px" class="dialog-chat">
      <el-form  class="dialog-chat__form" inline>
        <el-form-item>
          <el-form-grid size="xmd">
            <el-input
              placeholder="输入个人号"
              v-model="input"
              clearable>
            </el-input>
          </el-form-grid>
          <el-form-grid size="xs">
            <ns-button type="primary">搜索</ns-button>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="dialog-chat__content">
        <div class="dialog-left">
          <div class="dialog-left__checkbox">
            <div class="dialog-choice">可选择个人号</div>
            <el-scrollbar class="scrollbarc">
              <el-checkbox-group v-model="checkList" class="checkbox">
                <div class="dialog-checkbox__item">
                  <el-checkbox label="淘宝优惠群淘宝优惠群淘宝优惠群淘宝优惠群"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="天猫打折群"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="墙头草"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="东方2号门店会员群"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="山海皆可平"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="墙头马上遥相顾"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="东方1号门店会员群"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="山海皆可平"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="东方1号门店会员群"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="东方1号门店会员群"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="墙头马上遥相顾"></el-checkbox>
                </div>
              </el-checkbox-group>
            </el-scrollbar>
          </div>
        </div>
        <div class="dialog-right">
          <div class="dialog-right__title">已选择个人号</div>
          <div class="dialog-right__content">
            <el-scrollbar class="scrollbarc">
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">淘宝优惠群淘宝优惠群淘宝优惠群淘宝优惠群</span>
                <i class="iconfont icon-shanchu2 dacha"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">山海皆可平</span>
                <i class="iconfont icon-shanchu2 dacha"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">墙头草</span>
                <i class="iconfont icon-shanchu2 dacha"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">淘宝优惠群</span>
                <i class="iconfont icon-shanchu2 dacha"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">墙头马上遥相顾</span>
                <i class="iconfont icon-shanchu2 dacha"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">淘宝优惠群</span>
                <i class="iconfont icon-shanchu2 dacha"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">淘宝优惠群</span>
                <i class="iconfont icon-shanchu2 dacha"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">淘宝优惠群</span>
                <i class="iconfont icon-shanchu2 dacha"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">淘宝优惠群</span>
                <i class="iconfont icon-shanchu2 dacha"></i>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-btn">
        <ns-button @click="dialogVisible = false">取消</ns-button>
        <ns-button @click="dialogVisible = false" type="primary">确定</ns-button>
      </span>
    </el-dialog>
    <!-- 好友排重筛选弹窗-->
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      checkList: ['选中且禁用', '淘宝优惠群'],
      input: ''
    }
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";
  @component-namespace dialog {
    @b chat {
      @e form {
        padding-left: 2px;
      }
      @e content{
        display: flex;
        margin-top: var(--default-margin-larger);
      }
    }
    @b left {
      width: 50%;
      padding: 0 var(--default-padding-larger) var(--default-padding-xlarger) 0;
      border-right: 1px solid var(--theme-base-border-color-primary);
      @e checkbox {
        @b choice {
          font-size: var(--default-font-size-base);
          color: var(--theme-font-color-primary);
          font-weight: bold;
          padding-left: var(--default-padding-small);
        }
        @b checkbox {
          @e item {
            color: var(--theme-font-color-primary);
            position: relative;
            margin-top: var(--default-margin-larger);
            padding-right: var(--default-padding-small);
          }
        }
      }
    }
    @b right {
      width: 50%;
      padding: 0 0 var(--default-padding-xlarger) var(--default-padding-xlarger);
      @e title {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-primary);
        font-weight: bold;
      }
    }
    @b selectitem {
      font-size: var(--default-font-size-small);
      color: var(--theme-font-color-primary);
      position: relative;
      margin: 9px 15px 0 0;
      cursor: pointer;
      .dacha{
        font-size: var(--default-font-size-base);
        color: var(--theme-color-danger);
        position: absolute;
        top: 0;
        right: 0;
        display: none;
      }
      &:hover .dacha {
        display: block;
      }
      @e discountgroup {
        display: inline-block;
        width: 82%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  >>> .el-form-item__label {
    font-size: var(--default-font-size-base);
    color: var(--theme-font-color-secondary);
  }
  >>>.el-dialog__body {
    color: var(--theme-font-color-primary);
  }
  >>> .el-checkbox-group .el-checkbox {
    display: block;
  }
  >>> .el-checkbox__input {
    position: absolute;
    right: 0;
    top: 3px;
  }
  >>> .el-checkbox__input.is-checked + .el-checkbox__label {
    width: 55%;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  >>> .el-checkbox__label {
    width: 77%;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  >>> .el-input--prefix .el-input__inner {
    padding-left: 30px;
  }
  .scrollbarc >>> .el-scrollbar__view {
    max-height: 240px;
  }
  .dialog-chat__content >>> .el-scrollbar__thumb {
    margin-top: var(--default-margin-larger);
  }
</style>
