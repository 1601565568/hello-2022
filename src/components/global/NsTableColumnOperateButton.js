import isAuthorize from 'utils/isAuthorize'

function replaceWith (scope, exp) {
  exp = ' ' + exp.trim()
  /*eslint-disable*/
  let quickRegex = /([\s\+\-\*\/%&\|\^!\(\)\*~]\s*?)([a-zA-Z_$][a-zA-Z_$0-9]*?)/g
  exp = exp.replace(quickRegex, (a, b, c) => {
    return b + 'scope.' + c
  })
  let Fn = Function
  let func = new Fn('scope', 'return ' + exp)
  return func(scope)
}

function createDropItems (createElement, context, btnOpts, prop) {
  var dropMenu = btnOpts.map((item, index, arr) => {
    return createElement('el-dropdown-item', {
      'nativeOn': {
        click: function ($event) {
          item.func.call(context, prop)
        }
      }
    }, [item.name])
  })
  var dropWrapper = createElement('el-dropdown', {
    props: {
      'menu-align': 'end'
    }
  }, [createElement('span', {
    'class': 'el-dropdown-link'
  }, ['更多', createElement('i', {'class': 'el-icon-caret-bottom el-icon--right'})]) /* 更多 */,
    createElement('el-dropdown-menu', {
      'slot': 'dropdown'
    }, dropMenu) /* 下拉选项 */
  ])
  return dropWrapper
}

function createBtns (createElement, context, btnOpts, prop) {
  return btnOpts.map(x => createElement('ns-button', {
    props: {
      'type': 'text' // 按钮类型： text
    },
    domProps: {
      'innerHTML': x.name // 按钮名称
    },
    on: {
      click: function () {
        return x.func.call(context, prop)
      } || function () {
      }
    }
  }))
}

export default {
  name: 'NsTableColumnOperateButton',
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
    var btns = this.buttons
    var context = this
    var prop = this.prop
    var content = []
    var parentContext = this.$vnode.context

    function compute (expression) {
      if (expression === undefined || expression === null) {
        return true
      }
      if (typeof expression === 'string' && expression.trim() === '') {
        return true
      }
      return replaceWith(Object.assign({}, parentContext, {scope: context.prop}), expression)
    }

    // 筛选出被授权并且允许显示的按钮
    var shown = btns.filter(x => {
      return isAuthorize(x.auth, x.code) && compute(x.visible)
    })
    var btnLength = shown.length
    if (btnLength > 1) {
      if (btnLength <= 3) {
        content = createBtns(createElement, parentContext, shown, prop)
      } else {
        var firstBtn = createBtns(createElement, parentContext, [shown[0]], prop)
        var secondBtn = createBtns(createElement, parentContext, [shown[1]], prop)
        var others = createDropItems(createElement, parentContext, shown.slice(2), prop)
        content = [].concat(firstBtn).concat(secondBtn).concat(others)
      }
    } else {
      content = createBtns(createElement, parentContext, shown, prop)
    }
    var wrapper = createElement('div', {
      'class': 'tmp-cell__buttons'
    }, content)
    return wrapper
  }
}
