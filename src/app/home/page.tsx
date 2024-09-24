

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateRequest } from "@/lib/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import DisplayMessage from "../components/DisplayMessage"


export default async  function Home() {

  const {user} : any = await validateRequest()

  if(!user){
    return redirect("/login")
  }
  const link = `http://localhost:3000/u/${user.id}`

  return (
    <div className="h-screen w-screen bg-gray-900 text-white"> 
     {link}

    <DisplayMessage/>

    </div>
  )
}