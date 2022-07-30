import { NextPage } from "next";
import { Main } from "@components/layout";
import { DonasiTable } from "@module/donasi";

const Home: NextPage = () => {
  return (
    <Main title="Donasi">
      <DonasiTable />
    </Main>
  );
};

export default Home;
