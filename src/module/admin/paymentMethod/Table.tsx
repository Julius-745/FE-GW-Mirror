import {
  Stack,
  Box,
  Text,
  Code,
  Button,
  Badge,
  Icon,
  AspectRatio,
  Image,
} from "@chakra-ui/react";
import { ColumnWithLooseAccessor } from "react-table";
import { ComposedTable } from "@components";
import { MdEdit, MdAdd } from "react-icons/md";

import { usePaymentMethodListQuery, IPaymentMethod } from "@queries";
import { PaymentMethodForm, usePaymentMethodFormStore } from "./Form";

const { onOpen } = usePaymentMethodFormStore.getState();

export const PaymentMethodTable = () => {
  const { data } = usePaymentMethodListQuery();

  return (
    <>
      <PaymentMethodForm />
      <Stack>
        <Stack align="end">
          <Box>
            <Button
              borderRadius="full"
              onClick={() => onOpen(undefined)}
              colorScheme="brand"
            >
              <Icon as={MdAdd} mr="2" />
              Metode Pembayaran
            </Button>
          </Box>
        </Stack>
        <ComposedTable columns={columns} data={data ?? []} />
      </Stack>
    </>
  );
};

const columns: ColumnWithLooseAccessor<IPaymentMethod>[] = [
  {
    Header: "Nama",
    Cell: (cellProps) => {
      const { title, imageUrl } = cellProps.row.original;
      return (
        <Box display="flex" flexDirection="row" alignItems="center">
          <Image mr="3" h="40px" alt={title} src={imageUrl} />
          <Text>{title}</Text>
        </Box>
      );
    },
  },
  {
    Header: "Deskripsi",
    Cell: (cellProps) => cellProps.row.original.description,
  },
  {
    Header: "Rekening",
    Cell: (cellProps) => {
      const { accountNumber, accountNumberSecondary } = cellProps.row.original;

      return (
        <Box>
          <Text>
            <Code>Rek 1: {accountNumber}</Code>
          </Text>
          {accountNumberSecondary ? (
            <Text>
              <Code>Rek 2: {accountNumberSecondary}</Code>
            </Text>
          ) : null}
        </Box>
      );
    },
  },
  {
    Header: "Status",
    Cell: (cellProps) => {
      const { enabled } = cellProps.row.original;
      return (
        <Badge colorScheme={enabled ? "green" : "gray"}>
          {enabled ? "Active" : "Inactive"}
        </Badge>
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
