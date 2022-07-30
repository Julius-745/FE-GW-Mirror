/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useCallback, useRef } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  HStack,
  Spacer,
  Stack,
  Box,
  Badge,
  Button,
  Text,
  Icon,
  Select,
} from "@chakra-ui/react";
import { ColumnWithLooseAccessor } from "react-table";
import { ComposedTable } from "@components";
import { MdEdit, MdAdd, MdSearch } from "react-icons/md";
import { Pagination } from "@components";
import { debounce } from "lodash";

import { useOperasionalListQuery, IOperasional } from "@queries";
import { OperasionalForm, useOperasionalFormStore } from "./Form";
import { useRouter } from "next/router";
import { formatIDR } from "@lib/currency";

const { onOpen } = useOperasionalFormStore.getState();

export const OperasionalTable = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { page = 1, limit = 10, search = "" } = router.query ?? {};
  const { data, isLoading } = useOperasionalListQuery({
    page: Number(page),
    limit: Number(limit),
    search: search as string,
    // @ts-ignore
    programId: router.query.programId,
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

  const handleProgramChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (isNaN(Number(e.target.value))) {
      delete router.query["programId"];
      router.replace({
        pathname: router.pathname,
        query: router.query,
      });
    } else {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          programId: e.target.value,
        },
      });
    }
  };

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
      <OperasionalForm />
      <Stack>
        <HStack spacing="4">
          <Box></Box>
          <Spacer />
          <InputGroup w="20rem" maxW="100%">
            <Input
              ref={inputRef}
              onChange={onSearch}
              defaultValue={search}
              borderRadius="full"
              placeholder="Cari Operasional"
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
              Operasional
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

const columns: ColumnWithLooseAccessor<IOperasional>[] = [
  {
    Header: "Tanggal",
    Cell: (cellProps) => {
      const { createdAt } = cellProps.row.original;

      return createdAt;
    },
  },
  {
    Header: "Kebutuhan",
    Cell: (cellProps) => {
      const { title } = cellProps.row.original;

      return title;
    },
  },
  {
    Header: "Kategori",
    Cell: (cellProps) => {
      const { category } = cellProps.row.original;
      return (
        <Badge colorScheme={category === "OPERASIONAL" ? "brand" : "orange"}>
          {category}
        </Badge>
      );
    },
  },
  {
    Header: "Jumlah",
    Cell: (cellProps) => {
      const { amount } = cellProps.row.original;
      return (
        <Box>
          <Text fontWeight="bold">{formatIDR(amount)}</Text>
        </Box>
      );
    },
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
