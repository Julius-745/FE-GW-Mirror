import { useMemo, useEffect, useState } from "react";
import {
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Stack,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Wrap,
  WrapItem,
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import create from "zustand";

import {
  IOperasional,
  useOperasionalListQuery,
  useEditOperasionalMutation,
  useCreateOperasionalMutation,
  useMe,
} from "@queries";
import { FormInput, FormSelect, FormCurrency } from "@components/form";

type FormData = Omit<IOperasional, "">;

export const OperasionalForm = () => {
  const { control, handleSubmit, reset } = useForm<FormData>();
  const { data, isOpen, onClose } = useOperasionalFormStore();
  const { data: me } = useMe();
  const { refetch } = useOperasionalListQuery();
  const [programIds, setProgramIds] = useState<Record<any, any>>({});
  const { mutateAsync: create, isLoading: loadingCreate } =
    useCreateOperasionalMutation();
  const { mutateAsync: edit, isLoading: loadingEdit } =
    useEditOperasionalMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.id) {
        await edit({
          ...data,
        });
      } else {
        await create({
          ...data,
        });
      }
      refetch();
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Modal size="5xl" isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {data?.id ? "Edit Operasional" : "Tambah Operasional"}
        </ModalHeader>
        <ModalBody>
          <Stack>
            <FormInput
              control={control}
              name="title"
              label="Kebutuhan"
              rules={{ required: "Kebutuhan Harus di Isi" }}
            />
            <HStack>
              <FormSelect
                control={control}
                name="category"
                label="Kategori"
                rules={{ required: "Kategori Harus Diisi" }}
                placeholder="Pilih Kategori"
              >
                <option value="OPERASIONAL">Operasional</option>
                <option value="PENDAYAGUNAAN">Pendayagunaan</option>
              </FormSelect>
            </HStack>
            <FormCurrency
              label="Jumlah Pengeluaran Operasional"
              control={control}
              name="amount"
              rules={{
                required: "Jumlah Operasioanl harus diisi",
                min: {
                  value: 10000,
                  message: "Jumlah minimal operasional adalah Rp 10.000",
                },
              }}
            />
            <FormInput
              control={control}
              name="documentation"
              label="Bukti Operasional"
              // rules={{ required: "Bukti Operasional Harus diisi" }}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Stack direction="row" align="end">
            <Button colorScheme="red" onClick={onClose}>
              Batal
            </Button>
            <Button
              isLoading={loadingCreate || loadingEdit}
              colorScheme="brand"
              onClick={onSubmit}
            >
              Simpan
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface IStore {
  data?: FormData;
  isOpen: boolean;
  onOpen: (data?: FormData) => void;
  onClose: () => void;
}
export const useOperasionalFormStore = create<IStore>((set) => {
  return {
    data: undefined,
    isOpen: false,
    onOpen: (data?: FormData) => set({ isOpen: true, data }),
    onClose: () => set({ isOpen: false, data: undefined }),
  };
});

export default OperasionalForm;
