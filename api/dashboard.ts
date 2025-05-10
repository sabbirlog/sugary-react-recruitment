import clientManagementInstance from "./api"

interface GetMaterialsParams {
  Skip?: number
  Limit?: number
  Types?: number[]
}

export const getMaterials = async ({ Skip = 0, Limit = 10, Types = [1] }: GetMaterialsParams) => {
  const filterObj = { Skip, Limit, Types }
  const base64Filter = btoa(JSON.stringify(filterObj))

  const res = await clientManagementInstance().get(`/Materials/GetAll?filter=${base64Filter}`)
  return res?.data
}
