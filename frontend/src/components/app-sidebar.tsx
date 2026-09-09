// import { NavLink } from "react-router-dom";
// import {
//   BarChart3,
//   Bell,
//   Building2,
//   CalendarCheck,
//   CreditCard,
//   HandCoins,
//   LayoutDashboard,
//   Landmark,
//   Settings,
//   ShieldCheck,
//   Sparkles,
//   Users,
//   FileText,
//   Package,
// } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarRail,
// } from "@/components/ui/sidebar"

// const mainMenu = [
//   {
//     title: "Dashboard",
//     url: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "Organizations",
//     url: "/Organizations",
//     icon: Building2,
//   },
// //  {
// //     title: "Modules Management",
// //     url: "/modules",
// //     icon: Package,
// //   },

// //   {
// //     title: "Sub Module",
// //     url: "/submodule",
// //     icon: Building2,
// //   },

// {
//   title: "Modules Management",
//   url: "/modules",
//   icon: Package,

//   items: [
//     {
//       title: "Modules",
//       url: "/modules",
//     },
//     {
//       title: "Sub Modules",
//       url: "/submodule",
//     },
//   ],
// },
//   {
//     title: "Temples",
//     url: "/temples",
//     icon: Landmark,
//   },
//   {
//     title: "Users",
//     url: "/users",
//     icon: Users,
//   },
//   {
//     title: "Roles & Permissions",
//     url: "/roles",
//     icon: ShieldCheck,
//   },
//   {
//     title: "Reports",
//     url: "/reports",
//     icon: FileText,
//   },
// ]

// const templeMenu = [
//   {
//     title: "Deities",
//     url: "/deities",
//     icon: Sparkles,
//   },
//   {
//     title: "Sevas",
//     url: "/sevas",
//     icon: CalendarCheck,
//   },
//   {
//     title: "Seva Bookings",
//     url: "/seva-bookings",
//     icon: CalendarCheck,
//   },
//   {
//     title: "Donations",
//     url: "/donations",
//     icon: HandCoins,
//   },
//   {
//     title: "Payments",
//     url: "/payments",
//     icon: CreditCard,
//   },
// ]

// const systemMenu = [
//   {
//     title: "Reports",
//     url: "/reports",
//     icon: BarChart3,
//   },
//   {
//     title: "Notifications",
//     url: "/notifications",
//     icon: Bell,
//   },
//   {
//     title: "Settings",
//     url: "/settings",
//     icon: Settings,
//   },
  
// ]


// function MenuItems({
//   items,
// }: {
//   items: typeof mainMenu
// }) {
//   return (
//     // <SidebarMenu>
//     //   {items.map((item) => (
//     //     <SidebarMenuItem key={item.title}>
//     //       <SidebarMenuButton
//     //         tooltip={item.title}
//     //         render={
//     //         <NavLink href={item.url} />
          
          
//     //       }
//     //       >
//     //         <item.icon />
//     //         <span>{item.title}</span>
//     //       </SidebarMenuButton>
//     //     </SidebarMenuItem>
//     //   ))}
//     // </SidebarMenu>
//     <SidebarMenu> 
//       {items.map((item) => (
//          <SidebarMenuItem key={item.title}>
//            <SidebarMenuButton tooltip={item.title}
//             render={<NavLink to={item.url} />} >
//                <item.icon /> <span>{item.title}
//                 </span> 
//                 </SidebarMenuButton> 
//                 </SidebarMenuItem> ))}
//                  </SidebarMenu>
//   )
// }


// export function AppSidebar() {
//   return (
//      <>
//     <Sidebar collapsible="icon">

//       {/* ================= HEADER ================= */}
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton size="lg">
//               <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
//                 <Landmark className="size-4" />
//               </div>

//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-semibold">
//                   TMS SOFTWARE
//                 </span>

//                 <span className="truncate text-xs text-muted-foreground">
//                   Temple Management
//                 </span>
//               </div>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>

//       {/* ================= CONTENT ================= */}
//       <SidebarContent>

//         {/* MAIN */}
//         <SidebarGroup>
//           <SidebarGroupLabel>
//             Main
//           </SidebarGroupLabel>

//           <SidebarGroupContent>
//             <MenuItems items={mainMenu} />
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* TEMPLE MANAGEMENT */}
//         <SidebarGroup>
//           <SidebarGroupLabel>
//             Temple Management
//           </SidebarGroupLabel>

//           <SidebarGroupContent>
//             <MenuItems items={templeMenu} />
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* SYSTEM */}
//         <SidebarGroup>
//           <SidebarGroupLabel>
//             System
//           </SidebarGroupLabel>

//           <SidebarGroupContent>
//             <MenuItems items={systemMenu} />
//           </SidebarGroupContent>
//         </SidebarGroup>

//       </SidebarContent>

//       {/* ================= FOOTER ================= */}
//       <SidebarFooter>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton>
//               {/* <Switch /> */}
//               <Settings />
//               <span>Admin Name 
//               </span>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>

//       {/* COLLAPSE RAIL */}
//       <SidebarRail />

//     </Sidebar>
    
//     </>
//   )
// }


import { NavLink } from "react-router-dom"

import {
  BarChart3,
  Bell,
  Building2,
  CalendarCheck,
  CreditCard,
  HandCoins,
  LayoutDashboard,
  Landmark,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  FileText,
  Package,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

/* =========================================================
   TYPES
========================================================= */

interface SubMenuItem {
  title: string
  url: string
}

interface MenuItem {
  title: string
  url: string
  icon: React.ElementType
  items?: SubMenuItem[]
}

/* =========================================================
   MAIN MENU
========================================================= */

const mainMenu: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Organizations",
    url: "/Organizations",
    icon: Building2,
  },

  {
    title: "Modules Management",
    url: "/modules",
    icon: Package,

    items: [
      {
        title: "Modules",
        url: "/modules",
      },
      {
        title: "Sub Modules",
        url: "/submodule",
      },
    ],
  },

  {
    title: "Temples",
    url: "/temples",
    icon: Landmark,
  },

  {
    title: "Users",
    url: "/users",
    icon: Users,
  },

  {
    title: "Roles & Permissions",
    url: "/roles",
    icon: ShieldCheck,
  },

  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
]

/* =========================================================
   TEMPLE MANAGEMENT MENU
========================================================= */

const templeMenu: MenuItem[] = [
  {
    title: "Deities",
    url: "/deities",
    icon: Sparkles,
  },

  {
    title: "Sevas",
    url: "/sevas",
    icon: CalendarCheck,
  },

  {
    title: "Seva Bookings",
    url: "/seva-bookings",
    icon: CalendarCheck,
  },

  {
    title: "Donations",
    url: "/donations",
    icon: HandCoins,
  },

  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
]

/* =========================================================
   SYSTEM MENU
========================================================= */

const systemMenu: MenuItem[] = [
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },

  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },

  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

/* =========================================================
   MENU ITEMS COMPONENT
========================================================= */

function MenuItems({
  items,
}: {
  items: MenuItem[]
}) {
  return (
    <SidebarMenu>
      {items.map((item) => {
        const hasSubMenu =
          item.items &&
          item.items.length > 0

        return (
          <SidebarMenuItem key={item.title}>
            {/* =================================================
                PARENT MENU
            ================================================= */}

            <SidebarMenuButton
              tooltip={item.title}
              render={
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                />
              }
            >
              <item.icon />

              <span>{item.title}</span>
            </SidebarMenuButton>

            {/* =================================================
                SUB MENU
            ================================================= */}

            {hasSubMenu && (
              <SidebarMenuSub>
                {item.items?.map(
                  (subItem) => (
                    <SidebarMenuSubItem
                      key={subItem.title}
                    >
                      <SidebarMenuSubButton
                        render={
                          <NavLink
                            to={subItem.url}
                            className={({ isActive }) =>
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : ""
                            }
                          />
                        }
                      >
                        <span>
                          {subItem.title}
                        </span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ),
                )}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

/* =========================================================
   APP SIDEBAR
========================================================= */

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Landmark className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  TMS SOFTWARE
                </span>

                <span className="truncate text-xs text-muted-foreground">
                  Temple Management
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <SidebarContent>
        {/* ===================================================
            MAIN
        =================================================== */}

        <SidebarGroup>
          <SidebarGroupLabel>
            Main
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <MenuItems items={mainMenu} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ===================================================
            TEMPLE MANAGEMENT
        =================================================== */}

        <SidebarGroup>
          <SidebarGroupLabel>
            Temple Management
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <MenuItems items={templeMenu} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ===================================================
            SYSTEM
        =================================================== */}

        <SidebarGroup>
          <SidebarGroupLabel>
            System
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <MenuItems items={systemMenu} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Admin Name"
            >
              <Settings />

              <span>
                Admin Name
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* =====================================================
          COLLAPSE RAIL
      ===================================================== */}

      <SidebarRail />
    </Sidebar>
  )
}
