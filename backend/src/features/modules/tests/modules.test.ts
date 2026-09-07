// import request from "supertest"
// import {
//   describe,
//   expect,
//   it,
// } from "vitest"

// import app from "../../../config/app"

// describe("Modules API - CRUD", () => {
//   let moduleId: number
// const uniqueId = Date.now()
//   const moduleData = {
//     module_code: `TEST_MODULE_${uniqueId}`,
//   module_name: `Test Module ${uniqueId}`,
//     module_type: "feature",
//     capacity_type: null,
//     consumable_type: null,
//     display_order: 999,
//     status: "active",
//   }

//   // ==========================================
//   // CREATE
//   // ==========================================

//   it("should create a module", async () => {
//     const response = await request(app)
//       .post("/api/v1/modules")
//       .send(moduleData)

//     expect(response.status).toBe(201)

//     expect(response.body.success).toBe(true)

//     expect(response.body.message).toBe(
//       "Module created successfully",
//     )

//     expect(response.body.data).toHaveProperty(
//       "id",
//     )

//     moduleId = response.body.data.id

//     expect(moduleId).toBeTypeOf("number")
//   })

//   // ==========================================
//   // READ ALL
//   // ==========================================

//   it("should get all modules", async () => {
//     const response = await request(app)
//       .get("/api/v1/modules")

//     expect(response.status).toBe(200)

//     expect(response.body.success).toBe(true)

//     expect(
//       Array.isArray(response.body.data),
//     ).toBe(true)

//     const createdModule =
//       response.body.data.find(
//         (module: {
//           id: number
//         }) => module.id === moduleId,
//       )

//     expect(createdModule).toBeDefined()
//   })

//   // ==========================================
//   // READ BY ID
//   // ==========================================

//   it("should get module by ID", async () => {
//     const response = await request(app)
//       .get(`/api/v1/modules/${moduleId}`)

//     expect(response.status).toBe(200)

//     expect(response.body.success).toBe(true)

//     expect(response.body.data).toBeDefined()

//     expect(response.body.data.id).toBe(
//       moduleId,
//     )

//     expect(
//       response.body.data.module_code,
//     ).toBe(moduleData.module_code)

//     expect(
//       response.body.data.module_name,
//     ).toBe(moduleData.module_name)
//   })

//   // ==========================================
//   // UPDATE
//   // ==========================================

//   it("should update a module", async () => {
//     const updateData = {
//       module_code: moduleData.module_code,
//       module_name: "Updated Test Module",
//       module_type: "feature",
//       capacity_type: null,
//       consumable_type: null,
//       display_order: 1000,
//       status: "inactive",
//     }

//     const response = await request(app)
//       .put(`/api/v1/modules/${moduleId}`)
//       .send(updateData)

//     expect(response.status).toBe(200)

//     expect(response.body.success).toBe(true)

//     expect(response.body.message).toBe(
//       "Module updated successfully",
//     )
//   })

//   // ==========================================
//   // VERIFY UPDATE
//   // ==========================================

//   it("should return updated module data", async () => {
//     const response = await request(app)
//       .get(`/api/v1/modules/${moduleId}`)

//     expect(response.status).toBe(200)

//     expect(
//       response.body.data.module_name,
//     ).toBe("Updated Test Module")

//     expect(
//       response.body.data.display_order,
//     ).toBe(1000)

//     expect(
//       response.body.data.status,
//     ).toBe("inactive")
//   })

//   // ==========================================
//   // SOFT DELETE
//   // ==========================================

//   it("should soft delete a module", async () => {
//     const response = await request(app)
//       .delete(`/api/v1/modules/${moduleId}`)

//     expect(response.status).toBe(200)

//     expect(response.body.success).toBe(true)

//     expect(response.body.message).toBe(
//       "Module deleted successfully",
//     )
//   })

//   // ==========================================
//   // VERIFY SOFT DELETE
//   // ==========================================

//   it("should not return soft deleted module", async () => {
//     const response = await request(app)
//       .get(`/api/v1/modules/${moduleId}`)

//     expect(response.status).toBe(404)

//     expect(response.body.success).toBe(false)

//     expect(response.body.message).toBe(
//       "Module not found",
//     )
//   })

//   // ==========================================
//   // VERIFY SOFT DELETE FROM LIST
//   // ==========================================

//   it("should exclude soft deleted module from module list", async () => {
//     const response = await request(app)
//       .get("/api/v1/modules")

//     expect(response.status).toBe(200)

//     const deletedModule =
//       response.body.data.find(
//         (module: {
//           id: number
//         }) => module.id === moduleId,
//       )

//     expect(deletedModule).toBeUndefined()
//   })

//   // ==========================================
//   // INVALID ID - GET
//   // ==========================================

//   it("should reject invalid module ID", async () => {
//     const response = await request(app)
//       .get("/api/v1/modules/abc")

//     expect(response.status).toBe(400)

//     expect(response.body.success).toBe(false)

//     expect(response.body.message).toBe(
//       "Invalid module ID",
//     )
//   })

//   // ==========================================
//   // INVALID ID - UPDATE
//   // ==========================================

//   it("should reject invalid module ID during update", async () => {
//     const response = await request(app)
//       .put("/api/v1/modules/abc")
//       .send({
//         module_name: "Invalid Update",
//       })

//     expect(response.status).toBe(400)

//     expect(response.body.success).toBe(false)

//     expect(response.body.message).toBe(
//       "Invalid module ID",
//     )
//   })

//   // ==========================================
//   // INVALID ID - DELETE
//   // ==========================================

//   it("should reject invalid module ID during delete", async () => {
//     const response = await request(app)
//       .delete("/api/v1/modules/abc")

//     expect(response.status).toBe(400)

//     expect(response.body.success).toBe(false)

//     expect(response.body.message).toBe(
//       "Invalid module ID",
//     )
//   })

//   // ==========================================
//   // NOT FOUND - GET
//   // ==========================================

//   it("should return 404 for non-existing module", async () => {
//     const response = await request(app)
//       .get("/api/v1/modules/999999999")

//     expect(response.status).toBe(404)

//     expect(response.body.success).toBe(false)

//     expect(response.body.message).toBe(
//       "Module not found",
//     )
//   })

//   // ==========================================
//   // NOT FOUND - UPDATE
//   // ==========================================

//   it("should return 404 when updating non-existing module", async () => {
//     const response = await request(app)
//       .put("/api/v1/modules/999999999")
//       .send({
//         module_name: "Not Found Module",
//       })

//     expect(response.status).toBe(404)

//     expect(response.body.success).toBe(false)

//     expect(response.body.message).toBe(
//       "Module not found",
//     )
//   })

//   // ==========================================
//   // NOT FOUND - DELETE
//   // ==========================================

//   it("should return 404 when deleting non-existing module", async () => {
//     const response = await request(app)
//       .delete("/api/v1/modules/999999999")

//     expect(response.status).toBe(404)

//     expect(response.body.success).toBe(false)

//     expect(response.body.message).toBe(
//       "Module not found",
//     )
//   })

//   // ==========================================
//   // DELETE ALREADY DELETED MODULE
//   // ==========================================

//   it("should return 404 when deleting already deleted module", async () => {
//     const response = await request(app)
//       .delete(`/api/v1/modules/${moduleId}`)

//     expect(response.status).toBe(404)

//     expect(response.body.success).toBe(false)

//     expect(response.body.message).toBe(
//       "Module not found",
//     )
//   })
// })


import request from "supertest"

import {
  describe,
  expect,
  it,
} from "vitest"

import app from "../../../app"

describe("Modules API - CRUD", () => {
  let moduleId: number

  const uniqueId = Date.now()

  const moduleData = {
    module_code: `TEST_MODULE_${uniqueId}`,
    module_name: `Test Module ${uniqueId}`,
    module_type: "feature",
    capacity_type: null,
    consumable_type: null,
    display_order: 999,
    status: "active",
  }

  const updatedModuleName = `Updated Test Module ${uniqueId}`

  // ==========================================
  // CREATE
  // ==========================================

  it("should create a module", async () => {
    const response = await request(app)
      .post("/api/v1/modules")
      .send(moduleData)

    expect(response.status).toBe(201)

    expect(response.body.success).toBe(true)

    expect(response.body.message).toBe(
      "Module created successfully",
    )

    expect(response.body.data).toHaveProperty("id")

    moduleId = response.body.data.id

    expect(moduleId).toBeTypeOf("number")
  })

  // ==========================================
  // READ ALL
  // ==========================================

  it("should get all modules", async () => {
    const response = await request(app)
      .get("/api/v1/modules")

    expect(response.status).toBe(200)

    expect(response.body.success).toBe(true)

    expect(
      Array.isArray(response.body.data),
    ).toBe(true)

    const createdModule =
      response.body.data.find(
        (module: { id: number }) =>
          module.id === moduleId,
      )

    expect(createdModule).toBeDefined()
  })

  // ==========================================
  // READ BY ID
  // ==========================================

  it("should get module by ID", async () => {
    const response = await request(app)
      .get(`/api/v1/modules/${moduleId}`)

    expect(response.status).toBe(200)

    expect(response.body.success).toBe(true)

    expect(response.body.data).toBeDefined()

    expect(response.body.data.id).toBe(
      moduleId,
    )

    expect(
      response.body.data.module_code,
    ).toBe(moduleData.module_code)

    expect(
      response.body.data.module_name,
    ).toBe(moduleData.module_name)

    expect(
      response.body.data.module_type,
    ).toBe(moduleData.module_type)

    expect(
      response.body.data.display_order,
    ).toBe(moduleData.display_order)

    expect(
      response.body.data.status,
    ).toBe(moduleData.status)
  })

  // ==========================================
  // UPDATE
  // ==========================================

  it("should update a module", async () => {
    const updateData = {
      module_code: moduleData.module_code,
      module_name: updatedModuleName,
      module_type: "feature",
      capacity_type: null,
      consumable_type: null,
      display_order: 1000,
      status: "inactive",
    }

    const response = await request(app)
      .put(`/api/v1/modules/${moduleId}`)
      .send(updateData)

    expect(response.status).toBe(200)

    expect(response.body.success).toBe(true)

    expect(response.body.message).toBe(
      "Module updated successfully",
    )
  })

  // ==========================================
  // VERIFY UPDATE
  // ==========================================

  it("should return updated module data", async () => {
    const response = await request(app)
      .get(`/api/v1/modules/${moduleId}`)

    expect(response.status).toBe(200)

    expect(response.body.success).toBe(true)

    expect(response.body.data.id).toBe(
      moduleId,
    )

    expect(
      response.body.data.module_name,
    ).toBe(updatedModuleName)

    expect(
      response.body.data.display_order,
    ).toBe(1000)

    expect(
      response.body.data.status,
    ).toBe("inactive")
  })

  // ==========================================
  // SOFT DELETE
  // ==========================================

  it("should soft delete a module", async () => {
    const response = await request(app)
      .delete(`/api/v1/modules/${moduleId}`)

    expect(response.status).toBe(200)

    expect(response.body.success).toBe(true)

    expect(response.body.message).toBe(
      "Module deleted successfully",
    )
  })

  // ==========================================
  // VERIFY SOFT DELETE
  // ==========================================

  it("should not return soft deleted module", async () => {
    const response = await request(app)
      .get(`/api/v1/modules/${moduleId}`)

    expect(response.status).toBe(404)

    expect(response.body.success).toBe(false)

    expect(response.body.message).toBe(
      "Module not found",
    )
  })

  // // ==========================================
  // // VERIFY SOFT DELETE FROM LIST
  // // ==========================================

  // it("should exclude soft deleted module from module list", async () => {
  //   const response = await request(app)
  //     .get("/api/v1/modules")

  //   expect(response.status).toBe(200)

  //   expect(response.body.success).toBe(true)

  //   const deletedModule =
  //     response.body.data.find(
  //       (module: { id: number }) =>
  //         module.id === moduleId,
  //     )

  //   expect(deletedModule).toBeUndefined()
  // })

  // // ==========================================
  // // INVALID ID - GET
  // // ==========================================

  // it("should reject invalid module ID", async () => {
  //   const response = await request(app)
  //     .get("/api/v1/modules/abc")

  //   expect(response.status).toBe(400)

  //   expect(response.body.success).toBe(false)

  //   expect(response.body.message).toBe(
  //     "Invalid module ID",
  //   )
  // })

  // // ==========================================
  // // INVALID ID - UPDATE
  // // ==========================================

  // it("should reject invalid module ID during update", async () => {
  //   const response = await request(app)
  //     .put("/api/v1/modules/abc")
  //     .send({
  //       module_name: "Invalid Update",
  //     })

  //   expect(response.status).toBe(400)

  //   expect(response.body.success).toBe(false)

  //   expect(response.body.message).toBe(
  //     "Invalid module ID",
  //   )
  // })

  // // ==========================================
  // // INVALID ID - DELETE
  // // ==========================================

  // it("should reject invalid module ID during delete", async () => {
  //   const response = await request(app)
  //     .delete("/api/v1/modules/abc")

  //   expect(response.status).toBe(400)

  //   expect(response.body.success).toBe(false)

  //   expect(response.body.message).toBe(
  //     "Invalid module ID",
  //   )
  // })

  // // ==========================================
  // // NOT FOUND - GET
  // // ==========================================

  // it("should return 404 for non-existing module", async () => {
  //   const response = await request(app)
  //     .get("/api/v1/modules/999999999")

  //   expect(response.status).toBe(404)

  //   expect(response.body.success).toBe(false)

  //   expect(response.body.message).toBe(
  //     "Module not found",
  //   )
  // })

  // // ==========================================
  // // NOT FOUND - UPDATE
  // // ==========================================

  // it("should return 404 when updating non-existing module", async () => {
  //   const response = await request(app)
  //     .put("/api/v1/modules/999999999")
  //     .send({
  //       module_name: "Not Found Module",
  //     })

  //   expect(response.status).toBe(404)

  //   expect(response.body.success).toBe(false)

  //   expect(response.body.message).toBe(
  //     "Module not found",
  //   )
  // })

  // // ==========================================
  // // NOT FOUND - DELETE
  // // ==========================================

  // it("should return 404 when deleting non-existing module", async () => {
  //   const response = await request(app)
  //     .delete("/api/v1/modules/999999999")

  //   expect(response.status).toBe(404)

  //   expect(response.body.success).toBe(false)

  //   expect(response.body.message).toBe(
  //     "Module not found",
  //   )
  // })

  // // ==========================================
  // // DELETE ALREADY DELETED MODULE
  // // ==========================================

  // it("should return 404 when deleting already deleted module", async () => {
  //   const response = await request(app)
  //     .delete(`/api/v1/modules/${moduleId}`)

  //   expect(response.status).toBe(404)

  //   expect(response.body.success).toBe(false)

  //   expect(response.body.message).toBe(
  //     "Module not found",
  //   )
  // })
})