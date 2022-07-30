import { NextPage } from "next";
import { Main } from "@components/layout";
import { UserTable } from "@module/user/Table";

const UserPage: NextPage = () => {
  return (
    <Main title="Kelola Pengguna">
      <UserTable />
    </Main>
  );
};

export default UserPage;
