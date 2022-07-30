import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Stack,
  Button,
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import create from "zustand";

import {
  IPaymentMethod,
  usePaymentMethodListQuery,
  useEditPaymentMethodMutation,
  useCreatePaymentMethodMutation,
  httpClient,
} from "@queries";
import { FormInput, FormTextarea } from "@components/form";
import { ImageUpload } from "@components/ImageUpload";

export const PaymentMethodForm = () => {
  const { control, handleSubmit, reset } = useForm<IPaymentMethod>();
  const { data, isOpen, onClose } = usePaymentMethodFormStore();
  const { refetch } = usePaymentMethodListQuery();
  const [image, setImage] = useState<string | undefined>(undefined);
  const [isUploading, setUploading] = useState(false);
  const { mutateAsync: create, isLoading: loadingCreate } =
    useCreatePaymentMethodMutation();
  const { mutateAsync: edit, isLoading: loadingEdit } =
    useEditPaymentMethodMutation();

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("files", file);
      const res = await httpClient.post<any>("/upload", formData);
      setImage(res.data.url as string);
    } catch (error) {
      setImage(data?.imageUrl);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (data) {
      reset(data);
      setImage(data.imageUrl);
    } else {
      reset({});
      setImage(undefined);
    }
  }, [data]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.id) {
        await edit({ ...data, imageUrl: image });
      } else {
        await create({ ...data, imageUrl: image });
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
          {data?.id ? "Edit Metode Pembayaran" : "Tambah Metode Pembayaran"}
        </ModalHeader>
        <ModalBody>
          <Stack>
            <FormInput
              control={control}
              name="title"
              label="Nama Metode Pembayaran"
              rules={{ required: "Nama Harus diisi" }}
              helperText="Contoh: BCA Virtual Account"
            />
            <FormTextarea
              control={control}
              name="description"
              label="Deskripsi"
              helperText="Deskripsi penjelasan tentang metode pembayaran ini"
            />
            <FormInput
              control={control}
              name="accountNumber"
              label="Rekening Utama"
              rules={{ required: "Rekening Utama Harus diisi" }}
            />
            <FormInput
              control={control}
              name="accountNumberSecondary"
              label="Rekening Kedua"
              helperText="Rekening kedua jika ada"
            />
            <ImageUpload
              w="100%"
              src={image}
              onChange={handleUpload}
              isLoading={isUploading}
            />
            <FormControl>
              <FormLabel>Aktifkan?</FormLabel>
              <Controller
                control={control}
                name="enabled"
                defaultValue={true}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Switch
                    colorScheme="brand"
                    isChecked={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Stack direction="row" align="end">
            <Button
              isDisabled={loadingCreate || loadingEdit || isUploading}
              colorScheme="red"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              isLoading={loadingCreate || loadingEdit || isUploading}
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
  data?: IPaymentMethod;
  isOpen: boolean;
  onOpen: (data?: IPaymentMethod) => void;
  onClose: () => void;
}
export const usePaymentMethodFormStore = create<IStore>((set) => {
  return {
    data: undefined,
    isOpen: false,
    onOpen: (data?: IPaymentMethod) => set({ isOpen: true, data }),
    onClose: () => set({ isOpen: false, data: undefined }),
  };
});

export default PaymentMethodForm;
