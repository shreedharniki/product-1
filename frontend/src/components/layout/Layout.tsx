




// import type { ReactNode } from "react"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
 import { Outlet } from "react-router-dom"

// interface LayoutProps {
//   children: ReactNode
// }

// export default function Layout({ children }: LayoutProps) {
 export default function Layout() {
  return (
    <SidebarProvider>

      {/* SIDEBAR */}
      <AppSidebar />

      {/* MAIN */}
      <SidebarInset>

        {/* HEADER */}
        <Header />

        {/* PAGE */}
        <main className="flex-1 bg-muted/30 p-4 md:p-6">
          {/* {children} */}
           <Outlet />
           
        </main>

        {/* FOOTER */}
        <Footer />

      </SidebarInset>

    </SidebarProvider>
  )
}

