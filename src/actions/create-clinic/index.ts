"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createClinic = async (name: string) => {
  // DEVE SER TRADADA COMO UMA ROTA DE API
  //VERIFIAR SE O USUÁRIO ESTÁ LOGADO

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  //pega o primeiro elemento da lista que será retornada
  const [clinic] = await db.insert(clinicsTable).values({ name }).returning();

  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });

  redirect("/dashboard");
};
