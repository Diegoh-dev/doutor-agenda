"use server";

import { headers } from "next/headers";
import Stripe from "stripe";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

export const createStripeCheckout = actionClient.action(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key not found");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });
  const { id: sessionId } = await stripe.checkout.sessions.create({
    payment_method_types: ["card"], //metodos de pagamentos (para pix precisa fazer algumas configurações na conta do stripe)
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, //URL QUE O USUÁRIO SERÁ DIRECIONADO QUANDO O PAGAMENTO FOR EFEITUADO COM SUCESSO
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, //URL QUE O USUÁRIO SERÁ DIRECIONADO QUANDO O ELE CLICAR EM CANCELAR
    subscription_data: {
      //metadata: SERÁ ENVIADO PARA O WEBHOOK
      metadata: {
        userId: session.user.id, //ID DO USUÁRIO
      },
    },
    //ITENS QUE O USUÁRIO VAI PAGAR (PODE SER COLOCADO VÁRIOS ITENS AQUI)
    line_items: [
      {
        price: process.env.STRIPE_ESSENTIAL_PLAN_PRICE_ID,
        quantity: 1,
      },
    ],
  });
  return {
    sessionId,
  };
});
