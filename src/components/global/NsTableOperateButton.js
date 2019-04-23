import isAuthorize from 'web-crm/src/utils/isAuthorize'

function createDropItems (createElement, context, btnOpts) {
  var dropMenu = btnOpts.map((item, index, arr) => {
    return createElement('el-dropdown-item', {
      'nativeOn': {
        click: function ($event) {
          console.log($event)
          // item.func.call(context, context['scope'])
        }
      }
    }, [item.name])
  })
  var dropWrapper = createElement('el-form-grid', [createElement('el-dropdown', {
    props: {
      'trigger': 'click',
      'menu-align': 'end'
    }
  }, [createElement('ns-button', {
    props: {
      'type': 'primary'
    }
  }, ['更多菜单', createElement('i', { 'class': 'el-icon-caret-bottom el-icon--right' })]) /* 更多 */,
  createElement('el-dropdown-menu', {
    'slot': 'dropdown'
  }, dropMenu) /* 下拉选项 */
  ])])
  return dropWrapper
}

export default {
  name: 'NsTableOperateButton',
  props: {
    'prop': {
      type: Object,
      default: function () {
        return {}
      }
    },
    'buttons': Array
  },
  render: function (createElement) {
    var PRENUM = 5
    var context = this
    var parentContext = context.$parent.$vnode.context
    // 筛选出被授权的按钮
    var btns = this.buttons.filter(x => {
      /*eslint-disable*/
      return isAuthorize(x.auth, x.code)
    })
    var content = []
    content = btns.slice(0, PRENUM).map(x => {
      return createElement('el-form-grid', [createElement('ns-button', {
        props: {
          'type': 'primary'
        },
        class: 'mb-sm',
        nativeOn: {
          click: function ($event) {
            console.log($event)
            x.func.call(parentContext)
          }
        }
      }, [createElement('i', {
        'class': x.icon
      }), x.name])])
    })
    var others = btns.slice(PRENUM)
    content = content.concat([' '])
    content = content.concat(
      others.length > 0
        ? createDropItems(createElement, parentContext, btns.slice(PRENUM), {label: '更多菜单'})
        : []
    )
    return createElement('div', {class: 'template-table-buttons'}, content)
  }
}

