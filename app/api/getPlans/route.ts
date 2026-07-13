import { NextResponse } from 'next/server';
import { repository } from "@/lib/database/repository";

export async function GET() {
  try {
    const plans = await repository().getAllPlans();
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch plans" }, 
      { status: 500 }
    );
  }
}