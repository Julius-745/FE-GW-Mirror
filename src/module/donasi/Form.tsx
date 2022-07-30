import { useEffect, useState, useMemo } from "react";
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
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import create from "zustand";

import {
  ITransaction,
  ITransactionInput,
  usePaymentMethodListQuery,
  useEditTransactionMutation,
  useDonationCategoryListQuery,
  useCreateTransactionMutation,
  httpClient,
} from "@queries";
import { FormInput, FormCurrency } from "@components/form";
import { ImageUpload } from "@components/ImageUpload";
import { DonaturPicker } from "@components";
import { useRouter } from "next/router";
import { useTransactionListQuery } from "@queries";

type FormData = ITransactionInput & {
  id?: string;
};

export const DonasiForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const { page = 1, limit = 10, search = "" } = router.query ?? {};
  const { refetch } = useTransactionListQuery({
    page: Number(page),
    limit: Number(limit),
    search: search as string,
  });
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const { data, isOpen, onClose } = useDonasiFormStore();
  const { data: paymentMethodList } = usePaymentMethodListQuery();
  const [image, setImage] = useState<string | undefined>(undefined);
  const [isUploading, setUploading] = useState(false);
  const { data: donationCategoryList } = useDonationCategoryListQuery();
  // const { mutateAsync: create, isLoading: loadingCreate } =
  //   useCreatePaymentMethodMutation();
  const { mutateAsync: edit, isLoading: loadingEdit } =
    useEditTransactionMutation();
  const { mutateAsync: create, isLoading: loadingCreate } =
    useCreateTransactionMutation();

  const selectedCategory = useMemo(() => {
    return donationCategoryList?.find((category) => category.id === categoryId);
  }, [categoryId, donationCategoryList]);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("files", file);
      const res = await httpClient.post<any>("/upload", formData);
      setImage(res.data.url as string);
    } catch (error) {
      setImage(data?.receiptUrl);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    // @ts-ignore
    setValue("donationProgramId", "");
  }, [categoryId]);

  useEffect(() => {
    if (data) {
      reset({
        id: "" + data.id,
        amount: data.amount,
        donationProgramId: data.donationProgramId,
        donaturId: data.donaturId,
        paymentMethodId: data.paymentMethodId,
        receiptUrl: data.receiptUrl,
      });
      setImage(data.receiptUrl);
      setCategoryId(data.program.category.id);
    } else {
      reset({});
      setImage(undefined);
    }
  }, [data]);

  useEffect(() => {
    if (donationCategoryList && donationCategoryList?.length > 0 && data) {
      setValue("donationProgramId", data.donationProgramId);
    }
  }, [selectedCategory]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.id) {
        await edit({
          id: Number(data.id),
          amount: Number(data.amount),
          donationProgramId: Number(data.donationProgramId),
          donaturId: Number(data.donaturId),
          paymentMethodId: Number(data.paymentMethodId),
          receiptUrl: image,
        });
      } else {
        await create({
          amount: Number(data.amount),
          donationProgramId: Number(data.donationProgramId),
          donaturId: Number(data.donaturId),
          paymentMethodId: Number(data.paymentMethodId),
          receiptUrl: image,
        });
      }
      refetch();
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Modal isCentered size="xl" isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{data?.id ? "Edit Donasi" : "Tambah Donasi"}</ModalHeader>
        <ModalBody>
          <Stack>
            <FormControl isRequired isInvalid={!!errors.donaturId}>
              <FormLabel>Donatur</FormLabel>
              <Controller
                control={control}
                name="donaturId"
                rules={{ required: true }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <DonaturPicker
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                  />
                )}
              />
              <FormErrorMessage>Donatur harus diisi</FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Pilih Kategori</FormLabel>
              <Select
                placeholder="Pilih Kategori"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value ? +e.target.value : undefined);
                }}
              >
                {donationCategoryList?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.donationProgramId}>
              <FormLabel>Pilih Program</FormLabel>
              <Controller
                control={control}
                name="donationProgramId"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Select
                    placeholder="Pilih Kategori"
                    isDisabled={categoryId === undefined}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  >
                    {selectedCategory?.DonationProgram?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.paymentMethodId}>
              <FormLabel>Pilih Metode Pembayaran</FormLabel>
              <Controller
                control={control}
                name="paymentMethodId"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Select
                    placeholder="Pilih Metode Pembayaran"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  >
                    {paymentMethodList?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <FormCurrency
              label="Jumlah Donasi"
              control={control}
              name="amount"
              rules={{
                required: "Jumlah Donasi harus diisi",
                min: {
                  value: 10000,
                  message: "Jumlah minimal donasi adalah Rp 10.000",
                },
              }}
            />
            <ImageUpload
              w="100%"
              label="Upload Bukti Pembayaran"
              src={image}
              onChange={handleUpload}
              isLoading={isUploading}
            />
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
  data?: ITransaction;
  isOpen: boolean;
  onOpen: (data?: ITransaction) => void;
  onClose: () => void;
}
export const useDonasiFormStore = create<IStore>((set) => {
  return {
    data: undefined,
    isOpen: false,
    onOpen: (data?: ITransaction) => set({ isOpen: true, data }),
    onClose: () => set({ isOpen: false, data: undefined }),
  };
});

export default DonasiForm;
