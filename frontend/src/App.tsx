

import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"

import Layout from "@/components/layout/Layout"
import DashboardSkeleton from "@/features/dashboards/components/DashboardSkeleton"

// Lazy-loaded pages
const Dashboard = lazy(() => import("@/pages/Dashboard"))

const Organizations = lazy(
  () => import("@/pages/Organizations")
)

const OrganizationsTable = lazy(
  () => import("@/features/organizations/pages/Organizations")
)

const AddOrganizations = lazy(
  () => import("@/features/organizations/pages/AddOrganization")
)

const EditOrganizations = lazy(
  () => import("@/features/organizations/pages/EditOrganizations")
)

const ViewOrganizations = lazy(
  () => import("@/features/organizations/pages/ViewOrganizations")
)
const Modules = lazy(
  () => import("@/pages/Modules")
)

const ModulesTable = lazy(
  () => import("@/features/modules/pages/Modules")
)
const AddModules = lazy(
  () => import("@/features/modules/pages/AddModule")
)

const EditModule = lazy(
  () => import("@/features/modules/pages/EditModule")
)

const ViewModule = lazy(
  () => import("@/features/modules/pages/ViewModule")
)
const SubModules = lazy(
  () => import("@/pages/Modules")
)


const SubModuleTable = lazy(
  () => import("@/features/sub_modules/components/SubModuleTable")
)

const AddSubModule = lazy(
  () =>import("@/features/sub_modules/pages/AddSubModule")
)
const EditSubModule = lazy(
  () => import ("@/features/sub_modules/pages/EditSubModule")
  )
function App() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Routes>
        <Route element={<Layout />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
         <Route
            path="/"
            element={<Dashboard />}
          />
          {/* Organizations */}
          <Route
            path="/organizations"
            element={<Organizations />}
          >
            {/* /organizations */}
            <Route
              index
              element={<OrganizationsTable />}
            />

            {/* /organizations/add */}
            <Route
              path="add"
              element={<AddOrganizations />}
            />

            {/* /organizations/details */}
            <Route
              path="details"
              element={<ViewOrganizations />}
            />

            {/* /organizations/edit */}
            <Route
              path="edit"
              element={<EditOrganizations />}
            />

            {/* /modules */}
            
          </Route>


          <Route
            path="/modules"
            element={<Modules />}
          >
            {/* /modules */}
            <Route
              index
              element={<ModulesTable />}
            />

            {/* /modules/add */}
            <Route
              path="add"
              element={<AddModules />}
            />
            {/* /modules/edit */}
            <Route
              path="/modules/edit/:id"
              element={<EditModule />}
            />

            <Route
              path="/modules/view/:id"
              element={<ViewModule />}
            />
          
          </Route>

          {/* Sub Modules */}
          <Route
            path="/submodule"
            element={<SubModules />}
          >
            {/* /modules/sub */}
            <Route
              index
              element={<SubModuleTable />}
            />
             <Route
              path="add"
              element={<AddSubModule />}
            />
            <Route 
            path="/submodule/edit/:id"
            element={<EditSubModule/>}
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App