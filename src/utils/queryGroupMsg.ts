import http from '@nascent/ecrp-ecrm/src/extends/http'
import api from '@/apis'

export default function () {
  return new Promise((resolve) => {
    http.fetch(api.getChangeChannel, {}).then((res:any) => {
      if (res.success) {
        resolve(res.result)
      } else {
        resolve(2)
      }
    }).catch(() => {
      resolve(2)
    })
  })
}
