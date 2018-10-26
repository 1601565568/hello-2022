<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogAdd" width="600px" v-loading="loading"
               :close-on-click-modal="false">
      <el-form ref="form" placement="right" label-width="100px" :model="affairNewModel" :rules="rules">

        <el-form-item label="客户昵称：" prop="out_nick_enc" class="el-inline-block">
          <el-form-grid size="xmd">
            <el-input type="text" v-model.trim="affairNewModel.out_nick_enc" placeholder="请输入客户昵称"
                      :disabled="affairNewModel.id !== '' || affairSource !== 5" >
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="所属店铺：" prop="shop_id" v-if="controlParam.shopSelectVisble === 1">
          <el-form-grid size="xmd">
            <el-select v-model="affairNewModel.shop_id" :placeholder="$t('prompt.select')" @change ="onShopChange">
              <el-option v-for="item in shops" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="订单编号：" prop="sys_trade_id" v-if="controlParam.orderItemVisble === 1">
          <el-form-grid size="xmd">
            {{affairNewModel.sys_trade_id}}
          </el-form-grid>
        </el-form-item>
        <el-form-item label="事务类型：" prop="affair_type_id">
          <el-form-grid size="xmd">
            <el-select v-model="affairNewModel.affair_type_id" @change="onAffairTypeChange">
              <el-option v-for="(option ,index) in  affairTypeData"
                         :key="index"
                         :label="option.affair_type_name"
                         :value="option.id"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="事务备注：" prop="affair_desc">
          <el-form-grid size="xmd">
            <el-input v-model.trim="affairNewModel.affair_desc"
                      type="textarea"
                      :rows="4"
                      placeholder="请输入内容">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="优先级：" prop="affair_level">
          <el-form-grid size="sm">
            <el-form-item prop="affair_level">
              <el-select v-model="affairNewModel.affair_level">
                <el-option
                  :key="1"
                  label="低"
                  :value="1">
                </el-option>
                <el-option
                  :key="2"
                  label="中"
                  :value="2">
                </el-option>
                <el-option
                  :key="3"
                  label="高"
                  :value="3">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
          <el-form-grid size="sm">
            <i class="text-icon low" v-if="affairNewModel.affair_level === 1">低</i>
            <i class="text-icon medium" v-if="affairNewModel.affair_level === 2">中</i>
            <i class="text-icon high" v-if="affairNewModel.affair_level === 3">高</i>
          </el-form-grid>
        </el-form-item>
        <el-form-item label=" 指派处理人：">
          <el-form-grid size="xmd">
            <el-radio-group v-model="handleType">
              <el-radio :label="1">部门处理</el-radio>
              <el-radio :label="2">处理人</el-radio>
            </el-radio-group>
          </el-form-grid>
        </el-form-item>
        <el-form-item  v-if="handleType === 1">
          <el-form-item prop="departmentIds">
            <el-form-grid size="xmd" >
              <ns-droptree :multiple="false" v-model="departmentIds" :data="departmentTree" clearable></ns-droptree>
            </el-form-grid>
          </el-form-item>
        </el-form-item>
        <el-form-item  v-if="handleType === 2">
          <el-form-item  prop="selectUsers">
            <el-form-grid size="sm" >
              <ns-select-relevance v-model="selectUsers" :data="selectUserRange"></ns-select-relevance>
            </el-form-grid>
            <el-form-grid size="sm" >
              <ns-button type="primary" @click="onAllocationTome">分配给我</ns-button>
            </el-form-grid>
          </el-form-item>
        </el-form-item>
        <el-form-item label=" 期望解决时间：" prop="affair_expire_time">
          <el-form-grid size="xmd">
            <el-date-picker
              v-model="affairNewModel.affair_expire_time"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="上传图片：" v-if="controlParam.shopSelectVisble === 1">
          <el-form-grid>
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :before-upload="beforeAvatarUpload"
              accept=".jpg,.jpeg,.png,.bmp,.gif"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :file-list="picList"
              list-type="picture-card">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p class="tmp-tips text-info"><i class="el-icon-info"></i>
              图片大小不能超过500kb
            </p>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="预计费用：" prop="budget_cost" class="el-inline-block">
          <el-form-grid size="xmd">
            <el-input type="number" v-model.trim="affairNewModel.budget_cost" placeholder="0">
              <template slot="append">元</template>
            </el-input>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseAddDialog">取 消</ns-button>
        <ns-save @click="onSaveAffair"></ns-save>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import AffairSource from 'configs/affairSource'
  import NsSelectRelevance from '../NsSelectRelevance'
  import moment from 'moment/moment'
  import NsDatetime from 'components/NsDatetime'
  import NsDroptree from 'components/NsDroptree'
  import dataCheck from 'utils/dataCheck'
  export default {
    name: 'NsAffairList',
    data: function () {
      return {
        loading: true,
        dialogAdd: false,
        batchFlag: false,
        updateFlag: false,
        affairNewModelList: [],
        affairNewModel: {affair_desc: '', out_nick: '', out_nick_enc: '', affair_level: '', id: '', affair_source: ''},
        title: '',
        uploadUrl: this.$api.core.uploadFile('affairList'),
        // 图片上传完成标志
        uploadFinishFlag: true,
        // 图片预览使用
        dialogVisible: false,
        // 图片上传控件使用
        picList: [],
        // 处理方式-部门或人
        handleType: 1,
        // 处理-是否已解决
        solveFlag: 2,
        // 事务类型下拉
        affairTypeData: [],
        // 处理人下拉
        selectUserRange: [],
        selectUsers: '',
        // 选部门
        departmentIds: {},
        departmentTree: [],
        // 品牌下所有店铺
        shops: [],
        affairSource: '',
        currentLoginUserAccount: '',
        controlParam: {
          orderItemVisble: 2, // 是否展示订单选项       1，展示，2,不展示
          fileUploadVisble: 2, // 是否展示文件上传选项  1，展示，2,不展示
          shopSelectVisble: 2// 是否展示店铺下拉选项    1，展示，2,不展示
        },
        // 集团下所有部门
        allDepartments: [],
        allUsers: [],
        rules: {
          out_nick_enc: [{required: true, message: '请输入客户昵称', trigger: 'blur'},
            {
              validator: (rule, val, call) => {
                if (this.affairSource !== 5) {
                  call()
                } else {
                  if (val.length > 0 && val.length < 26) {
                    call()
                  } else {
                    call(new Error('最大长度为25'))
                  }
                }
              },
              trigger: ['blur']
            }],
          shop_id: [{required: true, message: '请选择店铺', trigger: 'change'}],
          affair_desc: [{required: true, message: '请输入事务备注', trigger: 'blur'}, { min: 1, max: 255, message: '已超过可输入长度，最大长度为255', trigger: 'blur' }],
          budget_cost: [{
            validator: (rule, val, call) => {
              if (val) {
                if (!dataCheck.isDecimal(val)) {
                  call(new Error('请输入正确的金额（两位小数）'))
                }
                if (val.length > 9) {
                  call(new Error('已超过可输入长度,最大长度为8'))
                }
              }
              call()
            },
            trigger: ['blur']
          }],
          selectUsers: [{
            validator: (rule, val, call) => {
              let user = this.selectUsers
              if (this.handleType === 2 && (user === undefined || user === '' || user === null)) {
                call(new Error('请选择一个处理人'))
              }
              call()
            },
            trigger: ['change']
          }],
          departmentIds: [{
            validator: (rule, val, call) => {
              let depart = this.departmentIds
              if (this.handleType === 1) {
                if (depart === undefined || depart === null || depart.value === '' || depart.value === null || depart.value === undefined) {
                  call(new Error('请选择一个部门'))
                }
              }
              call()
            },
            trigger: ['change']
          }],
          affair_type_id: [{required: true, message: '请选择事务类型', trigger: 'blur'}]
        }
      }
    },
    computed: {
    },
    watch: {
      handleType (curVal, oldVal) {
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].clearValidate('departmentIds')
        }
      }
    },
    methods: {
      onOpenAffairBatch (affairArr, affairSource, title, param) {
        let that = this
        this.updateFlag = false
        if (!affairSource) {
          affairSource = AffairSource.NONE_ROUTE
        }
        this.$set(this, 'controlParam', param)
        that.affairSource = affairSource
        that.affairNewModelList = []
        that.$set(that, 'affairNewModel', {})
        if (affairArr && affairArr.length > 0) {
          let outNicks = []
          if (affairArr.length > 1) {
            that.batchFlag = true
          } else {
            that.batchFlag = false
          }
          for (let affair of affairArr) {
            let affair2 = {}
            affair2.id = affair.id
            affair2.sys_customer_id = affair.sys_customer_id
            affair2.sys_trade_id = affair.sys_trade_id
            affair2.out_trade_id = affair.out_trade_id
            affair2.out_nick = affair.out_nick
            affair2.out_nick_enc = affair.out_nick
            affair2.target = affair.target
            affair2.shop_id = affair.shopId
            if (typeof (affair.encryOutNick) !== 'undefined' && affair.encryOutNick !== '' && affair.encryOutNick !== null) {
              outNicks.push(affair.encryOutNick)
            }
            that.affairNewModelList.push(affair2)
          }
          let thisTime = moment().add(3, 'days').format('YYYY-MM-DD HH:mm:ss')
          if (affairArr[0] != null) {
            let affairModel = {}
            if (outNicks.length > 0) {
              affairModel.out_nick = outNicks.join(',')
              affairModel.out_nick_enc = outNicks.join(',')
            } else {
              affairModel.out_nick = ''
              affairModel.out_nick_enc = ''
            }
            affairModel.id = affairArr[0].id === undefined ? '' : affairArr[0].id
            affairModel.affair_level = 1
            affairModel.affair_expire_time = thisTime
            affairModel.affair_source = affairSource
            affairModel.affair_type_id = ''
            affairModel.affair_type_name = ''
            affairModel.affair_desc = ''
            affairModel.affair_source = affairSource
            affairModel.sys_customer_id = affairArr[0].sys_customer_id
            affairModel.sys_trade_id = affairArr[0].sys_trade_id
            affairModel.out_trade_id = affairArr[0].out_trade_id
            affairModel.shop_id = affairArr[0].shop_id
            that.$set(that, 'affairNewModel', affairModel)
            that.handleType = 1
            that.departmentIds = {}
            that.title = title
            that.picData = {content: []}
            that.initSelectedAffairType()
          }
        }
        that.selectUserRange = that.allUsers
        that.departmentTree = that.allDepartments
        that.dialogAdd = true
      },
      onOpenAffairEdit (obj) {
        this.dialogAdd = true
        this.updateFlag = true
        this.picData = {content: []}
        this.title = '修改事务'
        if (obj) {
          let resp = this.initAffairModel(obj)
          this.$set(this, 'affairNewModel', resp)
          this.affairNewModelList = []
          this.affairNewModelList.push(resp)
        } else {
        }
      },
      /**
       * 初始化事务类型下拉-选择第一个事务类型
       */
      initSelectedAffairType () {
        let that = this
        if (that.affairTypeData) {
          for (let temp of that.affairTypeData) {
            that.affairNewModel.affair_type_id = temp.id
            break
          }
          this.onAffairTypeChange(that.affairNewModel.affair_type_id)
        }
      },
      /**
       *  回显事务列表信息
       * @param data
       */
      initAffairModel (data) {
        let resp = {}
        // Object.assign(resp, data)
        resp.id = data.id
        resp.picture_url = data.pictureUrl
        resp.sys_trade_id = data.sysTradeId
        resp.create_user_name = data.createUserName
        resp.affair_level = data.affairLevel
        if (data.affairTypeState === 1) {
          resp.affair_type_id = data.affairTypeId
        }
        resp.create_time = data.createTime
        resp.last_handle_time = data.lastHandleTime
        resp.extra_cost = data.extraCost
        resp.budget_cost = data.budgetCost
        resp.affair_status = data.affairStatus
        resp.affair_desc = data.affairDesc
        resp.current_login_account = data.currentLoginAccount
        resp.current_department_id = data.currentDepartmentId
        resp.affair_expire_time = data.affairExpireTime
        resp.out_nick = data.outNickEnc
        resp.out_nick_enc = data.outNick
        resp.affair_source = data.affairSource
        resp.affair_no = data.affairNo
        resp.sys_customer_id = data.sysCustomerId
        resp.out_trade_id = data.outTradeId
        resp.target = data.target
        resp.shop_id = data.shopId
        resp.current_user_id = data.currentUserId
        this.picData = {content: []}
        this.picList = []
        if (data.currentDepartmentId) {
          this.departmentIds = {}
          this.departmentIds.value = data.currentDepartmentId
          this.departmentIds.text = data.departmentName
        }
        if (data.pictureUrl) {
          let pic = JSON.parse(data.pictureUrl)
          if (pic && pic.content) {
            for (let ct of pic.content) {
              let picture = {}
              picture.name = ct.name
              picture.url = this.$api.core.downloadFile(ct.id)
              picture.picId = ct.id
              let picDataT = {}
              picDataT.name = ct.name
              picDataT.id = ct.id
              this.picList.push(picture)
              this.picData.content.push(picDataT)
            }
          }
        }
        this.handleType = data.currentDepartmentId ? 1 : 2
        this.selectUsers = data.currentLoginAccount
        return resp
      },
      /**
       * 保存事务列表信息
       */
      onSaveAffair () {
        var that = this
        if (!this.uploadFinishFlag) {
          this.$notify.error('请等待图片上传完成')
          return
        }
        this.handleParam4AffairAddOrEdit()
        that.$refs['form'].validate((valid) => {
          if (valid) {
            that.$http.fetch(that.$api.affair.affairList.saveOrUpdateBatch, {kdAffairLists: this.affairNewModelList})
              .then((resp) => {
                that.onCloseAddDialog()
                that.$notify.success(resp.msg)
                that.$emit('callBackFunc', {success: resp.success})
              }).catch((err) => {
                that.$notify.error(err.msg === undefined ? '未知错误，请刷新页面重试' : err.msg)
              }).finally(() => {
              })
          } else {
            return false
          }
        })
      },
      /**
       * 事务类型改变时触发
       * @param val
       */
      onAffairTypeChange: function (val) {
        // 移除事务备注校验
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].clearValidate()
        }
        let that = this
        that.$set(that, 'selectUsers', '')
        if (val) {
          // 获取所有事务数据
          let template = that.affairTypeData.find(x => {
            return x.id === val
          })
          if (that.selectUserRange != null && that.selectUserRange.length > 0) {
            for (let selectUser of that.selectUserRange) {
              selectUser.relevance = false
            }
          }
          if (template) {
            if (that.affairNewModel) {
              that.affairNewModel.affair_desc = template.affair_type_content
              that.affairNewModel.affair_type_name = template.affair_type_name
            }
            if (template.login_accounts && that.selectUserRange) {
              for (let selectUser of that.selectUserRange) {
                if (template.login_accounts !== null) {
                  if (template.login_accounts.indexOf(selectUser.value) < 0) {
                    selectUser.relevance = false
                  } else {
                    selectUser.relevance = true
                  }
                } else { // 没有设置默认展示的用户，即全部不展示
                  selectUser.relevance = false
                }
              }
            }
          }
        }
      },
      /**
       * 店铺改变时，用户与部门跟着变化
       **/
      onShopChange () {
        let that = this
        that.departmentIds = ''
        that.selectUsers = ''
        that.departmentTree = []
        that.$set(that, 'selectUserRange', [])
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].clearValidate()
        }
        if (this.affairNewModel.shop_id) {
          that.$http.fetch(that.$api.core.sysUser.queryShopUserTreeByYun, {shopId: parseInt(this.affairNewModel.shop_id !== undefined ||
              this.affairNewModel.shop_id !== '' ? this.affairNewModel.shop_id : -1)})
            .then((resp) => {
              let allUser = resp.result
              if (allUser !== null && allUser.length > 0) {
                let selectUserRange = []
                let departmentTree = []
                let departIdArray = []
                for (let user of allUser) {
                  let selectUser = {}
                  selectUser.label = user.code
                  selectUser.value = user.code
                  selectUser.employeeId = user.id
                  selectUser.departmentId = user.ext1
                  selectUser.relevance = false
                  selectUserRange.push(selectUser)
                  if (departIdArray.indexOf(user.ext1) === -1) {
                    departIdArray.push(user.ext1)
                  }
                }
                for (let depart of departIdArray) {
                  for (let depart2 of that.allDepartments) {
                    if (depart2.id === depart) {
                      departmentTree.push(depart2)
                      continue
                    }
                  }
                }
                that.departmentTree = departmentTree
                that.selectUserRange = selectUserRange
                this.onAffairTypeChange(that.affairNewModel.affair_type_id)
              }
            }).finally(() => {})
        }
      },
      /**
       * 新增/修改-事务列表前处理提交信息
       */
      handleParam4AffairAddOrEdit () {
        let that = this
        let param = {}
        // 对象拷贝
        Object.assign(param, that.affairNewModel)
        // 部门处理
        if (that.handleType === 1) {
          if (that.departmentIds) {
            if (that.affairNewModel) {
              param.current_department_id = that.departmentIds.value
              param.current_department_name = that.departmentIds.text
              param.current_login_account = ''
              param.current_user_id = ''
            }
          }
        } else {
          if (that.selectUsers) {
            param.current_login_account = that.selectUsers
            param.current_department_name = ''
            param.current_department_id = ''
            if (that.selectUserRange.length > 0) {
              for (let selectUser of that.selectUserRange) {
                if (selectUser.value === that.selectUsers) {
                  param.current_user_id = selectUser.employeeId
                }
              }
            }
          }
        }
        if (this.picData && this.picData.content) {
          param.picture_url = JSON.stringify(this.picData)
        }
        for (let affair of this.affairNewModelList) {
          affair.picture_url = param.picture_url
          affair.current_login_account = param.current_login_account
          affair.current_department_name = param.current_department_name
          affair.current_department_id = param.current_department_id
          affair.affair_level = param.affair_level
          affair.affair_expire_time = param.affair_expire_time
          affair.affair_source = param.affair_source
          affair.affair_type_id = param.affair_type_id
          affair.affair_desc = param.affair_desc
          affair.budget_cost = param.budget_cost
          affair.affair_type_name = param.affair_type_name
          affair.current_user_id = param.current_user_id
          affair.shop_id = param.shop_id
        }
        if (!this.batchFlag && !this.updateFlag) {
          this.affairNewModelList[0].out_nick = param.out_nick_enc
        }
        return param
      },
      /**
       * 获取用户树
       */
      getAllUser () {
        let that = this
        that.$http.fetch(that.$api.core.sysUser.queryUserTree)
          .then((resp) => {
            let allUser = resp.result
            if (allUser !== null && allUser.length > 0) {
              let selectUserRange = []
              for (let user of allUser) {
                let selectUser = {}
                selectUser.label = user.code
                selectUser.value = user.code
                selectUser.employeeId = user.id
                selectUser.departmentId = user.ext1
                selectUser.relevance = false
                selectUserRange.push(selectUser)
              }
              that.selectUserRange = selectUserRange
              that.allUsers = selectUserRange
            }
          }).finally(() => {
          })
      },
      /**
       * 获取部门树
       */
      getDepartmentTree () {
        let that = this
        that.$http.fetch(that.$api.core.department.queryDepartmentTreeByYun)
          .then((resp) => {
            that.departmentTree = resp.result
            that.allDepartments = resp.result
          }).finally(() => {})
      },
      /**
       * 获取所有事务类型
       */
      getAffairTypeList () {
        let that = this
        that.$http.fetch(that.$api.affair.affairList.queryAffairTypeList).then((resp) => {
          that.affairTypeData = resp.result ? resp.result : []
        })
      },
      /**
       * 获取当前登陆用户信息
       */
      getUserInfo () {
        let that = this
        that.$http.fetch(that.$api.affair.affairList.getUserInfo)
          .then((resp) => {
            if (resp.result) {
              if (resp.result.loginAccount) {
                this.currentLoginUserAccount = resp.result.loginAccount
              }
            }
          }).finally(() => {
          })
      },
      getBrandShopOption () {
        let that = this
        that.$http.fetch(that.$api.core.common.querySysShopOptions)
          .then((resp) => {
            that.shops = resp.result
          }).catch((resp) => {
            that.$notify.error(resp.msg)
          }).finally(() => {
          })
      },
      onCloseAddDialog () {
        this.$refs.form.resetFields()
        this.onCloseReset()
        this.dialogAdd = false
      },
      onCloseReset () {
        this.solveFlag = 2
        this.handleType = 1
        this.selectUsers = ''
        this.departmentIds = {}
        this.affairNewModel = {}
        this.picList = []
        // this.$set(this, 'affairNewModel', {id: ''})
      },
      /**
       * 分配给我触发
       */
      onAllocationTome () {
        if (this.currentLoginUserAccount && this.affairNewModel) {
          this.selectUsers = this.currentLoginUserAccount
        }
      },
      /**
       * 图片处理方法
       * @param file
       * @param fileList
       */
      handleRemove (file) {
        if (this.picData && this.picData.content) {
          let index = 0
          for (let ct of this.picData.content) {
            if (ct.id === file.picId) {
              break
            }
            index++
          }
          this.picData.content.splice(index, 1)
        }
      },
      handlePreview (file) {
      },
      uploadSuccess (resp) {
        if (resp.result) {
          let result = resp.result
          let pic = {}
          pic.name = result.download_name
          pic.id = result.id
          this.picData.content.push(pic)
        } else {
          this.$notify.error('图片上传失败' + resp.msg ? resp.msg : '')
        }
        this.uploadFinishFlag = true
      },
      uploadError (resp) {
        this.$notify.error('图片上传失败' + resp.msg ? resp.msg : '')
        this.uploadFinishFlag = true
      },
      beforeAvatarUpload (file) {
        if (file.size / 1024 > 500) {
          this.$notify.warning('上传图片不得大于500KB')
          return false
        }
        this.uploadFinishFlag = false
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      }
    },
    components: {NsSelectRelevance, NsDatetime, NsDroptree},
    mounted: function () {
      /* this.getBrandShopOption()
      this.getAllUser()
      this.getDepartmentTree()
      this.getAffairTypeList()
      this.getUserInfo() */
      this.getUserInfo()
      this.getAllUser()
      this.getDepartmentTree()
      this.getAffairTypeList()
      this.getBrandShopOption()
    },
    created: function () {
    }
  }
</script>

<style scoped>
  @import "../../style/small/variables.pcss";

  .chat-record {

    >>> .el-collapse-item {

      .el-collapse-item__header {

        .float-right {
          color: var(--theme-base-link-color-primary);
          margin-right: var(--default-margin-larger);
        }

      }
      .el-collapse-item__content {
        font-size: var(--default-font-size-small);
      }

      .record-list {
        padding: 0;

        .record-list__item {
          padding: var(--default-padding-base);
          list-style: none;
          border: 1px solid var(--theme-base-border-color-primary);
          box-shadow: var(--default-box-shadow-base);
          border-radius: var(--default-radius-mini);

          &
          :not(:last-child) {
            margin-bottom: var(--default-margin-base);
          }

        }
      }
    }
  }
  .text-icon {
    display: inline-block;
    height: 23px;
    width: 23px;
    line-height: 23px;
    text-align: center;
    vertical-align: middle;
    font-style: normal;
    border-radius: var(--default-radius-mini);
    color: var(--theme-color-white);
    &.low {
      background-color: var(--theme-font-color-regular) !important;
    }
    &.medium {
      background-color: var(--theme-color-primary) !important;
    }
    &.high {
      background-color: var(--theme-color-danger) !important;
    }
  }
  /* 处理记录 */
  .record-scroll {

    .record-item {
      border-bottom: 1px solid var(--theme-base-border-color-primary);

      .text-secondary {

        span + span {
          margin-left: var(--default-margin-larger);
        }

      }
    }
  }
</style>
