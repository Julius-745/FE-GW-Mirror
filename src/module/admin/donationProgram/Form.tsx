import { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Stack,
  Button,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import create from "zustand";

import {
  IDonationProgram,
  useDonationProgramListQuery,
  useEditDonationProgramMutation,
  useCreateDonationProgramMutation,
  useDonationCategoryListQuery,
} from "@queries";
import { FormInput, FormSelect, FormCurrency } from "@components/form";

type FormData = Pick<
  IDonationProgram,
  "id" | "title" | "target" | "categoryId"
>;

export const DonationProgramForm = () => {
  const { control, handleSubmit, reset } = useForm<FormData>();
  const { data, isOpen, onClose } = useDonationProgramFormStore();
  const { refetch } = useDonationProgramListQuery();
  const { data: donationCategories } = useDonationCategoryListQuery();
  const { mutateAsync: create, isLoading: loadingCreate } =
    useCreateDonationProgramMutation();
  const { mutateAsync: edit, isLoading: loadingEdit } =
    useEditDonationProgramMutation();

  useEffect(() => {
    if (data) {
      reset(data);
    } else {
      reset({});
    }
  }, [data]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.id) {
        await edit({ ...data, target: Number(data.target) });
      } else {
        await create(data);
      }
      refetch();
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Modal isCentered isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {data?.id ? "Edit Program Donasi" : "Tambah Program Donasi"}
        </ModalHeader>
        <ModalBody>
          <Stack>
            <FormSelect
              control={control}
              name="categoryId"
              label="Kategori"
              placeholder="Pilih Kategori"
              rules={{ required: "Kategori harus diisi" }}
            >
              {donationCategories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </FormSelect>
            <FormInput
              control={control}
              name="title"
              label="Nama Program"
              rules={{ required: "Nama Program Harus diisi" }}
            />
            <FormCurrency
              control={control}
              name="target"
              label="Target"
              rules={{ required: "Target Harus diisi" }}
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
export const useDonationProgramFormStore = create<IStore>((set) => {
  return {
    data: undefined,
    isOpen: false,
    onOpen: (data?: FormData) => set({ isOpen: true, data }),
    onClose: () => set({ isOpen: false, data: undefined }),
  };
});

export default DonationProgramForm;
