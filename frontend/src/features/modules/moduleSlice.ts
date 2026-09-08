
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type {
  Module,
  ModulesState,
} from "./moduleTypes"

import {
  fetchModules,
  fetchModuleById,
  addModule,
  editModule,
  removeModule,
} from "./moduleThunks"

/* -------------------------------------------------------------------------- */
/* Initial State                                                              */
/* -------------------------------------------------------------------------- */

const initialState: ModulesState = {
  modules: [],
  loading: false,
  error: null,
  success: false,
}

/* -------------------------------------------------------------------------- */
/* Module Slice                                                               */
/* -------------------------------------------------------------------------- */

const moduleSlice = createSlice({
  name: "modules",

  initialState,

  reducers: {
    clearModuleError: (state) => {
      state.error = null
    },

    clearModuleSuccess: (state) => {
      state.success = false
    },

    clearModules: (state) => {
      state.modules = []
    },
  },

  extraReducers: (builder) => {
    /* ---------------------------------------------------------------------- */
    /* Fetch Modules                                                          */
    /* ---------------------------------------------------------------------- */

    builder
      .addCase(fetchModules.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(
        fetchModules.fulfilled,
        (state, action: PayloadAction<Module[]>) => {
          state.loading = false
          state.modules = action.payload
        }
      )

      .addCase(fetchModules.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) ||
          "Failed to fetch modules."
      })

    /* ---------------------------------------------------------------------- */
    /* Fetch Module By ID                                                     */
    /* ---------------------------------------------------------------------- */

    builder
      .addCase(fetchModuleById.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchModuleById.fulfilled, (state) => {
        state.loading = false
      })

      .addCase(fetchModuleById.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) ||
          "Failed to fetch module."
      })

    /* ---------------------------------------------------------------------- */
    /* Add Module                                                             */
    /* ---------------------------------------------------------------------- */

    builder
      .addCase(addModule.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })

      .addCase(
        addModule.fulfilled,
        (state, action: PayloadAction<Module>) => {
          state.loading = false
          state.success = true

          state.modules.push(action.payload)
        }
      )

      .addCase(addModule.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) ||
          "Failed to create module."
      })

    /* ---------------------------------------------------------------------- */
    /* Edit Module                                                            */
    /* ---------------------------------------------------------------------- */

    builder
      .addCase(editModule.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })

      .addCase(
        editModule.fulfilled,
        (state, action: PayloadAction<Module>) => {
          state.loading = false
          state.success = true

          const index = state.modules.findIndex(
            (module) => module.id === action.payload.id
          )

          if (index !== -1) {
            state.modules[index] = action.payload
          }
        }
      )

      .addCase(editModule.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) ||
          "Failed to update module."
      })

    /* ---------------------------------------------------------------------- */
    /* Delete Module                                                          */
    /* ---------------------------------------------------------------------- */

    builder
      .addCase(removeModule.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(removeModule.fulfilled, (state, action) => {
        state.loading = false

        state.modules = state.modules.filter(
          (module) => module.id !== action.payload
        )
      })

      .addCase(removeModule.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) ||
          "Failed to delete module."
      })
  },
})

/* -------------------------------------------------------------------------- */
/* Actions                                                                    */
/* -------------------------------------------------------------------------- */

export const {
  clearModuleError,
  clearModuleSuccess,
  clearModules,
} = moduleSlice.actions

/* -------------------------------------------------------------------------- */
/* Reducer                                                                    */
/* -------------------------------------------------------------------------- */

export default moduleSlice.reducer