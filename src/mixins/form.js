import common from './common'

export default {
  methods: {
    setModel: function (model, modelName) {
      if (modelName) {
        this.$set(this, modelName, model)
      } else {
        this.$set(this, 'model', model)
      }
    },
    resetForm: function (orgModel) {
      if (orgModel) {
        this.setModel(orgModel)
      } else {
        this.setModel(this.$options.data().model)
      }
      this.$refs.form.resetFields()
    },
    /**
     * vue表单验证提交
     */
    validAndSubmit: function (options) {
      var $this = this
      let form = options.form || $this.$refs.form
      form.validate(function (state) {
        if (state) {
          if ($this.$data[options.loading] !== undefined) {
            $this.$set($this, options.loading, true)
          }
          $this.submit(options)
        }
      })
    },
    submit: function (options) {
      let $this = this

      function resolver (params) {
        $this.$http.fetch(options.api, params).then((data) => {
          if (options && options.success && typeof options.success === 'function') {
            options.success(data, $this)
          }
        }).catch((xhr) => {
          if (options && options.error && typeof options.error === 'function') {
            options.error(xhr, $this)
          }
        }).finally((xhr) => {
          if ($this.$data[options.loading] === true) {
            $this.$set($this, options.loading, false)
          }
          if (options.complete) {
            options.complete(xhr, $this)
          }
        })
      }

      let params = JSON.parse(JSON.stringify(options.params || this.model))
      if (options && options.handleParams && typeof options.handleParams === 'function') {
        resolver(options.handleParams(params))
      } else {
        resolver(params)
      }
    },
    /**
     * 转换为下划线
     * @param object
     */
    transObjProp2Underline (object) {
      return this.transObjPropertyName(object, 1)
    },
    /**
     * 转换为小驼峰
     * @param object
     */
    transObjProp2CamelCase (object) {
      return this.transObjPropertyName(object, 2)
    },
    /**
     * 转换对象的属性名称
     * @param object
     * @param type 1：小驼峰转下划线 2：下划线转驼峰
     */
    transObjPropertyName: function (object, type) {
      let fn
      if (!(object instanceof Object) || !type) {
        throw new Error('参数不合法，请传入Object对象')
      }
      if (type === 1) {
        // 小驼峰转下划线
        fn = common.camelCase2Underline
      } else if (type === 2) {
        // 下划线转驼峰
        fn = common.underline2CamelCase
      }
      let data = {}
      for (let key in object) {
        let transKey = fn(key)
        if (object[key] instanceof Array || object[key] instanceof Object) {
          data[transKey] = JSON.parse(JSON.stringify(object[key]))
        } else {
          data[transKey] = object[key] === undefined || object[key] === null ? '' : object[key]
        }
      }
      return data
    }
  },
  computed: {
    savePromptMsg: function () {
      let msg
      if (this.saveType === 'add') {
        msg = '新增'
      } else if (this.saveType === 'edit') {
        msg = '修改'
      }
      return msg
    }
  },
  data () {
    return {
      saveType: 'add'
    }
  }
}
