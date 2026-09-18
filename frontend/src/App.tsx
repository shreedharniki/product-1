

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


const SubModule = lazy(
  () => import("@/features/sub_modules/pages/SubModule")
)

const AddSubModule = lazy(
  () =>import("@/features/sub_modules/pages/AddSubModule")
)
const EditSubModule = lazy(
  () => import ("@/features/sub_modules/pages/EditSubModule")
  )

  const SubscriptionPlans = lazy(
    ()=> import ("@/pages/SubscriptionPalns")
  )
    const AddSubscriptionPlans = lazy(
    ()=> import ("@/features/subscription/pages/AddSubscriptionPlans")
  )
    const SubscriptionPlan = lazy(
    ()=> import ("@/features/subscription/pages/SubscriptionPlans")
  )
   const EditSubscriptionPlans = lazy(
    ()=> import ("@/features/subscription/pages/EditSubscriptionPlans")
  )
   const ViewSubscriptionPlans = lazy(
    ()=> import ("@/features/subscription/pages/ViewSubscriptionPlans")
  )

  const SubscriptionBundle =lazy(
    ()=> import ("@/pages/SubscriptionBundle")
  )
 const SubscriptionBundles = lazy(
    ()=> import ("@/features/subscription_bundles/pages/SubscriptionBundles")
  )
const AddSubscriptionBundle = lazy(
    ()=> import ("@/features/subscription_bundles/pages/AddSubscriptionBundle")
  )
   const EditSubscriptionBundle = lazy(
    ()=> import ("@/features/subscription_bundles/pages/EditSubscriptionBundle")
  )
   const ViewSubscriptionBundle = lazy(
    ()=> import ("@/features/subscription_bundles/pages/ViewSubscriptionBundle")
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
              element={<SubModule />}
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


          <Route
            path="/subscriptionplans"
            element={<SubscriptionPlans />}
          >
           
           <Route
              index
              element={<SubscriptionPlan />}
            />
             <Route
              path="add"
              element={<AddSubscriptionPlans />}
            />
            <Route
              path="/subscriptionplans/edit/:id"
              element={<EditSubscriptionPlans />}
            />
            <Route
              path="/subscriptionplans/view/:id"
              element={<ViewSubscriptionPlans />}
            />
          </Route>
          <Route
            path="/subscriptionbundles"
            element={<SubscriptionBundle />}
          >
            <Route
              index
              element={<SubscriptionBundles />}
            />
            <Route
            path="add"
            element={<AddSubscriptionBundle/>}
           />
           <Route
              path="/subscriptionbundles/edit/:id"
              element={<EditSubscriptionBundle />}
            />
            <Route
              path="/subscriptionbundles/view/:id"
              element={<ViewSubscriptionBundle />}
            />
          </Route>

        </Route>
      </Routes>
    </Suspense>
  )
}

export default App