import React from "react";
import { Box } from '@chakra-ui/react'

export interface SquareProps {
  outerFill?: string;
  width?: number;
  height?: number;
}

export const Square: React.FC<SquareProps> = (props) => (
  <>
    <Box position="fixed" top="0" left="0">
      <svg
        width="100%"
        height={props.height ?? 544}
        viewBox={"0 0 584 544"}
        fill="none"
      >
        <rect
          x={-411}
          y={79.3301}
          width={750}
          height={750}
          rx={160}
          transform={"rotate(-45 -411 79.3301)"}
          fill={props.outerFill ?? "#B9EA38"}
        />
      </svg>
    </Box >
    <Box position="fixed" bottom="0" right="0" transform="rotate(180deg)">
      <svg
        width="100%"
        height={props.height ?? 544}
        viewBox={"0 0 584 544"}
        fill="none"
      >
        <rect
          x={-411}
          y={79.3301}
          width={750}
          height={750}
          rx={160}
          transform={"rotate(-45 -411 79.3301)"}
          fill={props.outerFill ?? "#B9EA38"}
        />
      </svg>
    </Box >
  </>
);

