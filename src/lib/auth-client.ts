import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()], // para saber as propriedades que o typescript precisar levar em consideração quando customiza a session do better-auth
});

// export const authClient = createAuthClient({
//     // baseURL: "http://localhost:3000"// PARA ESSA APLICAÇÃO NÃO VAI SER PRECISO PQ ENÃO TEMOS UMA APLICAÇÃO SEPARADA, VAI SER TUDO DENTO DO PROPRIO NEXT.JS
// })
