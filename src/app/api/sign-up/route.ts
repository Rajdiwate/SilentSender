import { db } from "@/lib";
import { lucia } from "@/lib/auth";
import { userTable } from "@/lib/schema";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
import { eq } from "drizzle-orm";
import { hash } from "@node-rs/argon2";
import { NextRequest, NextResponse } from "next/server";
import { generateId } from "lucia";
import { signupSchema } from "@/schema/signupSchema";

function generateRandomCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

//signup
export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    const parsedData = signupSchema.safeParse({ username, email, password });

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

    //check if there exists a user which is verified
    //check if there exists a user
    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));
    if (user.length >= 1) {
      //means user exists
      //check if email is verified
      if (user[0].isVerified) {
        //return(no need to signup)
        return NextResponse.json(
          { success: false, message: "user is already verified" },
          { status: 400 }
        );
      } else {
        //send verification code
        const verifyCode = generateRandomCode();

        const hashedPassword = await hash(password, {
          // recommended minimum parameters
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        });

        //change the password to new password
        await db
          .update(userTable)
          .set({
            hashPassword: hashedPassword,
            username: username,
            verifyCode: verifyCode,
            verifyCodeExpiry: new Date(Date.now() + 60 * 60 * 15),
          })
          .where(eq(userTable.id, user[0].id));

        await sendVerificationEmail(email, username, verifyCode);
        return NextResponse.json(
          { success: true, message: `verification code sent to ${email}` },
          { status: 201 }
        );
      }
    } else {
      // insert user details into db and create new user
      const id = generateId(15);
      const verifyCode = generateRandomCode();
      const hashPassword = await hash(password, {
        // recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });
      await sendVerificationEmail(email, username, verifyCode);

      await db
        .insert(userTable)
        .values({
          id: id,
          email: email,
          username: username,
          hashPassword: hashPassword,
          verifyCode: verifyCode,
          verifyCodeExpiry: new Date(Date.now() + 60 * 60 * 15),
        });

      return NextResponse.json(
        { success: true, message: `Verification code is sent to ${email}` },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("error registering user", error);
    return NextResponse.json(
      {
        success: false,
        message: "error registering user",
      },
      {
        status: 500,
      }
    );
  }
}

