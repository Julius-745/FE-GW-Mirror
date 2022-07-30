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
  IDonatur,
  useDonationCategoryListQuery,
  useDonaturListQuery,
  useEditDonaturMutation,
  useCreateDonaturMutation,
  useMe,
} from "@queries";
import { FormInput, FormSelect, FormTextarea } from "@components/form";

type FormData = Omit<IDonatur, "fundraiser">;

export const PendayagunaanForm = () => {
  const { control, handleSubmit, reset } = useForm<FormData>();
  const { data, isOpen, onClose } = usePendayagunaanFormStore();
  const { data: me } = useMe();
  const { refetch } = useDonaturListQuery();
  const { data: donationCategory } = useDonationCategoryListQuery();
  const [programIds, setProgramIds] = useState<Record<any, any>>({});
  const { mutateAsync: create, isLoading: loadingCreate } =
    useCreateDonaturMutation();
  const { mutateAsync: edit, isLoading: loadingEdit } =
    useEditDonaturMutation();

  useEffect(() => {
    if (data) {
      reset(data);
      setProgramIds(
        data.DonaturOnProgram.reduce((acc: any, item: any) => {
          return { ...acc, [item.programId]: true };
        }, [])
      );
    } else {
      reset({});
      setProgramIds({});
    }
  }, [data, me]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.id) {
        await edit({
          ...data,
          fundraiserId: me?.id!,
          birthdate: new Date(data.birthdate).toISOString(),
          programIds,
        });
      } else {
        await create({
          ...data,
          fundraiserId: me?.id!,
          birthdate: new Date(data.birthdate).toISOString(),
          programIds,
        });
      }
      refetch();
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  const defaultAccordionIndex = useMemo(() => {
    return (
      donationCategory?.reduce((acc, val, index) => {
        if (val.DonationProgram.some((item) => !!programIds[item.id])) {
          return [...acc, index];
        }

        return acc;
      }, [] as number[]) ?? []
    );
  }, [donationCategory, programIds]);

  return (
    <Modal size="5xl" isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {data?.id ? "Edit Donatur" : "Tambah Donatur"}
        </ModalHeader>
        <ModalBody>
          <Stack>
            <FormSelect
              control={control}
              name="category"
              label="Kategori"
              rules={{ required: "Kategori Harus Diisi" }}
              placeholder="Pilih Kategori"
            >
              <option value="Pendidikan">Pendidikan</option>
              <option value="Dakwah">Dakwah</option>
              <option value="Ekonomi">Ekonomi</option>
              <option value="Sosial">Sosial</option>
              <option value="Kesehatan">Kesehatan</option>
            </FormSelect>
            <HStack>
              <FormInput
                control={control}
                name="program"
                label="Program"
                rules={{ required: "Program Harus diisi" }}
              />
            </HStack>
            <FormInput
              control={control}
              name="subBab"
              label="Sub Bab"
              rules={{ required: "Sub Bab Harus Diisi" }}
            />
            <FormInput
              control={control}
              name="amount"
              label="Jumlah"
              rules={{ required: "Jumlah Harus diisi" }}
            />
            <FormInput
              control={control}
              name="documentation"
              label="Link Dokumentasi"
              rules={{ required: "Link Dokumentasi Harus diisi" }}
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
              disabled={true}
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
export const usePendayagunaanFormStore = create<IStore>((set) => {
  return {
    data: undefined,
    isOpen: false,
    onOpen: (data?: FormData) => set({ isOpen: true, data }),
    onClose: () => set({ isOpen: false, data: undefined }),
  };
});

export default PendayagunaanForm;
