"use client"

import { useForm } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Textarea } from "@/components/ui/textarea"

import type {
 
   SubModuleFormData,
   SubModulePermission,
} from "../subModuleValidation"

import {
  subModuleSchema,
  
} from "../subModuleValidation"
/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface SubModuleFormProps {
  initialData?: Partial<SubModuleFormData>
  loading?: boolean
  onSubmit: (
    data: SubModuleFormData,
  ) => Promise<void> | void
  onCancel?: () => void
}

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface ModuleOption {
  id: number
  module_name: string
  module_code: string
}

type SubModuleStatus = "active" | "inactive"

type PermissionType =
  | "view"
  | "add"
  | "edit"
  | "delete"

/* -------------------------------------------------------------------------- */
/* Module options                                                             */
/* -------------------------------------------------------------------------- */
/*
 * Replace this temporary data with your Modules API / Redux data.
 */

const MODULE_OPTIONS: ModuleOption[] = [
  {
    id: 33,
    module_name: "Donation Management",
    module_code: "DONATION",
  },
  {
    id: 34,
    module_name: "Seva Management",
    module_code: "SEVA",
  },
  {
    id: 35,
    module_name: "User Management",
    module_code: "USERS",
  },
]

/* -------------------------------------------------------------------------- */
/* Status options                                                             */
/* -------------------------------------------------------------------------- */

const STATUS_OPTIONS: {
  value: SubModuleStatus
  label: string
}[] = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
]

/* -------------------------------------------------------------------------- */
/* Roles                                                                      */
/* -------------------------------------------------------------------------- */

const DEFAULT_ROLES = [
  {
    role_id: 1,
    role_name: "Super Admin",
  },
  {
    role_id: 2,
    role_name: "Administrator",
  },
  {
    role_id: 3,
    role_name: "Temple Admin",
  },
  {
    role_id: 4,
    role_name: "User",
  },
] as const

/* -------------------------------------------------------------------------- */
/* Permission constants                                                       */
/* -------------------------------------------------------------------------- */

const PERMISSION = {
  ADD: 4,
  EDIT: 2,
  DELETE: 1,
} as const

/* -------------------------------------------------------------------------- */
/* Default permissions                                                        */
/* -------------------------------------------------------------------------- */
/*
 * Permission values:
 *
 * null = No access
 * 0    = View only
 * 1    = View + Delete
 * 2    = View + Edit
 * 3    = View + Edit + Delete
 * 4    = View + Add
 * 5    = View + Add + Delete
 * 6    = View + Add + Edit
 * 7    = Full access
 */

const DEFAULT_PERMISSIONS: SubModulePermission[] = [
  {
    role_id: 1,
    permission: 7,
  },
  {
    role_id: 2,
    permission: 7,
  },
  {
    role_id: 3,
    permission: 4,
  },
  {
    role_id: 4,
    permission: 0,
  },
]

/* -------------------------------------------------------------------------- */
/* Permission helpers                                                         */
/* -------------------------------------------------------------------------- */

function getPermission(
  permissions: SubModulePermission[],
  roleId: number,
): number | null {
  const rolePermission = permissions.find(
    (item) => item.role_id === roleId,
  )

  return rolePermission?.permission ?? null
}

/* -------------------------------------------------------------------------- */

function hasPermission(
  permission: number | null,
  type: PermissionType,
): boolean {
  /*
   * null means the role cannot view/access
   * the sub module.
   */
  if (permission === null) {
    return false
  }

  /*
   * Any non-null permission means View.
   */
  if (type === "view") {
    return true
  }

  const bit =
    type === "add"
      ? PERMISSION.ADD
      : type === "edit"
        ? PERMISSION.EDIT
        : PERMISSION.DELETE

  return (permission & bit) !== 0
}

/* -------------------------------------------------------------------------- */

function calculatePermission(
  view: boolean,
  add: boolean,
  edit: boolean,
  deletePermission: boolean,
): number | null {
  /*
   * If View is disabled, everything is disabled.
   */
  if (!view) {
    return null
  }

  let permission = 0

  if (add) {
    permission += PERMISSION.ADD
  }

  if (edit) {
    permission += PERMISSION.EDIT
  }

  if (deletePermission) {
    permission += PERMISSION.DELETE
  }

  return permission
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function SubModuleForm({
  initialData,
  loading = false,
  onSubmit,
  onCancel,
}: SubModuleFormProps) {
  const isEditMode = Boolean(initialData)

  const form = useForm({
    defaultValues: {
      module_id:
        initialData?.module_id ??
        MODULE_OPTIONS[0]?.id ??
        0,

      sub_module_code:
        initialData?.sub_module_code ?? "",

      sub_module_name:
        initialData?.sub_module_name ?? "",

      sub_module_status:
        initialData?.sub_module_status ??
        "active",

      display_order:
        initialData?.display_order ?? 0,

      note:
        initialData?.note ?? "",

      permissions:
        initialData?.permissions ??
        DEFAULT_PERMISSIONS,
    } satisfies SubModuleFormData,

    validators: {
      onSubmit: ({ value }) => {
        const result =
          subModuleSchema.safeParse(value)

        if (result.success) {
          return undefined
        }

        return result.error.issues.map(
          (issue) => issue.message,
        )
      },
    },

    onSubmit: async ({ value }) => {
      const result =
        subModuleSchema.safeParse(value)

      if (!result.success) {
        return
      }

      await onSubmit(result.data)
    },
  })

  return (
    <Card className="w-full">
      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <CardHeader className="border-b">
        <CardTitle className="text-xl">
          {isEditMode
            ? "Edit Sub Module"
            : "Create Sub Module"}
        </CardTitle>

        {/* <p className="text-sm text-muted-foreground">
          Configure the sub module information and
          default role permissions.
        </p> */}
      </CardHeader>

      {/* ================================================================== */}
      {/* CONTENT                                                            */}
      {/* ================================================================== */}

      <CardContent className="pt-6">
        <form
          id="sub-module-form"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()

            void form.handleSubmit()
          }}
          noValidate
        >
          {/* ============================================================ */}
          {/* SUB MODULE INFORMATION                                       */}
          {/* ============================================================ */}

          <div className="space-y-6">
            {/* <div>
              <h2 className="text-base font-semibold">
                Sub Module Information
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Enter the basic information for this
                sub module.
              </p>
            </div> */}

            <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* -------------------------------------------------------- */}
              {/* PARENT MODULE                                            */}
              {/* -------------------------------------------------------- */}

              <form.Field
                name="module_id"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>
                        Parent Module
                        <span className="text-destructive">
                          {" "}
                          *
                        </span>
                      </FieldLabel>

                      <Select
                        value={
                          field.state.value
                            ? String(
                                field.state.value,
                              )
                            : ""
                        }
                        onValueChange={(value) => {
                          field.handleChange(
                            Number(value),
                          )

                          field.handleBlur()
                        }}
                        disabled={loading}
                      >
                        <SelectTrigger
                          aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder="Select parent module" />
                        </SelectTrigger>

                        <SelectContent>
                          {MODULE_OPTIONS.map(
                            (module) => (
                              <SelectItem
                                key={module.id}
                                value={String(
                                  module.id,
                                )}
                              >
                                {module.module_name} (
                                {module.module_code})
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>

                      <FieldDescription>
                        Select the parent module.
                      </FieldDescription>

                      {isInvalid && (
                        <FieldError
                          errors={
                            field.state.meta.errors
                          }
                        />
                      )}
                    </Field>
                  )
                }}
              />

              {/* -------------------------------------------------------- */}
              {/* SUB MODULE CODE                                           */}
              {/* -------------------------------------------------------- */}

              <form.Field
                name="sub_module_code"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                      >
                        Sub Module Code
                        <span className="text-destructive">
                          {" "}
                          *
                        </span>
                      </FieldLabel>

                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(
                            event.target.value,
                          )
                        }
                        aria-invalid={isInvalid}
                        placeholder="e.g. DONATION_REPORT"
                        autoComplete="off"
                        disabled={loading}
                      />

                      <FieldDescription>
                        Enter a unique sub module code.
                      </FieldDescription>

                      {isInvalid && (
                        <FieldError
                          errors={
                            field.state.meta.errors
                          }
                        />
                      )}
                    </Field>
                  )
                }}
              />

              {/* -------------------------------------------------------- */}
              {/* SUB MODULE NAME                                           */}
              {/* -------------------------------------------------------- */}

              <form.Field
                name="sub_module_name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                      >
                        Sub Module Name
                        <span className="text-destructive">
                          {" "}
                          *
                        </span>
                      </FieldLabel>

                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(
                            event.target.value,
                          )
                        }
                        aria-invalid={isInvalid}
                        placeholder="e.g. Donation Reports"
                        autoComplete="off"
                        disabled={loading}
                      />

                      <FieldDescription>
                        Enter the display name.
                      </FieldDescription>

                      {isInvalid && (
                        <FieldError
                          errors={
                            field.state.meta.errors
                          }
                        />
                      )}
                    </Field>
                  )
                }}
              />

              {/* -------------------------------------------------------- */}
              {/* DISPLAY ORDER                                             */}
              {/* -------------------------------------------------------- */}

              <form.Field
                name="display_order"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                      >
                        Display Order
                      </FieldLabel>

                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={0}
                        step={1}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          const value =
                            event.target.value

                          field.handleChange(
                            value === ""
                              ? 0
                              : Number(value),
                          )
                        }}
                        aria-invalid={isInvalid}
                        disabled={loading}
                      />

                      <FieldDescription>
                        Controls the display order.
                      </FieldDescription>

                      {isInvalid && (
                        <FieldError
                          errors={
                            field.state.meta.errors
                          }
                        />
                      )}
                    </Field>
                  )
                }}
              />

              {/* -------------------------------------------------------- */}
              {/* STATUS                                                    */}
              {/* -------------------------------------------------------- */}

              <form.Field
                name="sub_module_status"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>
                        Status
                        <span className="text-destructive">
                          {" "}
                          *
                        </span>
                      </FieldLabel>

                      <Select
                        value={field.state.value}
                        onValueChange={(
                          value,
                        ) => {
                          const status =
                            STATUS_OPTIONS.find(
                              (option) =>
                                option.value ===
                                value,
                            )?.value

                          if (!status) {
                            return
                          }

                          field.handleChange(status)
                          field.handleBlur()
                        }}
                        disabled={loading}
                      >
                        <SelectTrigger
                          aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent>
                          {STATUS_OPTIONS.map(
                            (option) => (
                              <SelectItem
                                key={option.value}
                                value={
                                  option.value
                                }
                              >
                                {option.label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>

                      <FieldDescription>
                        Enable or disable the sub module.
                      </FieldDescription>

                      {isInvalid && (
                        <FieldError
                          errors={
                            field.state.meta.errors
                          }
                        />
                      )}
                    </Field>
                  )
                }}
              />

              {/* -------------------------------------------------------- */}
              {/* NOTE                                                      */}
              {/* -------------------------------------------------------- */}

              <form.Field
                name="note"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                      >
                        Note
                      </FieldLabel>

                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={
                          field.state.value ?? ""
                        }
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(
                            event.target.value,
                          )
                        }
                        aria-invalid={isInvalid}
                        placeholder="Enter description or note"
                        disabled={loading}
                        rows={3}
                      />

                      <FieldDescription>
                        Optional description or note.
                      </FieldDescription>

                      {isInvalid && (
                        <FieldError
                          errors={
                            field.state.meta.errors
                          }
                        />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>
          </div>

          {/* ============================================================ */}
          {/* DEFAULT PERMISSIONS                                          */}
          {/* ============================================================ */}

          <form.Field
            name="permissions"
            children={(field) => {
              const permissions = field.state.value

              return (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Default Permissions
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                      Configure the default permissions
                      for each role.
                    </p>
                  </CardHeader>

                  <CardContent>
                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full min-w-[760px]">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-semibold">
                              Role
                            </th>

                            <th className="px-4 py-3 text-center text-sm font-semibold">
                              View
                            </th>

                            <th className="px-4 py-3 text-center text-sm font-semibold">
                              Add
                            </th>

                            <th className="px-4 py-3 text-center text-sm font-semibold">
                              Edit
                            </th>

                            <th className="px-4 py-3 text-center text-sm font-semibold">
                              Delete
                            </th>

                            <th className="px-4 py-3 text-center text-sm font-semibold">
                              Permission
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {DEFAULT_ROLES.map(
                            (role) => {
                              const permission =
                                getPermission(
                                  permissions,
                                  role.role_id,
                                )

                              const view =
                                hasPermission(
                                  permission,
                                  "view",
                                )

                              const add =
                                hasPermission(
                                  permission,
                                  "add",
                                )

                              const edit =
                                hasPermission(
                                  permission,
                                  "edit",
                                )

                              const deletePermission =
                                hasPermission(
                                  permission,
                                  "delete",
                                )

                              const updatePermission =
                                (
                                  type: PermissionType,
                                ) => {
                                  const nextView =
                                    type === "view"
                                      ? !view
                                      : view

                                  const nextAdd =
                                    type === "add"
                                      ? !add
                                      : add

                                  const nextEdit =
                                    type === "edit"
                                      ? !edit
                                      : edit

                                  const nextDelete =
                                    type === "delete"
                                      ? !deletePermission
                                      : deletePermission

                                  /*
                                   * If View is turned off,
                                   * permission becomes null.
                                   */
                                  const nextPermission =
                                    calculatePermission(
                                      nextView,
                                      nextAdd,
                                      nextEdit,
                                      nextDelete,
                                    )

                                  const nextPermissions =
                                    permissions.some(
                                      (item) =>
                                        item.role_id ===
                                        role.role_id,
                                    )
                                      ? permissions.map(
                                          (item) =>
                                            item.role_id ===
                                            role.role_id
                                              ? {
                                                  ...item,
                                                  permission:
                                                    nextPermission,
                                                }
                                              : item,
                                        )
                                      : [
                                          ...permissions,
                                          {
                                            role_id:
                                              role.role_id,
                                            permission:
                                              nextPermission,
                                          },
                                        ]

                                  field.handleChange(
                                    nextPermissions,
                                  )
                                }

                              return (
                                <tr
                                  key={
                                    role.role_id
                                  }
                                  className="border-b last:border-0 hover:bg-muted/20"
                                >
                                  {/* ROLE */}

                                  <td className="px-4 py-4">
                                    <span className="font-medium">
                                      {
                                        role.role_name
                                      }
                                    </span>
                                  </td>

                                  {/* VIEW */}

                                  <td className="px-4 py-4 text-center">
                                    <PermissionCheckbox
                                      checked={view}
                                      disabled={
                                        loading
                                      }
                                      onChange={() =>
                                        updatePermission(
                                          "view",
                                        )
                                      }
                                      label={`View permission for ${role.role_name}`}
                                    />
                                  </td>

                                  {/* ADD */}

                                  <td className="px-4 py-4 text-center">
                                    <PermissionCheckbox
                                      checked={add}
                                      disabled={
                                        loading ||
                                        !view
                                      }
                                      onChange={() =>
                                        updatePermission(
                                          "add",
                                        )
                                      }
                                      label={`Add permission for ${role.role_name}`}
                                    />
                                  </td>

                                  {/* EDIT */}

                                  <td className="px-4 py-4 text-center">
                                    <PermissionCheckbox
                                      checked={edit}
                                      disabled={
                                        loading ||
                                        !view
                                      }
                                      onChange={() =>
                                        updatePermission(
                                          "edit",
                                        )
                                      }
                                      label={`Edit permission for ${role.role_name}`}
                                    />
                                  </td>

                                  {/* DELETE */}

                                  <td className="px-4 py-4 text-center">
                                    <PermissionCheckbox
                                      checked={
                                        deletePermission
                                      }
                                      disabled={
                                        loading ||
                                        !view
                                      }
                                      onChange={() =>
                                        updatePermission(
                                          "delete",
                                        )
                                      }
                                      label={`Delete permission for ${role.role_name}`}
                                    />
                                  </td>

                                  {/* PERMISSION VALUE */}

                                  <td className="px-4 py-4 text-center">
                                    <span className="inline-flex min-w-10 items-center justify-center rounded-md border bg-muted px-2 py-1 text-sm font-semibold">
                                      {permission ===
                                      null
                                        ? "NULL"
                                        : permission}
                                    </span>
                                  </td>
                                </tr>
                              )
                            },
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* ================================================== */}
                    {/* PERMISSION INFORMATION                            */}
                    {/* ================================================== */}

                    <div className="mt-5 rounded-lg border bg-muted/20 p-4">
                      <p className="text-sm font-semibold">
                        Permission Mapping
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        View is implied for every
                        non-null permission value.
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
                        <PermissionInfo
                          value="NULL"
                          label="No Access"
                        />

                        <PermissionInfo
                          value="0"
                          label="View"
                        />

                        <PermissionInfo
                          value="1"
                          label="View + Delete"
                        />

                        <PermissionInfo
                          value="2"
                          label="View + Edit"
                        />

                        <PermissionInfo
                          value="3"
                          label="View + Edit + Delete"
                        />

                        <PermissionInfo
                          value="4"
                          label="View + Add"
                        />

                        <PermissionInfo
                          value="5"
                          label="View + Add + Delete"
                        />

                        <PermissionInfo
                          value="6"
                          label="View + Add + Edit"
                        />

                        <PermissionInfo
                          value="7"
                          label="Full Access"
                        />
                      </div>
                    </div>

                    {field.state.meta.errors.length >
                      0 && (
                      <div className="mt-4">
                        <FieldError
                          errors={
                            field.state.meta.errors
                          }
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            }}
          />
        </form>
      </CardContent>

      {/* ================================================================== */}
      {/* FOOTER                                                             */}
      {/* ================================================================== */}

      <CardFooter className="flex justify-end gap-3 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onCancel) {
              onCancel()
              return
            }

            form.reset()
          }}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          form="sub-module-form"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : isEditMode
              ? "Update Sub Module"
              : "Create Sub Module"}
        </Button>
      </CardFooter>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Permission Checkbox                                                        */
/* -------------------------------------------------------------------------- */

interface PermissionCheckboxProps {
  checked: boolean
  disabled?: boolean
  onChange: () => void
  label: string
}

function PermissionCheckbox({
  checked,
  disabled = false,
  onChange,
  label,
}: PermissionCheckboxProps) {
  return (
    <div className="flex justify-center">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        aria-label={label}
        className="h-4 w-4 cursor-pointer rounded border-input accent-primary disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Permission Information                                                     */
/* -------------------------------------------------------------------------- */

interface PermissionInfoProps {
  value: string
  label: string
}

function PermissionInfo({
  value,
  label,
}: PermissionInfoProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex min-w-9 items-center justify-center rounded border bg-background px-2 py-1 font-mono font-semibold">
        {value}
      </span>

      <span className="text-muted-foreground">
        {label}
      </span>
    </div>
  )
}