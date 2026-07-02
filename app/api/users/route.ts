import { NextRequest, NextResponse } from "next/server";
import  {UserActions}  from "@/lib/database/firebase/sartillum-user-actions";

const users = UserActions();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        await users.createUser(body);

        return NextResponse.json(
            { success: true, message: "User created/updated" },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "User ID is required" },
                { status: 400 }
            );
        }

        const user = await users.getUserById(id);

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}