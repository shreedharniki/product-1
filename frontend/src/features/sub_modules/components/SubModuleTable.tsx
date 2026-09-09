
import { useState } from "react"
import { List, LayoutGrid } from "lucide-react"

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Button } from "@/components/ui/button"

import { NavLink } from "react-router-dom"
const submodule = [
  {
    id: "001",
    name: "Donestion",
    code: "Sub-MO-001",
    module_name: "Module 1",
    status: "Active",
    super_permision: 777,
    org_permision: 770,
    users_permision: 100,
    temples_permision:6

  },
  
]

const PAGE_SIZE = 11


export default function SubModuleTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [view, setView] = useState<"list" | "grid">("list")

  const totalPages = Math.ceil(submodule.length / PAGE_SIZE)

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE

  const currentSubModules = submodule.slice(
    startIndex,
    endIndex,
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="w-full space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        {/* <div>
       
          <h2 className="text-lg font-semibold">
            Sub Modules
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage all SubModule
          </p>
        </div> */}
        <div>
                  
                
                    <NavLink to="/submodule/add">
                      <Button className="cursor-pointer">
                        Add Sub Module
                      </Button>
                    </NavLink>
                 
                </div>

        {/* List / Grid Toggle */}
        <div className="flex items-center gap-1 rounded-md border p-1">
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setView("list")}
            title="List View"
          >
            <List className="size-4" />
          </Button>

          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setView("grid")}
            title="Grid View"
          >
            <LayoutGrid className="size-4" />
          </Button>
        </div>
      </div>

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sl.no</TableHead>
                <TableHead>Sub Module Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Module Name</TableHead>
                <TableHead> Users Permision</TableHead>
                <TableHead>Org Permision</TableHead>
                <TableHead>Super Permision</TableHead>
                <TableHead>Temple Permision</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentSubModules.map((submodule, index) => (
                <TableRow key={submodule.id}>

                  <TableCell>
                    {startIndex + index + 1}
                  </TableCell>

                  <TableCell className="font-medium">
                    {submodule.name}
                  </TableCell>

                  <TableCell>
                    {submodule.code}
                  </TableCell>

                  <TableCell>
                    {submodule.module_name}
                  </TableCell>

                  <TableCell>
                    {submodule.users_permision}
                  </TableCell>

                  <TableCell>
                    {submodule.org_permision}
                  </TableCell>

                  <TableCell>
                    {submodule.super_permision}
                  </TableCell>

                  <TableCell>
                    {submodule.temples_permision}
                  </TableCell>

                  <TableCell>
                    <span
                      className={
                        submodule.status === "Active"
                          ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                          : "rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                      }
                    >
                      {submodule.status}

                    </span>
                    {/* <NavLink to="/organizations/details">
                           Details
                        </NavLink>/
                        <NavLink to="/organizations/edit">
                           edit
                        </NavLink> */}
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* GRID VIEW */}
      {view === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {currentSubModules.map((submodule, index) => (
            <div
              key={submodule.id}
              className="rounded-lg border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >

              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    #{startIndex + index + 1}
                  </p>

                  <h3 className="mt-1 truncate font-semibold">
                    {submodule.name}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {submodule.code}
                  </p>
                </div>

                <span
                  className={
                    submodule.status === "Active"
                      ? "shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                      : "shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                  }
                >
                  {submodule.status}
                </span>

              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-md bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    Temples
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {submodule.temples_permision}
                  </p>
                </div>

                <div className="rounded-md bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    Users
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {submodule.users_permision}
                  </p>
                </div>

              </div>

              {/* Details */}
              <div className="mt-4 space-y-2 text-sm">

                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    City
                  </span>

                  <span className="font-medium">
                    {submodule.org_permision}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">
                    Email
                  </span>

                  <span className="truncate font-medium">
                    {submodule.super_permision}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    Phone
                  </span>

                  <span className="font-medium">
                    {submodule.temples_permision}
                  </span>
                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">

        <div className="text-sm text-muted-foreground">
          Showing{" "}
          {startIndex + 1}{" "}
          to{" "}
          {Math.min(endIndex, submodule.length)}{" "}
          of{" "}
          {submodule.length} submodules
        </div>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>

            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault()

                  if (currentPage > 1) {
                    setCurrentPage((page) => page - 1)
                  }
                }}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from(
              { length: totalPages },
              (_, index) => {
                const page = index + 1

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(event) => {
                        event.preventDefault()
                        handlePageChange(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              },
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault()

                  if (currentPage < totalPages) {
                    setCurrentPage((page) => page + 1)
                  }
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>

      </div>

    </div>
  )
}

