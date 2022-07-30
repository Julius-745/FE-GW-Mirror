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
  FormErrorMessage,
  FormControl,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import create from "zustand";

import {
  IUser,
  IUserInput,
  useUserListQuery,
  useRoleListQuery,
  useCreateUserMutation,
  httpClient,
} from "@queries";
import { FormInput, FormSelect } from "@components/form";
import { ImageUpload } from "@components/ImageUpload";
import { useRouter } from "next/router";

type FormData = IUserInput & {
  id?: string;
};

export const UserForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const { page = 1, limit = 10, search = "" } = router.query ?? {};
  const { refetch } = useUserListQuery({
    page: Number(page),
    limit: Number(limit),
    search: search as string,
  });
  const { data, isOpen, onClose } = useUserFormStore();
  const { data: roleList } = useRoleListQuery();
  const [isUploading, setUploading] = useState(false);
  const { mutateAsync: create, isLoading: loadingCreate } =
    useCreateUserMutation();

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("files", file);
      const res = await httpClient.post<any>("/upload", formData);
      setValue("signatureImageUrl", res.data.url as string);
    } catch (error) {
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (data) {
      reset({
        id: "" + data.id,
        name: data.name,
        email: data.email,
        roleId: data.role.id,
        signatureImageUrl: data.signatureImageUrl,
      });
    } else {
      reset({
        id: undefined,
        name: undefined,
        email: undefined,
        roleId: undefined,
        signatureImageUrl: undefined,
      });
    }
  }, [data]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await create({
        name: data.name,
        email: data.email,
        roleId: Number(data.roleId),
        signatureImageUrl: data.signatureImageUrl,
      });
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
        <ModalHeader>
          {data?.id ? "Edit Pengguna" : "Tambah Pengguna"}
        </ModalHeader>
        <ModalBody>
          <Stack>
            <FormInput
              control={control}
              name="name"
              label="Nama"
              placeholder="Nama Lengkap"
              rules={{
                required: "Nama harus diisi",
              }}
            />
            <FormInput
              control={control}
              name="email"
              label="Email"
              placeholder="nama@domain.com"
              type="email"
              rules={{
                required: "Email harus diisi",
              }}
            />
            <FormSelect
              control={control}
              name="roleId"
              label="Role"
              placeholder="Pilih Role"
              rules={{ required: "Role harus diberikan" }}
            >
              {roleList?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </FormSelect>
            <Controller
              control={control}
              name="signatureImageUrl"
              rules={{
                required: "Tanda tangan wajib diisi",
              }}
              render={({ field: { value } }) => (
                <FormControl isInvalid={!!errors?.signatureImageUrl}>
                  <ImageUpload
                    w="100%"
                    label="Upload Tanda Tangan"
                    src={value}
                    onChange={handleUpload}
                    isLoading={isUploading}
                  />
                  <FormErrorMessage>
                    {errors.signatureImageUrl?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Stack direction="row" align="end">
            <Button
              isDisabled={loadingCreate || isUploading}
              colorScheme="red"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              isLoading={loadingCreate || isUploading}
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
  data?: IUser;
  isOpen: boolean;
  onOpen: (data?: IUser) => void;
  onClose: () => void;
}
export const useUserFormStore = create<IStore>((set) => {
  return {
    data: undefined,
    isOpen: false,
    onOpen: (data?: IUser) => set({ isOpen: true, data }),
    onClose: () => set({ isOpen: false, data: undefined }),
  };
});

export default UserForm;
