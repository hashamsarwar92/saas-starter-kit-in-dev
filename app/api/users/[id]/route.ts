import { NextRequest, NextResponse } from "next/server";
import { UserActions } from "@/lib/database/firebase/actions/user-actions";
import { collections } from "@/lib/database/firebase/collections";

const users = UserActions(collections.users);

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await users.getUserById(params.id);

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

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();

        await users.updateUser(params.id, body);

        return NextResponse.json({
            success: true,
            message: "User updated",
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await users.deleteUser(params.id);

        return NextResponse.json({
            success: true,
            message: "User deleted",
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}