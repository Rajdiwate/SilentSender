import { db } from "@/lib";
import { messageTable, userTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { NextRequest, NextResponse } from "next/server";
import { messageSchema } from "@/schema/messageSchema";


export async function POST(req: NextRequest) {
  try {
    const { username, content } = await req.json();
    const parsedData = messageSchema.safeParse({username , content})
    if(!parsedData.success){
        // If validation fails, return the error messages
        return NextResponse.json(
            {
              success: false,
              errors: parsedData.error.errors, // Zod will return an array of error details
            },
            { status: 400 }
          );
    }

    //Zod will handle below check
    // //check if message length is >0
    // if (!content || content.length <= 0) {
    //   return NextResponse.json(
    //     { success: false, message: "Content cannot be empty" },
    //     { status: 400 }
    //   );
    // }

    //check if user exists with given id
    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.username, username))
      .limit(1);
    if (user.length <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid User ID" },
        { status: 404 }
      );
    }

    //check if user is accepting messages
    if(!user[0].isAccepting){
        return NextResponse.json({succcess : false , message: "user is not currently accepting message"} , {status:403})
    }

    //create a new message in message table
    const msgId = generateId(15);
    const [newMessage] = await db
      .insert(messageTable)
      .values({ id: msgId, content: content, userId: user[0].id})
      .returning();

    if (!newMessage) {
      return NextResponse.json(
        { success: false, message: " Error in creating message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "message sent successfully" }, { status: 200 });
  } catch (error) {
    console.log("Failed to create message");
    return NextResponse.json(
      { success: false, message: "Failed to create message" },
      { status: 500 }
    );
  }
}
