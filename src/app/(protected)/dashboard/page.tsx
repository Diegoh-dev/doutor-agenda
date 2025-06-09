// import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// import { db } from "@/db";
// import { usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import SingOutButton from "./_componets/sing-out-button";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  //PRECISO PEGAR AS CLÍNICAS DO USUÁRIO
  // const clinics = await db.query.usersToClinicsTable.findMany({
  //   where: eq(usersToClinicsTable.userId, session.user.id),
  // });

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  return (
    <div>
      <div>dashboard</div>
      <div>{session?.user?.name}</div>
      <div>{session?.user?.email}</div>
      <SingOutButton />
    </div>
  );
};

export default DashboardPage;
