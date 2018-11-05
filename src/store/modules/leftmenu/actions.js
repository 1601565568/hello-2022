import * as types from './mutations_types'

export default {
  set_menu_open: ({
                    commit
                  }) => {
    commit(types.SET_MENU_OPEN)
  },
  set_menu_close: ({
                     commit
                   }) => {
    commit(types.SET_MENU_CLOSE)
  },
  set_menu_open_flag: ({
                    commit
                  }) => {
    commit(types.SET_MENU_OPEN_FLAG)
  },
  set_menu_close_flag: ({
                     commit
                   }) => {
    commit(types.SET_MENU_CLOSE_FLAG)
  },
  set_menu_init: ({
                          commit
                        }) => {
    commit(types.SET_MENU_INIT)
  }
}
