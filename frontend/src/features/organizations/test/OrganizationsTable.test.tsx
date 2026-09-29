
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react"

import userEvent from "@testing-library/user-event"

import {
  BrowserRouter,
} from "react-router-dom"

import {
  Provider,
} from "react-redux"

import "@testing-library/jest-dom"

import {
  store,
} from "@/app/store"

import OrganizationsTable from "../component/OrganizationsTable"


/* =========================================================
   MOCK ORGANIZATIONS
========================================================= */

const mockOrganizations = Array.from(
  { length: 40 },
  (_, index) => {
    const number = index + 1

    return {
      id: number,

      org_name: `Organization ${number}`,

      org_legal_name:
        `Organization ${number} Legal Name`,

      org_gst_number:
        `GST${String(number).padStart(4, "0")}`,

      org_registration_number:
        `REG${String(number).padStart(4, "0")}`,

      org_email:
        `admin${number}@example.com`,

      org_phone:
        `+91 987654${String(number).padStart(4, "0")}`,

      org_address_line1:
        `${number}, Main Street`,

      org_city:
        number % 2 === 0
          ? "Bengaluru"
          : "Pune",

      org_status:
        number % 2 === 0
          ? "inactive"
          : "active",

      created_at:
        "2026-01-15T10:00:00.000Z",
    }
  },
)


/* =========================================================
   SPECIAL TEST DATA
========================================================= */

mockOrganizations[0] = {
  id: 1,

  org_name:
    "Shree Ganesh Temple Trust",

  org_legal_name:
    "Shree Ganesh Temple Trust Legal Name",

  org_gst_number:
    "GST0001",

  org_registration_number:
    "SGT001",

  org_email:
    "admin@ganeshtemple.com",

  org_phone:
    "+91 9876543210",

  org_address_line1:
    "Pune Main Road",

  org_city:
    "Pune",

  org_status:
    "active",

  created_at:
    "2026-01-15T10:00:00.000Z",
}


mockOrganizations[1] = {
  id: 2,

  org_name:
    "Shree Lakshmi Narayan Trust",

  org_legal_name:
    "Shree Lakshmi Narayan Trust Legal Name",

  org_gst_number:
    "GST0002",

  org_registration_number:
    "LNT002",

  org_email:
    "admin@lakshmitrust.com",

  org_phone:
    "+91 9876543211",

  org_address_line1:
    "Temple Road",

  org_city:
    "Bengaluru",

  org_status:
    "inactive",

  created_at:
    "2026-01-15T10:00:00.000Z",
}


mockOrganizations[11] = {
  id: 12,

  org_name:
    "Shree Venkateshwara Trust",

  org_legal_name:
    "Shree Venkateshwara Trust Legal Name",

  org_gst_number:
    "GST0012",

  org_registration_number:
    "SVT012",

  org_email:
    "admin@venkateshwaratrust.com",

  org_phone:
    "+91 9876543222",

  org_address_line1:
    "Temple Main Road",

  org_city:
    "Bengaluru",

  org_status:
    "active",

  created_at:
    "2026-01-15T10:00:00.000Z",
}


mockOrganizations[12] = {
  id: 13,

  org_name:
    "Shree Balaji Temple Trust",

  org_legal_name:
    "Shree Balaji Temple Trust Legal Name",

  org_gst_number:
    "GST0013",

  org_registration_number:
    "SBT013",

  org_email:
    "admin@balajitrust.com",

  org_phone:
    "+91 9876543223",

  org_address_line1:
    "Balaji Temple Road",

  org_city:
    "Pune",

  org_status:
    "inactive",

  created_at:
    "2026-01-15T10:00:00.000Z",
}


/* =========================================================
   MOCK SERVICE
   IMPORTANT:
   DO NOT MOCK organizationThunks.
   The Redux slice needs thunk.pending/fulfilled/rejected.
========================================================= */

vi.mock(
  "../services/organizationService",
  () => ({
    organizationService: {
      getOrganizations:
        vi.fn(
          async () => ({
            success: true,

            message:
              "Organizations fetched successfully",

            data: mockOrganizations,

            organizations:
              mockOrganizations,

            total:
              mockOrganizations.length,
          }),
        ),

      getOrganizationById:
        vi.fn(),

      createOrganization:
        vi.fn(),

      updateOrganization:
        vi.fn(),

      updateOrganizationSubscription:
        vi.fn(),

      deleteOrganization:
        vi.fn(
          async () => undefined,
        ),
    },
  }),
)


/* =========================================================
   HELPERS
========================================================= */

const renderComponent = () => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <OrganizationsTable />
      </BrowserRouter>
    </Provider>,
  )
}


const waitForOrganizations = async () => {
  await waitFor(
    () => {
      expect(
        screen.queryByText(
          "Loading organizations...",
        ),
      ).not.toBeInTheDocument()
    },
    {
      timeout: 3000,
    },
  )
}


/* =========================================================
   TESTS
========================================================= */

describe(
  "OrganizationsTable",
  () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })


    /* =====================================================
       BASIC RENDER
    ===================================================== */

    it(
      "renders Add Organization button",
      async () => {
        renderComponent()

        await waitForOrganizations()

        expect(
          screen.getByRole(
            "button",
            {
              name: /add organization/i,
            },
          ),
        ).toBeInTheDocument()
      },
    )


    /* =====================================================
       LIST VIEW
    ===================================================== */

    it(
      "renders organization table in list view",
      async () => {
        renderComponent()

        await waitForOrganizations()

        expect(
          screen.getByText("Sl.no"),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Organization Name",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Organization legal Name",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "GST Number",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Oregistration Number",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Organization Email",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Organization Phone",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Full Address",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            'Created date ("customer since")',
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Status",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Actions",
          ),
        ).toBeInTheDocument()
      },
    )


    /* =====================================================
       PAGINATION COUNT
    ===================================================== */

    it(
      "shows first page with 10 organizations",
      async () => {
        renderComponent()

        await waitForOrganizations()

        expect(
          screen.getByText(
            "Showing 1 to 10 of 40 organizations",
          ),
        ).toBeInTheDocument()
      },
    )


    /* =====================================================
       FIRST PAGE DATA
    ===================================================== */

    it(
      "shows first page organizations",
      async () => {
        renderComponent()

        await waitForOrganizations()

        expect(
          screen.getByText(
            "Shree Ganesh Temple Trust",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Shree Lakshmi Narayan Trust",
          ),
        ).toBeInTheDocument()

        expect(
          screen.queryByText(
            "Shree Venkateshwara Trust",
          ),
        ).not.toBeInTheDocument()

        expect(
          screen.queryByText(
            "Shree Balaji Temple Trust",
          ),
        ).not.toBeInTheDocument()
      },
    )


    /* =====================================================
       ORGANIZATION DETAILS
    ===================================================== */

    it(
      "renders organization details",
      async () => {
        renderComponent()

        await waitForOrganizations()

        expect(
          screen.getByText(
            "Shree Ganesh Temple Trust Legal Name",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "GST0001",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "SGT001",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "admin@ganeshtemple.com",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "+91 9876543210",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Pune Main Road",
          ),
        ).toBeInTheDocument()
      },
    )


    /* =====================================================
       STATUS
    ===================================================== */

    it(
      "renders organization status",
      async () => {
        renderComponent()

        await waitForOrganizations()

        expect(
          screen.getByText(
            "Active",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Inactive",
          ),
        ).toBeInTheDocument()
      },
    )


    /* =====================================================
       NEXT PAGE
    ===================================================== */

    it(
      "moves to next page",
      async () => {
        const user =
          userEvent.setup()

        renderComponent()

        await waitForOrganizations()

        const nextButton =
          screen.getByRole(
            "link",
            {
              name: /next/i,
            },
          )

        await user.click(
          nextButton,
        )

        await waitFor(
          () => {
            expect(
              screen.getByText(
                "Showing 11 to 20 of 40 organizations",
              ),
            ).toBeInTheDocument()
          },
        )

        expect(
          screen.getByText(
            "Shree Venkateshwara Trust",
          ),
        ).toBeInTheDocument()

        expect(
          screen.queryByText(
            "Shree Ganesh Temple Trust",
          ),
        ).not.toBeInTheDocument()
      },
    )


    /* =====================================================
       PREVIOUS PAGE
    ===================================================== */

    it(
      "moves back to previous page",
      async () => {
        const user =
          userEvent.setup()

        renderComponent()

        await waitForOrganizations()

        await user.click(
          screen.getByRole(
            "link",
            {
              name: /next/i,
            },
          ),
        )

        await waitFor(
          () => {
            expect(
              screen.getByText(
                "Showing 11 to 20 of 40 organizations",
              ),
            ).toBeInTheDocument()
          },
        )

        await user.click(
          screen.getByRole(
            "link",
            {
              name: /previous/i,
            },
          ),
        )

        await waitFor(
          () => {
            expect(
              screen.getByText(
                "Showing 1 to 10 of 40 organizations",
              ),
            ).toBeInTheDocument()
          },
        )

        expect(
          screen.getByText(
            "Shree Ganesh Temple Trust",
          ),
        ).toBeInTheDocument()
      },
    )


    /* =====================================================
       DIRECT PAGE 2
       IMPORTANT:
       Numbered pagination items are queried as <a>
       instead of assuming role="link".
    ===================================================== */

    it(
      "moves directly to page 2",
      async () => {
        const user =
          userEvent.setup()

        renderComponent()

        await waitForOrganizations()

        const pageTwo =
          screen.getByText(
            "2",
            {
              selector: "a",
            },
          )

        await user.click(
          pageTwo,
        )

        await waitFor(
          () => {
            expect(
              screen.getByText(
                "Showing 11 to 20 of 40 organizations",
              ),
            ).toBeInTheDocument()
          },
        )

        expect(
          screen.getByText(
            "Shree Venkateshwara Trust",
          ),
        ).toBeInTheDocument()
      },
    )


    /* =====================================================
       PREVIOUS DISABLED ON FIRST PAGE
    ===================================================== */

    it(
      "disables previous pagination on first page",
      async () => {
        renderComponent()

        await waitForOrganizations()

        const previousButton =
          screen.getByRole(
            "link",
            {
              name: /previous/i,
            },
          )

        expect(
          previousButton,
        ).toHaveAttribute(
          "aria-disabled",
          "true",
        )
      },
    )


    /* =====================================================
       LIST / GRID TOGGLE
    ===================================================== */

    it(
      "renders list and grid view buttons",
      async () => {
        renderComponent()

        await waitForOrganizations()

        expect(
          screen.getByTitle(
            "List View",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByTitle(
            "Grid View",
          ),
        ).toBeInTheDocument()
      },
    )


    /* =====================================================
       GRID VIEW
    ===================================================== */

    it(
      "switches to grid view",
      async () => {
        const user =
          userEvent.setup()

        renderComponent()

        await waitForOrganizations()

        await user.click(
          screen.getByTitle(
            "Grid View",
          ),
        )

        expect(
          screen.getByText(
            "Shree Ganesh Temple Trust",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "Pune",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "admin@ganeshtemple.com",
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "+91 9876543210",
          ),
        ).toBeInTheDocument()
      },
    )


    /* =====================================================
       CREATED DATE
    ===================================================== */

    it(
      "formats created date correctly",
      async () => {
        renderComponent()

        await waitForOrganizations()

        expect(
          screen.getAllByText(
            "15 Jan 2026",
          ).length,
        ).toBeGreaterThan(0)
      },
    )


    /* =====================================================
       VIEW BUTTONS
    ===================================================== */

    it(
      "renders 10 view buttons on first page",
      async () => {
        renderComponent()

        await waitForOrganizations()

        const viewButtons =
          screen.getAllByTitle(
            "View",
          )

        expect(
          viewButtons,
        ).toHaveLength(10)
      },
    )


    /* =====================================================
       DELETE BUTTONS
    ===================================================== */

    it(
      "renders 10 delete buttons on first page",
      async () => {
        renderComponent()

        await waitForOrganizations()

        const deleteButtons =
          screen.getAllByTitle(
            "Delete",
          )

        expect(
          deleteButtons,
        ).toHaveLength(10)
      },
    )


    /* =====================================================
       FOUR PAGINATION PAGES
    ===================================================== */

    it(
      "renders four pagination pages",
      async () => {
        renderComponent()

        await waitForOrganizations()

        expect(
          screen.getByText(
            "1",
            {
              selector: "a",
            },
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "2",
            {
              selector: "a",
            },
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "3",
            {
              selector: "a",
            },
          ),
        ).toBeInTheDocument()

        expect(
          screen.getByText(
            "4",
            {
              selector: "a",
            },
          ),
        ).toBeInTheDocument()
      },
    )


    /* =====================================================
       LAST PAGE
    ===================================================== */

    it(
      "moves to last page",
      async () => {
        const user =
          userEvent.setup()

        renderComponent()

        await waitForOrganizations()

        await user.click(
          screen.getByText(
            "4",
            {
              selector: "a",
            },
          ),
        )

        await waitFor(
          () => {
            expect(
              screen.getByText(
                "Showing 31 to 40 of 40 organizations",
              ),
            ).toBeInTheDocument()
          },
        )

        expect(
          screen.getByText(
            "Organization 40",
          ),
        ).toBeInTheDocument()
      },
    )
  },
)
