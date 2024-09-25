import { NextRequest, NextResponse } from "next/server";
import { messageTable } from "@/lib/schema"; // Adjust this path to your message schema
import { eq } from "drizzle-orm"; // Assuming you're using drizzle-orm
import { db } from "@/lib";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ success: false, message: "No message found" });
    }

    // Delete the message from the database
    const deletedMessage = await db
      .delete(messageTable)
      .where(eq(messageTable.id, id))
      .returning({ id: messageTable.id });

    if (deletedMessage.length === 0) {
      return NextResponse.json({ success: false, message: "Message not found or already deleted" });
    }

    return NextResponse.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error while deleting message:", error); // Log the actual error for debugging
    return NextResponse.json({ success: false, message: "Error while deleting message" });
  }
}
