
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import "@testing-library/jest-dom"

import OrganizationsTable from "./OrganizationsTable"

describe("OrganizationsTable", () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <OrganizationsTable />
      </MemoryRouter>,
    )
  }

  it("renders the organizations heading", () => {
    renderComponent()

    expect(
      screen.getByRole("heading", { name: "Organizations" }),
    ).toBeInTheDocument()

    expect(
      screen.getByText("Manage all organizations"),
    ).toBeInTheDocument()
  })

  it("renders list view by default", () => {
    renderComponent()

    expect(
      screen.getByRole("columnheader", {
        name: "Organization Name",
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole("columnheader", {
        name: "Number of temple",
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole("columnheader", {
        name: "Number of users",
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText("Shree Ganesh Temple Trust"),
    ).toBeInTheDocument()
  })

  it("renders the correct number of organizations on the first page", () => {
    renderComponent()

    expect(
      screen.getByText("Showing 1 to 11 of 40 organizations"),
    ).toBeInTheDocument()

    expect(
      screen.getByText("Shree Ganesh Temple Trust"),
    ).toBeInTheDocument()

    expect(
      screen.getByText("Shree Balaji Temple Trust"),
    ).toBeInTheDocument()

    expect(
      screen.queryByText("Shree Mahadev Temple Trust"),
    ).not.toBeInTheDocument()
  })

  it("displays organization information", () => {
    renderComponent()

    expect(
      screen.getByText("Shree Ganesh Temple Trust"),
    ).toBeInTheDocument()

    expect(screen.getByText("SGT001")).toBeInTheDocument()
    expect(screen.getByText("Pune")).toBeInTheDocument()
    expect(
      screen.getByText("admin@ganeshtemple.com"),
    ).toBeInTheDocument()
    expect(screen.getByText("+91 9876543210")).toBeInTheDocument()
  })

  it("displays Active and Inactive status", () => {
    renderComponent()

    expect(screen.getAllByText("Active").length).toBeGreaterThan(0)

    expect(
      screen.getAllByText("Inactive").length,
    ).toBeGreaterThan(0)
  })

//   it("navigates to organization details", () => {
//     renderComponent()

//     const detailsLinks = screen.getAllByRole("link", {
//       name: "Details",
//     })

//     expect(detailsLinks[0]).toHaveAttribute(
//       "href",
//       "/organizations/details",
//     )
//   })

//   it("navigates to organization edit page", () => {
//     renderComponent()

//     const editLinks = screen.getAllByRole("link", {
//       name: "edit",
//     })

//     expect(editLinks[0]).toHaveAttribute(
//       "href",
//       "/organizations/edit",
//     )
//   })

  it("changes to the next page", async () => {
    const user = userEvent.setup()

    renderComponent()

    expect(
      screen.getByText("Shree Ganesh Temple Trust"),
    ).toBeInTheDocument()

    const nextButton = screen.getByRole("link", {
      name: "Next",
    })

    await user.click(nextButton)

    expect(
      screen.getByText("Showing 12 to 22 of 40 organizations"),
    ).toBeInTheDocument()

    expect(
      screen.getByText("Shree Lakshmi Narayan Trust"),
    ).toBeInTheDocument()

    expect(
      screen.queryByText("Shree Ganesh Temple Trust"),
    ).not.toBeInTheDocument()
  })

  it("changes to the previous page", async () => {
    const user = userEvent.setup()

    renderComponent()

    const nextButton = screen.getByRole("link", {
      name: "Next",
    })

    await user.click(nextButton)

    const previousButton = screen.getByRole("link", {
      name: "Previous",
    })

    await user.click(previousButton)

    expect(
      screen.getByText("Showing 1 to 11 of 40 organizations"),
    ).toBeInTheDocument()

    expect(
      screen.getByText("Shree Ganesh Temple Trust"),
    ).toBeInTheDocument()
  })

  it("changes directly to page 2", async () => {
    const user = userEvent.setup()

    renderComponent()

    const pageTwo = screen.getByRole("link", {
      name: "2",
    })

    await user.click(pageTwo)

    expect(
      screen.getByText("Showing 12 to 22 of 40 organizations"),
    ).toBeInTheDocument()

    expect(
      screen.getByText("Shree Lakshmi Narayan Trust"),
    ).toBeInTheDocument()
  })

  it("disables previous button on the first page", () => {
    renderComponent()

    const previousButton = screen.getByRole("link", {
      name: "Previous",
    })

    expect(previousButton).toHaveClass(
      "pointer-events-none",
      "opacity-50",
    )
  })

  it("switches from list view to grid view", async () => {
    const user = userEvent.setup()

    renderComponent()

    const gridButton = screen.getByRole("button", {
      name: "Grid View",
    })

    await user.click(gridButton)

    expect(
      screen.getByText("Temples"),
    ).toBeInTheDocument()

    expect(
      screen.getByText("Users"),
    ).toBeInTheDocument()

    expect(
      screen.getByText("Shree Ganesh Temple Trust"),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole("columnheader", {
        name: "Organization Name",
      }),
    ).not.toBeInTheDocument()
  })

  it("switches back from grid view to list view", async () => {
    const user = userEvent.setup()

    renderComponent()

    const gridButton = screen.getByRole("button", {
      name: "Grid View",
    })

    await user.click(gridButton)

    const listButton = screen.getByRole("button", {
      name: "List View",
    })

    await user.click(listButton)

    expect(
      screen.getByRole("columnheader", {
        name: "Organization Name",
      }),
    ).toBeInTheDocument()
  })

  it("shows organization counts in grid view", async () => {
    const user = userEvent.setup()

    renderComponent()

    await user.click(
      screen.getByRole("button", {
        name: "Grid View",
      }),
    )

    expect(screen.getByText("Temples")).toBeInTheDocument()
    expect(screen.getByText("Users")).toBeInTheDocument()

    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByText("20")).toBeInTheDocument()
  })
})

