import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateRequest } from "@/lib/auth"
import { redirect } from "next/navigation"


export default async function Home() {

  const {user} : any = await validateRequest()
  console.log(user)

  if(!user){
    return redirect("/signup")
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" 
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/placeholder.svg?height=1080&width=1920&text=Dark+Anime+Background')",
      }}
    >
      <Card className="w-[350px] bg-black/50 backdrop-blur-sm text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg">You have logged in successfully.</p>
        </CardContent>
      </Card>
    </div>
  )
}