// // import { useEffect, useState } from "react"

// // import { useNavigate, useParams } from "react-router-dom"

// // import { useDispatch, useSelector } from "react-redux"

// // import type { AppDispatch } from "@/app/store"

// // import SubmodulesForm from "../components/SubmoduleForm"


// // import {
// //   fetchSubModuleById,
// //   editSubModule,
// // } from "../submoduleThunks"
// // import {
// //   selectSubModulesLoading,
// // } from "../submoduleSelectors"

// // import type { SubModuleFormData } from "../submoduleValidations"

// // import type {SubModule} from "../submoduleTypes"

// // export default function EditSubModule(){
// //      const { id } = useParams<{
// //     id: string
// //      }>()
     
// //        const navigate = useNavigate()
     
// //        const dispatch = useDispatch<AppDispatch>()
     
// //        const loading = useSelector(
// //          selectSubModulesLoading
// //        )

// //          const [submodule, setSubModule] =
// //            useState<SubModule | null>(null)

// //             const [pageLoading, setPageLoading] =
// //             useState(true)
// //  useEffect(() => {
// //     if (!id) return

// //     const loadModule = async () => {
// //       setPageLoading(true)

// //       const result = await dispatch(
// //         fetchSubModuleById(id)
// //       )

// //       if (
// //         fetchSubModuleById.fulfilled.match(
// //           result
// //         )
// //       ) {
// //         setSubModule(result.payload)
// //       }

// //       setPageLoading(false)
// //     }

// //     void loadModule()
// //   }, [dispatch, id])


// // const handleSubmit = async (
// //     data: SubModuleFormData
// //   ) => {
// //     if (!id) return

// //     const result = await dispatch(
// //       editSubModule({
// //         ...data,
// //         id: Number(id),
// //       })
// //     )

// //     if (
// //       editSubModule.fulfilled.match(result)
// //     ) {
// //       navigate("/submodule")
// //     }
// //   }
// //               if (pageLoading) {
// //                     return (
// //                     <div className="flex min-h-[300px] items-center justify-center">
// //                         <p className="text-sm text-muted-foreground">
// //                         Loading module...
// //                         </p>
// //                     </div>
// //                     )
// //                 }
// //    if (!submodule) {
// //     return (
// //       <div className="rounded-md border p-6 text-center">
// //         <p className="text-sm text-destructive">
// //            Sub Module not found.
// //         </p>

// //         <button
// //           type="button"
// //           className="mt-4 underline"
// //           onClick={() =>
// //             navigate("/submodule")
// //           }
// //         >
// //           Back to  Sub Modules
// //         </button>
// //       </div>
// //     )
// //   }
// //     return(

// //         <>
// //         <div className="w-full">
       
// //              <SubmodulesForm
// //             //    initialData={submodule}
// //             initialData={{
// //   ...submodule,
// //   note: submodule.note ?? "",
// // }}
// //                loading={loading}
// //                onSubmit={handleSubmit}
// //                onCancel={() =>
// //                  navigate("/submodule")
// //                }
// //              />
       
// //            </div>
// //         </>
// //     )
// // }


// "use client"

// import {
//   useEffect,
//   useState,
// } from "react"

// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom"

// import {
//   useDispatch,
//   useSelector,
// } from "react-redux"

// import type {
//   AppDispatch,
// } from "@/app/store"

// import SubmodulesForm from "../components/SubmoduleForm"

// import {
//   fetchSubModuleById,
//   editSubModule,
// } from "../submoduleThunks"

// import {
//   selectSubModulesLoading,
// } from "../submoduleSelectors"

// import type {
//   SubModuleFormData,
// } from "../submoduleValidations"

// import type {
//   SubModule,
// } from "../submoduleTypes"

// import {
//   fetchModulesList,
// } from "../../modules/moduleThunks"

// import {
//   fetchRoles,
// } from "../../roles/roleThunks"

// import {
//   selectRoles,
//   selectRolesLoading,
//   selectRolesError,
// } from "../../roles/roleSelectors"

// export default function EditSubModule() {
//   const {
//     id,
//   } = useParams<{
//     id: string
//   }>()

//   const navigate = useNavigate()

//   const dispatch =
//     useDispatch<AppDispatch>()

//   /* =========================================================
//      SUB MODULE LOADING
//   ========================================================= */

//   const loading =
//     useSelector(
//       selectSubModulesLoading,
//     )

//   /* =========================================================
//      ROLES
//   ========================================================= */

//   const roles =
//     useSelector(
//       selectRoles,
//     )

//   const rolesLoading =
//     useSelector(
//       selectRolesLoading,
//     )

//   const rolesError =
//     useSelector(
//       selectRolesError,
//     )

//   /* =========================================================
//      LOCAL STATE
//   ========================================================= */

//   const [
//     submodule,
//     setSubModule,
//   ] =
//     useState<SubModule | null>(null)

//   const [
//     pageLoading,
//     setPageLoading,
//   ] =
//     useState(true)

//   const [
//     submitting,
//     setSubmitting,
//   ] =
//     useState(false)

//   /* =========================================================
//      LOAD EDIT DATA
//   ========================================================= */

//   useEffect(() => {
//     if (!id) {
//       setPageLoading(false)
//       return
//     }

//     let mounted = true

//     const loadData = async () => {
//       try {
//         setPageLoading(true)

//         /*
//          * Load modules first.
//          */
//         await dispatch(
//           fetchModulesList(),
//         )

//         /*
//          * Load roles.
//          *
//          * This is very important because
//          * permissions must use valid
//          * default_roles IDs.
//          */
//         await dispatch(
//           fetchRoles(),
//         )

//         /*
//          * Load the existing sub module.
//          */
//         const result =
//           await dispatch(
//             fetchSubModuleById(id),
//           )

//         if (!mounted) {
//           return
//         }

//         if (
//           fetchSubModuleById.fulfilled.match(
//             result,
//           )
//         ) {
//           console.log(
//             "EDIT SUBMODULE:",
//             result.payload,
//           )

//           setSubModule(
//             result.payload,
//           )
//         } else {
//           console.error(
//             "Failed to load sub module:",
//             result,
//           )

//           setSubModule(null)
//         }
//       } catch (error) {
//         console.error(
//           "Failed to load edit page:",
//           error,
//         )

//         if (mounted) {
//           setSubModule(null)
//         }
//       } finally {
//         if (mounted) {
//           setPageLoading(false)
//         }
//       }
//     }

//     void loadData()

//     return () => {
//       mounted = false
//     }
//   }, [
//     dispatch,
//     id,
//   ])

//   /* =========================================================
//      SUBMIT
//   ========================================================= */

//   const handleSubmit = async (
//     data: SubModuleFormData,
//   ) => {
//     console.log(
//       "================================",
//     )

//     console.log(
//       "EDIT SUBMODULE SUBMIT",
//     )

//     console.log(
//       "ID:",
//       id,
//     )

//     console.log(
//       "FORM DATA:",
//       data,
//     )

//     console.log(
//       "ROLES:",
//       roles,
//     )

//     console.log(
//       "================================",
//     )

//     if (!id) {
//       console.error(
//         "Sub module ID is missing.",
//       )

//       return
//     }

//     if (rolesLoading) {
//       console.error(
//         "Roles are still loading.",
//       )

//       return
//     }

//     if (rolesError) {
//       console.error(
//         "Roles loading error:",
//         rolesError,
//       )

//       return
//     }

//     if (roles.length === 0) {
//       console.error(
//         "No roles available.",
//       )

//       return
//     }

//     /*
//      * IMPORTANT:
//      *
//      * Build permissions ONLY from roles
//      * returned by the roles API.
//      *
//      * Do NOT hard-code:
//      * role_id: 1, 2, 3, 4
//      */
//     const permissions =
//       roles.map(
//         (role) => {
//           const existing =
//             data.permissions?.find(
//               (permission) =>
//                 Number(
//                   permission.role_id,
//                 ) ===
//                 Number(role.id),
//             )

//           return {
//             role_id:
//               Number(role.id),

//             permission:
//               Number(
//                 existing?.permission ??
//                   0,
//               ),
//           }
//         },
//       )

//     const payload = {
//       id:
//         Number(id),

//       module_id:
//         Number(data.module_id),

//       sub_module_code:
//         data.sub_module_code.trim(),

//       sub_module_name:
//         data.sub_module_name.trim(),

//       sub_module_status:
//         data.sub_module_status,

//       display_order:
//         Number(
//           data.display_order,
//         ),

//       note:
//         data.note?.trim() ?? "",

//       permissions,
//     }

//     console.log(
//       "================================",
//     )

//     console.log(
//       "FINAL UPDATE PAYLOAD:",
//       payload,
//     )

//     console.log(
//       "================================",
//     )

//     try {
//       setSubmitting(true)

//       const result =
//         await dispatch(
//           editSubModule(
//             payload,
//           ),
//         )

//       console.log(
//         "UPDATE RESULT:",
//         result,
//       )

//       if (
//         editSubModule.fulfilled.match(
//           result,
//         )
//       ) {
//         console.log(
//           "SUB MODULE UPDATED SUCCESSFULLY",
//         )

//         navigate(
//           "/submodule",
//         )

//         return
//       }

//       console.error(
//         "SUB MODULE UPDATE FAILED:",
//         result,
//       )
//     } catch (error) {
//       console.error(
//         "UPDATE EXCEPTION:",
//         error,
//       )
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   /* =========================================================
//      PAGE LOADING
//   ========================================================= */

//   if (pageLoading) {
//     return (
//       <div className="flex min-h-[300px] items-center justify-center">
//         <p className="text-sm text-muted-foreground">
//           Loading sub module...
//         </p>
//       </div>
//     )
//   }

//   /* =========================================================
//      INVALID ID
//   ========================================================= */

//   if (!id) {
//     return (
//       <div className="rounded-md border p-6 text-center">
//         <p className="text-sm text-destructive">
//           Invalid sub module ID.
//         </p>

//         <button
//           type="button"
//           className="mt-4 underline"
//           onClick={() =>
//             navigate(
//               "/submodule",
//             )
//           }
//         >
//           Back to Sub Modules
//         </button>
//       </div>
//     )
//   }

//   /* =========================================================
//      SUB MODULE NOT FOUND
//   ========================================================= */

//   if (!submodule) {
//     return (
//       <div className="rounded-md border p-6 text-center">
//         <p className="text-sm text-destructive">
//           Sub Module not found.
//         </p>

//         <button
//           type="button"
//           className="mt-4 underline"
//           onClick={() =>
//             navigate(
//               "/submodule",
//             )
//           }
//         >
//           Back to Sub Modules
//         </button>
//       </div>
//     )
//   }

//   /* =========================================================
//      ROLES ERROR
//   ========================================================= */

//   if (
//     !rolesLoading &&
//     rolesError
//   ) {
//     return (
//       <div className="rounded-md border p-6 text-center">
//         <p className="text-sm text-destructive">
//           {rolesError}
//         </p>

//         <button
//           type="button"
//           className="mt-4 underline"
//           onClick={() =>
//             navigate(
//               "/submodule",
//             )
//           }
//         >
//           Back to Sub Modules
//         </button>
//       </div>
//     )
//   }

//   /* =========================================================
//      NO ROLES
//   ========================================================= */

//   if (
//     !rolesLoading &&
//     roles.length === 0
//   ) {
//     return (
//       <div className="rounded-md border p-6 text-center">
//         <p className="text-sm text-destructive">
//           No roles are available.
//         </p>

//         <button
//           type="button"
//           className="mt-4 underline"
//           onClick={() =>
//             navigate(
//               "/submodule",
//             )
//           }
//         >
//           Back to Sub Modules
//         </button>
//       </div>
//     )
//   }

//   /* =========================================================
//      FORM
//   ========================================================= */

//   return (
//     <div className="w-full">
//       <SubmodulesForm
//         initialData={{
//           id:
//             Number(
//               submodule.id,
//             ),

//           module_id:
//             Number(
//               submodule.module_id,
//             ),

//           sub_module_code:
//             submodule.sub_module_code ??
//             "",

//           sub_module_name:
//             submodule.sub_module_name ??
//             "",

//           sub_module_status:
//             submodule.sub_module_status ??
//             "active",

//           display_order:
//             Number(
//               submodule.display_order ??
//                 1,
//             ),

//           note:
//             submodule.note ??
//             "",

//           permissions:
//             submodule.permissions ??
//             [],
//         }}
//         loading={
//           loading ||
//           rolesLoading ||
//           submitting
//         }
//         onSubmit={
//           handleSubmit
//         }
//         onCancel={() =>
//           navigate(
//             "/submodule",
//           )
//         }
//       />
//     </div>
//   )
// }


"use client"

import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import {
  useDispatch,
  useSelector,
} from "react-redux"

import type {
  AppDispatch,
} from "@/app/store"

import SubmodulesForm from "../components/SubmoduleForm"

import {
  fetchSubModuleById,
  editSubModule,
} from "../submoduleThunks"

import {
  selectSubModulesLoading,
} from "../submoduleSelectors"

import type {
  SubModuleFormData,
} from "../submoduleValidations"

import type {
  SubModule,
} from "../submoduleTypes"

import {
  fetchModulesList,
} from "../../modules/moduleThunks"

import {
  fetchRoles,
} from "../../roles/roleThunks"

import {
  selectRoles,
  selectRolesLoading,
  selectRolesError,
} from "../../roles/roleSelectors"


export default function EditSubModule() {
  /* =========================================================
     PARAMS
  ========================================================= */

  const {
    id,
  } = useParams<{
    id: string
  }>()

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const navigate = useNavigate()

  /* =========================================================
     REDUX
  ========================================================= */

  const dispatch =
    useDispatch<AppDispatch>()

  /* =========================================================
     SUB MODULE LOADING
  ========================================================= */

  const loading =
    useSelector(
      selectSubModulesLoading,
    )

  /* =========================================================
     ROLES
  ========================================================= */

  const roles =
    useSelector(
      selectRoles,
    )

  const rolesLoading =
    useSelector(
      selectRolesLoading,
    )

  const rolesError =
    useSelector(
      selectRolesError,
    )

  /* =========================================================
     LOCAL STATE
  ========================================================= */

  const [
    submodule,
    setSubModule,
  ] =
    useState<SubModule | null>(null)

  /*
   * If ID does not exist, we don't need
   * to show the loading screen.
   *
   * This avoids calling setState()
   * synchronously inside useEffect().
   */
  const [
    pageLoading,
    setPageLoading,
  ] =
    useState(
      Boolean(id),
    )

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false)

  /* =========================================================
     LOAD EDIT DATA
  ========================================================= */

  useEffect(() => {
    /*
     * No ID means there is nothing to fetch.
     *
     * IMPORTANT:
     * Do NOT call setPageLoading(false) here.
     */
    if (!id) {
      return
    }

    let mounted = true

    const loadData = async () => {
      try {
        /*
         * -----------------------------------------------------
         * FETCH MODULES
         * -----------------------------------------------------
         */

        const modulesResult =
          await dispatch(
            fetchModulesList(),
          )

        if (
          !fetchModulesList.fulfilled.match(
            modulesResult,
          )
        ) {
          console.error(
            "Failed to load modules:",
            modulesResult,
          )
        }

        /*
         * -----------------------------------------------------
         * FETCH ROLES
         * -----------------------------------------------------
         *
         * This is important because the permission
         * role IDs must come from the roles API.
         */

        const rolesResult =
          await dispatch(
            fetchRoles(),
          )

        if (
          !fetchRoles.fulfilled.match(
            rolesResult,
          )
        ) {
          console.error(
            "Failed to load roles:",
            rolesResult,
          )
        }

        /*
         * -----------------------------------------------------
         * FETCH SUB MODULE
         * -----------------------------------------------------
         */

        const result =
          await dispatch(
            fetchSubModuleById(id),
          )

        /*
         * Component has been unmounted.
         */

        if (!mounted) {
          return
        }

        /*
         * -----------------------------------------------------
         * SUCCESS
         * -----------------------------------------------------
         */

        if (
          fetchSubModuleById.fulfilled.match(
            result,
          )
        ) {
          console.log(
            "EDIT SUBMODULE:",
            result.payload,
          )

          setSubModule(
            result.payload,
          )
        }

        /*
         * -----------------------------------------------------
         * FAILURE
         * -----------------------------------------------------
         */

        else {
          console.error(
            "Failed to load sub module:",
            result,
          )

          setSubModule(null)
        }
      } catch (error) {
        console.error(
          "Failed to load edit page:",
          error,
        )

        if (mounted) {
          setSubModule(null)
        }
      } finally {
        /*
         * This setState is inside an async callback,
         * after the external async operation completes.
         *
         * ESLint allows this pattern.
         */

        if (mounted) {
          setPageLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      mounted = false
    }
  }, [
    dispatch,
    id,
  ])

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (
    data: SubModuleFormData,
  ) => {
    console.log(
      "================================",
    )

    console.log(
      "EDIT SUBMODULE SUBMIT",
    )

    console.log(
      "ID:",
      id,
    )

    console.log(
      "FORM DATA:",
      data,
    )

    console.log(
      "ROLES:",
      roles,
    )

    console.log(
      "================================",
    )

    /* -------------------------------------------------------
       ID CHECK
    ------------------------------------------------------- */

    if (!id) {
      console.error(
        "Sub module ID is missing.",
      )

      return
    }

    /* -------------------------------------------------------
       ROLE LOADING CHECK
    ------------------------------------------------------- */

    if (rolesLoading) {
      console.error(
        "Roles are still loading.",
      )

      return
    }

    /* -------------------------------------------------------
       ROLE ERROR CHECK
    ------------------------------------------------------- */

    if (rolesError) {
      console.error(
        "Roles loading error:",
        rolesError,
      )

      return
    }

    /* -------------------------------------------------------
       NO ROLES CHECK
    ------------------------------------------------------- */

    if (roles.length === 0) {
      console.error(
        "No roles available.",
      )

      return
    }

    /* =======================================================
       BUILD PERMISSIONS
    ======================================================= */

    /*
     * IMPORTANT:
     *
     * Never hard-code:
     *
     * role_id: 1
     * role_id: 2
     * role_id: 3
     * role_id: 4
     *
     * Instead use the roles returned from
     * GET /api/v1/roles.
     */

    const permissions =
      roles.map(
        (role) => {
          const existing =
            data.permissions?.find(
              (permission) =>
                Number(
                  permission.role_id,
                ) ===
                Number(
                  role.id,
                ),
            )

          return {
            role_id:
              Number(
                role.id,
              ),

            permission:
              Number(
                existing?.permission ??
                  0,
              ),
          }
        },
      )

    /* =======================================================
       FINAL PAYLOAD
    ======================================================= */

    const payload = {
      id:
        Number(id),

      module_id:
        Number(
          data.module_id,
        ),

      sub_module_code:
        data.sub_module_code.trim(),

      sub_module_name:
        data.sub_module_name.trim(),

      sub_module_status:
        data.sub_module_status,

      display_order:
        Number(
          data.display_order,
        ),

      note:
        data.note?.trim() ??
        "",

      permissions,
    }

    /* =======================================================
       DEBUG PAYLOAD
    ======================================================= */

    console.log(
      "================================",
    )

    console.log(
      "FINAL UPDATE PAYLOAD:",
      payload,
    )

    console.log(
      "PERMISSIONS:",
      permissions,
    )

    console.log(
      "================================",
    )

    /* =======================================================
       UPDATE
    ======================================================= */

    try {
      setSubmitting(true)

      const result =
        await dispatch(
          editSubModule(
            payload,
          ),
        )

      console.log(
        "UPDATE RESULT:",
        result,
      )

      /* -----------------------------------------------------
         SUCCESS
      ----------------------------------------------------- */

      if (
        editSubModule.fulfilled.match(
          result,
        )
      ) {
        console.log(
          "SUB MODULE UPDATED SUCCESSFULLY",
        )

        navigate(
          "/submodule",
        )

        return
      }

      /* -----------------------------------------------------
         FAILURE
      ----------------------------------------------------- */

      console.error(
        "SUB MODULE UPDATE FAILED:",
        result,
      )
    } catch (error) {
      console.error(
        "UPDATE EXCEPTION:",
        error,
      )
    } finally {
      setSubmitting(false)
    }
  }

  /* =========================================================
     INVALID ID
  ========================================================= */

  if (!id) {
    return (
      <div className="rounded-md border p-6 text-center">

        <p className="text-sm text-destructive">
          Invalid sub module ID.
        </p>

        <button
          type="button"
          className="mt-4 underline"
          onClick={() =>
            navigate(
              "/submodule",
            )
          }
        >
          Back to Sub Modules
        </button>

      </div>
    )
  }

  /* =========================================================
     PAGE LOADING
  ========================================================= */

  if (pageLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">

        <p className="text-sm text-muted-foreground">
          Loading sub module...
        </p>

      </div>
    )
  }

  /* =========================================================
     ROLES ERROR
  ========================================================= */

  if (
    !rolesLoading &&
    rolesError
  ) {
    return (
      <div className="rounded-md border p-6 text-center">

        <p className="text-sm text-destructive">
          {rolesError}
        </p>

        <button
          type="button"
          className="mt-4 underline"
          onClick={() =>
            navigate(
              "/submodule",
            )
          }
        >
          Back to Sub Modules
        </button>

      </div>
    )
  }

  /* =========================================================
     NO ROLES
  ========================================================= */

  if (
    !rolesLoading &&
    roles.length === 0
  ) {
    return (
      <div className="rounded-md border p-6 text-center">

        <p className="text-sm text-destructive">
          No roles are available.
        </p>

        <button
          type="button"
          className="mt-4 underline"
          onClick={() =>
            navigate(
              "/submodule",
            )
          }
        >
          Back to Sub Modules
        </button>

      </div>
    )
  }

  /* =========================================================
     SUB MODULE NOT FOUND
  ========================================================= */

  if (!submodule) {
    return (
      <div className="rounded-md border p-6 text-center">

        <p className="text-sm text-destructive">
          Sub Module not found.
        </p>

        <button
          type="button"
          className="mt-4 underline"
          onClick={() =>
            navigate(
              "/submodule",
            )
          }
        >
          Back to Sub Modules
        </button>

      </div>
    )
  }

  /* =========================================================
     FORM
  ========================================================= */

  return (
    <div className="w-full">

      <SubmodulesForm
        initialData={{
          id:
            Number(
              submodule.id,
            ),

          module_id:
            Number(
              submodule.module_id,
            ),

          sub_module_code:
            submodule.sub_module_code ??
            "",

          sub_module_name:
            submodule.sub_module_name ??
            "",

          sub_module_status:
            submodule.sub_module_status ??
            "active",

          display_order:
            Number(
              submodule.display_order ??
                1,
            ),

          note:
            submodule.note ??
            "",

          permissions:
            submodule.permissions ??
            [],
        }}

        loading={
          loading ||
          rolesLoading ||
          submitting
        }

        onSubmit={
          handleSubmit
        }

        onCancel={() =>
          navigate(
            "/submodule",
          )
        }
      />

    </div>
  )
}
