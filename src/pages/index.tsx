import { NextPage } from "next";
import { Main } from "@components/layout";
import {
  Box,
  Heading,
  Stack,
  AspectRatio,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatArrow,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { TotalTransPerCatChart, ProgramBreakdownChart } from "@components";
import { useAggregateTransactionQuery } from "@queries";
import { formatIDR } from "@lib/currency";

const Home: NextPage = () => {
  const { data } = useAggregateTransactionQuery();

  return (
    <Main bg="gray.100" title="Dashboard">
      <Stack spacing="4">
        <Wrap spacing="4">
          {data?.map((item: any) => (
            <WrapItem minW="31.5%" maxW="33.3333%" key={item.id}>
              <CatSummary data={item} />
            </WrapItem>
          ))}
        </Wrap>
        <Stack direction="row" spacing="4">
          <Box bg="white" borderRadius="lg" p="3" flex={1}>
            <AspectRatio w="full" ratio={4 / 1.5}>
              <ProgramBreakdownChart />
            </AspectRatio>
          </Box>
        </Stack>
        <Stack>
          <Box bg="white" borderRadius="lg" p="3" flex={1} maxW="600px">
            <Heading size="sm">Total Donasi Per Kategori</Heading>
            <AspectRatio w="full" ratio={1}>
              <TotalTransPerCatChart />
            </AspectRatio>
          </Box>
        </Stack>
      </Stack>
    </Main>
  );
};

const CatSummary = (props: any) => {
  const { data } = props;
  const prevAmount = data?.total?.prevMonth ?? 0;
  const currentAmount = data?.total?.currentMonth ?? 0;
  const title = data?.title ?? "";
  const diff = Math.abs(prevAmount - currentAmount);
  const type = prevAmount > currentAmount ? "decrease" : "increase";

  return (
    <Box
      textAlign="center"
      bg="white"
      borderRadius="lg"
      py="4"
      px="8"
      flex={1}
      w="100%"
    >
      <Stat>
        <StatLabel fontSize="lg">{title}</StatLabel>
        <StatNumber>
          {diff === 0 ? null : <StatArrow type={type} />}{" "}
          {formatIDR(currentAmount)}
        </StatNumber>
        <Stack direction="row" spacing="4" mt="3" justify="space-between">
          <Box textAlign="left">
            <Text fontSize="xs">Sebelumnya</Text>
            <Text fontWeight="bold" fontSize="sm">
              {formatIDR(prevAmount)}
            </Text>
          </Box>
          <Box textAlign="left">
            <Text fontSize="xs">Selisih</Text>
            <Text fontWeight="bold" fontSize="sm">
              {formatIDR(diff)}
            </Text>
          </Box>
        </Stack>
      </Stat>
    </Box>
  );
};

export default Home;
