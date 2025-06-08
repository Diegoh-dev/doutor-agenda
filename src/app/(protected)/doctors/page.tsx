import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PageAction,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

const DoctorsPage = () => {
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
            <Button>
              <Plus />
              Adicionar médico
            </Button>
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
