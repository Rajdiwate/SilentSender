"use client";

import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";

export default function Page({ params }: any) {
  // const router = useRouter()
  const id = decodeURIComponent(params.id);

  const [message, setMessage] = useState("");

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/send-message", { id, content: message });
      toast({
        variant: "default",
        description: "message sent Successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "user not accepting message",
      });
    } finally {
      setMessage("");
    }
  };

  return (
    <form
      className="bg-gray-900 text-white flex justify-center items-center h-screen w-screen"
      onSubmit={handleOnSubmit}
    >
      <label htmlFor="message" className="m-3">
        {" "}
        Message :{" "}
      </label>
      <input
        className="p-2 rounded-lg text-black"
        type="text"
        id="message"
        placeholder="write a message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="h-[30px] w-[100px] bg-slate-200 m-3 text-black rounded-md"
      >
        {" "}
        Submit
      </button>
      <Toaster />
    </form>
  );
}
