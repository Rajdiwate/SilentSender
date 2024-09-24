import { db } from "@/lib";
import { lucia } from "@/lib/auth";
import { userTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
 import { verifySchema } from "@/schema/verifySchema";

//check verification code
export async function POST(req: NextRequest) {
    try {
      const { email, verifyCode } = await req.json();
      const parsedData = verifySchema.safeParse({code : verifyCode , email : email})
      if (!parsedData.success) {
        // If validation fails, return the error messages
        return NextResponse.json(
          {
            success: false,
            errors: parsedData.error.errors, // Zod will return an array of error details
          },
          { status: 400 }
        );
      }
      
      // Check if user exists with given email
      const user = await db.select().from(userTable).where(eq(userTable.email, email));
      if (user.length <= 0) {
        return NextResponse.json({ success: false, message: "Invalid email" }, { status: 401 });
      }
      //check if already verified
      if(user[0].isVerified){
        return NextResponse.json({success : false , message : "User alredy verified"})
      }
  
      // If user exists then check if verify code matches
      const expiryTime = new Date(user[0].verifyCodeExpiry);
      if (user[0].verifyCode.toString() !== verifyCode.toString() || Date.now() > expiryTime.getTime()  ) {
        return NextResponse.json({ success: false, message: "Code is invalid or expired" });
      }
  
      // If code is correct
      const updatedUser = await db
        .update(userTable)
        .set({
          isVerified: true,
          verifyCodeExpiry: new Date() // This will set the expiry to the current time
        })
        .where(eq(userTable.email, email))
        .returning({
          id: userTable.id,
          email: userTable.email,
        });
  
      if (updatedUser.length <= 0) {
        return NextResponse.json({ success: false, message: "Something went wrong during the update" });
      }
  
      // Create a session for the user
      const session = await lucia.createSession(updatedUser[0].id, { expiresIn: 60 * 60 * 24 * 30 });
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  
      return NextResponse.json({ success: true, user: updatedUser[0] });
  
    } catch (error) {
      console.error("Error verifying user", error);
      return NextResponse.json(
        {
          success: false,
          message: "Error verifying user",
        },
        {
          status: 500,
        }
      );
    }
  }
  
