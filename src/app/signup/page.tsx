"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      setTimeout(()=>{},4000)
      setErrors(""); // Clear previous errors
  
      const res = await axios.post(
        "/api/sign-up",
        { username, email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer yourToken",
          },
          withCredentials: true, // Include cookies with the request
        }
      );
  
      // Check for success in the response
      if (!res.data.success) {
        setErrors(res.data.message); // Set error message if not successful
        return; // Exit if there's an error
      }
  
      // Redirect on successful response
      router.push(`/verify/${email}`);
    } catch (error: any) {
      console.error("Error during signup:", error);
  
      // Handle Axios errors
      if (error.response) {
        // If the server responded with a status outside of 2xx
        setErrors(error.response.data.message || "An error occurred during signup");
      } else if (error.request) {
        // If the request was made but no response was received
        setErrors("No response from the server. Please try again.");
      } else {
        // Something else happened while setting up the request
        setErrors("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Always set loading to false
    }
  
    console.log("Signup attempted with:", { username, email, password });
  };

  if(loading){
    return ( <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900 border-t-transparent"></div>
    </div>)
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Join True Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          {errors ? <p className="text-center text-red-600">{errors}</p> : null}
          <p className="text-center text-gray-600 mb-6">
            Sign up to start your anonymous adventure
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gray-900 text-white hover:bg-gray-800"
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            Already a member?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
