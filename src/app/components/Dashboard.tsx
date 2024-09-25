"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, RefreshCcw } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  // Add other fields as necessary
}

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [acceptMessages, setAcceptMessages] = useState(true);
  const [user , setUser]  = useState<User | null>(null)
  const router = useRouter();

  const getMessages = async () => {
    try {
      const data = await axios.get("/api/get-messages");
      setMessages(data.data.messages);
    } catch (error) {
      console.log(error);
    }
  };
  const getUser = async()=>{
    try {
      const res = await axios.get('/api/get-user' , {withCredentials:true})
      console.log(res.data.user)
      if(!res.data.user){
        router.push('/login')
      }
      setUser(res.data.user)
    } catch (error) {
      console.log( " No user Found in  Home component ",error)
      router.push('/login')
    }
  }
  const handleRefresh = async ()=>{
    const data = await axios.get("/api/get-messages");
    setMessages(data.data.messages);
  }
  const deleteMessage = async (id: string) => {
    try {
    await axios.delete(`/api/delete-message/${id}`);
      getMessages();
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout =async()=>{
    try {
      const data = await axios.get("/api/logout");
      router.push('/')
    } catch (error) {
      console.log(error);
    }
  }

  

  useEffect(() => {
    getUser()
    getMessages();
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText("https://truefeedback.in/u/Raj");
    alert("Link copied to clipboard!");
  };

  

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">True Feedback</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user? user.username : "Loading"}</span>
            <Button
              variant="outline"
              className="text-black border-white hover:bg-gray-800 hover:text-white"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto mt-8 p-4">
        <h2 className="text-3xl font-bold mb-6">User Dashboard</h2>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Copy Your Unique Link</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-gray-600">{`https://truefeedback.in/u/${user?.id}`}</span>
            <Button onClick={copyLink}>Copy</Button>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={acceptMessages}
              onCheckedChange={setAcceptMessages}
              id="accept-messages"
            />
            <label htmlFor="accept-messages">
              Accept Messages: {acceptMessages ? "On" : "Off"}
            </label>
          </div>
          <Button variant="outline" size="icon" >
            <RefreshCcw className="h-4 w-4" onClick={handleRefresh} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.map((message: any) => (
            <Card key={message.id}>
              <CardContent className="flex justify-between items-start p-4">
                <div>
                  <p className="font-semibold mb-2">{message.content}</p>
                  <p className="text-sm text-gray-500">
                    {" "}
                    {new Date(message.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true, // For AM/PM format
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMessage(message.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
