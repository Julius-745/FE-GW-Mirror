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

import {
  useDonaturListQuery,
  useDonationProgramListQuery,
  IDonatur,
} from "@queries";
import { PendayagunaanForm, usePendayagunaanFormStore } from "./Form";
import { useRouter } from "next/router";

const { onOpen } = usePendayagunaanFormStore.getState();

export const PendayagunaanTable = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { page = 1, limit = 10, search = "" } = router.query ?? {};
  const { data: programList } = useDonationProgramListQuery({
    page: 1,
    limit: 100,
    search: "",
  });
  const { data, isLoading } = useDonaturListQuery({
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
      <PendayagunaanForm />
      <Stack>
        <HStack spacing="4">
          <Spacer />
          <InputGroup w="20rem" maxW="100%">
            <Input
              ref={inputRef}
              onChange={onSearch}
              defaultValue={search}
              borderRadius="full"
              placeholder="Cari Pendayagunaan"
              disabled={true}
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
              Pendayagunaan
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

const columns: ColumnWithLooseAccessor<IDonatur>[] = [
  {
    Header: "Tanggal",
    /**Cell: (cellProps) => {
      const { name, fundraiser } = cellProps.row.original;

      return (
        <Box>
          <Text fontWeight="medium">{name}</Text>
          <Text fontSize="xs">Fundraiser: {fundraiser.name}</Text>
        </Box>
      );
    },*/
  },
  {
    Header: "Berita Acara",
    /**Cell: (cellProps) => {
      const { phoneNumber } = cellProps.row.original;

      return phoneNumber;
    },*/
  },
  {
    Header: "Kategori",
    /**Cell: (cellProps) => {
      const { address } = cellProps.row.original;

      return address ?? "-";
    },*/
  },
  {
    Header: "Penerima Manfaat",
    /**Cell: (cellProps) => {
      const { commitment } = cellProps.row.original;
      return (
        <Badge colorScheme={commitment === "RUTIN" ? "brand" : "orange"}>
          {commitment}
        </Badge>
      );
    },*/
  },
  {
    Header: "Jumlah",
    /**Cell: (cellProps) => {
      const { commitment } = cellProps.row.original;
      return (
        <Badge colorScheme={commitment === "RUTIN" ? "brand" : "orange"}>
          {commitment}
        </Badge>
      );
    },*/
  },
  {
    Header: "Link Dokumen",
    /**Cell: (cellProps) => {
      const { commitment } = cellProps.row.original;
      return (
        <Badge colorScheme={commitment === "RUTIN" ? "brand" : "orange"}>
          {commitment}
        </Badge>
      );
    },*/
  },
  {
    Header: "#",
    /**Cell: (cellProps) => {
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
    },*/
  },
];
