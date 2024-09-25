import { db } from "@/lib";
import { validateRequest } from "@/lib/auth";
import { userTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req : NextRequest){
    try {
        const {user} = await validateRequest();
        if(!user){
            return NextResponse.json({success : false , message : "No user found"})
        }

        const dbUser = await db.select().from(userTable).where(eq(userTable.id , user.id));
        if(dbUser.length <=0){
            return NextResponse.json({success : false , message : "No user found"})
        }
        console.log("hello")
        return NextResponse.json({success : true , user : dbUser[0]})
    } catch (error) {
        console.log("Error in  getting user")
        return NextResponse.json({success : false , message : "Cannot get user"});
    }

}