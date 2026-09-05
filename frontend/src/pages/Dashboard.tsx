


import {useState,useEffect} from 'react'
// import { useAuth } from "./auth/useAuth"
import SuperAdminDashboard from "@/features/dashboards/pages/SuperAdminDashboard"
// import TempleAdminDashboard from "../features/dashboards/pages/TempleAdminDashboard"
// import UserDashboard from "../features/dashboards/pages/UserDashboard"
// import OrgAdminDashboard from "../features/dashboards/pages/OrgAdminDashboard"
import DashboardSkeleton from "@/features/dashboards/components/DashboardSkeleton"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <>
      <SuperAdminDashboard />

      {/* 
      <OrgAdminDashboard />

      <TempleAdminDashboard />

      <UserDashboard />
      */}
    </>
  )
}




