


// "use client"

// import {
//   useEffect,
// } from "react"

// import {
//   useDispatch,
//   useSelector,
// } from "react-redux"

// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom"

// import type {
//   AppDispatch,
// } from "@/app/store"

// import RoleForm from "../components/RoleForm"

// import type {
//   RoleFormData,
// } from "../components/RoleForm"

// import {
//   fetchRoleById,
//   updateRole,
// } from "../roleThunks"

// import {
//   selectSelectedRole,
//   selectRolesLoading,
//   selectRolesSaving,
// } from "../roleSelectors"

// import {
//   fetchSubModules,
// } from "../../sub_modules/submoduleThunks"

// import {
//   selectSubModules,
//   selectSubModulesLoading,
// } from "../../sub_modules/submoduleSelectors"


// export default function EditRole() {

//   const {
//     id,
//   } = useParams<{
//     id: string
//   }>()

//   const dispatch =
//     useDispatch<AppDispatch>()

//   const navigate =
//     useNavigate()


//   /* =========================================================
//      ROLE
//   ========================================================= */

//   const role =
//     useSelector(
//       selectSelectedRole,
//     )

//   const roleLoading =
//     useSelector(
//       selectRolesLoading,
//     )

//   const saving =
//     useSelector(
//       selectRolesSaving,
//     )


//   /* =========================================================
//      SUBMODULES
//   ========================================================= */

//   const subModules =
//     useSelector(
//       selectSubModules,
//     )

//   const subModulesLoading =
//     useSelector(
//       selectSubModulesLoading,
//     )


//   /* =========================================================
//      FETCH ROLE + SUBMODULES
//   ========================================================= */

//   useEffect(() => {

//     if (!id) {
//       return
//     }

//     void dispatch(
//       fetchRoleById(
//         Number(id),
//       ),
//     )

//     void dispatch(
//       fetchSubModules({}),
//     )

//   }, [
//     dispatch,
//     id,
//   ])


//   /* =========================================================
//      LOADING
//   ========================================================= */

//   if (
//     roleLoading ||
//     subModulesLoading
//   ) {

//     return (
//       <div
//         className="
//           py-10
//           text-center
//           text-sm
//           text-muted-foreground
//         "
//       >
//         Loading role...
//       </div>
//     )

//   }


//   /* =========================================================
//      ROLE NOT FOUND
//   ========================================================= */

//   if (!role) {

//     return (
//       <div
//         className="
//           py-10
//           text-center
//           text-sm
//           text-muted-foreground
//         "
//       >
//         Role not found.
//       </div>
//     )

//   }


//   /* =========================================================
//      FORM DATA
//   ========================================================= */

//   const initialData: RoleFormData & {
//     id: number
//   } = {

//     id:
//       role.id,

//     /*
//      * User Role Name
//      *
//      * Example:
//      * Temple Manager
//      */
//     role_name:
//       role.user_role_name ?? "",

//     /*
//      * User Role
//      *
//      * Example:
//      * temple_manager
//      */
//     user_role:
//       role.user_role ?? "",

//     /*
//      * Selected submodules
//      */
//     submodule_ids:
//       role.permissions?.map(
//         (permission) =>
//           permission.sub_module_id,
//       ) ?? [],

//     /*
//      * Existing permissions
//      */
//     permissions:
//       role.permissions?.map(
//         (permission) => ({
//           sub_module_id:
//             permission.sub_module_id,

//           permission:
//             permission.permission,
//         }),
//       ) ?? [],

//   }


//   /* =========================================================
//      UPDATE ROLE
//   ========================================================= */

//   const handleSubmit = async (
//     data: RoleFormData,
//   ) => {

//     if (!id) {
//       return
//     }

//     try {

//       const payload = {

//         id:
//           Number(id),

//         user_role_name:
//           data.role_name.trim(),

//         user_role:
//           data.user_role.trim(),

//         permissions:
//           data.permissions.map(
//             (permission) => ({

//               sub_module_id:
//                 permission.sub_module_id,

//               permission:
//                 permission.permission,

//             }),
//           ),

//       }


//       console.log(
//         "ROLE UPDATE PAYLOAD:",
//         payload,
//       )


//       await dispatch(
//         updateRole(payload),
//       ).unwrap()


//       navigate(
//         "/roles",
//       )

//     } catch (error) {

//       console.error(
//         "Update role failed:",
//         error,
//       )

//     }

//   }


//   /* =========================================================
//      CANCEL
//   ========================================================= */

//   const handleCancel = () => {

//     navigate(
//       "/roles",
//     )

//   }


//   /* =========================================================
//      PAGE
//   ========================================================= */

//   return (

//     <div className="w-full">

//       <RoleForm

//         initialData={
//           initialData
//         }

//         subModules={
//           subModules
//         }

//         onSubmit={
//           handleSubmit
//         }

//         onCancel={
//           handleCancel
//         }

//         loading={
//           saving
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
  useDispatch,
  useSelector,
} from "react-redux"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import type {
  AppDispatch,
} from "@/app/store"

import {
  fetchRoleById,
  updateRole,
} from "../roleThunks"

import {
  selectSelectedRole,
  selectRolesLoading,
  selectRolesSaving,
} from "../roleSelectors"

import {
  Button,
} from "@/components/ui/button"

import {
  Input,
} from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldLabel,
} from "@/components/ui/field"


export default function EditRole() {

  const {
    id,
  } = useParams<{
    id: string
  }>()

  const dispatch =
    useDispatch<AppDispatch>()

  const navigate =
    useNavigate()

  const role =
    useSelector(
      selectSelectedRole,
    )

  const loading =
    useSelector(
      selectRolesLoading,
    )

  const saving =
    useSelector(
      selectRolesSaving,
    )

  const [
    roleName,
    setRoleName,
  ] = useState("")

  const [
    userRole,
    setUserRole,
  ] = useState("")


  /* =========================================================
     FETCH ROLE
  ========================================================= */

  useEffect(() => {

    if (!id) {
      return
    }

    void dispatch(
      fetchRoleById(
        Number(id),
      ),
    )

  }, [
    dispatch,
    id,
  ])


  /* =========================================================
     SET FORM VALUES
  ========================================================= */

  useEffect(() => {

    if (!role) {
      return
    }

    setRoleName(
      role.user_role_name ?? "",
    )

    setUserRole(
      role.user_role ?? "",
    )

  }, [
    role,
  ])


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading role...
      </div>
    )

  }


  /* =========================================================
     ROLE NOT FOUND
  ========================================================= */

  if (!role) {

    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Role not found.
      </div>
    )

  }


  /* =========================================================
     UPDATE ROLE
     
     ONLY:
     - user_role_name
     - user_role

     NO:
     - permissions
     - submodules
  ========================================================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {

    event.preventDefault()

    if (!id) {
      return
    }

    const trimmedRoleName =
      roleName.trim()

    const trimmedUserRole =
      userRole.trim()

    if (
      !trimmedRoleName ||
      !trimmedUserRole
    ) {
      return
    }

    try {

      await dispatch(
        updateRole({
          id: Number(id),

          data: {
            user_role_name:
              trimmedRoleName,

            user_role:
              trimmedUserRole,
          },
        }),
      ).unwrap()

      navigate("/roles")

    } catch (error) {

      console.error(
        "Update role failed:",
        error,
      )

    }

  }


  /* =========================================================
     CANCEL
  ========================================================= */

  const handleCancel = () => {

    navigate("/roles")

  }


  /* =========================================================
     PAGE
  ========================================================= */

  return (

    <div className="w-full">

      <Card>

        <CardHeader>

          <CardTitle>
            Edit Role
          </CardTitle>

        </CardHeader>


        <CardContent>
      <div className="w-full">
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =================================================
                USER ROLE NAME
            ================================================= */}

            <Field>

              <FieldLabel htmlFor="role_name">
                User Role Name
              </FieldLabel>

              <Input
                id="role_name"
                name="role_name"
                value={roleName}
                onChange={(event) =>
                  setRoleName(
                    event.target.value,
                  )
                }
                placeholder="Enter user role name"
                disabled={saving}
              />

            </Field>


            {/* =================================================
                USER ROLE
            ================================================= */}

            <Field>

              <FieldLabel htmlFor="user_role">
                User Role
              </FieldLabel>

              <Input
              readOnly
                id="user_role"
                name="user_role"
                value={userRole}
                onChange={(event) =>
                  setUserRole(
                    event.target.value,
                  )
                }
                placeholder="Enter user role"
                disabled={saving}
              />

            </Field>


            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="flex justify-end gap-3">

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>


              <Button
                type="submit"
                disabled={
                  saving ||
                  !roleName.trim() ||
                  !userRole.trim()
                }
              >
                {saving
                  ? "Updating..."
                  : "Update Role"}
              </Button>

            </div>

          </form>
</div>
         

        </CardContent>

      </Card>

    </div>

  )
}
