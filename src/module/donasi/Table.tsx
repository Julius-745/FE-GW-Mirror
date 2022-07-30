/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useCallback, useRef, useState } from "react";
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
  Image,
  Select,
  useRadioGroup,
  Tooltip,
} from "@chakra-ui/react";
import { ColumnWithLooseAccessor } from "react-table";
import { ComposedTable, RadioCard } from "@components";
import { MdEdit, MdAdd, MdSearch } from "react-icons/md";
import { format } from "date-fns";
import { Pagination } from "@components";
import { debounce } from "lodash";

import {
  useTransactionListQuery,
  ITransaction,
  useDonationProgramListQuery,
} from "@queries";
import { DonasiForm, useDonasiFormStore } from "./Form";
import { useRouter } from "next/router";
import { formatIDR } from "@lib/currency";

const { onOpen } = useDonasiFormStore.getState();

export const DonasiTable = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { page = 1, limit = 10, search = "" } = router.query ?? {};
  const groupOptions = [
    { value: "monthly", label: "Bulanan" },
    { value: "yearly", label: "Tahunan" },
  ];
  const [selectedGroup, setSelectedGroup] = useState("monthly");
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "group",
    value: selectedGroup,
    onChange: (data) => setSelectedGroup(data),
  });

  const group = getRootProps();
  const { data: donationProgramData } = useDonationProgramListQuery({
    page: 1,
    limit: 100,
    search: "",
  });
  const { data, isLoading } = useTransactionListQuery({
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

  return (
    <>
      <DonasiForm />
      <Stack>
        <HStack spacing="4">
          <Box>
            <Select
              onChange={handleProgramChange}
              value={router.query.programId}
              fontWeight="bold"
              variant="unstyled"
              cursor="pointer"
            >
              <option>Semua Program</option>
              {donationProgramData?.data?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <HStack {...group}>
              {groupOptions.map((option) => {
                const radio = getRadioProps({ value: option.value });
                return (
                  <RadioCard key={option.value} {...radio}>
                    {option.label}
                  </RadioCard>
                );
              })}
            </HStack>
          </Box>
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
              Donasi
            </Button>
          </Box>
        </HStack>
        <ComposedTable
          onRowClick={(row) => {
            router.push(`/donasi/${row.id}`);
          }}
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

const columns: ColumnWithLooseAccessor<ITransaction>[] = [
  {
    Header: "Tanggal",
    Cell: (cellProps) => {
      const { createdAt } = cellProps.row.original;

      return format(new Date(createdAt), "dd MMM yyyy");
    },
  },
  {
    Header: "Donatur",
    Cell: (cellProps) => {
      const { donatur } = cellProps.row.original;

      return (
        <Box>
          <Text fontWeight="medium">{donatur.name}</Text>
          <Text fontSize="xs">Fundraiser: {donatur.fundraiser.name}</Text>
        </Box>
      );
    },
  },
  {
    Header: "Program",
    Cell: (cellProps) => {
      const { program } = cellProps.row.original;
      return program.title;
    },
  },
  {
    Header: "Metode",
    Cell: (cellProps) => {
      const { paymentMethod } = cellProps.row.original;
      return (
        <Tooltip label={paymentMethod.title}>
          <Image
            h="30px"
            src={paymentMethod.imageUrl}
            alt={paymentMethod.title}
          />
        </Tooltip>
      );
    },
  },
  {
    Header: "Jumlah",
    Cell: (cellProps) => {
      const { amount, isVerified } = cellProps.row.original;
      return (
        <Box>
          <Text fontWeight="bold">{formatIDR(amount)}</Text>
          <Badge mt="1" colorScheme={isVerified ? "green" : "red"}>
            {isVerified ? "Sudah Validasi" : "Belum Validasi"}
          </Badge>
        </Box>
      );
    },
  },
  {
    Header: "#",
    Cell: (cellProps) => {
      return (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(cellProps.row.original);
          }}
          colorScheme="orange"
          size="sm"
        >
          <Icon as={MdEdit} />
        </Button>
      );
    },
  },
];
