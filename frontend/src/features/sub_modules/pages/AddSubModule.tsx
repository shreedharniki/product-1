



import SubModuleForm from "../components/SubModuleForm";

import type { SubModuleFormData } from "../subModuleValidation"

export default function AddSubModule() {
  const handleSubmit = async (
    data: SubModuleFormData,
  ): Promise<void> => {
    console.log("data submit:", data)
  }

  return (
    <SubModuleForm
      onSubmit={handleSubmit}
    />
  )
}