/* eslint-disable react/jsx-key */
import React from "react";
import {
  TableProps,
  Table,
  Tbody,
  Thead,
  Tr,
  Td,
  Th,
  Skeleton,
} from "@chakra-ui/react";
import { useTable, Column } from "react-table";

export interface ComposedTableProps extends TableProps {
  isLoading?: boolean;
  columns: Column<any>[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export const ComposedTable: React.FC<ComposedTableProps> = (props) => {
  const { columns, data, isLoading, onRowClick, ...rest } = props;
  const {
    allColumns,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });
  return (
    <Table size="md" {...rest} {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th bg="gray.100" {...column.getHeaderProps()}>
                {column.render("Header")}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {isLoading ? (
          <>
            {Array.from(Array(5)).map((_, index) => (
              <Tr key={index}>
                {allColumns.map((_, index) => (
                  <Td key={index}>
                    <Skeleton height="20px" />
                  </Td>
                ))}
              </Tr>
            ))}
          </>
        ) : (
          rows.map((row) => {
            prepareRow(row);
            const rowProps = row.getRowProps();
            return (
              <Tr
                onClick={() => onRowClick?.(row.original)}
                cursor={onRowClick ? "pointer" : undefined}
                _hover={
                  onRowClick
                    ? {
                        bg: "gray.200",
                      }
                    : undefined
                }
                {...rowProps}
              >
                {row.cells.map((cell) => {
                  return (
                    <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                  );
                })}
              </Tr>
            );
          })
        )}
      </Tbody>
    </Table>
  );
};
