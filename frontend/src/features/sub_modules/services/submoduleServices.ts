import api from "@/axios/axios"

import type {
  CreateSubModulePayload,
  SubModule,
  SubModuleResponse,
  SubModulesResponse,
  UpdateSubModulePayload,
} from "../submoduleTypes"

/* -------------------------------------------------------------------------- */
/* GET ALL SUB MODULES                                                        */
/* -------------------------------------------------------------------------- */

export const getSubModules = async (
  page = 1,
  limit = 10
): Promise<SubModulesResponse> => {
  const response = await api.get<SubModulesResponse>(
    "/v1/sub-modules",
    {
      params: {
        page,
        limit,
      },
    }
  )

  return response.data
}

/* -------------------------------------------------------------------------- */
/* GET SUB MODULE BY ID                                                       */
/* -------------------------------------------------------------------------- */

export const getSubModuleById = async (
  id: number | string
): Promise<SubModule> => {
  const response = await api.get<SubModuleResponse>(
    `/v1/sub-modules/${id}`
  )

  return response.data.data
}

/* -------------------------------------------------------------------------- */
/* CREATE SUB MODULE                                                          */
/* -------------------------------------------------------------------------- */

export const createSubModule = async (
  data: CreateSubModulePayload
): Promise<SubModule> => {
  const response = await api.post<SubModuleResponse>(
    "/v1/sub-modules",
    data
  )

  return response.data.data
}

/* -------------------------------------------------------------------------- */
/* UPDATE SUB MODULE                                                          */
/* -------------------------------------------------------------------------- */

export const updateSubModule = async (
  data: UpdateSubModulePayload
): Promise<SubModule> => {
  const { id, ...payload } = data

  const response = await api.put<SubModuleResponse>(
    `/v1/sub-modules/${id}`,
    payload
  )

  return response.data.data
}

/* -------------------------------------------------------------------------- */
/* DELETE SUB MODULE                                                          */
/* -------------------------------------------------------------------------- */

export const deleteSubModule = async (
  id: number
): Promise<void> => {
  await api.delete(`/v1/sub-modules/${id}`)
}