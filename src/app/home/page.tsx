import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateRequest } from "@/lib/auth"
import { redirect } from "next/navigation"


export default async function Home() {

  const {user} : any = await validateRequest()
  console.log(user)

  if(!user){
    return redirect("/login")
  }

  return (
    <div> 
     
    </div>
  )
}