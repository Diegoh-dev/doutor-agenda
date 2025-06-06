import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

// export const authClient = createAuthClient({
//     // baseURL: "http://localhost:3000"// PARA ESSA APLICAÇÃO NÃO VAI SER PRECISO PQ ENÃO TEMOS UMA APLICAÇÃO SEPARADA, VAI SER TUDO DENTO DO PROPRIO NEXT.JS
// })
