import axios from '@/api/axios'
export interface ParamsPageLimit {
  page: string
  limit: string
}
const sleep = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, 2000)
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
