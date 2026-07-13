"use server";
import { db } from "@/lib/database/firebase/firebase-admin";
import { Plan } from "../types";
import { planRef } from "@/lib/database/firebase/references";





export async function seedPlansAction(plans: any[]) {
  const batch = db.batch();
  plans.forEach((plan) => {
    // Note: ensure planRef() is reachable in this server environment
    batch.set(planRef().doc(plan.id), {
      ...plan,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  await batch.commit();
}