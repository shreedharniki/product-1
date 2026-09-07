import {
  getModules,
    getModuleById,
  insertModule,
    updateModule,
  softDeleteModule,
} from "../repositories/moduleRepository"

import type {
  CreateModuleData,
   UpdateModuleData,
} from "../modulesTypes"

// ============================
// Get Modules
// ============================

export const fetchModules = async () => {
  return getModules()
}
export const fetchModuleById = async (
  id: number,
) => {
  return getModuleById(id)
}
// ============================
// Create Module
// ============================

export const createModule = async (
  data: CreateModuleData,
) => {
  return insertModule(data)
}


// ============================
// Update Module
// ============================

export const editModule = async (
  id: number,
  data: UpdateModuleData,
) => {
  return updateModule(id, data)
}

// ============================
// Soft Delete Module
// ============================

export const deleteModule = async (
  id: number,
) => {
  return softDeleteModule(id)
}