// import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import {
  PageAction,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
// import { db } from "@/db";
// import { usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddPatientButton from "../patients/_components/add-patient-button";
import { patientsTableColumns } from "../patients/_components/table-columns";
import { DatePicker } from "./_componets/date-picker";
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
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>
            Gerencie os pacientes da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageAction>
          <DatePicker />
        </PageAction>
      </PageHeader>
      <PageContent>
        <></>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
