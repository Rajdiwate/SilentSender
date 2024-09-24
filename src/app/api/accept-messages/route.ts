import { db } from "@/lib";
import { validateRequest } from "@/lib/auth";
import { userTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";

// changes isAccepting Status
export async function POST(req: NextRequest) {
  try {
    const { acceptMessages } = await req.json();
    const parsedData = acceptMessageSchema.safeParse({acceptMessages : acceptMessages });

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

    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { success: false, message: " not authenticated" },
        { status: 401 }
      );
    }

    const dbUser = await db
      .update(userTable)
      .set({ isAccepting: acceptMessages })
      .where(eq(userTable.id, user.id))
      .returning();

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "no User Found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: "User status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to update user status");
    return NextResponse.json(
      { success: false, message: "Failed to update user Status" },
      { status: 500 }
    );
  }
}

//fetches current isAccepting Status
export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { success: false, message: " not authenticated" },
        { status: 401 }
      );
    }
    const dbUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, user.id));

    if (dbUser.length <= 0) {
      return NextResponse.json(
        { success: false, message: "no User Found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      isAccepting: dbUser[0].isAccepting,
    });
  } catch (error) {
    console.log("failed to fetch isAccepting status");
    return NextResponse.json(
      { success: false, message: "Failed to fetch isAccepting status" },
      { status: 500 }
    );
  }
}
