import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Input,
  InputProps,
  Box,
  Text,
  Stack,
  Divider,
  useDisclosure,
  Skeleton,
} from "@chakra-ui/react";

import { useDonaturListQuery, useDonaturQuery } from "@queries";
import { useDebounce } from "react-use";

export interface DonaturPickerProps extends Omit<InputProps, "onChange"> {
  onChange?: (id: number) => void;
}

export const DonaturPicker: React.FC<DonaturPickerProps> = (props) => {
  const { value, onChange } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: donaturData } = useDonaturQuery(Number(value) ?? 1);

  const { data, isLoading } = useDonaturListQuery({
    limit: 20,
    page: 1,
    search: debouncedSearch,
  });

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },
    500,
    [search]
  );

  const handleSelect = (id: number) => () => {
    onChange?.(id);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Input
              placeholder="Cari Donatur"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </ModalHeader>
          <ModalBody px="0" pt="4">
            {!isLoading && (data?.data ?? []).length === 0 ? (
              <Text px="4">
                Data dengan pencarian{" "}
                <Text as="strong" fontWeight="bold">
                  {debouncedSearch}
                </Text>{" "}
                tidak ditemukan
              </Text>
            ) : null}
            <Stack spacing="0" divider={<Divider />}>
              {isLoading
                ? [
                    <Skeleton mb="2" h="30px" key="skeleton1" />,
                    <Skeleton mb="2" h="30px" key="skeleton2" />,
                    <Skeleton h="30px" key="skeleton3" />,
                  ]
                : data?.data?.map((donatur) => (
                    <Box
                      onClick={handleSelect(donatur.id)}
                      px="6"
                      py="2"
                      _hover={{
                        bg: "gray.100",
                      }}
                      cursor="pointer"
                      key={donatur.id}
                    >
                      <Text>{donatur.name}</Text>
                    </Box>
                  ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Input
        value={value ? donaturData?.name ?? "" : ""}
        cursor="pointer"
        onClick={onOpen}
        placeholder="Pilih Donatur"
        readOnly
      />
    </>
  );
};
