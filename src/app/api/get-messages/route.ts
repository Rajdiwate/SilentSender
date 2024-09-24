import { db } from "@/lib";
import { validateRequest } from "@/lib/auth";
import { messageTable } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "unauthorized request" },
        { status: 401 }
      );
    }
    
    const messages = await db
      .select({
        content: messageTable.content,
      } )
      .from(messageTable)
      .where(eq(messageTable.userId, user.id))
      .orderBy(desc(messageTable.createdAt))
      .limit(10);

    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    console.log("Failed to fetch Messages");
    return NextResponse.json(
      { success: false, message: "Failed to fetch Messages" },
      { status: 500 }
    );
  }
}
