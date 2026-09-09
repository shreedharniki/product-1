



import SubModuleForm from "../components/SubModuleForm"

export default function AddSubModule() {
 const handleSubmit = async () => {
     console.log("data submit")
 
     
   }
  return (
       <SubModuleForm
       
       onSubmit={handleSubmit}
       />
  )
}