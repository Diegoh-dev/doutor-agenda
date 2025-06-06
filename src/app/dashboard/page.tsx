import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import SingOutButton from "./componets/sing-out-button";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
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
