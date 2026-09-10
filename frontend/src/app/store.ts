import { configureStore } from "@reduxjs/toolkit"

// import organizationReducer from "@/features/organizations/organizationSlice"
import moduleReducer from "../features/modules/moduleSlice"
import submoduleReducer from "../features/sub_modules/submoduleSlice"

export const store = configureStore({
  reducer: {
    // organizations: organizationReducer,
    modules: moduleReducer,
    submodules: submoduleReducer,
  },
})

export type RootState = ReturnType<
  typeof store.getState
>

export type AppDispatch = typeof store.dispatch