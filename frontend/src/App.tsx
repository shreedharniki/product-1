

// import { Route, Routes } from "react-router-dom"
// import { lazy, Suspense } from "react"
// import Layout from "@/components/layout/Layout"
// import Dashboard from "@/pages/Dashboard";
// import Organizations from "@/pages/Organizations"
//  import OrganizationsTable from "@/features/organizations/pages/Organizations"
//   import AddOrganizations from "@/features/organizations/pages/AddOrganization"
//    import EditOrganizations from "@/features/organizations/pages/EditOrganizations"
//   import ViewOrganizations from "@/features/organizations/pages/ViewOrganizations"
//  import DashboardSkeleton from "@/features/dashboards/components/DashboardSkeleton"


// function App() {
//   return (
//     <>
//     <Routes>
//      <Route element={<Layout />}>
//       <Route path="/dashboard" element={<Dashboard />} />
      
//         <Route path="/organizations" element={<Organizations />}>
            
         
//             <Route
//               index
//               element={<OrganizationsTable />}
//             />

           
//             <Route
//               path="add"
//               element={<AddOrganizations />}
//             />

           
//           <Route
//               path="details"
//               element={<ViewOrganizations />}
//             />
            

          
//             <Route
//               path="edit"
//               element={<EditOrganizations />}
//             /> 
           
//           </Route> 

//         </Route>
      
//     </Routes>
     
//       </>
//   )
// }

// export default App

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
          </Route>

        </Route>
      </Routes>
    </Suspense>
  )
}

export default App