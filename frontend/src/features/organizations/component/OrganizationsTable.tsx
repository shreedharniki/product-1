
import { useState } from "react"
import { List, LayoutGrid } from "lucide-react"
import {NavLink} from "react-router-dom"
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

const organizations = [
  {
    id: "ORG001",
    name: "Shree Ganesh Temple Trust",
    code: "SGT001",
    email: "admin@ganeshtemple.com",
    phone: "+91 9876543210",
    city: "Pune",
    status: "Active",
    users:20,
    temples:5
  },
  {
    id: "ORG002",
    name: "Shree Krishna Mandir Trust",
    code: "SKM002",
    email: "admin@krishnamandir.com",
    phone: "+91 9876543211",
    city: "Mumbai",
    status: "Active",
     users:10,
    temples:2
  },
  {
    id: "ORG003",
    name: "Shree Ram Temple Trust",
    code: "SRT003",
    email: "admin@ramtemple.com",
    phone: "+91 9876543212",
    city: "Nashik",
    status: "Inactive",
     users:30,
    temples:3
  },
  {
    id: "ORG004",
    name: "Shree Hanuman Seva Trust",
    code: "SHT004",
    email: "admin@hanumanseva.com",
    phone: "+91 9876543213",
    city: "Nagpur",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG005",
    name: "Shree Vitthal Rukmini Trust",
    code: "SVR005",
    email: "admin@vitthalrukmini.com",
    phone: "+91 9876543214",
    city: "Pandharpur",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG006",
    name: "Shree Mahadev Temple Trust",
    code: "SMT006",
    email: "admin@mahadevtemple.com",
    phone: "+91 9876543215",
    city: "Kolhapur",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG007",
    name: "Shree Durga Mata Trust",
    code: "SDM007",
    email: "admin@durgamata.com",
    phone: "+91 9876543216",
    city: "Aurangabad",
    status: "Inactive",
     users:30,
    temples:3
  },
  {
    id: "ORG008",
    name: "Shree Sai Baba Trust",
    code: "SSB008",
    email: "admin@saibaba.com",
    phone: "+91 9876543217",
    city: "Shirdi",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG009",
    name: "Shree Swaminarayan Trust",
    code: "SWT009",
    email: "admin@swaminarayan.com",
    phone: "+91 9876543218",
    city: "Ahmedabad",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG010",
    name: "Shree Jagannath Temple Trust",
    code: "SJT010",
    email: "admin@jagannathtemple.com",
    phone: "+91 9876543219",
    city: "Puri",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG011",
    name: "Shree Lakshmi Narayan Trust",
    code: "SLN011",
    email: "admin@lakshminarayan.com",
    phone: "+91 9876543220",
    city: "Delhi",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG012",
    name: "Shree Venkateshwara Trust",
    code: "SVT012",
    email: "admin@venkateshwara.com",
    phone: "+91 9876543221",
    city: "Tirupati",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG013",
    name: "Shree Balaji Temple Trust",
    code: "SBT013",
    email: "admin@balajitemple.com",
    phone: "+91 9876543222",
    city: "Jaipur",
    status: "Inactive",
     users:30,
    temples:3
  },
  {
    id: "ORG014",
    name: "Shree Somnath Temple Trust",
    code: "SST014",
    email: "admin@somnath.com",
    phone: "+91 9876543223",
    city: "Somnath",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG015",
    name: "Shree Kedarnath Temple Trust",
    code: "SKT015",
    email: "admin@kedarnath.com",
    phone: "+91 9876543224",
    city: "Kedarnath",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG016",
    name: "Shree Badrinath Temple Trust",
    code: "SBT016",
    email: "admin@badrinath.com",
    phone: "+91 9876543225",
    city: "Badrinath",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG017",
    name: "Shree Trimbakeshwar Trust",
    code: "STT017",
    email: "admin@trimbakeshwar.com",
    phone: "+91 9876543226",
    city: "Nashik",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG018",
    name: "Shree Grishneshwar Trust",
    code: "SGT018",
    email: "admin@grishneshwar.com",
    phone: "+91 9876543227",
    city: "Ellora",
    status: "Inactive",
     users:30,
    temples:3
  },
  {
    id: "ORG019",
    name: "Shree Bhimashankar Trust",
    code: "SBT019",
    email: "admin@bhimashankar.com",
    phone: "+91 9876543228",
    city: "Pune",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG020",
    name: "Shree Kashi Vishwanath Trust",
    code: "SKV020",
    email: "admin@kashivishwanath.com",
    phone: "+91 9876543229",
    city: "Varanasi",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG021",
    name: "Shree Meenakshi Temple Trust",
    code: "SMT021",
    email: "admin@meenakshi.com",
    phone: "+91 9876543230",
    city: "Madurai",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG022",
    name: "Shree Rameshwaram Trust",
    code: "SRT022",
    email: "admin@rameshwaram.com",
    phone: "+91 9876543231",
    city: "Rameshwaram",
    status: "Inactive",
     users:30,
    temples:3
  },
  {
    id: "ORG023",
    name: "Shree Murugan Temple Trust",
    code: "SMT023",
    email: "admin@murugan.com",
    phone: "+91 9876543232",
    city: "Chennai",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG024",
    name: "Shree Ayyappa Seva Trust",
    code: "SAT024",
    email: "admin@ayyappa.com",
    phone: "+91 9876543233",
    city: "Kochi",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG025",
    name: "Shree Chamundeshwari Trust",
    code: "SCT025",
    email: "admin@chamundeshwari.com",
    phone: "+91 9876543234",
    city: "Mysore",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG026",
    name: "Shree Mookambika Trust",
    code: "SMT026",
    email: "admin@mookambika.com",
    phone: "+91 9876543235",
    city: "Kollur",
    status: "Inactive",
     users:30,
    temples:3
  },
  {
    id: "ORG027",
    name: "Shree Udupi Krishna Trust",
    code: "SUK027",
    email: "admin@udupikrishna.com",
    phone: "+91 9876543236",
    city: "Udupi",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG028",
    name: "Shree Gokarna Mahabaleshwar Trust",
    code: "SGM028",
    email: "admin@gokarna.com",
    phone: "+91 9876543237",
    city: "Gokarna",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG029",
    name: "Shree Tulja Bhavani Trust",
    code: "STB029",
    email: "admin@tuljabhavani.com",
    phone: "+91 9876543238",
    city: "Tuljapur",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG030",
    name: "Shree Mahalaxmi Temple Trust",
    code: "SMT030",
    email: "admin@mahalaxmi.com",
    phone: "+91 9876543239",
    city: "Kolhapur",
    status: "Inactive",
     users:30,
    temples:3
  },
  {
    id: "ORG031",
    name: "Shree Khandoba Temple Trust",
    code: "SKT031",
    email: "admin@khandoba.com",
    phone: "+91 9876543240",
    city: "Jejuri",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG032",
    name: "Shree Ekvira Devi Trust",
    code: "SED032",
    email: "admin@ekvira.com",
    phone: "+91 9876543241",
    city: "Lonavala",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG033",
    name: "Shree Jyotiba Temple Trust",
    code: "SJT033",
    email: "admin@jyotiba.com",
    phone: "+91 9876543242",
    city: "Kolhapur",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG034",
    name: "Shree Datta Mandir Trust",
    code: "SDM034",
    email: "admin@datta.com",
    phone: "+91 9876543243",
    city: "Narsobawadi",
    status: "Inactive",
     users:30,
    temples:3
  },
  {
    id: "ORG035",
    name: "Shree Narasimha Temple Trust",
    code: "SNT035",
    email: "admin@narasimha.com",
    phone: "+91 9876543244",
    city: "Hyderabad",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG036",
    name: "Shree Radha Krishna Trust",
    code: "SRK036",
    email: "admin@radhakrishna.com",
    phone: "+91 9876543245",
    city: "Vrindavan",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG037",
    name: "Shree Sai Seva Trust",
    code: "SST037",
    email: "admin@saiseva.com",
    phone: "+91 9876543246",
    city: "Pune",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG038",
    name: "Shree Gurudev Temple Trust",
    code: "SGT038",
    email: "admin@gurudev.com",
    phone: "+91 9876543247",
    city: "Bengaluru",
    status: "Inactive",
     users:30,
    temples:3
  },
  {
    id: "ORG039",
    name: "Shree Suryanarayan Trust",
    code: "SST039",
    email: "admin@suryanarayan.com",
    phone: "+91 9876543248",
    city: "Nagpur",
    status: "Active",
     users:30,
    temples:3
  },
  {
    id: "ORG040",
    name: "Shree Balaji Seva Trust",
    code: "SBS040",
    email: "admin@balajiseva.com",
    phone: "+91 9876543249",
    city: "Bengaluru",
    status: "Active",
     users:30,
    temples:3
  },
]

const PAGE_SIZE = 11


export default function OrganizationsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [view, setView] = useState<"list" | "grid">("list")

  const totalPages = Math.ceil(organizations.length / PAGE_SIZE)

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE

  const currentOrganizations = organizations.slice(
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
        <div>
          <h2 className="text-lg font-semibold">
            Organizations
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage all organizations
          </p>
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
                <TableHead>Organization Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Number of temple</TableHead>
                <TableHead>Number of users</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentOrganizations.map((organization, index) => (
                <TableRow key={organization.id}>

                  <TableCell>
                    {startIndex + index + 1}
                  </TableCell>

                  <TableCell className="font-medium">
                    {organization.name}
                  </TableCell>

                  <TableCell>
                    {organization.code}
                  </TableCell>

                  <TableCell>
                    {organization.temples}
                  </TableCell>

                  <TableCell>
                    {organization.users}
                  </TableCell>

                  <TableCell>
                    {organization.email}
                  </TableCell>

                  <TableCell>
                    {organization.phone}
                  </TableCell>

                  <TableCell>
                    {organization.city}
                  </TableCell>

                  <TableCell>
                    <span
                      className={
                        organization.status === "Active"
                          ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                          : "rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                      }
                    >
                      {organization.status}

                    </span>
                    <NavLink to="/organizations/details">
                           Details
                        </NavLink>/
                        <NavLink to="/organizations/edit">
                           edit
                        </NavLink>
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

          {currentOrganizations.map((organization, index) => (
            <div
              key={organization.id}
              className="rounded-lg border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >

              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    #{startIndex + index + 1}
                  </p>

                  <h3 className="mt-1 truncate font-semibold">
                    {organization.name}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {organization.code}
                  </p>
                </div>

                <span
                  className={
                    organization.status === "Active"
                      ? "shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                      : "shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                  }
                >
                  {organization.status}
                </span>

              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-md bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    Temples
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {organization.temples}
                  </p>
                </div>

                <div className="rounded-md bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    Users
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {organization.users}
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
                    {organization.city}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">
                    Email
                  </span>

                  <span className="truncate font-medium">
                    {organization.email}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    Phone
                  </span>

                  <span className="font-medium">
                    {organization.phone}
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
          {Math.min(endIndex, organizations.length)}{" "}
          of{" "}
          {organizations.length} organizations
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

