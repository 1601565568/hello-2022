<template>
  <div style="background-color: white" class="base-border-radius">
    <el-scrollbar ref="integralRuleHeight" outsider>
      <el-form label-width="150px" ref="form">
        <!-- 会员招募码配置开始 -->
        <div class="form-grid">
          <div class="form-grid__title">
            <div class="bluepillar"></div>
            {{ title }}
          </div>
          <div class="form-grid__content">
            <el-form-item v-if="ids !== '0'" label="员工："  size="xxs">
              <el-form-grid>
                <span>{{ names ? names:'' }}</span>
              </el-form-grid>
            </el-form-item>
            <el-form-item v-if="ids !== '0'" v-show="isShowWxAccount === true" label="微信账号：" size="xxs">
              <el-form-grid>
                <el-form-grid>
                  <span>{{ friendAutoPass.wxnick ? friendAutoPass.wxnick:'-' }}({{ friendAutoPass.wxaccount ? friendAutoPass.wxaccount:'-' }})</span>
                </el-form-grid>
              </el-form-grid>
            </el-form-item>
            <el-form-item v-if="ids === '0'" label="员工："  size="xxs">
              <ElFormGrid>
                <NsGuideDialog :auth="false" type="primary" btnTitle="选择员工" dialogTitle="选择员工" v-model="guideIds"></NsGuideDialog>
              </ElFormGrid>
              <ElFormGrid>
                已选择<span class="text-primary">{{model.guideIds? model.guideIds.length: 0}}</span>个导购员工
              </ElFormGrid>
            </el-form-item>
            <el-form-item label="通过时间间隔：" required>
              <el-form-grid style="width: 80px">
                <el-input  autofocus=true type="n" v-model.number="friendAutoPass.mininterval" onkeyup="this.value=this.value.replace(/\D|^0/g,'')" onafterpaste="this.value=this.value.replace(/\D|^0/g,'')" placeholder="" clearable></el-input>
              </el-form-grid>
              --
              <el-form-grid style="width: 80px">
                <el-input  autofocus=true v-model.number="friendAutoPass.maxinterval" onkeyup="this.value=this.value.replace(/\D|^0/g,'')" onafterpaste="this.value=this.value.replace(/\D|^0/g,'')" placeholder="" clearable></el-input>
              </el-form-grid>
              秒
            </el-form-item>
            <el-form-item>
              <span class="text-primary">
                 <Icon type="exclamation-circle" theme="outlined"/>
                 设置好友请求自动添加通过的通过时间间隔，为了模拟人为操作降低封号风险，建议设置时间为60-180秒
              </span>
            </el-form-item>
            <el-form-item label="是否需要验证：" required>
              <el-form-grid size="xxmd">
                <el-form-item prop="sex">
                  <el-radio-group v-model="friendAutoPass.isvalidate">
                    <el-radio :label="2">是</el-radio>
                    <el-radio :label="1">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item>
              <span class="text-primary">
                 <Icon type="exclamation-circle" theme="outlined"/>
                 个人号自动通过好友请求时是否需要好友验证
              </span>
            </el-form-item>
            <el-form-item label="验证信息关键字：" v-if="friendAutoPass.isvalidate == 2" required>
              <el-form-grid>
                <el-input   style="width:400px;" maxlength="50" type="textarea" autofocus=true v-model="friendAutoPass.validatemsg" placeholder="请输入验证信息关键字，关键字之间用英文逗号割开，最多输入50个关键字" clearable></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="关键字匹配方式：" v-if="friendAutoPass.isvalidate == 2" required>
              <el-form-grid size="xxmd">
                <el-form-item prop="sex">
                  <el-radio-group v-model="friendAutoPass.matchmode">
                    <el-radio :label="1">模糊匹配</el-radio>
                    <el-radio :label="2">全部匹配</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="自动通过：" required>
              <el-form-grid size="xxmd">
                <el-form-item prop="sex">
                  <el-radio-group v-model="friendAutoPass.isopen">
                    <el-radio :label="2">开启</el-radio>
                    <el-radio :label="1">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="自动通过时间：" required>
              <el-form-grid>
                <el-time-picker
                  is-range
                  v-model="timeValue"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围">
                </el-time-picker>
              </el-form-grid>
            </el-form-item>
            <el-form-item>
              <span class="text-primary">
                 <Icon type="exclamation-circle" theme="outlined"/>
                 该时间段内自动通过好友自动通过
              </span>
            </el-form-item>
            <el-form-item label="加入队列：" required>
              <el-form-grid size="xxmd">
                <el-form-item prop="sex">
                  <el-radio-group v-model="friendAutoPass.joinqueue">
                    <el-radio :label="2">开启</el-radio>
                    <el-radio :label="1">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item>
              <span class="text-primary">
                 <Icon type="exclamation-circle" theme="outlined"/>
                 选择开启后，自动通过时间段外新的好友验证将自动加入队列，直到自动通过开启后再执行任务
              </span>
            </el-form-item>
            <el-form-item>
              <ns-button @click="onCancel()" >取消</ns-button>
              <ns-button type="primary" @click="onSave(friendAutoPass)">确定</ns-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-scrollbar>
  </div>
</template>
<script>
import Edit from './src/Edit'
import index from './src/List'
import NsGuideDialog from '@/components/NsGuideDialog'

Edit.components = {
  index,
  NsGuideDialog
}

export default Edit
</script>
<style scoped>
  @import "@theme/variables.pcss";

  .dialog_mian_topText p sapn{
    color:grey;
  }
  .dialog_mian_topText p{
    line-height: 30px;
    height: 30px;
  }
  .form-grid__title {
    font-size: var(--default-font-size-base);
    padding: var(--default-padding-larger) 0;
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
    font-weight: 700;
    display: flex;
    align-items: center;
  }
  .bluepillar {
    width: 4px;
    height: 12px;
    margin-right: var(--default-margin-small);
    background-color: #0091FA;
  }
  .form-save__unique {
    padding: var(--default-padding-small) 0 var(--default-padding-small) 61px;
    border-top: 1px solid var(--theme-base-border-color-primary);
    background-color: var(--theme-color-white);
    border-bottom-left-radius: var(--default-radius-mini);
    border-bottom-right-radius: var(--default-radius-mini);
  }
  >>> .template-table__bar {
    margin-bottom: 0;
  }
  .form-grid {
    border-radius: var(--default-radius-mini);
  }
</style>
