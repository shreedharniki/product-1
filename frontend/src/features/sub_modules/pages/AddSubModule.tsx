



import SubModuleForms from "../components/SubModuleForms"
import type { SubModuleFormData } from "../subModuleValidation"

export default function AddSubModule() {
  const handleSubmit = async (
    data: SubModuleFormData,
  ): Promise<void> => {
    console.log("data submit:", data)
  }

  return (
    <SubModuleForms
      onSubmit={handleSubmit}
    />
  )
}