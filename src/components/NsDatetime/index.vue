<template>
  <div>
    <el-form-grid :size="size" :width="width">
      <el-date-picker :type="type" :editable="editable" :format="format"
                      :value-format="valueFormat" @change="handleStartChange" :picker-options="pickerOptions0"
                      :placeholder="startPlaceholder" v-model="startDate">
      </el-date-picker>
    </el-form-grid>
    <el-form-grid>
      {{separator}}
    </el-form-grid>
    <el-form-grid :size="size" :width="width">
      <el-date-picker :type="type" :editable="editable" :format="format"
                      :value-format="valueFormat" @change="handleEndChange"
                      :placeholder="endPlaceholder" :picker-options="pickerOptions1" v-model="endDate">
      </el-date-picker>
    </el-form-grid>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'NsDatetime',
    props: {
      value: {
        type: Array,
        default: []
      },
      size: {
        type: String,
        default: 'xmd'
      },
      type: {
        type: String,
        default: 'datetime'
      },
      startPlaceholder: {
        type: String,
        default: '请输入开始时间'
      },
      endPlaceholder: {
        type: String,
        default: '请输入结束时间'
      },
      editable: {
        type: Boolean,
        default: false
      },
      separator: {
        type: String,
        default: '~'
      },
      format: String,
      valueFormat: {
        type: String,
        default: 'yyyy-MM-dd HH:mm:ss'
      },
      width: String
    },
    data: function () {
      let that = this
      return {
        startDate: this.value.length > 0 ? this.value[0] : '',
        endDate: this.value.length > 1 ? this.value[1] : '',
        pickerOptions0: {
          disabledDate: function (time) {
            var disabled = false
            if (that.endDate) {
              disabled = time.getTime() > moment(that.endDate).subtract(1, 'seconds').toDate().getTime()
            }
            return disabled
          }
        },
        pickerOptions1: {
          disabledDate: function (time) {
            var disabled = false
            if (that.startDate) {
              disabled = moment(that.startDate).add(1, 'seconds').toDate().getTime() > time.getTime()
            }
            return disabled
          }
        }
      }
    },
    watch: {
      value: function (val) {
        if (val[0] === this.startDate && val[1] === this.endDate) {
          return
        }
        this.startDate = val && val[0]
        this.endDate = val && val[1]
      }
    },
    methods: {
      handleStartChange: function (value) {
        if (value && this.endDate && moment(value).isAfter(moment(this.endDate))) {
          value = ''
        }
        this.$emit('input', [value, this.endDate])
      },
      handleEndChange: function (value) {
        if (value && this.startDate && moment(value).isBefore(moment(this.startDate))) {
          value = ''
        }
        this.$emit('input', [this.startDate, value])
      },
      getText: function () {
        if (this.endDate && this.startDate) {
          var endDate_ = this.endDate ? this.endDate : ''
          var startDate_ = this.startDate ? this.startDate : ''
          return startDate_ + '~' + endDate_
        } else if (this.endDate) {
          return '<=' + this.endDate
        } else if (this.startDate) {
          return '>=' + this.startDate
        }
      }
    }
  }
</script>
