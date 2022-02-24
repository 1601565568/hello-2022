<template>
    <iframe id='linkedFrame' hight='auto' width='100%' src='https://sandbox-sg-v6.vecrp.com/v3/friendsDrainage/demo' frameborder='0' scrolling='auto' onload='this.height=1000'></iframe>
</template>
<script>
import Index from './src/list'
import PageTable from '@/components/NewUi/PageTablePro'
import NsGuideDialog from '@/components/NsGuideDialog'
import PreviewRedPacket from '../components/PreviewRedPacket'
import UserList from '../components/UserList'
Index.components = {
  PageTable, NsGuideDialog, PreviewRedPacket, UserList
}
export default Index
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.search-icon {
  font-size: 25px;
}
.scope-img {
  min-width: 38.66px;
  max-width: 38.66px;
  margin-right: 15.67px;
}
.scope-title {
  display: flex;
  align-items: center;
}
.self-btn {
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
  .guideIds-icon {
    color:#C0C4CC;
  }
}
.scope-name_text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    &.more:after {
      content:'...'
    }
  }
</style>
