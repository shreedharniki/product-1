

// "use client"

// import { useForm } from "@tanstack/react-form"
// import { useSelector } from "react-redux"

// import type { RootState } from "@/app/store"

// import { Button } from "@/components/ui/button"

// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// import {
//   Field,
//   FieldDescription,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field"

// import { Input } from "@/components/ui/input"

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// import { Textarea } from "@/components/ui/textarea"

// import type {
//   SubModuleFormData,
// } from "../submoduleValidations"

// import {
//   subModuleSchema,
// } from "../submoduleValidations"

// import type {
//   SubModulePermission,
// } from "../submoduleTypes"

// /* -------------------------------------------------------------------------- */
// /* Props                                                                      */
// /* -------------------------------------------------------------------------- */

// interface SubmoduleFormProps {
//   initialData?: Partial<SubModuleFormData> & {
//     id?: number
//   }

//   loading?: boolean

//   onSubmit: (
//     data: SubModuleFormData
//   ) => Promise<void> | void

//   onCancel?: () => void
// }

// /* -------------------------------------------------------------------------- */
// /* Types                                                                      */
// /* -------------------------------------------------------------------------- */

// type PermissionType =
//   | "view"
//   | "add"
//   | "edit"
//   | "delete"

// /* -------------------------------------------------------------------------- */
// /* Roles                                                                      */
// /* -------------------------------------------------------------------------- */

// const ROLES = [
//   {
//     role_id: 1,
//     role_name: "Super Admin",
//   },
//   {
//     role_id: 2,
//     role_name: "Organization Admin",
//   },
//   {
//     role_id: 3,
//     role_name: "Temple Admin",
//   },
//   {
//     role_id: 4,
//     role_name: "User",
//   },
// ] as const

// /* -------------------------------------------------------------------------- */
// /* Status                                                                     */
// /* -------------------------------------------------------------------------- */

// const STATUS_OPTIONS = [
//   {
//     value: "active",
//     label: "Active",
//   },
//   {
//     value: "inactive",
//     label: "Inactive",
//   },
// ] as const

// /* -------------------------------------------------------------------------- */
// /* Permission bits                                                            */
// /* -------------------------------------------------------------------------- */

// const PERMISSION = {
//   ADD: 4,
//   EDIT: 2,
//   DELETE: 1,
// } as const

// /* -------------------------------------------------------------------------- */
// /* Default permissions                                                        */
// /* -------------------------------------------------------------------------- */

// const DEFAULT_PERMISSIONS: SubModulePermission[] = [
//   {
//     role_id: 1,
//     permission: 0,
//   },
//   {
//     role_id: 2,
//     permission: 0,
//   },
//   {
//     role_id: 3,
//     permission: 0,
//   },
//   {
//     role_id: 4,
//     permission: 0,
//   },
// ]

// /* -------------------------------------------------------------------------- */
// /* Permission helpers                                                         */
// /* -------------------------------------------------------------------------- */

// function getPermission(
//   permissions: SubModulePermission[],
//   roleId: number,
// ): number {
//   return (
//     permissions.find(
//       (item) => item.role_id === roleId,
//     )?.permission ?? 0
//   )
// }

// function hasPermission(
//   permission: number,
//   type: PermissionType,
// ): boolean {
//   if (type === "view") {
//     return true
//   }

//   const bit =
//     type === "add"
//       ? PERMISSION.ADD
//       : type === "edit"
//         ? PERMISSION.EDIT
//         : PERMISSION.DELETE

//   return (permission & bit) === bit
// }

// function calculatePermission(
//   currentPermission: number,
//   type: PermissionType,
// ): number {
//   if (type === "view") {
//     return currentPermission
//   }

//   const bit =
//     type === "add"
//       ? PERMISSION.ADD
//       : type === "edit"
//         ? PERMISSION.EDIT
//         : PERMISSION.DELETE

//   const enabled =
//     (currentPermission & bit) === bit

//   if (enabled) {
//     return currentPermission & ~bit
//   }

//   return currentPermission | bit
// }

// /* -------------------------------------------------------------------------- */
// /* Component                                                                  */
// /* -------------------------------------------------------------------------- */

// export default function SubmoduleForm({
//   initialData,
//   loading = false,
//   onSubmit,
//   onCancel,
// }: SubmoduleFormProps) {
//   const isEditMode = Boolean(initialData?.id)

//   /* ------------------------------------------------------------------------ */
//   /* Get modules from Redux                                                   */
//   /* ------------------------------------------------------------------------ */

//   const modules = useSelector(
//     (state: RootState) => state.modules.modules,
//   )

//   /* ------------------------------------------------------------------------ */
//   /* Default permissions                                                      */
//   /* ------------------------------------------------------------------------ */

//   const defaultPermissions: SubModulePermission[] =
//     ROLES.map((role) => {
//       const existing =
//         initialData?.permissions?.find(
//           (item) =>
//             item.role_id === role.role_id,
//         )

//       return {
//         role_id: role.role_id,
//         permission: Number(
//           existing?.permission ??
//             DEFAULT_PERMISSIONS.find(
//               (item) =>
//                 item.role_id === role.role_id,
//             )?.permission ??
//             0,
//         ),
//       }
//     })

//   /* ------------------------------------------------------------------------ */
//   /* Form                                                                     */
//   /* ------------------------------------------------------------------------ */

// //   const form = useForm({
// //     defaultValues: {
// //       module_id:
// //         initialData?.module_id ?? 0,

// //       sub_module_code:
// //         initialData?.sub_module_code ?? "",

// //       sub_module_name:
// //         initialData?.sub_module_name ?? "",

// //       sub_module_status:
// //         initialData?.sub_module_status ??
// //         "active",

// //       display_order:
// //         initialData?.display_order ?? 1,

// //       note:
// //         initialData?.note ?? "",

// //       permissions:
// //         defaultPermissions,
// //     } satisfies SubModuleFormData,

// //     // validators: {
// //     //   onSubmit: ({ value }) => {
// //     //     const result =
// //     //       subModuleSchema.safeParse(value)

// //     //     if (result.success) {
// //     //       return undefined
// //     //     }

// //     //     return result.error.issues.map(
// //     //       (issue) => issue.message,
// //     //     )
// //     //   },
// //     // },
// //         validators: {
// //         onSubmit: subModuleSchema,
// //         },

// //     onSubmit: async ({ value }) => {
// //       const result =
// //         subModuleSchema.safeParse(value)

// //       if (!result.success) {
// //         return
// //       }

// //       await onSubmit(result.data)
// //     },
// //   })

// const form = useForm({
//   defaultValues: {
//     module_id:
//       initialData?.module_id ?? 0,

//     sub_module_code:
//       initialData?.sub_module_code ?? "",

//     sub_module_name:
//       initialData?.sub_module_name ?? "",

//     sub_module_status:
//       initialData?.sub_module_status ??
//       "active",

//     display_order:
//       initialData?.display_order ?? 1,

//     note:
//       initialData?.note ?? "",

//     permissions:
//       defaultPermissions,
//   } satisfies SubModuleFormData,

//   validators: {
//     onSubmit: subModuleSchema,
//   },

//   onSubmit: async ({ value }) => {
//     await onSubmit(value)
//   },
// })
//   return (
//     <Card className="w-full">
//       {/* ------------------------------------------------------------------ */}
//       {/* Header                                                             */}
//       {/* ------------------------------------------------------------------ */}

//       <CardHeader className="border-b">
//         <CardTitle className="text-xl">
//           {isEditMode
//             ? "Edit Sub Module"
//             : "Create Sub Module"}
//         </CardTitle>
//       </CardHeader>

//       {/* ------------------------------------------------------------------ */}
//       {/* Content                                                            */}
//       {/* ------------------------------------------------------------------ */}

//       <CardContent className="pt-6">
//         <form
//           id="sub-module-form"
//           onSubmit={(event) => {
//             event.preventDefault()
//             event.stopPropagation()

//             void form.handleSubmit()
//           }}
//           noValidate
//         >
//           {/* ============================================================ */}
//           {/* BASIC INFORMATION                                             */}
//           {/* ============================================================ */}

//           <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

//             {/* ========================================================== */}
//             {/* PARENT MODULE                                              */}
//             {/* ========================================================== */}

//             <form.Field
//               name="module_id"
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched &&
//                   !field.state.meta.isValid

//                 return (
//                   <Field
//                     data-invalid={isInvalid}
//                   >
//                     <FieldLabel>
//                       Parent Module
//                       <span className="text-destructive">
//                         {" "}
//                         *
//                       </span>
//                     </FieldLabel>

//                     <Select
//                       value={
//                         field.state.value > 0
//                           ? String(
//                               field.state.value,
//                             )
//                           : ""
//                       }
//                       onValueChange={(value) => {
//                         field.handleChange(
//                           Number(value),
//                         )

//                         field.handleBlur()
//                       }}
//                       disabled={loading}
//                     >
//                       <SelectTrigger
//                         aria-invalid={isInvalid}
//                       >
//                         <SelectValue placeholder="Select parent module" />
//                       </SelectTrigger>

//                       <SelectContent>
//                         {modules.length === 0 ? (
//                           <SelectItem
//                             value="no-modules"
//                             disabled
//                           >
//                             No modules available
//                           </SelectItem>
//                         ) : (
//                           modules.map(
//                             (module) => (
//                               <SelectItem
//                                 key={module.id}
//                                 value={String(
//                                   module.id,
//                                 )}
//                               >
//                                 {module.module_name}
//                                 {module.module_code
//                                   ? ` (${module.module_code})`
//                                   : ""}
//                               </SelectItem>
//                             ),
//                           )
//                         )}
//                       </SelectContent>
//                     </Select>

//                     <FieldDescription>
//                       Select the parent module.
//                     </FieldDescription>

//                     {isInvalid && (
//                       <FieldError
//                         errors={
//                           field.state.meta.errors
//                         }
//                       />
//                     )}
//                   </Field>
//                 )
//               }}
//             />

//             {/* ========================================================== */}
//             {/* SUB MODULE CODE                                             */}
//             {/* ========================================================== */}

//             <form.Field
//               name="sub_module_code"
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched &&
//                   !field.state.meta.isValid

//                 return (
//                   <Field
//                     data-invalid={isInvalid}
//                   >
//                     <FieldLabel
//                       htmlFor={field.name}
//                     >
//                       Sub Module Code
//                       <span className="text-destructive">
//                         {" "}
//                         *
//                       </span>
//                     </FieldLabel>

//                     <Input
//                       id={field.name}
//                       name={field.name}
//                       value={field.state.value}
//                       onBlur={field.handleBlur}
//                       onChange={(event) =>
//                         field.handleChange(
//                           event.target.value,
//                         )
//                       }
//                       aria-invalid={isInvalid}
//                       placeholder="e.g. SUB_7"
//                       autoComplete="off"
//                       disabled={loading}
//                     />

//                     <FieldDescription>
//                       Unique code for the sub module.
//                     </FieldDescription>

//                     {isInvalid && (
//                       <FieldError
//                         errors={
//                           field.state.meta.errors
//                         }
//                       />
//                     )}
//                   </Field>
//                 )
//               }}
//             />

//             {/* ========================================================== */}
//             {/* SUB MODULE NAME                                             */}
//             {/* ========================================================== */}

//             <form.Field
//               name="sub_module_name"
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched &&
//                   !field.state.meta.isValid

//                 return (
//                   <Field
//                     data-invalid={isInvalid}
//                   >
//                     <FieldLabel
//                       htmlFor={field.name}
//                     >
//                       Sub Module Name
//                       <span className="text-destructive">
//                         {" "}
//                         *
//                       </span>
//                     </FieldLabel>

//                     <Input
//                       id={field.name}
//                       name={field.name}
//                       value={field.state.value}
//                       onBlur={field.handleBlur}
//                       onChange={(event) =>
//                         field.handleChange(
//                           event.target.value,
//                         )
//                       }
//                       aria-invalid={isInvalid}
//                       placeholder="e.g. Donation Reports"
//                       autoComplete="off"
//                       disabled={loading}
//                     />

//                     <FieldDescription>
//                       Display name of the sub module.
//                     </FieldDescription>

//                     {isInvalid && (
//                       <FieldError
//                         errors={
//                           field.state.meta.errors
//                         }
//                       />
//                     )}
//                   </Field>
//                 )
//               }}
//             />

//             {/* ========================================================== */}
//             {/* DISPLAY ORDER                                               */}
//             {/* ========================================================== */}

//             <form.Field
//               name="display_order"
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched &&
//                   !field.state.meta.isValid

//                 return (
//                   <Field
//                     data-invalid={isInvalid}
//                   >
//                     <FieldLabel
//                       htmlFor={field.name}
//                     >
//                       Display Order
//                     </FieldLabel>

//                     <Input
//                       id={field.name}
//                       name={field.name}
//                       type="number"
//                       min={1}
//                       step={1}
//                       value={field.state.value}
//                       onBlur={field.handleBlur}
//                       onChange={(event) => {
//                         const value =
//                           event.target.value

//                         field.handleChange(
//                           value === ""
//                             ? 0
//                             : Number(value),
//                         )
//                       }}
//                       aria-invalid={isInvalid}
//                       disabled={loading}
//                     />

//                     <FieldDescription>
//                       Controls the display order.
//                     </FieldDescription>

//                     {isInvalid && (
//                       <FieldError
//                         errors={
//                           field.state.meta.errors
//                         }
//                       />
//                     )}
//                   </Field>
//                 )
//               }}
//             />

//             {/* ========================================================== */}
//             {/* STATUS                                                      */}
//             {/* ========================================================== */}

//             <form.Field
//               name="sub_module_status"
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched &&
//                   !field.state.meta.isValid

//                 return (
//                   <Field
//                     data-invalid={isInvalid}
//                   >
//                     <FieldLabel>
//                       Status
//                       <span className="text-destructive">
//                         {" "}
//                         *
//                       </span>
//                     </FieldLabel>

//                     <Select
//                       value={field.state.value}
//                       onValueChange={(value) => {
//                         if (
//                           value !== "active" &&
//                           value !== "inactive"
//                         ) {
//                           return
//                         }

//                         field.handleChange(
//                           value,
//                         )

//                         field.handleBlur()
//                       }}
//                       disabled={loading}
//                     >
//                       <SelectTrigger
//                         aria-invalid={isInvalid}
//                       >
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>

//                       <SelectContent>
//                         {STATUS_OPTIONS.map(
//                           (option) => (
//                             <SelectItem
//                               key={option.value}
//                               value={
//                                 option.value
//                               }
//                             >
//                               {option.label}
//                             </SelectItem>
//                           ),
//                         )}
//                       </SelectContent>
//                     </Select>

//                     <FieldDescription>
//                       Enable or disable the sub module.
//                     </FieldDescription>

//                     {isInvalid && (
//                       <FieldError
//                         errors={
//                           field.state.meta.errors
//                         }
//                       />
//                     )}
//                   </Field>
//                 )
//               }}
//             />

//             {/* ========================================================== */}
//             {/* NOTE                                                        */}
//             {/* ========================================================== */}

//             <form.Field
//               name="note"
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched &&
//                   !field.state.meta.isValid

//                 return (
//                   <Field
//                     data-invalid={isInvalid}
//                   >
//                     <FieldLabel
//                       htmlFor={field.name}
//                     >
//                       Note
//                     </FieldLabel>

//                     <Textarea
//                       id={field.name}
//                       name={field.name}
//                       value={field.state.value}
//                       onBlur={field.handleBlur}
//                       onChange={(event) =>
//                         field.handleChange(
//                           event.target.value,
//                         )
//                       }
//                       aria-invalid={isInvalid}
//                       placeholder="Enter description or note"
//                       disabled={loading}
//                       rows={3}
//                     />

//                     <FieldDescription>
//                       Optional description or note.
//                     </FieldDescription>

//                     {isInvalid && (
//                       <FieldError
//                         errors={
//                           field.state.meta.errors
//                         }
//                       />
//                     )}
//                   </Field>
//                 )
//               }}
//             />
//           </FieldGroup>

//           {/* ============================================================ */}
//           {/* PERMISSIONS                                                   */}
//           {/* ============================================================ */}

//           <form.Field
//             name="permissions"
//             children={(field) => {
//               const permissions =
//                 field.state.value

//               return (
//                 <Card className="mt-8">
//                   <CardHeader>
//                     <CardTitle className="text-lg">
//                       Permissions
//                     </CardTitle>

//                     <p className="text-sm text-muted-foreground">
//                       Configure permissions for each role.
//                     </p>
//                   </CardHeader>

//                   <CardContent>
//                     <div className="overflow-x-auto rounded-lg border">
//                       <table className="w-full min-w-[760px]">
//                         <thead>
//                           <tr className="border-b bg-muted/50">
//                             <th className="px-4 py-3 text-left text-sm font-semibold">
//                               Role
//                             </th>

//                             <th className="px-4 py-3 text-center text-sm font-semibold">
//                               View
//                             </th>

//                             <th className="px-4 py-3 text-center text-sm font-semibold">
//                               Add
//                             </th>

//                             <th className="px-4 py-3 text-center text-sm font-semibold">
//                               Edit
//                             </th>

//                             <th className="px-4 py-3 text-center text-sm font-semibold">
//                               Delete
//                             </th>
//                           </tr>
//                         </thead>

//                         <tbody>
//                           {ROLES.map(
//                             (role) => {
//                               const permission =
//                                 getPermission(
//                                   permissions,
//                                   role.role_id,
//                                 )

//                               const add =
//                                 hasPermission(
//                                   permission,
//                                   "add",
//                                 )

//                               const edit =
//                                 hasPermission(
//                                   permission,
//                                   "edit",
//                                 )

//                               const deletePermission =
//                                 hasPermission(
//                                   permission,
//                                   "delete",
//                                 )

//                               const updatePermission =
//                                 (
//                                   type: PermissionType,
//                                 ) => {
//                                   if (
//                                     type ===
//                                     "view"
//                                   ) {
//                                     return
//                                   }

//                                   const nextPermission =
//                                     calculatePermission(
//                                       permission,
//                                       type,
//                                     )

//                                   const nextPermissions =
//                                     permissions.map(
//                                       (item) =>
//                                         item.role_id ===
//                                         role.role_id
//                                           ? {
//                                               ...item,
//                                               permission:
//                                                 nextPermission,
//                                             }
//                                           : item,
//                                     )

//                                   field.handleChange(
//                                     nextPermissions,
//                                   )
//                                 }

//                               return (
//                                 <tr
//                                   key={
//                                     role.role_id
//                                   }
//                                   className="border-b last:border-0 hover:bg-muted/20"
//                                 >
//                                   <td className="px-4 py-4">
//                                     <span className="font-medium">
//                                       {
//                                         role.role_name
//                                       }
//                                     </span>
//                                   </td>

//                                   <td className="px-4 py-4 text-center">
//                                     <PermissionCheckbox
//                                       checked
//                                       label={`View permission for ${role.role_name}`}
//                                       onChange={() =>
//                                         undefined
//                                       }
//                                     />
//                                   </td>

//                                   <td className="px-4 py-4 text-center">
//                                     <PermissionCheckbox
//                                       checked={add}
//                                       disabled={
//                                         loading
//                                       }
//                                       onChange={() =>
//                                         updatePermission(
//                                           "add",
//                                         )
//                                       }
//                                       label={`Add permission for ${role.role_name}`}
//                                     />
//                                   </td>

//                                   <td className="px-4 py-4 text-center">
//                                     <PermissionCheckbox
//                                       checked={edit}
//                                       disabled={
//                                         loading
//                                       }
//                                       onChange={() =>
//                                         updatePermission(
//                                           "edit",
//                                         )
//                                       }
//                                       label={`Edit permission for ${role.role_name}`}
//                                     />
//                                   </td>

//                                   <td className="px-4 py-4 text-center">
//                                     <PermissionCheckbox
//                                       checked={
//                                         deletePermission
//                                       }
//                                       disabled={
//                                         loading
//                                       }
//                                       onChange={() =>
//                                         updatePermission(
//                                           "delete",
//                                         )
//                                       }
//                                       label={`Delete permission for ${role.role_name}`}
//                                     />
//                                   </td>
//                                 </tr>
//                               )
//                             },
//                           )}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* -------------------------------------------------- */}
//                     {/* PERMISSION MAPPING                                  */}
//                     {/* -------------------------------------------------- */}

//                     {/* <div className="mt-5 rounded-lg border bg-muted/20 p-4">
//                       <p className="text-sm font-semibold">
//                         Permission Mapping
//                       </p>

//                       <p className="mt-1 text-xs text-muted-foreground">
//                         View is always available. Add,
//                         Edit and Delete are represented
//                         using permission bits.
//                       </p>

//                       <div className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
//                         <PermissionInfo
//                           value="0"
//                           label="View"
//                         />

//                         <PermissionInfo
//                           value="1"
//                           label="View + Delete"
//                         />

//                         <PermissionInfo
//                           value="2"
//                           label="View + Edit"
//                         />

//                         <PermissionInfo
//                           value="3"
//                           label="View + Edit + Delete"
//                         />

//                         <PermissionInfo
//                           value="4"
//                           label="View + Add"
//                         />

//                         <PermissionInfo
//                           value="5"
//                           label="View + Add + Delete"
//                         />

//                         <PermissionInfo
//                           value="6"
//                           label="View + Add + Edit"
//                         />

//                         <PermissionInfo
//                           value="7"
//                           label="Full Access"
//                         />
//                       </div>
//                     </div> */}

//                     {field.state.meta.errors.length >
//                       0 && (
//                       <div className="mt-4">
//                         <FieldError
//                           errors={
//                             field.state.meta.errors
//                           }
//                         />
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               )
//             }}
//           />
//         </form>
//       </CardContent>

//       {/* ------------------------------------------------------------------ */}
//       {/* Footer                                                             */}
//       {/* ------------------------------------------------------------------ */}

//       <CardFooter className="flex justify-end gap-3 border-t pt-6">
//         <Button
//          className="cursor-pointer"
//           type="button"
//           variant="outline"
//           onClick={() => {
//             if (onCancel) {
//               onCancel()
//               return
//             }

//             form.reset()
//           }}
//           disabled={loading}
//         >
//           Cancel
//         </Button>

//         <Button
//          className="cursor-pointer"
//           type="submit"
//           form="sub-module-form"
//           disabled={loading}
//         >
//           {loading
//             ? "Saving..."
//             : isEditMode
//               ? "Update Sub Module"
//               : "Create Sub Module"}
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }

// /* -------------------------------------------------------------------------- */
// /* Permission Checkbox                                                        */
// /* -------------------------------------------------------------------------- */

// interface PermissionCheckboxProps {
//   checked: boolean
//   disabled?: boolean
//   onChange: () => void
//   label: string
// }

// function PermissionCheckbox({
//   checked,
//   disabled = false,
//   onChange,
//   label,
// }: PermissionCheckboxProps) {
//   return (
//     <div className="flex justify-center">
//       <input
//         type="checkbox"
//         checked={checked}
//         disabled={disabled}
//         onChange={onChange}
//         aria-label={label}
//         className="h-4 w-4 cursor-pointer rounded border-input accent-primary disabled:cursor-not-allowed disabled:opacity-50"
//       />
//     </div>
//   )
// }

// /* -------------------------------------------------------------------------- */
// /* Permission Information                                                     */
// /* -------------------------------------------------------------------------- */

// // interface PermissionInfoProps {
// //   value: string
// //   label: string
// // }

// // function PermissionInfo({
// //   value,
// //   label,
// // }: PermissionInfoProps) {
// //   return (
// //     <div className="flex items-center gap-2">
// //       <span className="inline-flex min-w-9 items-center justify-center rounded border bg-background px-2 py-1 font-mono font-semibold">
// //         {value}
// //       </span>

// //       <span className="text-muted-foreground">
// //         {label}
// //       </span>
// //     </div>
// //   )
// // }



"use client"

import {
  useEffect,
} from "react"

import {
  useForm,
} from "@tanstack/react-form"

import {

  useSelector,
} from "react-redux"

import type {

  RootState,
} from "@/app/store"

import {
  Button,
} from "@/components/ui/button"

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

import {
  Input,
} from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Textarea,
} from "@/components/ui/textarea"

import type {
  SubModuleFormData,
} from "../submoduleValidations"

import {
  subModuleSchema,
} from "../submoduleValidations"

import type {
  SubModulePermission,
} from "../submoduleTypes"

import {
  selectRoles,
  selectRolesLoading,
  selectRolesError,
} from "../../roles/roleSelectors"

/* ==========================================================================
   PROPS
========================================================================== */

interface SubmoduleFormProps {
  initialData?: Partial<SubModuleFormData> & {
    id?: number
  }

  loading?: boolean

  onSubmit: (
    data: SubModuleFormData,
  ) => Promise<void> | void

  onCancel?: () => void
}

/* ==========================================================================
   PERMISSION TYPE
========================================================================== */

type PermissionType =
  | "view"
  | "add"
  | "edit"
  | "delete"

/* ==========================================================================
   STATUS
========================================================================== */

const STATUS_OPTIONS = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
] as const

/* ==========================================================================
   PERMISSION BITS

   View = 0
   Add = 4
   Edit = 2
   Delete = 1

   Therefore:

   0 = View
   1 = View + Delete
   2 = View + Edit
   3 = View + Edit + Delete
   4 = View + Add
   5 = View + Add + Delete
   6 = View + Add + Edit
   7 = Full
========================================================================== */

const PERMISSION = {
  ADD: 4,
  EDIT: 2,
  DELETE: 1,
} as const

/* ==========================================================================
   GET PERMISSION
========================================================================== */

function getPermission(
  permissions: SubModulePermission[],
  roleId: number,
): number {
  return (
    permissions.find(
      (item) =>
        item.role_id === roleId,
    )?.permission ?? 0
  )
}

/* ==========================================================================
   CHECK PERMISSION
========================================================================== */

function hasPermission(
  permission: number,
  type: PermissionType,
): boolean {
  /*
   * View is always enabled.
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

  return (
    (permission & bit) === bit
  )
}

/* ==========================================================================
   CALCULATE PERMISSION
========================================================================== */

function calculatePermission(
  currentPermission: number,
  type: PermissionType,
): number {
  /*
   * View cannot be disabled.
   */
  if (type === "view") {
    return currentPermission
  }

  const bit =
    type === "add"
      ? PERMISSION.ADD
      : type === "edit"
        ? PERMISSION.EDIT
        : PERMISSION.DELETE

  const enabled =
    (currentPermission & bit) ===
    bit

  /*
   * Remove permission
   */
  if (enabled) {
    return (
      currentPermission & ~bit
    )
  }

  /*
   * Add permission
   */
  return (
    currentPermission | bit
  )
}

/* ==========================================================================
   BUILD PERMISSIONS
========================================================================== */

function buildPermissions(
  roles: {
    id: number
  }[],
  initialPermissions?: SubModulePermission[],
): SubModulePermission[] {
  return roles.map((role) => {
    const existing =
      initialPermissions?.find(
        (item) =>
          item.role_id === role.id,
      )

    return {
      role_id: role.id,
      permission:
        existing?.permission ?? 0,
    }
  })
}

/* ==========================================================================
   COMPONENT
========================================================================== */

export default function SubmoduleForm({
  initialData,
  loading = false,
  onSubmit,
  onCancel,
}: SubmoduleFormProps) {
  const isEditMode =
    Boolean(initialData?.id)

  // const dispatch =
  //   useDispatch<AppDispatch>()

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
     MODULES
  ========================================================================== */

  const modules = useSelector(
    (state: RootState) =>
      state.modules.modules,
  )

  /* ==========================================================================
     FORM
  ========================================================================== */

  const form = useForm({
    defaultValues: {
      module_id:
        initialData?.module_id ?? 0,

      sub_module_code:
        initialData?.sub_module_code ??
        "",

      sub_module_name:
        initialData?.sub_module_name ??
        "",

      sub_module_status:
        initialData?.sub_module_status ??
        "active",

      display_order:
        initialData?.display_order ?? 1,

      note:
        initialData?.note ?? "",

      /*
       * Initially roles may not have loaded.
       *
       * This will be populated by the
       * useEffect below.
       */
      permissions:
        buildPermissions(
          roles,
          initialData?.permissions,
        ),
    } satisfies SubModuleFormData,

    validators: {
      onSubmit:
        subModuleSchema,
    },

    onSubmit: async ({
      value,
    }) => {
      await onSubmit(value)
    },
  })

  /* ==========================================================================
     IMPORTANT:
     SYNC PERMISSIONS WHEN ROLES LOAD
  ========================================================================== */

  // useEffect(() => {
  //   /*
  //    * Do nothing while roles are loading.
  //    */
  //   if (rolesLoading) {
  //     return
  //   }

  //   /*
  //    * No roles available.
  //    */
  //   if (roles.length === 0) {
  //     return
  //   }

  //   /*
  //    * Get the current form permissions.
  //    */
  //   const currentPermissions =
  //     form.getFieldValue(
  //       "permissions",
  //     ) ?? []

  //   /*
  //    * Build one permission record
  //    * for every role.
  //    */
  //   const permissions =
  //     roles.map((role) => {
  //       /*
  //        * First use the current form value.
  //        */
  //       const current =
  //         currentPermissions.find(
  //           (item) =>
  //             item.role_id === role.id,
  //         )

  //       /*
  //        * Then use initial edit data.
  //        */
  //       const initial =
  //         initialData?.permissions?.find(
  //           (item) =>
  //             item.role_id === role.id,
  //         )

  //       return {
  //         role_id: role.id,

  //         permission:
  //           current?.permission ??
  //           initial?.permission ??
  //           0,
  //       }
  //     })

  //   /*
  //    * Update TanStack Form.
  //    *
  //    * THIS IS THE IMPORTANT FIX.
  //    */
  //   form.setFieldValue(
  //     "permissions",
  //     permissions,
  //   )
  // }, [
  //   roles,
  //   rolesLoading,
  //   initialData?.permissions,
  //   form,
  // ])


useEffect(() => {
  if (rolesLoading) {
    return
  }

  if (roles.length === 0) {
    return
  }

  const currentPermissions =
    form.getFieldValue(
      "permissions",
    ) ?? []

  const nextPermissions =
    roles.map((role) => {
      const current =
        currentPermissions.find(
          (item) =>
            Number(
              item.role_id,
            ) ===
            Number(role.id),
        )

      const initial =
        initialData?.permissions?.find(
          (item) =>
            Number(
              item.role_id,
            ) ===
            Number(role.id),
        )

      return {
        role_id:
          Number(role.id),

        permission:
          Number(
            current?.permission ??
              initial?.permission ??
              0,
          ),
      }
    })

  /*
   * Do not update the form if
   * permissions are already identical.
   */
  const currentJson =
    JSON.stringify(
      currentPermissions,
    )

  const nextJson =
    JSON.stringify(
      nextPermissions,
    )

  if (
    currentJson !==
    nextJson
  ) {
    form.setFieldValue(
      "permissions",
      nextPermissions,
    )
  }
}, [
  roles,
  rolesLoading,
  initialData?.permissions,
  form,
])


  /* ==========================================================================
     SUBMIT LOADING STATE
  ========================================================================== */

  const formLoading =
    loading || rolesLoading

  /* ==========================================================================
     UI
  ========================================================================== */

  return (
    <Card className="w-full">

      {/* ======================================================================
         HEADER
      ====================================================================== */}

      <CardHeader className="border-b">
        <CardTitle className="text-xl">
          {isEditMode
            ? "Edit Sub Module"
            : "Create Sub Module"}
        </CardTitle>
      </CardHeader>

      {/* ======================================================================
         CONTENT
      ====================================================================== */}

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

          {/* ==================================================================
             BASIC INFORMATION
          ================================================================== */}

          <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* ================================================================
               PARENT MODULE
            ================================================================ */}

            <form.Field
              name="module_id"
              children={(field) => {
                const isInvalid =
                  field.state.meta
                    .isTouched &&
                  !field.state.meta
                    .isValid

                return (
                  <Field
                    data-invalid={
                      isInvalid
                    }
                  >
                    <FieldLabel>
                      Parent Module

                      <span className="text-destructive">
                        {" "}*
                      </span>
                    </FieldLabel>

                    <Select
                      value={
                        field.state
                          .value > 0
                          ? String(
                              field.state
                                .value,
                            )
                          : ""
                      }
                      onValueChange={(
                        value,
                      ) => {
                        field.handleChange(
                          Number(value),
                        )

                        field.handleBlur()
                      }}
                      disabled={
                        formLoading
                      }
                    >
                      <SelectTrigger
                        aria-invalid={
                          isInvalid
                        }
                      >
                        <SelectValue
                          placeholder="Select parent module"
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {modules.length ===
                        0 ? (
                          <SelectItem
                            value="no-modules"
                            disabled
                          >
                            No modules available
                          </SelectItem>
                        ) : (
                          modules.map(
                            (
                              module,
                            ) => (
                              <SelectItem
                                key={
                                  module.id
                                }
                                value={String(
                                  module.id,
                                )}
                              >
                                {
                                  module.module_name
                                }

                                {module.module_code
                                  ? ` (${module.module_code})`
                                  : ""}
                              </SelectItem>
                            ),
                          )
                        )}
                      </SelectContent>
                    </Select>

                    <FieldDescription>
                      Select the parent
                      module.
                    </FieldDescription>

                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state
                            .meta
                            .errors
                        }
                      />
                    )}
                  </Field>
                )
              }}
            />

            {/* ================================================================
               SUB MODULE CODE
            ================================================================ */}

            <form.Field
              name="sub_module_code"
              children={(field) => {
                const isInvalid =
                  field.state.meta
                    .isTouched &&
                  !field.state.meta
                    .isValid

                return (
                  <Field
                    data-invalid={
                      isInvalid
                    }
                  >
                    <FieldLabel
                      htmlFor={
                        field.name
                      }
                    >
                      Sub Module Code

                      <span className="text-destructive">
                        {" "}*
                      </span>
                    </FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      value={
                        field.state.value
                      }
                      onBlur={
                        field.handleBlur
                      }
                      onChange={(
                        event,
                      ) =>
                        field.handleChange(
                          event.target
                            .value,
                        )
                      }
                      aria-invalid={
                        isInvalid
                      }
                      placeholder="e.g. SUB_7"
                      autoComplete="off"
                      disabled={
                        formLoading
                      }
                    />

                    <FieldDescription>
                      Unique code for the
                      sub module.
                    </FieldDescription>

                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state
                            .meta
                            .errors
                        }
                      />
                    )}
                  </Field>
                )
              }}
            />

            {/* ================================================================
               SUB MODULE NAME
            ================================================================ */}

            <form.Field
              name="sub_module_name"
              children={(field) => {
                const isInvalid =
                  field.state.meta
                    .isTouched &&
                  !field.state.meta
                    .isValid

                return (
                  <Field
                    data-invalid={
                      isInvalid
                    }
                  >
                    <FieldLabel
                      htmlFor={
                        field.name
                      }
                    >
                      Sub Module Name

                      <span className="text-destructive">
                        {" "}*
                      </span>
                    </FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      value={
                        field.state.value
                      }
                      onBlur={
                        field.handleBlur
                      }
                      onChange={(
                        event,
                      ) =>
                        field.handleChange(
                          event.target
                            .value,
                        )
                      }
                      aria-invalid={
                        isInvalid
                      }
                      placeholder="e.g. Donation Reports"
                      autoComplete="off"
                      disabled={
                        formLoading
                      }
                    />

                    <FieldDescription>
                      Display name of the
                      sub module.
                    </FieldDescription>

                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state
                            .meta
                            .errors
                        }
                      />
                    )}
                  </Field>
                )
              }}
            />

            {/* ================================================================
               DISPLAY ORDER
            ================================================================ */}

            <form.Field
              name="display_order"
              children={(field) => {
                const isInvalid =
                  field.state.meta
                    .isTouched &&
                  !field.state.meta
                    .isValid

                return (
                  <Field
                    data-invalid={
                      isInvalid
                    }
                  >
                    <FieldLabel
                      htmlFor={
                        field.name
                      }
                    >
                      Display Order
                    </FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
                      step={1}
                      value={
                        field.state.value
                      }
                      onBlur={
                        field.handleBlur
                      }
                      onChange={(
                        event,
                      ) => {
                        const value =
                          event.target
                            .value

                        field.handleChange(
                          value === ""
                            ? 0
                            : Number(
                                value,
                              ),
                        )
                      }}
                      aria-invalid={
                        isInvalid
                      }
                      disabled={
                        formLoading
                      }
                    />

                    <FieldDescription>
                      Controls the display
                      order.
                    </FieldDescription>

                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state
                            .meta
                            .errors
                        }
                      />
                    )}
                  </Field>
                )
              }}
            />

            {/* ================================================================
               STATUS
            ================================================================ */}

            <form.Field
              name="sub_module_status"
              children={(field) => {
                const isInvalid =
                  field.state.meta
                    .isTouched &&
                  !field.state.meta
                    .isValid

                return (
                  <Field
                    data-invalid={
                      isInvalid
                    }
                  >
                    <FieldLabel>
                      Status

                      <span className="text-destructive">
                        {" "}*
                      </span>
                    </FieldLabel>

                    <Select
                      value={
                        field.state.value
                      }
                      onValueChange={(
                        value,
                      ) => {
                        if (
                          value !==
                            "active" &&
                          value !==
                            "inactive"
                        ) {
                          return
                        }

                        field.handleChange(
                          value,
                        )

                        field.handleBlur()
                      }}
                      disabled={
                        formLoading
                      }
                    >
                      <SelectTrigger
                        aria-invalid={
                          isInvalid
                        }
                      >
                        <SelectValue
                          placeholder="Select status"
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {STATUS_OPTIONS.map(
                          (
                            option,
                          ) => (
                            <SelectItem
                              key={
                                option.value
                              }
                              value={
                                option.value
                              }
                            >
                              {
                                option.label
                              }
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>

                    <FieldDescription>
                      Enable or disable the
                      sub module.
                    </FieldDescription>

                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state
                            .meta
                            .errors
                        }
                      />
                    )}
                  </Field>
                )
              }}
            />

            {/* ================================================================
               NOTE
            ================================================================ */}

            <form.Field
              name="note"
              children={(field) => {
                const isInvalid =
                  field.state.meta
                    .isTouched &&
                  !field.state.meta
                    .isValid

                return (
                  <Field
                    data-invalid={
                      isInvalid
                    }
                  >
                    <FieldLabel
                      htmlFor={
                        field.name
                      }
                    >
                      Note
                    </FieldLabel>

                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={
                        field.state.value
                      }
                      onBlur={
                        field.handleBlur
                      }
                      onChange={(
                        event,
                      ) =>
                        field.handleChange(
                          event.target
                            .value,
                        )
                      }
                      aria-invalid={
                        isInvalid
                      }
                      placeholder="Enter description or note"
                      disabled={
                        formLoading
                      }
                      rows={3}
                    />

                    <FieldDescription>
                      Optional description or
                      note.
                    </FieldDescription>

                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state
                            .meta
                            .errors
                        }
                      />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          {/* ==================================================================
             PERMISSIONS
          ================================================================== */}

          <form.Field
            name="permissions"
            children={(field) => {
              const permissions =
                field.state.value ?? []

              return (
                <Card className="mt-8">

                  <CardHeader>
                    <CardTitle className="text-lg">
                      Permissions
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                      Configure permissions
                      for each role.
                    </p>
                  </CardHeader>

                  <CardContent>

                    {/* ========================================================
                       LOADING
                    ======================================================== */}

                    {rolesLoading && (
                      <div className="mb-4 rounded-md border p-4">
                        <p className="text-sm text-muted-foreground">
                          Loading roles...
                        </p>
                      </div>
                    )}

                    {/* ========================================================
                       ERROR
                    ======================================================== */}

                    {!rolesLoading &&
                      rolesError && (
                        <div className="mb-4 rounded-md border border-destructive p-4">
                          <p className="text-sm text-destructive">
                            {rolesError}
                          </p>
                        </div>
                      )}

                    {/* ========================================================
                       NO ROLES
                    ======================================================== */}

                    {!rolesLoading &&
                      !rolesError &&
                      roles.length ===
                        0 && (
                        <div className="mb-4 rounded-md border p-4">
                          <p className="text-sm text-destructive">
                            No roles available.
                            Please configure
                            roles before
                            creating a sub
                            module.
                          </p>
                        </div>
                      )}

                    {/* ========================================================
                       PERMISSION TABLE
                    ======================================================== */}

                    {roles.length >
                      0 && (
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

                            </tr>
                          </thead>

                          <tbody>

                            {roles.map(
                              (role) => {
                                const permission =
                                  getPermission(
                                    permissions,
                                    role.id,
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

                                /* ==================================================
                                   UPDATE PERMISSION
                                ================================================== */

                                const updatePermission =
                                  (
                                    type: PermissionType,
                                  ) => {
                                    if (
                                      type ===
                                      "view"
                                    ) {
                                      return
                                    }

                                    const nextPermission =
                                      calculatePermission(
                                        permission,
                                        type,
                                      )

                                    /*
                                     * Make sure this
                                     * role already
                                     * exists.
                                     */

                                    const exists =
                                      permissions.some(
                                        (
                                          item,
                                        ) =>
                                          item.role_id ===
                                          role.id,
                                      )

                                    let nextPermissions

                                    if (
                                      exists
                                    ) {
                                      nextPermissions =
                                        permissions.map(
                                          (
                                            item,
                                          ) =>
                                            item.role_id ===
                                            role.id
                                              ? {
                                                  ...item,
                                                  permission:
                                                    nextPermission,
                                                }
                                              : item,
                                        )
                                    } else {
                                      nextPermissions =
                                        [
                                          ...permissions,
                                          {
                                            role_id:
                                              role.id,
                                            permission:
                                              nextPermission,
                                          },
                                        ]
                                    }

                                    field.handleChange(
                                      nextPermissions,
                                    )
                                  }

                                return (
                                  <tr
                                    key={
                                      role.id
                                    }
                                    className="border-b last:border-0 hover:bg-muted/20"
                                  >

                                    {/* ==================================================
                                       ROLE
                                    ================================================== */}

                                    <td className="px-4 py-4">
                                      <span className="font-medium">
                                        {
                                          role.user_role_name
                                        }
                                      </span>
                                    </td>

                                    {/* ==================================================
                                       VIEW
                                    ================================================== */}

                                    <td className="px-4 py-4 text-center">
                                      <PermissionCheckbox
                                        checked={
                                          true
                                        }
                                        disabled={
                                          true
                                        }
                                        onChange={() =>
                                          undefined
                                        }
                                        label={`View permission for ${role.user_role_name}`}
                                      />
                                    </td>

                                    {/* ==================================================
                                       ADD
                                    ================================================== */}

                                    <td className="px-4 py-4 text-center">
                                      <PermissionCheckbox
                                        checked={
                                          add
                                        }
                                        disabled={
                                          formLoading
                                        }
                                        onChange={() =>
                                          updatePermission(
                                            "add",
                                          )
                                        }
                                        label={`Add permission for ${role.user_role_name}`}
                                      />
                                    </td>

                                    {/* ==================================================
                                       EDIT
                                    ================================================== */}

                                    <td className="px-4 py-4 text-center">
                                      <PermissionCheckbox
                                        checked={
                                          edit
                                        }
                                        disabled={
                                          formLoading
                                        }
                                        onChange={() =>
                                          updatePermission(
                                            "edit",
                                          )
                                        }
                                        label={`Edit permission for ${role.user_role_name}`}
                                      />
                                    </td>

                                    {/* ==================================================
                                       DELETE
                                    ================================================== */}

                                    <td className="px-4 py-4 text-center">
                                      <PermissionCheckbox
                                        checked={
                                          deletePermission
                                        }
                                        disabled={
                                          formLoading
                                        }
                                        onChange={() =>
                                          updatePermission(
                                            "delete",
                                          )
                                        }
                                        label={`Delete permission for ${role.user_role_name}`}
                                      />
                                    </td>

                                  </tr>
                                )
                              },
                            )}

                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* ========================================================
                       FORM ERROR
                    ======================================================== */}

                    {field.state.meta
                      .errors
                      .length > 0 && (
                      <div className="mt-4">
                        <FieldError
                          errors={
                            field.state
                              .meta
                              .errors
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

      {/* ======================================================================
         FOOTER
      ====================================================================== */}

      <CardFooter className="flex justify-end gap-3 border-t pt-6">

        {/* ====================================================================
           CANCEL
        ==================================================================== */}

        <Button
          className="cursor-pointer"
          type="button"
          variant="outline"
          onClick={() => {
            if (onCancel) {
              onCancel()
              return
            }

            form.reset()
          }}
          disabled={
            formLoading
          }
        >
          Cancel
        </Button>

        {/* ====================================================================
           SAVE
        ==================================================================== */}

        <Button
          className="cursor-pointer"
          type="submit"
          form="sub-module-form"
          disabled={
            formLoading ||
            rolesLoading ||
            roles.length === 0
          }
        >
          {formLoading
            ? "Saving..."
            : isEditMode
              ? "Update Sub Module"
              : "Create Sub Module"}
        </Button>

      </CardFooter>
    </Card>
  )
}

/* ==========================================================================
   PERMISSION CHECKBOX
========================================================================== */

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