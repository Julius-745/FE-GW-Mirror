import { useMemo, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Stack, Box, Select } from "@chakra-ui/react";
import { useAggregateCategoryQuery } from "@queries";

export const ProgramBreakdownChart = () => {
  const { data } = useAggregateCategoryQuery();
  const [selectedCategory, setSelectedCategory] = useState(0);

  const categories = useMemo(() => {
    return data?.map((item) => item.title) ?? [];
  }, [data]);

  const programList = useMemo(() => {
    return data?.[selectedCategory]?.program ?? [];
  }, [selectedCategory, data]);

  return (
    <Stack>
      <Box width="100%">
        <Select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(+e.target.value);
          }}
          fontWeight="bold"
        >
          {categories.map((item, index) => (
            <option key={index} value={index}>
              Kategori {item}
            </option>
          ))}
        </Select>
      </Box>
      <ResponsiveBar
        data={programList as any}
        keys={["total", "target"]}
        indexBy="title"
        groupMode="grouped"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: "fries",
            },
            id: "dots",
          },
          {
            match: {
              id: "sandwich",
            },
            id: "lines",
          },
        ]}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={function (e) {
          return (
            e.id + ": " + e.formattedValue + " in country: " + e.indexValue
          );
        }}
      />
    </Stack>
  );
};
