import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true, //para usar o plural nas pgTables
    schema: schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      // TODO: colocar cache
      const [userData, clinics] = await Promise.all([
        db.query.usersTable.findFirst({
          where: eq(schema.usersTable.id, user.id),
        }),
        db.query.usersToClinicsTable.findMany({
          where: eq(schema.usersToClinicsTable.userId, user.id),
          with: {
            clinic: true,
            user: true,
          },
        }),
      ]);

      //TODO: AO ADAPTAR PARA O USUÁRIO TER MULTIPLAS CLINICAS DEVE-SE MUDAR ESSE CÓDIGO.
      const clinic = clinics?.[0];

      return {
        user: {
          ...user,
          plan: userData?.plan,
          clinic: clinic?.clinicId
            ? {
                id: clinic?.clinicId,
                name: clinic?.clinic?.name,
              }
            : undefined,
        },
        session,
      };
    }),
  ],
  //precisamos colocar pq mudamos os nomes das variaveris do banco que vem como padrão quando é gerado pelo better-auth
  user: {
    modelName: "usersTable",
    //o better-authh precisa saber que possui esses campos novos
    additionalFields: {
      stripeCustomerId: {
        type: "string",
        fieldName: "stripeCustomerId",
        required: false,
      },
      stripeSubscriptionId: {
        type: "string",
        fieldName: "stripeSubscriptionId",
        required: false,
      },
      plan: {
        type: "string",
        fieldName: "plan",
        required: false,
      },
    },
  },
  session: {
    modelName: "sessionsTable",
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
  //PARA IMPLEMENTAR A AUTENTICAÇÃO COM E-MAIL E SENHA
  emailAndPassword: {
    enabled: true,
  },
});
