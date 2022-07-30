import { Main } from "@components/layout";
import { DonationProgramTable } from "@module/admin/donationProgram";

const ProgramDonasi = () => {
  return (
    <Main title="Program Donasi">
      <DonationProgramTable />
    </Main>
  );
};

export default ProgramDonasi;
