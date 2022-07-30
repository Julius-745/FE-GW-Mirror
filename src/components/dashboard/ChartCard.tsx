import React from 'react';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { ResponsivePie } from '@nivo/pie';

export interface DataChart {
  id: string;
  label: string;
  value: number;
}
interface ChartCardProps {
  data: DataChart[];
}
export const ChartCard: React.FC<ChartCardProps> = (props) => {
  const { data } = props;

  return (
    <Stack
      w="100%"
      textAlign="center"
      bg="gray.100"
      p={4}
      alignItems="center"
      rounded="lg"
    >
      <Heading size="md">Kategori Donasi</Heading>
      <Box h="15rem" w="100%">
        <ResponsivePie
          data={data ?? []}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          colors={{ scheme: 'pastel2' }}
        />
      </Box>
    </Stack>
  );
};
