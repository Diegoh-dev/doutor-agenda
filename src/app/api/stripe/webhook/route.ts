/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe secret key not found");
  }

  //signature => É UMA ASSINATURA Q O STRIPE VAI ME MANDAR, E É ISSO QUE VOU USAR PARA VERIFICAR SE É O STRIPE QUE ESTÁ CHAMANDO ESSE WEBHOOK
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    throw new Error("Stripe signature not found");
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });

  //ESTUDAR COMO FUNCIONA ESSE ALGORITMO: WMAC COM SHA256
  //O STRIPE VALIDA COM "WMAC COM SHA256" : PARA FAZER ESSA VERIFICAÇÃO SE A REQUISIÇÃO NÃO FOI AUTERADO
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case "invoice.paid": {
      if (!event.data.object.id) {
        throw new Error("Subscription ID not found");
      }

      const invoice = event.data.object as Stripe.Invoice;
      const subscription = (invoice as any).parent?.subscription_details
        ?.subscription;

      // const { subscription, subscription_details, customer } = event.data
      //   .object as unknown as {
      //   customer: string;
      //   subscription: string;
      //   subscription_details: {
      //     metadata: {
      //       userId: string;
      //     };
      //   };
      // };

      if (!subscription) {
        throw new Error("Subscription not found");
      }
      const userId = (invoice as any).parent?.subscription_details?.metadata
        ?.userId;
      // const userId = subscription_details.metadata.userId;
      const customer = invoice.customer?.toString();
      if (!userId) {
        throw new Error("User ID not found");
      }
      await db
        .update(usersTable)
        .set({
          stripeSubscriptionId: subscription,
          stripeCustomerId: customer,
          plan: "essential",
        })
        .where(eq(usersTable.id, userId));
      break;
    }
    case "customer.subscription.deleted": {
      if (!event.data.object.id) {
        throw new Error("Subscription ID not found");
      }
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      );
      if (!subscription) {
        throw new Error("Subscription not found");
      }
      const userId = subscription.metadata.userId;
      if (!userId) {
        throw new Error("User ID not found");
      }
      await db
        .update(usersTable)
        .set({
          stripeSubscriptionId: null,
          stripeCustomerId: null,
          plan: null,
        })
        .where(eq(usersTable.id, userId));
    }
  }
  return NextResponse.json({
    received: true,
  });
};
