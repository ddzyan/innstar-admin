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

// TODO 暂时借用
export const s3UploadFile = ({ file }: { file: any }) => {
  const _formdata = new FormData()
  _formdata.append('file', file)
  _formdata.append('filename', file.name)
  _formdata.append('acl', 'public-read')
  _formdata.append('bucket', 'grheat-brf-test')
  const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJhciIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjQ1NTExNjUwLCJleHAiOjE2NzcwNDc2NTB9.4DY1LRgZ0TJv0bzC5-SDromWQlWAb7uETdpvOKJGEPQ'
  const apiUrl = 'https://s3.test.dcpool.cn'
  return axios({
    baseURL: apiUrl,
    method: 'post',
    url: `/api/aws/upload`,
    data: _formdata,
    headers: {
      'Content-Type': 'multipart/form-data',
      // 直接写死token，用于上传，时限1年，2022年2月22日起算
      Authorization: token,
    },
  })
}
