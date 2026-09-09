
import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type PermissionValue = number | null

type PermissionAction =
  | "read"
  | "add"
  | "edit"
  | "delete"

type UserRole =
  | "super_admin"
  | "org_admin"
  | "temple_admin"
  | "user"

interface SubModulePermission {
  id: number
  sub_module_name: string

  super_admin: PermissionValue
  org_admin: PermissionValue
  temple_admin: PermissionValue
  user: PermissionValue
}

interface SubModuleProps {
  moduleId: number | string
}

interface Role {
  key: UserRole
  label: string
}

/**
 * Role configuration
 */
const roles: Role[] = [
  {
    key: "super_admin",
    label: "Super Admin",
  },
  {
    key: "org_admin",
    label: "Org Admin",
  },
  {
    key: "temple_admin",
    label: "Temple Admin",
  },
  {
    key: "user",
    label: "User",
  },
]

/**
 * Permission bit values
 *
 * Read   = always available when permission !== null
 * Add    = 1
 * Edit   = 2
 * Delete = 4
 *
 * Examples:
 *
 * NULL = No access
 * 0    = Read
 * 1    = Read + Delete
 * 2    = Read + Edit
 * 3    = Read + Edit + Delete
 * 4    = Read + Add
 * 5    = Read + Add + Delete
 * 6    = Read + Add + Edit
 * 7    = Read + Add + Edit + Delete
 */

/**
 * Check whether a permission contains an action.
 */
function hasPermission(
  permission: PermissionValue,
  action: PermissionAction,
): boolean {
  if (permission === null) {
    return false
  }

  if (action === "read") {
    return true
  }

  if (action === "add") {
    return (permission & 1) === 1
  }

  if (action === "edit") {
    return (permission & 2) === 2
  }

  if (action === "delete") {
    return (permission & 4) === 4
  }

  return false
}

/**
 * Convert individual permissions back to
 * NULL / 0 / 1 / 2 / 3 / 4 / 5 / 6 / 7
 */
function calculatePermission(
  read: boolean,
  add: boolean,
  edit: boolean,
  deletePermission: boolean,
): PermissionValue {
  /**
   * If Read is disabled, there is no access.
   */
  if (!read) {
    return null
  }

  let permission = 0

  if (add) {
    permission += 1
  }

  if (edit) {
    permission += 2
  }

  if (deletePermission) {
    permission += 4
  }

  return permission
}

/**
 * Permission checkbox
 */
interface PermissionCheckboxProps {
  checked: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
}

function PermissionCheckbox({
  checked,
  disabled = false,
  onChange,
}: PermissionCheckboxProps) {
  return (
    <div className="flex justify-center">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) =>
          onChange?.(event.target.checked)
        }
        className="h-4 w-4 cursor-pointer rounded"
      />
    </div>
  )
}

export default function SubModule({
  moduleId,
}: SubModuleProps) {
  const [subModules, setSubModules] = useState<
    SubModulePermission[]
  >([])

  /**
   * Load submodules
   *
   * Replace this temporary data with your API call.
   */
  useEffect(() => {
    if (!moduleId) {
      return
    }

    setSubModules([
      {
        id: 1,
        sub_module_name: "Donation List",

        super_admin: 7,
        org_admin: 7,
        temple_admin: 7,
        user: 0,
      },

    
    ])
  }, [moduleId])

  /**
   * Update one permission.
   */
  const updatePermission = (
    subModuleId: number,
    role: UserRole,
    action: PermissionAction,
    checked: boolean,
  ) => {
    setSubModules((currentSubModules) =>
      currentSubModules.map((subModule) => {
        if (subModule.id !== subModuleId) {
          return subModule
        }

        const currentPermission =
          subModule[role]

        const currentRead = hasPermission(
          currentPermission,
          "read",
        )

        const currentAdd = hasPermission(
          currentPermission,
          "add",
        )

        const currentEdit = hasPermission(
          currentPermission,
          "edit",
        )

        const currentDelete = hasPermission(
          currentPermission,
          "delete",
        )

        let read = currentRead
        let add = currentAdd
        let edit = currentEdit
        let deletePermission = currentDelete

        if (action === "read") {
          read = checked

          /**
           * If Read is disabled,
           * all other permissions are disabled.
           */
          if (!checked) {
            add = false
            edit = false
            deletePermission = false
          }
        }

        if (action === "add") {
          add = checked

          /**
           * Add requires Read.
           */
          if (checked) {
            read = true
          }
        }

        if (action === "edit") {
          edit = checked

          /**
           * Edit requires Read.
           */
          if (checked) {
            read = true
          }
        }

        if (action === "delete") {
          deletePermission = checked

          /**
           * Delete requires Read.
           */
          if (checked) {
            read = true
          }
        }

        const newPermission =
          calculatePermission(
            read,
            add,
            edit,
            deletePermission,
          )

        return {
          ...subModule,
          [role]: newPermission,
        }
      }),
    )
  }

  /**
   * Save permissions.
   *
   * Replace this with your API request.
   */
  const handleSave = () => {
    console.log(
      "Permissions to save:",
      subModules,
    )

    /*
      Example API payload:

      [
        {
          sub_module_id: 1,
          super_admin: 7,
          org_admin: 7,
          temple_admin: 7,
          user: 0
        }
      ]
    */
  }

  return (
    <Card className="mt-6 w-full">
      <CardHeader>
        <CardTitle>
          Sub Modules & Permissions
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {/* Role header */}
              <tr className="border-b">
                <th
                  rowSpan={2}
                  className="min-w-[220px] px-4 py-3 text-left font-medium"
                >
                  Sub Module
                </th>

                {roles.map((role) => (
                  <th
                    key={role.key}
                    colSpan={4}
                    className="border-l px-4 py-3 text-center font-medium"
                  >
                    {role.label}
                  </th>
                ))}
              </tr>

              {/* Permission header */}
              <tr className="border-b">
                {roles.map((role) => (
                  <th
                    key={role.key}
                    colSpan={4}
                    className="border-l px-2 py-2"
                  >
                    <div className="grid grid-cols-4 gap-2 text-xs font-medium">
                      <span>Read</span>
                      <span>Add</span>
                      <span>Edit</span>
                      <span>Delete</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {subModules.map((subModule) => (
                <tr
                  key={subModule.id}
                  className="border-b last:border-0"
                >
                  {/* Sub Module */}
                  <td className="px-4 py-4 font-medium">
                    {subModule.sub_module_name}
                  </td>

                  {/* Roles */}
                  {roles.map((role) => {
                    const permission =
                      subModule[role.key]

                    return (
                      <td
                        key={role.key}
                        colSpan={4}
                        className="border-l px-2 py-4"
                      >
                        <div className="grid grid-cols-4 gap-2">
                          {/* Read */}
                          <PermissionCheckbox
                            checked={hasPermission(
                              permission,
                              "read",
                            )}
                            onChange={(checked) =>
                              updatePermission(
                                subModule.id,
                                role.key,
                                "read",
                                checked,
                              )
                            }
                          />

                          {/* Add */}
                          <PermissionCheckbox
                            checked={hasPermission(
                              permission,
                              "add",
                            )}
                            disabled={
                              permission === null
                            }
                            onChange={(checked) =>
                              updatePermission(
                                subModule.id,
                                role.key,
                                "add",
                                checked,
                              )
                            }
                          />

                          {/* Edit */}
                          <PermissionCheckbox
                            checked={hasPermission(
                              permission,
                              "edit",
                            )}
                            disabled={
                              permission === null
                            }
                            onChange={(checked) =>
                              updatePermission(
                                subModule.id,
                                role.key,
                                "edit",
                                checked,
                              )
                            }
                          />

                          {/* Delete */}
                          <PermissionCheckbox
                            checked={hasPermission(
                              permission,
                              "delete",
                            )}
                            disabled={
                              permission === null
                            }
                            onChange={(checked) =>
                              updatePermission(
                                subModule.id,
                                role.key,
                                "delete",
                                checked,
                              )
                            }
                          />
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Permission values */}
        <div className="mt-6 rounded-md border bg-muted/30 p-4">
          <h3 className="mb-3 font-medium">
            Permission Values
          </h3>

          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <div>
              <span className="font-medium">
                NULL
              </span>{" "}
              = No Access
            </div>

            <div>
              <span className="font-medium">
                0
              </span>{" "}
              = Read
            </div>

            <div>
              <span className="font-medium">
                1
              </span>{" "}
              = Read + Delete
            </div>

            <div>
              <span className="font-medium">
                2
              </span>{" "}
              = Read + Edit
            </div>

            <div>
              <span className="font-medium">
                3
              </span>{" "}
              = Read + Edit + Delete
            </div>

            <div>
              <span className="font-medium">
                4
              </span>{" "}
              = Read + Add
            </div>

            <div>
              <span className="font-medium">
                5
              </span>{" "}
              = Read + Add + Delete
            </div>

            <div>
              <span className="font-medium">
                6
              </span>{" "}
              = Read + Add + Edit
            </div>

            <div>
              <span className="font-medium">
                7
              </span>{" "}
              = Read + Add + Edit + Delete
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Save Permissions
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

