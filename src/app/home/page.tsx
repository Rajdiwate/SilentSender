'use server'
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import Dashboard from "../components/Dashboard";
import axios from "axios";

export default async function () {
  // const { user } = await validateRequest();
  // if (!user) {
  //   return redirect("/");
  // }

  return (
    <div>
      <Dashboard/>
    </div>
  );
}
