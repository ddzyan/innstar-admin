import axios from '@/api/axios'
export interface ParamsPageLimit {
  page: string
  limit: string
}
const sleep = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, 1000)
  })
}

export const demoApi = async (params: any) => {
  console.log(params)
  await sleep()
  return new Promise<void>((resolve) => {
    resolve()
  })
}

// export const postAdminLogin = (params: ParamsPostAdminLogin) =>
//   axios({
//     method: 'post',
//     url: `/admin/login`,
//     data: params,
//   })

// export const getUserList = (params: ParamsGetUserList) =>
//   axios({
//     method: 'get',
//     url: `/admin/user/list`,
//     params: params,
//   })

// 获取基础知识类型列表
export const getKnowledgeTypeList = (params: ParamsPageLimit) =>
  axios({
    method: 'get',
    url: `/admin/knowledgeType`,
    params: params,
  })

// 获取指定基础知识类型
export const getKnowledgeTypeByid = (params: { knowledgeTypeId: string }) =>
  axios({
    method: 'get',
    url: `/admin/knowledgeType/show`,
    params: params,
  })

// 创建基础知识类型
export const postKnowledgeTypeCreate = (params: { name: string; rank: number }) =>
  axios({
    method: 'post',
    url: `/admin/knowledgeType/create`,
    data: params,
  })

// 修改基础知识类型
export const postKnowledgeTypeEdit = (params: { name: string; rank: number; knowledgeTypeId: number }) =>
  axios({
    method: 'post',
    url: `/admin/knowledgeType/update`,
    data: params,
  })

// 删除基础知识类型
export const postKnowledgeTypeDel = (params: { knowledgeTypeId: number }) =>
  axios({
    method: 'post',
    url: `/admin/knowledgeType/destroy`,
    data: params,
  })

// ---------基础知识---------

// 获取基础知识列表
export const getKnowledgeList = (params: ParamsPageLimit) =>
  axios({
    method: 'get',
    url: `/admin/knowledge`,
    params: params,
  })

// 获取指定基础知识列表
export const getKnowledgeByid = (params: { knowledgeId: string }) =>
  axios({
    method: 'get',
    url: `/admin/knowledge/show`,
    params: params,
  })

// 创建基础知识
interface Knowledge {
  title: string
  knowledgeTypeId: number // 基础知识类型id
  rank: number // 排序
  describe: string // 介绍
  readers: number // 初始阅读人数
  coverUrl: string // 封面地址
  videoUrl: string // 视频地址
  courses: any[] // 链接课程 {courseId: number; rank: number}
}
export const postKnowledgeCreate = (params: Knowledge) =>
  axios({
    method: 'post',
    url: `/admin/knowledge`,
    data: params,
  })

// 删除基础知识
export const postKnowledgeDel = (params: { knowledgeId: number }) =>
  axios({
    method: 'post',
    url: `/admin/knowledge/destroy`,
    data: params,
  })

// 编辑基础知识
export const postKnowledgEdit = (params: Knowledge & { knowledgeId: number }) =>
  axios({
    method: 'post',
    url: `/admin/knowledge/update`,
    data: params,
  })
