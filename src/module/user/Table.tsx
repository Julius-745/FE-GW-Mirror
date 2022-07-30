/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useCallback } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  HStack,
  Spacer,
  Stack,
  Box,
  Button,
  Icon,
} from "@chakra-ui/react";
import { ColumnWithLooseAccessor } from "react-table";
import { ComposedTable } from "@components";
import { MdAdd, MdSearch } from "react-icons/md";
import { Pagination } from "@components";
import { debounce } from "lodash";

import { IUser, useUserListQuery } from "@queries";
import { UserForm, useUserFormStore } from "./Form";
import { useRouter } from "next/router";

const { onOpen } = useUserFormStore.getState();

export const UserTable = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { page = 1, limit = 10, search = "" } = router.query ?? {};

  const { data: userList, isLoading } = useUserListQuery({
    page: page as number,
    limit: limit as number,
    search: search as string,
  });

  const onSearch = useCallback(
    debounce(() => {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          search: inputRef.current?.value,
        },
      });
    }, 450),
    [router]
  );

  const handleChangePage = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page,
      },
    });
  };

  return (
    <>
      <UserForm />
      <Stack>
        <HStack spacing="4">
          <Spacer />
          <InputGroup w="20rem" maxW="100%">
            <Input
              ref={inputRef}
              onChange={onSearch}
              defaultValue={search}
              borderRadius="full"
              placeholder="Cari Donasi"
            />
            <InputRightElement>
              <Icon fontSize="xl" color="gray.400" as={MdSearch} />
            </InputRightElement>
          </InputGroup>
          <Box>
            <Button
              borderRadius="full"
              onClick={() => onOpen(undefined)}
              colorScheme="brand"
            >
              <Icon as={MdAdd} mr="2" />
              Pengguna
            </Button>
          </Box>
        </HStack>
        <ComposedTable
          isLoading={isLoading}
          columns={columns}
          data={userList?.data ?? []}
        />
        <Pagination
          onChange={handleChangePage}
          activePage={userList?.page ?? 1}
          totalPage={userList?.totalPage ?? 1}
        />
      </Stack>
    </>
  );
};

const columns: ColumnWithLooseAccessor<IUser>[] = [
  {
    Header: "Nama",
    Cell: (cellProps) => {
      const { name } = cellProps.row.original;

      return name;
    },
  },
  {
    Header: "Email",
    Cell: (cellProps) => {
      const { email } = cellProps.row.original;

      return email;
    },
  },
  {
    Header: "Role",
    Cell: (cellProps) => {
      const { role } = cellProps.row.original;
      return role.name;
    },
  },
  {
    Header: "#",
    Cell: (cellProps) => {
      return (
        <Button colorScheme="blue" size="sm">
          Reset Password
        </Button>
      );
    },
  },
];
