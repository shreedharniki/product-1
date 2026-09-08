
import { createAsyncThunk } from "@reduxjs/toolkit"

import {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} from "./services/moduleServices"

import type {
  CreateModulePayload,
  UpdateModulePayload,
} from "./moduleTypes"

/* -------------------------------------------------------------------------- */
/* Fetch Modules                                                              */
/* -------------------------------------------------------------------------- */

export const fetchModules = createAsyncThunk(
  "modules/fetchModules",
  async (_, { rejectWithValue }) => {
    try {
      return await getModules()
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch modules."
      )
    }
  }
)

/* -------------------------------------------------------------------------- */
/* Fetch Module By ID                                                         */
/* -------------------------------------------------------------------------- */

export const fetchModuleById = createAsyncThunk(
  "modules/fetchModuleById",
  async (id: number | string, { rejectWithValue }) => {
    try {
      return await getModuleById(id)
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch module."
      )
    }
  }
)

/* -------------------------------------------------------------------------- */
/* Create Module                                                              */
/* -------------------------------------------------------------------------- */

export const addModule = createAsyncThunk(
  "modules/addModule",
  async (data: CreateModulePayload, { rejectWithValue }) => {
    try {
      return await createModule(data)
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create module."
      )
    }
  }
)

/* -------------------------------------------------------------------------- */
/* Update Module                                                              */
/* -------------------------------------------------------------------------- */

export const editModule = createAsyncThunk(
  "modules/editModule",
  async (data: UpdateModulePayload, { rejectWithValue }) => {
    try {
      return await updateModule(data)
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update module."
      )
    }
  }
)

/* -------------------------------------------------------------------------- */
/* Delete Module                                                              */
/* -------------------------------------------------------------------------- */

export const removeModule = createAsyncThunk(
  "modules/removeModule",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteModule(id)

      return id
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete module."
      )
    }
  }
)