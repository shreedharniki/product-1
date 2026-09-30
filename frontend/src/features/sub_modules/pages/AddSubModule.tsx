
// import { useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { useDispatch, useSelector } from "react-redux"

// import type { AppDispatch } from "@/app/store"

// import SubModulesForm from "../components/SubmoduleForm"
// import { addSubModule } from "../submoduleThunks"
// import { fetchModulesList } from "../../modules/moduleThunks"

// import {
//   selectSubModulesLoading,
// } from "../submoduleSelectors"

// import type {
//   SubModuleFormData,
// } from "../submoduleValidations"

// export default function AddSubModule() {
//   const navigate = useNavigate()
//   const dispatch = useDispatch<AppDispatch>()

//   const loading = useSelector(selectSubModulesLoading)

//   useEffect(() => {
//     dispatch(fetchModulesList())
//   }, [dispatch])

//   const handleSubmit = async (
//     data: SubModuleFormData
//   ) => {
   
//     const result=  await dispatch(
//         addSubModule(data)
//       )

     
//        if (addSubModule.fulfilled.match(result)) {
//              navigate("/submodule")
//           }
  
//   }

//   return (
//     <div className="w-full">
//       <SubModulesForm
//         onSubmit={handleSubmit}
//         loading={loading}
//         onCancel={() => navigate("/submodule")}
//       />
//     </div>
//   )
// }


"use client"

import { useEffect } from "react"

import {
  useDispatch,
  useSelector,
} from "react-redux"

import {
  useNavigate,
} from "react-router-dom"

import type {
  AppDispatch,
} from "@/app/store"

import SubModulesForm from "../components/SubmoduleForm"

import {
  addSubModule,
} from "../submoduleThunks"

import {
  fetchModulesList,
} from "../../modules/moduleThunks"

import {
  fetchRoles,
} from "../../roles/roleThunks"

import {
  selectSubModulesLoading,
} from "../submoduleSelectors"

import {
  selectRoles,
  selectRolesLoading,
  selectRolesError,
} from "../../roles/roleSelectors"

import type {
  SubModuleFormData,
} from "../submoduleValidations"

export default function AddSubModule() {
  const navigate = useNavigate()

  const dispatch =
    useDispatch<AppDispatch>()

  /* ==========================================================================
     SUB MODULE LOADING
  ========================================================================== */

  const loading = useSelector(
    selectSubModulesLoading,
  )

  /* ==========================================================================
     ROLES
  ========================================================================== */

  const roles = useSelector(
    selectRoles,
  )

  const rolesLoading = useSelector(
    selectRolesLoading,
  )

  const rolesError = useSelector(
    selectRolesError,
  )

  /* ==========================================================================
     LOAD DATA
  ========================================================================== */

  useEffect(() => {
    void dispatch(
      fetchModulesList(),
    )

    void dispatch(
      fetchRoles(),
    )
  }, [dispatch])

  /* ==========================================================================
     SUBMIT
  ========================================================================== */

  const handleSubmit = async (
    data: SubModuleFormData,
  ) => {
    /* ------------------------------------------------------------------------
       Roles must finish loading first.
    ------------------------------------------------------------------------ */

    if (rolesLoading) {
      return
    }

    /* ------------------------------------------------------------------------
       Roles API error
    ------------------------------------------------------------------------ */

    if (rolesError) {
      return
    }

    /* ------------------------------------------------------------------------
       Roles must exist
    ------------------------------------------------------------------------ */

    if (roles.length === 0) {
      return
    }

    /* ------------------------------------------------------------------------
       Create exactly one permission record
       for every role returned by the API.
    ------------------------------------------------------------------------ */

    const permissions =
      roles.map((role) => {
        const existing =
          data.permissions.find(
            (permission) =>
              permission.role_id ===
              role.id,
          )

        return {
          role_id: role.id,

          permission:
            existing?.permission ??
            0,
        }
      })

    /* ------------------------------------------------------------------------
       Final API payload
    ------------------------------------------------------------------------ */

    const payload: SubModuleFormData = {
      ...data,
      permissions,
    }

    /* ------------------------------------------------------------------------
       API
    ------------------------------------------------------------------------ */

    const result =
      await dispatch(
        addSubModule(payload),
      )

    /* ------------------------------------------------------------------------
       Success
    ------------------------------------------------------------------------ */

    if (
      addSubModule.fulfilled.match(
        result,
      )
    ) {
      navigate("/submodule")
    }
  }

  /* ==========================================================================
     UI
  ========================================================================== */

  return (
    <div className="w-full">
      <SubModulesForm
        onSubmit={handleSubmit}
        loading={
          loading ||
          rolesLoading
        }
        onCancel={() =>
          navigate("/submodule")
        }
      />
    </div>
  )
}