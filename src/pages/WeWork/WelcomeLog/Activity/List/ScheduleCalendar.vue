<template>
  <BaseContainer>
    <div class="schelude-calendar">
      <ElDatePicker
        class="date-picker"
        v-model="month"
        format="yyyy-MM"
        type="month"
        size="medium"
        :clearable="false"
        placeholder="选择月"
        @change="chooseMonth"
      />
      <ElScrollbar
        ref="ListScrollbar"
        class="data-list-scrollbar"
        wrapStyle="overflow-x:hidden;"
      >
        <ul class="date-list">
          <li
            v-for="item in dateList"
            :key="item.day"
            class="date-list-item"
            :class="{ 'date-list-item_active': day === item.day }"
            @click="chooseDay(item.day)"
          >
            <div class="date-item_time">
              <span>{{item.day}}</span>
              <span>{{item.weekday}}</span>
            </div>
            <div class="date-item_today-icon" v-if="today === item.date">今天</div>
            <div class="date-item_activity-count">{{item.count}}</div>
          </li>
        </ul>
      </ElScrollbar>
    </div>
  </BaseContainer>
</template>

<script>
import moment from 'moment'
import BaseContainer from '../../components/BaseContainer.vue'

export default {
  components: {
    BaseContainer
  },
  data () {
    return {
      scrollTop: null,
      month: moment(),
      day: 0,
      today: moment().format('yyyy-MM-DD'),
      dateList: []
    }
  },
  async mounted () {
    if (this.$route.query.date) {
      this.month = this.$route.query.date
    }

    // 设置日历列表
    await this.setScheludeDateList(this.month)
    this.saveScroll()

    this.initChooseDay()
  },
  methods: {
    saveScroll () {
      this.$nextTick(() => {
        setTimeout(() => {
          const scrollTop = this.$refs.ListScrollbar.wrap
          let date
          if (this.$route.query.date) {
            date = moment(this.$route.query.date).date()
          } else {
            if (moment(this.month).format('yyyy-MM') === moment().format('yyyy-MM')) {
              // 当前月份
              date = moment().date()
            } else {
              date = 0
            }
          }
          scrollTop.scrollTop = (date - 3) * 72
        }, 13)
      })
    },
    chooseMonth (date) {
      this.setScheludeDateList(date)
      this.saveScroll()

      if (moment(this.month).format('yyyy-MM') === moment().format('yyyy-MM')) {
        // 当前月份 选择当天
        this.chooseDay(moment().date())
      } else {
        // 否则选择1号
        this.chooseDay(1)
      }
    },
    chooseDay (day) {
      this.day = `0${day}`.slice(-2)

      this.$emit('reload', `${moment(this.month).format('yyyy-MM')}-${this.day}`)
      this.$router.push({
        path: '/Marketing/SOP',
        query: {
          date: `${moment(this.month).format('yyyy-MM')}-${this.day}`
        }
      })
    },
    /**
     * 初始化选择天
     */
    initChooseDay () {
      if (this.$route.query.date) {
        this.chooseDay(moment(this.$route.query.date).date())
      } else {
        if (moment(this.month).format('yyyy-MM') === moment().format('yyyy-MM')) {
          // 当前月份 选择当天
          this.chooseDay(moment().date())
        } else {
          // 否则选择1号
          this.chooseDay(1)
        }
      }
    },
    /**
     * 设置日历列表
     */
    async setScheludeDateList (date) {
      try {
        const resp = await this.$http.fetch(this.$api.weWork.sop.getEveryDayForCountByMonth, { month: moment(date).format('yyyy-MM') })
        const activityCountByMonth = resp.result

        if (this.dateList.length) this.dateList = []
        const totalDays = moment(date).daysInMonth()
        const yearAndDay = moment(date).toArray().slice(0, 2)
        const weekdays = [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ]

        for (let i = 1; i <= totalDays; i++) {
          const date = moment([...yearAndDay, i]).format('yyyy-MM-DD')

          this.dateList.push({
            date,
            day: `0${i}`.slice(-2),
            weekday: weekdays[moment([...yearAndDay, i]).weekday()],
            count: activityCountByMonth[date] || 0
          })
        }
      } catch (respErr) {
        this.$notify.error('获取当月每天活动数失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.schelude-calendar {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .date-picker {
    margin-top: 16px;
    width: 204px;
  }

  .data-list-scrollbar {
    height: 100%;
    margin-top: 16px;
    overflow-x: hidden;
  }

  .date-list {
    width: 204px;
    padding: 0;
    height: calc(100% - 52px - 16px);
    .date-list-item {
      position: relative;
      list-style: none;
      margin-top: 4px;
      width: 100%;
      height: 68px;
      cursor: pointer;
      display: flex;
      align-items: center;
      &:hover {
        background: #F8F9FB;
      }
      .date-item_time {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 16px;
        span {
          display: block;
          &:first-child {
            font-size: 24px;
            color: #383838;
            line-height: 32px;
            font-weight: 500;
          }
          &:last-child {
            font-size: 12px;
            color: #383838;
            line-height: 20px;
          }
        }
      }
      .date-item_today-icon {
        position: absolute;
        left: 68px;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background:  #0392FB;
        color: #fff;
        font-weight: 500;
        font-size: 12px;
        line-height: 34px;
        text-align: center;
      }
      .date-item_activity-count {
        margin-left: 90px;
        color: #0392FB;
        font-size: 14px;
        width: 45px;
        text-align: right;
      }
    }

    .date-list-item_active {
      background: #F8F9FB;
      border-right: 2px solid #0392FB;
    }
  }
}
</style>
