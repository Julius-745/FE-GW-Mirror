/* eslint-disable react-hooks/exhaustive-deps */
import {
  Stack,
  Box,
  Text,
  Button,
  Icon,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
} from "@chakra-ui/react";
import { ColumnWithLooseAccessor } from "react-table";
import { ComposedTable, Pagination } from "@components";
import { MdEdit, MdAdd, MdSearch } from "react-icons/md";

import { useDonationProgramListQuery, IDonationProgram } from "@queries";
import { DonationProgramForm, useDonationProgramFormStore } from "./Form";
import { formatIDR } from "@lib/currency";
import { useRouter } from "next/router";
import { useCallback, useRef } from "react";
import { debounce } from "lodash";

const { onOpen } = useDonationProgramFormStore.getState();

export const DonationProgramTable = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { page = 1, limit = 10, search = "" } = router.query ?? {};
  const { data, isLoading } = useDonationProgramListQuery({
    page: Number(page),
    limit: Number(limit),
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
    []
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
      <DonationProgramForm />
      <Stack>
        <HStack spacing="4">
          <Spacer />
          <InputGroup w="20rem" maxW="100%">
            <Input
              ref={inputRef}
              onChange={onSearch}
              defaultValue={search}
              borderRadius="full"
              placeholder="Cari Program"
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
              Program
            </Button>
          </Box>
        </HStack>
        <ComposedTable
          isLoading={isLoading}
          columns={columns}
          data={data?.data ?? []}
        />
        <Pagination
          onChange={handleChangePage}
          activePage={data?.page ?? 1}
          totalPage={data?.totalPage ?? 1}
        />
      </Stack>
    </>
  );
};

const columns: ColumnWithLooseAccessor<IDonationProgram>[] = [
  {
    Header: "Nama",
    Cell: (cellProps) => cellProps.row.original.title,
  },
  {
    Header: "Kategori",
    Cell: (cellProps) => cellProps.row.original.category.title,
  },
  {
    Header: "Target",
    Cell: (cellProps) => {
      const { target } = cellProps.row.original;

      return <Text fontWeight="bold">{formatIDR(target)}</Text>;
    },
  },
  {
    Header: "Jumlah Donatur",
    Cell: (cellProps) => cellProps.row.original._count.DonaturOnProgram,
  },
  {
    Header: "#",
    Cell: (cellProps) => {
      return (
        <Button
          onClick={() => onOpen(cellProps.row.original)}
          colorScheme="orange"
          size="sm"
        >
          <Icon mr="2" as={MdEdit} />
          Edit
        </Button>
      );
    },
  },
];
