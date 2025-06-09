import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageAction,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";

import AddDoctorButton from "./_components/add-doctor-button";

const DoctorsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }
  return (
    <>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Médicos</PageTitle>
            <PageDescription>
              Gerencie os médicos da sua clínica
            </PageDescription>
          </PageHeaderContent>
          <PageAction>
            <AddDoctorButton />
          </PageAction>
        </PageHeader>
        <PageContent>
          <h1>Médicos</h1>
        </PageContent>
      </PageContainer>
    </>
  );
};

export default DoctorsPage;
