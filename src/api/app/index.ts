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

export const postAdminLogin = (params: { account: string; pwd: string }) =>
  axios({
    method: 'post',
    url: `/admin/login`,
    data: params,
  })

// export const getUserList = (params: ParamsGetUserList) =>
//   axios({
//     method: 'get',
//     url: `/admin/user/list`,
//     params: params,
//   })

// 获取oss凭证
export const getOssCredentials = () =>
  axios({
    method: 'get',
    url: `/admin/oss/credentials`,
  })

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
export const getKnowledgeList = (params: ParamsPageLimit & { title?: string; knowledgeTypeId?: number; startAt?: string; endAt?: string }) =>
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
  duration: string // 视频时长s
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

// ---------器械---------
// 获取器械列表
export const getInstrumentsList = (params: ParamsPageLimit) =>
  axios({
    method: 'get',
    url: `/admin/instruments`,
    params: params,
  })

// 获取指定器械
export const getInstrumentsByid = (params: { instrumentId: string }) =>
  axios({
    method: 'get',
    url: `/admin/instruments/${params.instrumentId}`,
    // params: params,
  })

// 创建器械
interface Instruments {
  title: string
  rank: number // 排序
  describe: string // 介绍
  readers: number // 初始阅读人数
  coverUrl: string // 封面地址
  videoUrl: string // 视频地址
  duration: string
  courses: any[] // 链接课程 {courseId: number; rank: number}
}
export const postInstrumentsCreate = (params: Instruments) =>
  axios({
    method: 'post',
    url: `/admin/instruments/create`,
    data: params,
  })

// 删除器械
export const postInstrumentsDel = (params: { instrumentId: number }) =>
  axios({
    method: 'post',
    url: `/admin/instruments/destroy`,
    data: params,
  })

// 编辑器械
export const postInstrumentsEdit = (params: Instruments & { instrumentId: number }) =>
  axios({
    method: 'post',
    url: `/admin/instruments/update`,
    data: params,
  })

// -------动作分类------

// 获取动作类型列表
export const getMusclesTypeList = (params: ParamsPageLimit) =>
  axios({
    method: 'get',
    url: `/admin/muscles`,
    params: params,
  })

// 获取指定动作类型
export const getMusclesTypeByid = (params: { muscleId: string }) =>
  axios({
    method: 'get',
    url: `/admin/muscles/${params.muscleId}`,
    // params: params,
  })

// 创建动作类型
export const postMusclesTypeCreate = (params: { title: string; rank: number; coverUrl: string; videoUrl: string; duration: string }) =>
  axios({
    method: 'post',
    url: `/admin/muscles/create`,
    data: params,
  })

// 修改动作类型
export const postMusclesTypeEdit = (params: { title: string; rank: number; coverUrl: string; videoUrl: string; duration: string; muscleId: number }) =>
  axios({
    method: 'post',
    url: `/admin/muscles/update`,
    data: params,
  })

// 删除动作类型
export const postMusclesTypeDel = (params: { muscleId: number }) =>
  axios({
    method: 'post',
    url: `/admin/muscles/destroy`,
    data: params,
  })

// -------动作------

// 获取动作列表
export const getActionsList = (
  params: ParamsPageLimit & {
    instrumentId?: number // 器械id
    muscleId?: number // 器械id
    title?: string
    createdAt?: string
    endAt?: string
  },
) =>
  axios({
    method: 'get',
    url: `/admin/actions`,
    params: params,
  })

// 获取指定动作
export const getActionsByid = (params: { actionId: string }) =>
  axios({
    method: 'get',
    url: `/admin/actions/${params.actionId}`,
    // params: params,
  })

// 创建动作
interface Actions {
  title: string
  coverUrl: string
  videoUrl: string
  duration: string
  rank: number
  partUrl: string
  muscleId: number
  instrumentId: number
  actionContents: {
    title: string
    describe: string
  }[]
}
export const postActionsCreate = (params: Actions) =>
  axios({
    method: 'post',
    url: `/admin/actions/create`,
    data: params,
  })

// 修改动作
export const postActionsEdit = (params: Actions & { actionId: number }) =>
  axios({
    method: 'post',
    url: `/admin/actions/update`,
    data: params,
  })

// 删除动作
export const postActionsDel = (params: { actionId: number }) =>
  axios({
    method: 'post',
    url: `/admin/actions/destroy`,
    data: params,
  })

// -------课程分类------

// 获取课程分类
export const getCourseTypeList = (params: ParamsPageLimit) =>
  axios({
    method: 'get',
    url: `/admin/courseType`,
    params: params,
  })

// 获取指定课程分类
export const getCourseTypeByid = (params: { courseTypeId: string }) =>
  axios({
    method: 'get',
    url: `/admin/courseType/${params.courseTypeId}`,
    // params: params,
  })

// 创建课程分类
export const postCourseTypeCreate = (params: { title: string; rank: number }) =>
  axios({
    method: 'post',
    url: `/admin/courseType/create`,
    data: params,
  })

// 修改课程分类
export const postCourseTypeEdit = (params: { title: string; rank: number; courseTypeId: number }) =>
  axios({
    method: 'post',
    url: `/admin/courseType/update`,
    data: params,
  })

// 删除课程分类
export const postCourseTypeDel = (params: { courseTypeId: number }) =>
  axios({
    method: 'post',
    url: `/admin/courseType/destroy`,
    data: params,
  })

// -------课程------

// 获取课程列表
export const getCoursesList = (
  params: ParamsPageLimit & {
    instrumentId?: number // 器械id
    title?: string
    createdAt?: string
    endAt?: string
    courseTypeId?: number
  },
) =>
  axios({
    method: 'get',
    url: `/admin/courses`,
    params: params,
  })
// 获取指定课程
export const getCoursesByid = (params: { courseId: string }) =>
  axios({
    method: 'get',
    url: `/admin/courses/${params.courseId}`,
    // params: params,
  })

// 创建课程
interface Courses {
  title: string
  coverUrl: string
  videoUrl: string
  duration: string
  frequency: string
  describe: string
  level: string
  readers: number
  instrumentId: number // 所属器械
  courseTypeId: number // 所属课程
  videoNodes: {
    title: string
    startAt: number
    endAt: number
  }[]
  courses: {
    courseId: number
    rank: number
  }[]
  rank: number
}
export const postCoursesCreate = (params: Courses) =>
  axios({
    method: 'post',
    url: `/admin/courses/create`,
    data: params,
  })

// 修改课程
export const postCoursesEdit = (params: Courses & { courseId: number }) =>
  axios({
    method: 'post',
    url: `/admin/courses/update`,
    data: params,
  })

// 删除课程
export const postCoursesDel = (params: { courseId: number }) =>
  axios({
    method: 'post',
    url: `/admin/courses/destroy`,
    data: params,
  })
