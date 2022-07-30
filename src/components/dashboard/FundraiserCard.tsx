import React from 'react';
import {
  Stack,
  Heading,
  StatGroup,
  Stat,
  StatLabel,
  StatArrow,
  StatHelpText,
  Box,
  StackProps,
} from '@chakra-ui/react';

import { formatIDR } from '@lib/currency';

interface FundraiserCardProps extends StackProps {
  title: string;
  price: string;
  previousprice: string;
  difference: string;
  status: 1 | 0;
}
export const FundraiserCard: React.FC<FundraiserCardProps> = (props) => {
  const { title, difference, previousprice, price, status } = props;
  const typeArrow = status === 1 ? 'increase' : 'decrease';

  return (
    <Stack p="4" rounded="lg" bg="white" spacing="4" {...props}>
      <Stack w="32" mx="auto" textAlign="center">
        <Heading size="md">{title}</Heading>
        <Box rounded="lg" p="3" textAlign="center" bg="green" color="white">
          {formatIDR(price)}
        </Box>
      </Stack>

      <StatGroup textAlign="center">
        <Stat>
          <StatLabel>Sebelumnya</StatLabel>
          <StatHelpText>{formatIDR(previousprice)}</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Selisih</StatLabel>
          <StatHelpText>{formatIDR(difference)}</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Status</StatLabel>
          <StatHelpText>
            <StatArrow type={typeArrow} />
          </StatHelpText>
        </Stat>
      </StatGroup>
    </Stack>
  );
};
