"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"


export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        const res = await axios.post('/api/login' , {username , password} ,{
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // Include cookies with the request
          })

        if(!res.data.success){
            toast({
                variant: "destructive",
                description : res.data.message
            })
            return 
        }
        router.push('/home')
    } catch (error : any) {
        toast({
            variant: "destructive",
            description : "Invalid Credentials"
        })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
            Welcome Back to<br />True Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            Sign in to continue your secret conversations
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            Not a member yet?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    <Toaster/>
    </div>
  )
}