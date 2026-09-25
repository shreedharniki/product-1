

// // // import api from "@/axios/axios"

// // // import type {
// // //   CreateOrganizationPayload,
// // //   OrganizationListParams,
// // //   OrganizationListResponse,
// // //   OrganizationResponse,
// // //   UpdateOrganizationPayload,
// // // } from "../organizationsTypes"

// // // const ORGANIZATION_API = "/v1/organizations"

// // // export const organizationService = {
// // //   /* =========================================================
// // //      GET ORGANIZATIONS
// // //   ========================================================= */

// // //   getOrganizations: async (
// // //     params?: OrganizationListParams,
// // //   ): Promise<OrganizationListResponse> => {
// // //     const response =
// // //       await api.get<OrganizationListResponse>(
// // //         ORGANIZATION_API,
// // //         {
// // //           params,
// // //         },
// // //       )

// // //     return response.data
// // //   },

// // //   /* =========================================================
// // //      GET ORGANIZATION BY ID
// // //   ========================================================= */

// // //   getOrganizationById: async (
// // //     id: number | string,
// // //   ): Promise<OrganizationResponse> => {
// // //     const response =
// // //       await api.get<OrganizationResponse>(
// // //         `${ORGANIZATION_API}/${id}`,
// // //       )
      
// // //     return response.data
// // //   },

// // //   /* =========================================================
// // //      CREATE
// // //   ========================================================= */

// // //   // createOrganization: async (
// // //   //   payload: CreateOrganizationPayload,
// // //   // ) => {
// // //   //   const response =
// // //   //     await api.post(
// // //   //       ORGANIZATION_API,
// // //   //       payload,
// // //   //     )

// // //   //   return response.data
// // //   // },
// // //   createOrganization: async (
// // //     payload: CreateOrganizationPayload,
// // //   ): Promise<OrganizationResponse> => {
// // //     const response = await api.post<OrganizationResponse>(
// // //       ORGANIZATION_API,
// // //       payload,
// // //     )

// // //     return response.data
// // //   },
// // //   /* =========================================================
// // //      UPDATE
// // //   ========================================================= */

// // //   updateOrganization: async (
// // //     id: number | string,
// // //     payload: UpdateOrganizationPayload,
// // //   ) => {
// // //     const response =
// // //       await api.put(
// // //         `${ORGANIZATION_API}/${id}`,
// // //         payload,
// // //       )

// // //     return response.data
// // //   },

// // //   /* =========================================================
// // //      DELETE
// // //   ========================================================= */

// // //   deleteOrganization: async (
// // //     id: number | string,
// // //   ) => {
// // //     const response =
// // //       await api.delete(
// // //         `${ORGANIZATION_API}/${id}`,
// // //       )

// // //     return response.data
// // //   },
// // // }


// // import api from "@/axios/axios"

// // import type {
// //   CreateOrganizationPayload,
// //   OrganizationListParams,
// //   OrganizationListResponse,
// //   OrganizationResponse,
// //   UpdateOrganizationPayload,
// // } from "../organizationsTypes"

// // const ORGANIZATION_API = "/v1/organizations"

// // export const organizationService = {
// //   /* =========================================================
// //      GET ORGANIZATIONS
// //   ========================================================= */

// //   getOrganizations: async (
// //     params?: OrganizationListParams,
// //   ): Promise<OrganizationListResponse> => {
// //     const response = await api.get<OrganizationListResponse>(
// //       ORGANIZATION_API,
// //       {
// //         params,
// //       },
// //     )

// //     return response.data
// //   },

// //   /* =========================================================
// //      GET ORGANIZATION BY ID
// //   ========================================================= */

// //   getOrganizationById: async (
// //     id: number | string,
// //   ): Promise<OrganizationResponse> => {
// //     const response = await api.get<OrganizationResponse>(
// //       `${ORGANIZATION_API}/${id}`,
// //     )

// //     return response.data
// //   },

// //   /* =========================================================
// //      CREATE ORGANIZATION
// //   ========================================================= */

// //   createOrganization: async (
// //     payload: CreateOrganizationPayload,
// //   ): Promise<OrganizationResponse> => {
// //     try {
// //       console.log(
// //         "CREATE ORGANIZATION REQUEST:",
// //         JSON.stringify(payload, null, 2),
// //       )

// //       const response = await api.post<OrganizationResponse>(
// //         ORGANIZATION_API,
// //         payload,
// //       )

// //       console.log(
// //         "CREATE ORGANIZATION SUCCESS:",
// //         response.data,
// //       )

// //       return response.data
// //     } catch (error: unknown) {
// //       console.error(
// //         "CREATE ORGANIZATION FAILED",
// //         error,
// //       )

// //       if (
// //         typeof error === "object" &&
// //         error !== null &&
// //         "response" in error
// //       ) {
// //         const axiosError = error as {
// //           response?: {
// //             status?: number
// //             data?: unknown
// //           }
// //           message?: string
// //         }

// //         console.error(
// //           "STATUS:",
// //           axiosError.response?.status,
// //         )

// //         console.error(
// //           "BACKEND RESPONSE:",
// //           axiosError.response?.data,
// //         )

// //         console.error(
// //           "ERROR MESSAGE:",
// //           axiosError.message,
// //         )
// //       }

// //       throw error
// //     }
// //   },

// //   /* =========================================================
// //      UPDATE ORGANIZATION
// //   ========================================================= */

// //   updateOrganization: async (
// //     id: number | string,
// //     payload: UpdateOrganizationPayload,
// //   ): Promise<OrganizationResponse> => {
// //     const response = await api.put<OrganizationResponse>(
// //       `${ORGANIZATION_API}/${id}`,
// //       payload,
// //     )

// //     return response.data
// //   },

// //   /* =========================================================
// //      DELETE ORGANIZATION
// //   ========================================================= */

// //   deleteOrganization: async (
// //     id: number | string,
// //   ): Promise<void> => {
// //     await api.delete(
// //       `${ORGANIZATION_API}/${id}`,
// //     )
// //   },
// // }


// import api from "@/axios/axios"

// import type {
//   CreateOrganizationPayload,
//   OrganizationListParams,
//   OrganizationListResponse,
//   OrganizationResponse,
//   UpdateOrganizationPayload,
// } from "../organizationsTypes"

// const ORGANIZATION_API = "/v1/organizations"

// export const organizationService = {
//   /* =========================================================
//      GET ORGANIZATIONS
//   ========================================================= */

//   getOrganizations: async (
//     params?: OrganizationListParams,
//   ): Promise<OrganizationListResponse> => {
//     const response =
//       await api.get<OrganizationListResponse>(
//         ORGANIZATION_API,
//         {
//           params,
//         },
//       )

//     return response.data
//   },

//   /* =========================================================
//      GET ORGANIZATION BY ID
//   ========================================================= */

//   getOrganizationById: async (
//     id: number | string,
//   ): Promise<OrganizationResponse> => {
//     const response =
//       await api.get<OrganizationResponse>(
//         `${ORGANIZATION_API}/${id}`,
//       )

//     return response.data
//   },

//   /* =========================================================
//      CREATE ORGANIZATION
//   ========================================================= */

//   createOrganization: async (
//     payload: CreateOrganizationPayload,
//   ): Promise<OrganizationResponse> => {
//     console.log(
//       "CREATE ORGANIZATION REQUEST:",
//       JSON.stringify(
//         payload,
//         null,
//         2,
//       ),
//     )

//     try {
//       const response =
//         await api.post<OrganizationResponse>(
//           ORGANIZATION_API,
//           payload,
//         )

//       console.log(
//         "CREATE ORGANIZATION SUCCESS:",
//         response.data,
//       )

//       return response.data
//     } catch (error: unknown) {
//       console.error(
//         "CREATE ORGANIZATION FAILED:",
//         error,
//       )

//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "response" in error
//       ) {
//         const axiosError =
//           error as {
//             response?: {
//               status?: number
//               data?: unknown
//             }
//             message?: string
//           }

//         console.error(
//           "STATUS:",
//           axiosError.response?.status,
//         )

//         console.error(
//           "BACKEND RESPONSE:",
//           axiosError.response?.data,
//         )

//         console.error(
//           "ERROR MESSAGE:",
//           axiosError.message,
//         )
//       }

//       // VERY IMPORTANT
//       // Do not convert this into new Error(...)
//       throw error
//     }
//   },

//   /* =========================================================
//      UPDATE ORGANIZATION
//   ========================================================= */

//   updateOrganization: async (
//     id: number | string,
//     payload: UpdateOrganizationPayload,
//   ): Promise<OrganizationResponse> => {
//     const response =
//       await api.put<OrganizationResponse>(
//         `${ORGANIZATION_API}/${id}`,
//         payload,
//       )

//     return response.data
//   },

//   /* =========================================================
//      DELETE ORGANIZATION
//   ========================================================= */

//   deleteOrganization: async (
//     id: number | string,
//   ): Promise<void> => {
//     await api.delete(
//       `${ORGANIZATION_API}/${id}`,
//     )
//   },
// }

import api from "@/axios/axios"

import type {
  CreateOrganizationPayload,
  OrganizationListParams,
  OrganizationListResponse,
  OrganizationResponse,
  UpdateOrganizationPayload,
} from "../organizationsTypes"

const ORGANIZATION_API =
  "/v1/organizations"

/* =========================================================
   ORGANIZATION SERVICE
========================================================= */

export const organizationService = {
  /* =======================================================
     GET ORGANIZATIONS
  ======================================================= */

  getOrganizations: async (
    params?: OrganizationListParams,
  ): Promise<OrganizationListResponse> => {
    const response =
      await api.get<OrganizationListResponse>(
        ORGANIZATION_API,
        {
          params,
        },
      )

    return response.data
  },

  /* =======================================================
     GET ORGANIZATION BY ID
  ======================================================= */

  getOrganizationById: async (
    id: number | string,
  ): Promise<OrganizationResponse> => {
    const response =
      await api.get<OrganizationResponse>(
        `${ORGANIZATION_API}/${id}`,
      )

    return response.data
  },

  /* =======================================================
     CREATE ORGANIZATION
  ======================================================= */

  createOrganization: async (
    payload: CreateOrganizationPayload,
  ): Promise<OrganizationResponse> => {
    try {
      console.log(
        "CREATE ORGANIZATION REQUEST:",
        JSON.stringify(
          payload,
          null,
          2,
        ),
      )

      const response =
        await api.post<OrganizationResponse>(
          ORGANIZATION_API,
          payload,
        )

      console.log(
        "CREATE ORGANIZATION SUCCESS:",
        response.data,
      )

      return response.data
    } catch (error: unknown) {
      console.error(
        "CREATE ORGANIZATION FAILED:",
        error,
      )

      throw error
    }
  },

  /* =======================================================
     UPDATE ORGANIZATION
  ======================================================= */

  updateOrganization: async (
    id: number | string,
    payload: UpdateOrganizationPayload,
  ): Promise<OrganizationResponse> => {
    const response =
      await api.put<OrganizationResponse>(
        `${ORGANIZATION_API}/${id}`,
        payload,
      )

    return response.data
  },

  /* =======================================================
     DELETE ORGANIZATION
  ======================================================= */

  deleteOrganization: async (
    id: number | string,
  ): Promise<void> => {
    await api.delete(
      `${ORGANIZATION_API}/${id}`,
    )
  },
}