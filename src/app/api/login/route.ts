import { db } from "@/lib";
import { userTable } from "@/lib/schema";
import { loginSchema } from "@/schema/loginSchema";
import { eq } from "drizzle-orm";
import { verify } from "@node-rs/argon2";
import { NextRequest, NextResponse } from "next/server";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const parsedData = loginSchema.safeParse({ username, password });
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

    //if data is valid , find username in db
    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.username, username))
      .limit(1);
    if (user.length <= 0 || !user[0]) {
      return NextResponse.json(
        { success: false, message: "No username Found" },
        { status: 404 }
      );
    }

    //if user Exists  , check if verified
    if (!user[0].isVerified) {
      return NextResponse.json(
        { success: false, message: "User not verified" },
        { status: 400 }
      );
    }

    //if user is verified , check if password is correct

    const validPassword = await verify(user[0].hashPassword!, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "incorrect username or Password" },
        { status: 400 }
      );
    }

    // if password is correct , create session

    const session = await lucia.createSession(user[0].id, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return NextResponse.json({ success: true, user: user[0] }, { status: 200 });
  } catch (error) {
    console.log("failed to login : ", error);
    return NextResponse.json(
      { success: false, message: "failed to login" },
      { status: 500 }
    );
  }
}
