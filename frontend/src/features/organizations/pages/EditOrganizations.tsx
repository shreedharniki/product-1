
import { useMemo, useState } from "react"
import { NavLink } from "react-router-dom"
// import type { ChangeEvent, ReactNode } from "react"
import type {  ReactNode } from "react"
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Eye,
  Pencil,
  MoreHorizontal,
  UserRound,
  Save,
  X,
  ArrowLeft 
} from "lucide-react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import cmtlogo from "@/assets/cmtlogo.webp"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/* =========================================================
   TYPES
========================================================= */

type Status = "Active" | "Inactive"

interface OrganizationUser {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: Status
}

interface Temple {
  id: string
  name: string
  code: string
  city: string
  status: Status
  users: OrganizationUser[]
}

interface Organization {
  id: string
  name: string
  code: string
  email: string
  phone: string
  city: string
  status: Status
  adminName: string
  image?: string
  temples: Temple[]
}

/* =========================================================
   DUMMY DATA
========================================================= */

const initialOrganization: Organization = {
  id: "ORG001",
  name: "Shree Ganesh Temple Trust",
  code: "SGT001",
  email: "admin@ganeshtemple.com",
  phone: "+91 9876543210",
  city: "Pune",
  status: "Active",
  adminName: "Rahul Patil",
  image: cmtlogo,

  temples: [
    {
      id: "TEM001",
      name: "Shree Ganesh Temple",
      code: "TEM001",
      city: "Pune",
      status: "Active",

      users: [
        {
          id: 1,
          name: "Rahul Patil",
          email: "rahul@ganeshtemple.com",
          phone: "+91 9876543211",
          role: "Temple Admin",
          status: "Active",
        },
        {
          id: 2,
          name: "Amit Sharma",
          email: "amit@ganeshtemple.com",
          phone: "+91 9876543212",
          role: "Treasurer",
          status: "Active",
        },
        {
          id: 3,
          name: "Priya Joshi",
          email: "priya@ganeshtemple.com",
          phone: "+91 9876543213",
          role: "Devotee",
          status: "Active",
        },
      ],
    },

    {
      id: "TEM002",
      name: "Shree Mahadev Temple",
      code: "TEM002",
      city: "Pune",
      status: "Active",

      users: [
        {
          id: 4,
          name: "Suresh Patil",
          email: "suresh@ganeshtemple.com",
          phone: "+91 9876543214",
          role: "Temple Admin",
          status: "Active",
        },
        {
          id: 5,
          name: "Neha Kulkarni",
          email: "neha@ganeshtemple.com",
          phone: "+91 9876543215",
          role: "User",
          status: "Active",
        },
      ],
    },

    {
      id: "TEM003",
      name: "Shree Hanuman Temple",
      code: "TEM003",
      city: "Pune",
      status: "Inactive",

      users: [
        {
          id: 6,
          name: "Vikas Shinde",
          email: "vikas@ganeshtemple.com",
          phone: "+91 9876543216",
          role: "Temple Admin",
          status: "Active",
        },
        {
          id: 7,
          name: "Sneha More",
          email: "sneha@ganeshtemple.com",
          phone: "+91 9876543217",
          role: "User",
          status: "Inactive",
        },
      ],
    },
  ],
}

/* =========================================================
   COMPONENT
========================================================= */

export default function EditOrganizations() {
  /* ---------------------------------------------------------
     ORGANIZATION DATA
  --------------------------------------------------------- */

  const [organizationData, setOrganizationData] =
    useState<Organization>(initialOrganization)

  const [isEditingOrganization, setIsEditingOrganization] =
    useState(false)

  /* ---------------------------------------------------------
     TEMPLE DATA
  --------------------------------------------------------- */

  const [editingTempleId, setEditingTempleId] =
    useState<string | null>(null)

  const [templeEditData, setTempleEditData] =
    useState<Temple | null>(null)

  /* ---------------------------------------------------------
     SELECTED TEMPLE
  --------------------------------------------------------- */

  const [selectedTemple, setSelectedTemple] = useState<string>(
    initialOrganization.temples[0]?.id ?? "",
  )

  /* ---------------------------------------------------------
     SEARCH
  --------------------------------------------------------- */

  const [search, setSearch] = useState("")

  /* =========================================================
     ORGANIZATION STATISTICS
  ========================================================= */

  const totalUsers = useMemo(() => {
    return organizationData.temples.reduce(
      (total, temple) => total + temple.users.length,
      0,
    )
  }, [organizationData.temples])

  const activeUsers = useMemo(() => {
    return organizationData.temples.reduce(
      (total, temple) =>
        total +
        temple.users.filter(
          (user) => user.status === "Active",
        ).length,
      0,
    )
  }, [organizationData.temples])

  /* =========================================================
     SELECTED TEMPLE
  ========================================================= */

  const selectedTempleData = useMemo(() => {
    return organizationData.temples.find(
      (item) => item.id === selectedTemple,
    )
  }, [organizationData.temples, selectedTemple])

  /* =========================================================
     FILTER USERS
  ========================================================= */

  const filteredUsers = useMemo(() => {
    if (!selectedTempleData) {
      return []
    }

    const value = search.trim().toLowerCase()

    if (!value) {
      return selectedTempleData.users
    }

    return selectedTempleData.users.filter((user) => {
      return (
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.phone.toLowerCase().includes(value) ||
        user.role.toLowerCase().includes(value)
      )
    })
  }, [selectedTempleData, search])

  /* =========================================================
     ORGANIZATION EDIT
  ========================================================= */

  const handleOrganizationEdit = () => {
    setIsEditingOrganization(true)
  }

  const handleOrganizationCancel = () => {
    setOrganizationData(initialOrganization)
    setIsEditingOrganization(false)
  }

  const handleOrganizationSave = () => {
    /*
      Replace this section with your API call.

      Example:

      await api.put(
        `/v1/organizations/${organizationData.id}`,
        organizationData
      )
    */

    console.log(
      "Organization updated:",
      organizationData,
    )

    setIsEditingOrganization(false)
  }

  /* =========================================================
     ORGANIZATION FIELD UPDATE
  ========================================================= */

  const updateOrganizationField = <
    K extends keyof Organization,
  >(
    field: K,
    value: Organization[K],
  ) => {
    setOrganizationData((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  /* =========================================================
     TEMPLE EDIT
  ========================================================= */

  const handleTempleEdit = (temple: Temple) => {
    setEditingTempleId(temple.id)

    setTempleEditData({
      ...temple,
      users: [...temple.users],
    })
  }

  /* =========================================================
     TEMPLE CANCEL
  ========================================================= */

  const handleTempleCancel = () => {
    setEditingTempleId(null)
    setTempleEditData(null)
  }

  /* =========================================================
     TEMPLE SAVE
  ========================================================= */

  const handleTempleSave = () => {
    if (!templeEditData) {
      return
    }

    /*
      Replace this section with your API call.

      Example:

      await api.put(
        `/v1/temples/${templeEditData.id}`,
        templeEditData
      )
    */

    setOrganizationData((previous) => ({
      ...previous,

      temples: previous.temples.map((temple) =>
        temple.id === templeEditData.id
          ? templeEditData
          : temple,
      ),
    }))

    console.log(
      "Temple updated:",
      templeEditData,
    )

    setEditingTempleId(null)
    setTempleEditData(null)
  }

  /* =========================================================
     TEMPLE FIELD UPDATE
  ========================================================= */

  const updateTempleField = <
    K extends keyof Temple,
  >(
    field: K,
    value: Temple[K],
  ) => {
    setTempleEditData((previous) => {
      if (!previous) {
        return previous
      }

      return {
        ...previous,
        [field]: value,
      }
    })
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full space-y-6">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <p className="text-sm text-muted-foreground">
            Organizations
          </p>

          <h1 className="text-2xl font-semibold tracking-tight">
            Organization Edit
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage organization information, temples and users.
          </p>
        </div>

        <div className="flex gap-2">

          {/* <Button variant="outline" asChild>
              
              <ArrowLeft className="mr-2 size-4" />
            <NavLink to="/organizations/details">
            
            Back
            </NavLink>
          </Button> */}
          <NavLink
            to="/organizations/details"
            className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back
          </NavLink>

          <DropdownMenu>

            {/* <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger> */}
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                size="icon"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">

              <DropdownMenuItem>
                View Organization
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleOrganizationEdit}
              >
                Edit Organization
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>

      </div>

      {/* =====================================================
          ORGANIZATION PROFILE
      ===================================================== */}

      <Card>

        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <CardTitle>
              Organization Profile
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Organization basic information
            </p>
          </div>

          {/* ORGANIZATION ACTIONS */}

          {!isEditingOrganization ? (

            <Button
              variant="outline"
              size="sm"
              onClick={handleOrganizationEdit}
            >
              <Pencil className="mr-2 size-4" />
              Edit
            </Button>

          ) : (

            <div className="flex gap-2">

              <Button
                variant="outline"
                size="sm"
                onClick={handleOrganizationCancel}
              >
                <X className="mr-2 size-4" />
                Cancel
              </Button>

              <Button
                size="sm"
                onClick={handleOrganizationSave}
              >
                <Save className="mr-2 size-4" />
                Save
              </Button>

            </div>

          )}

        </CardHeader>

        <CardContent className="p-6">

          <div className="flex flex-col gap-6 lg:flex-row">

            {/* =================================================
                LOGO
            ================================================= */}

            <div className="flex shrink-0 items-start">

              <div className="flex size-24 items-center justify-center overflow-hidden rounded-xl border bg-muted">

                {organizationData.image ? (

                  <img
                    src={organizationData.image}
                    alt={organizationData.name}
                    className="size-full object-cover"
                  />

                ) : (

                  <Building2 className="size-10 text-muted-foreground" />

                )}

              </div>

            </div>

            {/* =================================================
                ORGANIZATION INFORMATION
            ================================================= */}

            <div className="min-w-0 flex-1">

              {!isEditingOrganization ? (

                /* =================================================
                   VIEW MODE
                ================================================= */

                <>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-xl font-semibold">
                          {organizationData.name}
                        </h2>

                        <Badge
                          variant={
                            organizationData.status === "Active"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {organizationData.status}
                        </Badge>

                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Organization Code:{" "}
                        {organizationData.code}
                      </p>

                    </div>

                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <InfoItem
                      icon={<UserRound />}
                      label="Administrator"
                      value={organizationData.adminName}
                    />

                    <InfoItem
                      icon={<Mail />}
                      label="Email"
                      value={organizationData.email}
                    />

                    <InfoItem
                      icon={<Phone />}
                      label="Phone"
                      value={organizationData.phone}
                    />

                    <InfoItem
                      icon={<MapPin />}
                      label="City"
                      value={organizationData.city}
                    />

                  </div>

                </>

              ) : (

                /* =================================================
                   EDIT MODE
                ================================================= */

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* NAME */}

                  <FormField
                    label="Organization Name"
                  >
                    <Input
                      value={organizationData.name}
                      onChange={(event) =>
                        updateOrganizationField(
                          "name",
                          event.target.value,
                        )
                      }
                    />
                  </FormField>

                  {/* CODE */}

                  <FormField
                    label="Organization Code"
                  >
                    <Input
                      value={organizationData.code}
                      onChange={(event) =>
                        updateOrganizationField(
                          "code",
                          event.target.value,
                        )
                      }
                    />
                  </FormField>

                  {/* ADMIN */}

                  <FormField
                    label="Administrator"
                  >
                    <Input
                      value={organizationData.adminName}
                      onChange={(event) =>
                        updateOrganizationField(
                          "adminName",
                          event.target.value,
                        )
                      }
                    />
                  </FormField>

                  {/* EMAIL */}

                  <FormField
                    label="Email"
                  >
                    <Input
                      type="email"
                      value={organizationData.email}
                      onChange={(event) =>
                        updateOrganizationField(
                          "email",
                          event.target.value,
                        )
                      }
                    />
                  </FormField>

                  {/* PHONE */}

                  <FormField
                    label="Phone"
                  >
                    <Input
                      value={organizationData.phone}
                      onChange={(event) =>
                        updateOrganizationField(
                          "phone",
                          event.target.value,
                        )
                      }
                    />
                  </FormField>

                  {/* CITY */}

                  <FormField
                    label="City"
                  >
                    <Input
                      value={organizationData.city}
                      onChange={(event) =>
                        updateOrganizationField(
                          "city",
                          event.target.value,
                        )
                      }
                    />
                  </FormField>

                  {/* STATUS */}

                  <FormField
                    label="Status"
                  >
                    <Select
                      value={organizationData.status}
                      onValueChange={(value) =>{
                         if (value !== null) {
                        updateOrganizationField(
                          "status",
                          value,
                        )
                      }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Active">
                          Active
                        </SelectItem>

                        <SelectItem value="Inactive">
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                </div>

              )}

            </div>

          </div>

        </CardContent>

      </Card>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <StatCard
          title="Total Temples"
          value={organizationData.temples.length}
          icon={<Building2 />}
        />

        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<UserRound />}
        />

        <StatCard
          title="Active Users"
          value={activeUsers}
          icon={<UserRound />}
        />

      </div>

      {/* =====================================================
          TEMPLES
      ===================================================== */}

      <Card>

        <CardHeader>

          <CardTitle>
            Temples
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Select a temple to view its details and users.
          </p>

        </CardHeader>

        <CardContent>

          <Tabs
            value={selectedTemple}
            onValueChange={(value) => {
              setSelectedTemple(value)
              setSearch("")
            }}
          >

            {/* =================================================
                TEMPLE TABS
            ================================================= */}

            <TabsList className="mb-6 h-auto w-full justify-start overflow-x-auto">

              {organizationData.temples.map((item) => (

                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="shrink-0"
                >
                  {item.name}
                </TabsTrigger>

              ))}

            </TabsList>

            {/* =================================================
                TEMPLE CONTENT
            ================================================= */}

            {organizationData.temples.map((item) => (

              <TabsContent
                key={item.id}
                value={item.id}
                className="space-y-6"
              >

                {/* =================================================
                    TEMPLE HEADER
                ================================================= */}

                <div className="rounded-lg border bg-muted/20 p-5">

                  {!editingTempleId ||
                  editingTempleId !== item.id ? (

                    /* =================================================
                       TEMPLE VIEW MODE
                    ================================================= */

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-lg font-semibold">
                            {item.name}
                          </h3>

                          <Badge
                            variant={
                              item.status === "Active"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {item.status}
                          </Badge>

                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Code: {item.code}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="size-4" />
                          {item.city}
                        </div>

                      </div>

                      <div className="flex items-center justify-between gap-6">

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Users
                          </p>

                          <p className="text-xl font-semibold">
                            {item.users.length}
                          </p>
                        </div>

                        {/* TEMPLE EDIT BUTTON */}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleTempleEdit(item)
                          }
                        >
                          <Pencil className="mr-2 size-4" />
                          Edit
                        </Button>

                      </div>

                    </div>

                  ) : (

                    /* =================================================
                       TEMPLE EDIT MODE
                    ================================================= */

                    <div className="space-y-5">

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                          <h3 className="font-semibold">
                            Edit Temple
                          </h3>

                          <p className="text-sm text-muted-foreground">
                            Update temple information
                          </p>

                        </div>

                        <div className="flex gap-2">

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleTempleCancel}
                          >
                            <X className="mr-2 size-4" />
                            Cancel
                          </Button>

                          <Button
                            size="sm"
                            onClick={handleTempleSave}
                          >
                            <Save className="mr-2 size-4" />
                            Save
                          </Button>

                        </div>

                      </div>

                      {templeEditData && (
                        <div className="grid gap-5 sm:grid-cols-2">

                          {/* TEMPLE NAME */}

                          <FormField
                            label="Temple Name"
                          >
                            <Input
                              value={templeEditData.name}
                              onChange={(event) =>
                                updateTempleField(
                                  "name",
                                  event.target.value,
                                )
                              }
                            />
                          </FormField>

                          {/* TEMPLE CODE */}

                          <FormField
                            label="Temple Code"
                          >
                            <Input
                              value={templeEditData.code}
                              onChange={(event) =>
                                updateTempleField(
                                  "code",
                                  event.target.value,
                                )
                              }
                            />
                          </FormField>

                          {/* CITY */}

                          <FormField
                            label="City"
                          >
                            <Input
                              value={templeEditData.city}
                              onChange={(event) =>
                                updateTempleField(
                                  "city",
                                  event.target.value,
                                )
                              }
                            />
                          </FormField>

                          {/* STATUS */}

                          <FormField
                            label="Status"
                          >
                            <Select
                              value={templeEditData.status}
                              onValueChange={(value) =>{
                                 if (value !== null) {
                                updateTempleField(
                                  "status",
                                  value,
                                )
                              }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>

                              <SelectContent>

                                <SelectItem value="Active">
                                  Active
                                </SelectItem>

                                <SelectItem value="Inactive">
                                  Inactive
                                </SelectItem>

                              </SelectContent>
                            </Select>
                          </FormField>

                        </div>
                      )}

                    </div>

                  )}

                </div>

                {/* =================================================
                    TEMPLE USERS
                ================================================= */}

                <div className="space-y-4">

                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                    <div>

                      <h3 className="font-semibold">
                        Temple Users
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        Users assigned to {item.name}
                      </p>

                    </div>

                    <Input
                      placeholder="Search users..."
                      value={
                        selectedTemple === item.id
                          ? search
                          : ""
                      }
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      className="w-full md:w-64"
                    />

                  </div>

                  {/* =================================================
                      USER TABLE
                  ================================================= */}

                  <div className="overflow-hidden rounded-lg border">

                    <Table>

                      <TableHeader>

                        <TableRow>

                          <TableHead>
                            Sl. No
                          </TableHead>

                          <TableHead>
                            User
                          </TableHead>

                          <TableHead>
                            Email
                          </TableHead>

                          <TableHead>
                            Phone
                          </TableHead>

                          <TableHead>
                            Role
                          </TableHead>

                          <TableHead>
                            Status
                          </TableHead>

                          <TableHead className="text-right">
                            Action
                          </TableHead>

                        </TableRow>

                      </TableHeader>

                      <TableBody>

                        {selectedTemple === item.id &&
                        filteredUsers.length > 0 ? (

                          filteredUsers.map(
                            (user, index) => (

                              <TableRow
                                key={user.id}
                              >

                                <TableCell>
                                  {index + 1}
                                </TableCell>

                                <TableCell className="font-medium">
                                  {user.name}
                                </TableCell>

                                <TableCell>
                                  {user.email}
                                </TableCell>

                                <TableCell>
                                  {user.phone}
                                </TableCell>

                                <TableCell>

                                  <Badge variant="outline">
                                    {user.role}
                                  </Badge>

                                </TableCell>

                                <TableCell>

                                  <Badge
                                    variant={
                                      user.status === "Active"
                                        ? "default"
                                        : "destructive"
                                    }
                                  >
                                    {user.status}
                                  </Badge>

                                </TableCell>

                                <TableCell className="text-right">

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="View User"
                                  >
                                    <Eye className="size-4" />
                                  </Button>

                                </TableCell>

                              </TableRow>

                            ),
                          )

                        ) : (

                          <TableRow>

                            <TableCell
                              colSpan={7}
                              className="h-24 text-center"
                            >
                              No users found.
                            </TableCell>

                          </TableRow>

                        )}

                      </TableBody>

                    </Table>

                  </div>

                </div>

              </TabsContent>

            ))}

          </Tabs>

        </CardContent>

      </Card>

    </div>
  )
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  children,
}: {
  label: string
  // children: React.ReactNode
    children: ReactNode
}) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">
        {label}
      </label>

      {children}

    </div>
  )
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3">

      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-4">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="truncate text-sm font-medium">
          {value}
        </p>

      </div>

    </div>
  )
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <Card>

      <CardContent className="flex items-center justify-between p-6">

        <div>

          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold">
            {value}
          </p>

        </div>

        <div className="flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-5">
          {icon}
        </div>

      </CardContent>

    </Card>
  )
}



// ### Important correction

// Your original code had this problem:

// ```tsx
// organization.temples.map(...)
// ```

// even though you created:

// ```tsx
// const [organizationData, setOrganizationData] =
//   useState<Organization>(organization)
// ```

// So when you edited a temple, you were changing temporary state, but the displayed temple list was still coming from the original `organization`.

// The corrected version consistently uses:

// ```tsx
// organizationData.temples
// ```

// and on a temple save only that specific temple is replaced:


// setOrganizationData((previous) => ({
//   ...previous,
//   temples: previous.temples.map((temple) =>
//     temple.id === templeEditData.id
//       ? templeEditData
//       : temple,
//   ),
// }))


// So the behavior is now:

// **Organization**

// `Edit → change fields → Save`

// **Temple 1**

// `Edit → change fields → Save`

// **Temple 2**

// `Edit → change fields → Save`

// **Temple 3**

// `Edit → change fields → Save`

// Each one is completely independent.

// When you are ready to connect the backend, replace the `console.log()` sections with your `api.put()`/`api.patch()` calls without changing the UI/state structure.
