
import { useMemo, useState } from "react"
import {NavLink} from 'react-router-dom'
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Users,
  Eye,
  Pencil,
  MoreHorizontal,
  UserRound,
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



/* =========================================================
   TYPES
========================================================= */

interface OrganizationUser {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: "Active" | "Inactive"
}

interface Temple {
  id: string
  name: string
  code: string
  city: string
  status: "Active" | "Inactive"
  users: OrganizationUser[]
}

interface Organization {
  id: string
  name: string
  code: string
  email: string
  phone: string
  city: string
  status: "Active" | "Inactive"
  adminName: string
  image?: string
  temples: Temple[]
}


/* =========================================================
   DUMMY DATA
========================================================= */

const organization: Organization = {
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

export default function ViewOrganizations() {
  const [selectedTemple, setSelectedTemple] = useState(
    organization.temples[0]?.id,
  )

  const [search, setSearch] = useState("")


  /* ---------------------------------------------------------
     TOTAL USERS
  --------------------------------------------------------- */

  const totalUsers = useMemo(() => {
    return organization.temples.reduce(
      (total, temple) => total + temple.users.length,
      0,
    )
  }, [])


  /* ---------------------------------------------------------
     ACTIVE USERS
  --------------------------------------------------------- */

  const activeUsers = useMemo(() => {
    return organization.temples.reduce(
      (total, temple) =>
        total +
        temple.users.filter(
          (user) => user.status === "Active",
        ).length,
      0,
    )
  }, [])


  /* ---------------------------------------------------------
     SELECTED TEMPLE
  --------------------------------------------------------- */

  const temple = organization.temples.find(
    (item) => item.id === selectedTemple,
  )


  /* ---------------------------------------------------------
     SEARCH USERS
  --------------------------------------------------------- */

  const filteredUsers = temple?.users.filter((user) => {
    const value = search.toLowerCase()

    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.role.toLowerCase().includes(value)
    )
  }) ?? []


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
            Organization Details
          </h1>
        </div>

        <div className="flex gap-2">

          <Button variant="outline">
            <Pencil className="mr-2 size-4" />
             <NavLink to="/organizations/edit">
                           Edit
                        </NavLink>
          
          </Button>

          <DropdownMenu>

            <DropdownMenuTrigger >
              <Button
                variant="outline"
                size="icon"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              <DropdownMenuItem>
                View Organization
              </DropdownMenuItem>

              <DropdownMenuItem>
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

        <CardContent className="p-6">

          <div className="flex flex-col gap-6 lg:flex-row">

            {/* LOGO */}

            <div className="flex shrink-0 items-start">

              <div className="flex size-24 items-center justify-center overflow-hidden rounded-xl border bg-muted">

                {organization.image ? (
                  <img
                    src={organization.image}
                    alt={organization.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <Building2 className="size-10 text-muted-foreground" />
                )}

              </div>

            </div>


            {/* ORGANIZATION INFO */}

            <div className="flex-1">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <h2 className="text-xl font-semibold">
                      {organization.name}
                    </h2>

                    <Badge
                      variant={
                        organization.status === "Active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {organization.status}
                    </Badge>

                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Organization Code: {organization.code}
                  </p>

                </div>

              </div>


              {/* DETAILS */}

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <InfoItem
                  icon={<UserRound />}
                  label="Administrator"
                  value={organization.adminName}
                />

                <InfoItem
                  icon={<Mail />}
                  label="Email"
                  value={organization.email}
                />

                <InfoItem
                  icon={<Phone />}
                  label="Phone"
                  value={organization.phone}
                />

                <InfoItem
                  icon={<MapPin />}
                  label="City"
                  value={organization.city}
                />

              </div>

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
          value={organization.temples.length}
          icon={<Building2 />}
        />

        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users />}
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
            Select a temple to view its users and details.
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

            {/* TEMPLE TABS */}

            <TabsList className="mb-6 h-auto w-full justify-start overflow-x-auto">

              {organization.temples.map((temple) => (

                <TabsTrigger
                  key={temple.id}
                  value={temple.id}
                  className="shrink-0"
                >
                  {temple.name}
                </TabsTrigger>

              ))}

            </TabsList>


            {/* TEMPLE CONTENT */}

            {organization.temples.map((item) => (

              <TabsContent
                key={item.id}
                value={item.id}
                className="space-y-6"
              >

                {/* TEMPLE HEADER */}

                <div className="flex flex-col gap-4 rounded-lg border bg-muted/20 p-5 md:flex-row md:items-center md:justify-between">

                  <div>

                    <div className="flex items-center gap-3">

                      <h3 className="text-lg font-semibold">
                        {item.name}
                      </h3>

                      <Badge variant="outline">
                        {item.status}
                      </Badge>

                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Code: {item.code} · {item.city}
                    </p>

                  </div>


                  <div className="flex gap-6">

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Users
                      </p>

                      <p className="text-xl font-semibold">
                        {item.users.length}
                      </p>
                    </div>

                  </div>

                </div>


                {/* USERS */}

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


                  {/* USER TABLE */}

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
                                  >
                                    <Eye />
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

        <div className="flex size-11 items-center justify-center rounded-lg bg-muted [&_svg]:size-5">
          {icon}
        </div>

      </CardContent>

    </Card>
  )
}

