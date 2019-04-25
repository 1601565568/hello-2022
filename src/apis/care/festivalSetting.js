import transData from 'web-crm/src/utils/transData'
export default {
  queryFestivals: {
    url: '/care/festivalsetting/queryFestivals',
    method: 'get'
  },
  addFestival: {
    url: '/care/festivalsetting/addFestival',
    method: 'post'
  },
  deleteFestival: {
    url: '/care/festivalsetting/deleteFestival',
    method: 'get'
  },
  hasFestivalNameExist: {
    url: '/care/festivalsetting/hasFestivalNameExist',
    transformRequest: transData,
    method: 'post'
  }
}
