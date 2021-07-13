<template>
  <div v-if="list.length" class="activity-panel">
    <el-scrollbar class="activity-card-scrollbar" wrapStyle="overflow-x:hidden;">
      <div class="activity-card-box">
        <div class="activity-card-box-wrapper">
          <ActivityCard
            v-for="(item, index) in list"
            :key="index"
            :activity="item"
            class="activity-card"
          >
            <template v-for="(message, messageIndex) in cardList(item.contentList)">
              <TextMessage
                :key="messageIndex"
                v-if="message.type === SOPActivityMessageType.Text"
                class="text-message"
                :class="[ cardList(item.contentList).length === 1 ? 'single-message' : 'multi-message' ]"
                :content="message.content"
              />
              <ImageMessage
                :key="messageIndex"
                v-else-if="message.type === SOPActivityMessageType.Image || message.type === SOPActivityMessageType.Poster"
                class="image-message"
                :content="message.content"
                :total="true"
                :preview="true"
                :previewList="getImgPrewivewList(item.contentList)"
              />
              <VideoMessage
                :key="messageIndex"
                v-else-if="message.type === SOPActivityMessageType.Video"
                class="video-message"
                :preview="true"
                :content="message.content"
              />
              <NewsMessage
                :key="messageIndex"
                v-else-if="message.type === SOPActivityMessageType.Link"
                class="news-message"
                :content="message.content"
              />
              <MiniProgramMessage
                :key="messageIndex"
                v-else-if="message.type === SOPActivityMessageType.MiniProgram"
                class="mini-message"
                :content="message.content"
              />
            </template>
            <template slot="footer">
              <div>
                <NsButton type="text" class="group-count" @click="checkActivityGroup(item.id)">{{item.chatroomNum}}</NsButton>个群
              </div>
              <div>
                <NsButton v-if="showBtn(item.status, 'edit')" type="text" class="group-count" @click="editActivity(item.id)">编辑</NsButton>
                <NsButton v-if="showBtn(item.status,'check')" type="text" class="group-count" @click="checkActivity(item.id)">查看</NsButton>
                <NsButton v-if="showBtn(item.status,'submit')" type="text" class="group-count" @click="submitActivity(item.id)">提交审核</NsButton>
                <NsButton type="text" class="group-count" @click="handleCopy(item.id)">复制</NsButton>
                <NsButton v-if="showBtn(item.status,'delete')" type="text" class="group-count" @click="deleteActivity(item.id)">删除</NsButton>
                <NsButton v-if="showBtn(item.status,'examine')" type="text" class="group-count" @click="checkActivity(item.id)">审核</NsButton>
              </div>
            </template>
          </ActivityCard>
        </div>
      </div>
    </el-scrollbar>
    <el-pagination
      class="pagination"
      :page-sizes="pagination.sizeOpts"
      :total="pagination.total"
      :current-page="pagination.page"
      :page-size="pagination.size"
      :background="true"
      @size-change="pagination.sizeChange"
      @current-change="pagination.pageChange"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <!-- 参加活动群drawer -->
    <GroupDrawer
      :visible.sync="visibleGroupDrawer"
      :activityId="activeActivityId"
    />
    <!-- 查看或审核活动drawer -->
    <CheckActivityDrawer
      :visible.sync="visibleCheckActivityDrawer"
      :panelType="panelType"
      :activityId="activeActivityId"
      @edit="editActivity"
      @submit="submitActivity"
      @delete="deleteActivity"
      @examine="examineActivity"
    />
    <!-- 审核Dialog -->
    <ExamineActivityDialog
      :visible.sync="visibleExamineDialog"
      :activityId="activeActivityId"
      @confirm="confirmExamineActivity"
    />
  </div>
  <div v-else class="activity-panel no-date-area">
    <div class="no-data">
      <img src="https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-H5/mobile/no_data.png"/>
      <span>没有数据哦~</span>
    </div>
  </div>
</template>

<script>
import ActivityCard from '../../components/ActivityCard/index.vue'
import { TextMessage, ImageMessage, VideoMessage, NewsMessage, MiniProgramMessage } from '../../components/ActivityMessage/index.vue'
import GroupDrawer from './GroupDrawer.vue'
import CheckActivityDrawer from './CheckActivityDrawer.vue'
import ExamineActivityDialog from './ExamineActivityDialog.vue'
import { SOPActivityMessageType, SOPExamineStatus } from '../../types'

export default {
  components: {
    ActivityCard,
    TextMessage,
    ImageMessage,
    VideoMessage,
    NewsMessage,
    MiniProgramMessage,
    GroupDrawer,
    CheckActivityDrawer,
    ExamineActivityDialog
  },
  props: {
    panelType: {
      type: String,
      default: 'activity',
      validator: function (value) {
        // activity 创建活动使用 examine 审核页面使用
        return ['activity', 'examine'].indexOf(value) !== -1
      }
    },
    list: {
      type: Array
    },
    pagination: {
      type: Object
    },
    date: String
  },
  data () {
    return {
      SOPActivityMessageType: SOPActivityMessageType,
      SOPExamineStatus: SOPExamineStatus,
      visibleGroupDrawer: false, // 查看参加活动群drawer
      visibleCheckActivityDrawer: false, // 查看活动drawer
      visibleExamineDialog: false, // 查看审核活动drawer
      activeActivityId: 0 // 要查看或审核的活动id
    }
  },
  mounted () {},
  methods: {
    cardList (contentList) {
      if (contentList.length > 0) {
        const list = [ ...contentList ]
        const newList = []
        const uniqueTypeMsgObj = {}
        list.forEach(item => {
          if (!uniqueTypeMsgObj[item.type]) {
            uniqueTypeMsgObj[item.type] = item
            newList.push(item)
          }
        })
        if (list[0].type === SOPActivityMessageType.Text) {
          // 如果第一条是文本 返回前两条
          return newList.slice(0, 2)
        } else {
          // 如果第一条不是文本，直接显示一条
          return newList.slice(0, 1)
        }
      } else {
        return []
      }
    },
    /**
     * 是否显示按钮
     */
    showBtn (status, btnType) {
      // 活动日历页面
      if (this.panelType === 'activity') {
        // 编辑 提交审核 删除
        if (btnType === 'edit' || btnType === 'submit') {
          // 待提交、审核失败
          if (status === SOPExamineStatus.UnSubmit || status === SOPExamineStatus.Failed) {
            return true
          } else {
            return false
          }
        }

        // 查看按钮
        if (btnType === 'check') {
          return true
        }

        // 审核按钮
        if (btnType === 'examine') {
          return false
        }

        // 删除按钮
        if (btnType === 'delete') {
          if (status === SOPExamineStatus.UnSubmit || status === SOPExamineStatus.Failed || status === SOPExamineStatus.Succeed) {
            return true
          } else {
            return false
          }
        }
      } else if (this.panelType === 'examine') {
        // 审核页面
        // 编辑按钮
        if (btnType === 'edit' || btnType === 'submit' || btnType === 'delete') {
          return false
        }

        // 查看按钮
        if (btnType === 'check') {
          // 审核成功、失败
          if (status === SOPExamineStatus.Succeed || status === SOPExamineStatus.Failed) {
            return true
          } else {
            return false
          }
        }

        // 审核按钮
        if (btnType === 'examine') {
          // 待审核
          if (status === SOPExamineStatus.Pending) {
            return true
          } else {
            return false
          }
        }
      }
      // 非定义类型返回 false
      return false
    },
    getImgPrewivewList (contentList) {
      const previewList = []
      contentList.forEach(item => {
        if (item.type === SOPActivityMessageType.Image || item.type === SOPActivityMessageType.Poster) {
          previewList.push(item.content.mediaid)
        }
      })
      return previewList
    },
    async updateExamineStatus (context) {
      return this.$http.fetch(this.$api.weWork.sop.updateStatus, context)
    },
    /**
     * 查看活动的群
     */
    checkActivityGroup (id) {
      this.activeActivityId = id
      this.visibleGroupDrawer = true
    },
    /**
     * 编辑活动
     */
    editActivity (id, isCopy = false) {
      this.jumpDetail(id)
    },
    /**
     * 查看活动
     */
    checkActivity (id) {
      this.activeActivityId = id
      this.visibleCheckActivityDrawer = true
    },
    /**
     * 提交活动审核
     */
    submitActivity (id) {
      this.$confirm('提交后不可编辑内容，请再次确定是否要提交', '确定提交审核？', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const resp = await this.$http.fetch(this.$api.weWork.sop.updateStatus, { id, status: SOPExamineStatus.Pending })
          this.$message({
            type: 'success',
            message: '提交成功'
          })

          this.$emit('change')
        } catch (respErr) {
          this.$message.error('提交失败')
        } finally {
          this.visibleCheckActivityDrawer = false
        }
      })
    },
    /**
     * 删除活动
     */
    deleteActivity (id) {
      this.$confirm('删除后不可恢复，请再次确定是否要删除', '确定删除？', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.fetch(this.$api.weWork.sop.delete, { id })
          .then(resp => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })

            this.$emit('change')
          }).catch((respErr) => {
            this.$message.error('删除失败')
          }).finally(() => {
            this.visibleCheckActivityDrawer = false
          })
      }).catch(() => {})
    },
    /**
     * 审核活动
     */
    examineActivity (id) {
      this.activeActivityId = id
      this.visibleExamineDialog = true
    },
    async confirmExamineActivity (context) {
      try {
        const resp = await this.$http.fetch(this.$api.weWork.sop.updateStatus, context)
        this.$message.success('审核完成')
      } catch (respErr) {
        this.$message.error('审核失败')
      } finally {
        this.visibleCheckActivityDrawer = false
        this.$emit('change')
      }
    },
    // 复制活动
    handleCopy (id) {
      this.jumpDetail(id, true)
    },
    /**
     * 去详情页
     */
    jumpDetail (id, isCopy = false) {
      const query = {
        date: this.date
      }
      if (isCopy) {
        query.isCopy = true
      }
      this.$router.push({
        path: `/Marketing/SOP/Edit/${id}`,
        query
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-panel {
  width: 100%;
  min-width: 895px;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  background: #FFFFFF;

  @media screen and (max-width: 1500px) {
    .activity-card-box {
      padding: 0px 16px 2px 16px;
      height: calc(100% - 16px);
      overflow: overlay;
      .activity-card-box-wrapper {
        margin-right: -16px;
        .activity-card {
          float: left;
          margin-right: 16px;
          margin-top: 16px;
          width: calc((100% - 48px) / 3);
          height: 325px;
          background: #F8F9FB;
        }
      }
    }
  }

  @media screen and (min-width: 1501px){
    .activity-card-box {
      padding: 0px 16px 2px 16px;
      height: calc(100% - 16px);
      overflow: overlay;
      .activity-card-box-wrapper {
        margin-right: -16px;
        .activity-card {
          float: left;
          margin-right: 16px;
          margin-top: 16px;
          width: calc((100% - 64px) / 4);
          height: 325px;
          background: #F8F9FB;
        }
      }
    }
  }

  // @media screen and (min-width: 1600px){
  //   .activity-card-box {
  //     padding: 16px 32px 16px 32px;
  //     height: calc(100% - 16px);
  //     overflow: overlay;
  //     .activity-card-box-wrapper {
  //       margin-right: -16px;
  //       .activity-card {
  //         float: left;
  //         box-sizing: border-box;
  //         margin-right: 16px;
  //         margin-top: 16px;
  //         width: calc((100% - 84px) / 5);
  //         height: 325px;
  //         background: #F8F9FB;
  //       }
  //     }
  //   }
  // }

  .single-message {
    -webkit-line-clamp: 8;
  }

  .multi-message {
    -webkit-line-clamp: 2;
  }

  .activity-card-scrollbar {
    height: calc(100% - 61px);
    overflow-x: hidden;
  }
  .pagination {
    height: 61px;
    padding: 15px 18px 0;
  }
}

.no-date-area {
  display: flex;
  align-items: center;
  justify-content: center;
  .no-data {
    height: 282px;
    width: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    img {
      width: 220px;
      height: 220px;
    }
    span {
      font-size: 14px;
      color: #8C8C8C;
      line-height: 22px;
    }
  }
}

.image-message, .video-message {
  height: 161px;
}
</style>
