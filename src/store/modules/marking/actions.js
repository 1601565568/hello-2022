import http from '@nascent/ecrp-ecrm/src/extends/http'
import api from '@/apis'
import Notification from '@nascent/nui/lib/notification.js'
export default {
  getTagGroupList ({ commit }) {
    return new Promise((resolve) => {
      http.fetch(api.weWork.externalContact.queryCorpTagList)
        .then((resp) => {
          const corpTagList = resp.result
          if (corpTagList) {
            // 标签组列表
            const tagGroupList = []
            // 标签列表
            const tagList = []
            for (let corpTag of corpTagList) {
              if (corpTag.is_tag_group === 1) {
                tagGroupList.push({
                  tagId: corpTag.tag_id,
                  tagName: corpTag.tag_name
                })
              } else {
                tagList.push({
                  tagId: corpTag.tag_id,
                  tagName: corpTag.tag_name,
                  parentTagId: corpTag.parent_tag_id
                })
              }
            }
            commit('setTagGroupList', tagGroupList)
            commit('setTaglist', tagList)
            // that.tagGroupList = tagGroupList
            // that.tagList = tagList
          }
        }).catch((resp) => {
          Notification.error(getErrorMsg('获取企业标签失败,请稍后重试', resp))
        }).finally(() => {})
    })
  }
}
