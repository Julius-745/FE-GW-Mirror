import { useMemo } from "react";
import { HStack, Button, IconButton, IconButtonProps } from "@chakra-ui/react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

export interface PaginationProps extends Pick<IconButtonProps, "colorScheme"> {
  activePage: number;
  totalPage: number;
  onChange?: (page: number) => void;
}

export const Pagination = (props: PaginationProps) => {
  const { activePage, totalPage = 1, colorScheme, onChange } = props;

  const pageList = useMemo(() => {
    const startPage = Math.max(1, activePage - 2);
    const endPage = Math.min(activePage + 2, totalPage);

    return new Array(endPage - startPage + 1)
      .fill(null)
      .map((_, idx) => startPage + idx);
  }, [activePage, totalPage]);

  const canGoBack = useMemo(() => activePage > 1, [activePage]);
  const canGoForward = useMemo(
    () => activePage! < totalPage,
    [activePage, totalPage]
  );

  const goBack = () => {
    onChange?.(activePage - 1);
  };

  const goForward = () => {
    onChange?.(activePage + 1);
  };

  return (
    <HStack pt="4" justify="end">
      <IconButton
        aria-label="Previous"
        icon={<FaChevronLeft />}
        onClick={goBack}
        isDisabled={!canGoBack}
      />
      {pageList.map((item) => (
        <Button
          onClick={() => onChange?.(item)}
          colorScheme={activePage === item ? colorScheme : "gray"}
          key={item}
        >
          {item}
        </Button>
      ))}
      <IconButton
        aria-label="Next"
        icon={<FaChevronRight />}
        onClick={goForward}
        isDisabled={!canGoForward}
      />
    </HStack>
  );
};

Pagination.defaultProps = {
  colorScheme: "brand",
};
