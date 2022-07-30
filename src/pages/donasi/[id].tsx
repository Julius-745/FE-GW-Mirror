import { NextPage } from "next";
import { Main } from "@components/layout";
import {
  Stack,
  Box,
  AspectRatio,
  Heading,
  Text,
  Table,
  Button,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  Image,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useTransactionQuery, useVerifyTransactionMutation } from "@queries";
import { formatIDR } from "@lib/currency";
import { format } from "date-fns";

const DonationDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data,
    refetch,
    isLoading: isLoadingTransaction,
  } = useTransactionQuery(id as string);
  const { mutateAsync, isLoading: isLoadingVerify } =
    useVerifyTransactionMutation();

  const handleVerify = async () => {
    try {
      const isYes = confirm("Yakin ingin validasi transaksi ini?");
      if (isYes) {
        await mutateAsync({
          id: Number(id),
        });
        refetch();
      }
    } catch (e) {}
  };

  function download() {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoice/download/${id}`)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `invoice-${data?.donatur?.name
          ?.split(/\s/)
          .join("-")}-${data?.program?.title?.split(/\s/).join("-")}-${format(
          new Date(data?.createdAt!),
          "dd-MM-yyyy"
        )}.pdf`;
        link.click();
      })
      .catch(console.error);
  }

  return (
    <Main title="Detail Donasi">
      <Stack direction="row">
        <Box flex="1" bg="gray.200">
          <AspectRatio ratio={595 / 842}>
            {id ? (
              <iframe
                src={`${process.env.NEXT_PUBLIC_API_URL}/invoice/download/${id}`}
              />
            ) : (
              <></>
            )}
          </AspectRatio>
        </Box>
        <Box px="1rem" flex="1.5">
          <Box>
            <Heading size="lg">{data?.program?.title}</Heading>
            <Text>
              Target Funding:{" "}
              {(data?.program?.target ?? 0) <= 0 ? (
                <Text color="green.500" as="span">
                  Tidak Ada
                </Text>
              ) : (
                <Text color="green.500" as="span">
                  {formatIDR(data?.program?.target!)}
                </Text>
              )}
            </Text>
          </Box>
          <Table mt="3" size="md" ml="-1rem">
            <Tbody>
              <Tr>
                <Th>Tanggal</Th>
                <Td>
                  {format(
                    data?.createdAt ? new Date(data?.createdAt) : new Date(),
                    "dd MMMM yyyy"
                  )}
                </Td>
              </Tr>
              <Tr>
                <Th>Nama Donatur</Th>
                <Td>{data?.donatur.name}</Td>
              </Tr>
              <Tr>
                <Th>Fundraiser</Th>
                <Td>{data?.donatur?.fundraiser?.name}</Td>
              </Tr>
              <Tr>
                <Th>Metode Pembayaran</Th>
                <Td>
                  <Tooltip label={data?.paymentMethod.title}>
                    <Image
                      h="30px"
                      src={data?.paymentMethod.imageUrl}
                      alt={data?.paymentMethod.title}
                    />
                  </Tooltip>
                </Td>
              </Tr>
              <Tr>
                <Th>Status</Th>
                <Td>
                  <Badge
                    mt="1"
                    colorScheme={data?.isVerified ? "green" : "red"}
                  >
                    {data?.isVerified ? "Sudah Validasi" : "Belum Validasi"}
                  </Badge>
                </Td>
              </Tr>
              <Tr>
                <Th>Jumlah Donasi</Th>
                <Td>{formatIDR(data?.amount ?? 0)}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Stack>
      <Stack mt="2" direction="row" spacing="4" justify="end">
        <Button
          isLoading={isLoadingTransaction}
          onClick={download}
          colorScheme="brand"
        >
          Download Kwitansi
        </Button>
        <Button
          isDisabled={data?.isVerified}
          onClick={handleVerify}
          isLoading={isLoadingTransaction || isLoadingVerify}
          colorScheme="red"
        >
          Validasi
        </Button>
      </Stack>
    </Main>
  );
};

export default DonationDetail;
