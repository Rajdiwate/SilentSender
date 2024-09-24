import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req : NextRequest){
    try {
        const { session } = await validateRequest();
	if (!session) {
		return NextResponse.json({success :false , message : "user already logged out"})
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return NextResponse.json({success :true , message : "logged out successfully"})
	
    } catch (error) {
        console.error("error logging out user", error);
        return NextResponse.json(
          {
            success: false,
            message: "error logging out user",
          },
          {
            status: 500,
          }
        );
    }

}