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

export const DonaturForm = () => {
  const { control, handleSubmit, reset } = useForm<FormData>();
  const { data, isOpen, onClose } = useDonaturFormStore();
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
            <FormInput
              control={control}
              name="name"
              label="Nama Lengkap"
              rules={{ required: "Nama Lengkap Harus diisi" }}
            />
            <HStack>
              <FormInput
                control={control}
                type="date"
                name="birthdate"
                label="Tanggal Lahir"
                rules={{ required: "Tanggal Lahir Harus diisi" }}
              />
              <FormSelect
                control={control}
                name="gender"
                label="Jenis Kelamin"
                rules={{ required: "Jenis Kelamin Harus Diisi" }}
                placeholder="Pilih Jenis Kelamin"
              >
                <option value="MALE">Laki - Laki</option>
                <option value="FEMALE">Perempuan</option>
              </FormSelect>
              <FormSelect
                control={control}
                name="commitment"
                label="Komitmen"
                rules={{ required: "Komitmen Harus Diisi" }}
                placeholder="Pilih Komitmen"
              >
                <option value="RUTIN">RUTIN</option>
                <option value="ISIDENTIL">ISIDENTIL</option>
              </FormSelect>
            </HStack>
            <FormTextarea
              control={control}
              name="address"
              label="Alamat"
              rules={{ required: "Alamat Harus Diisi" }}
            />
            <FormInput
              control={control}
              name="phoneNumber"
              label="Nomor HP"
              rules={{ required: "Nomor HP Harus diisi" }}
            />
            <FormControl>
              <FormLabel>Pilih Program</FormLabel>
              <Accordion defaultIndex={defaultAccordionIndex} allowMultiple>
                {donationCategory?.map((item) => (
                  <AccordionItem key={item.id}>
                    <AccordionButton>
                      <Heading size="sm" fontWeight="bold">
                        Kategori {item.title} (
                        {
                          item.DonationProgram.filter(
                            (item) => !!programIds[item.id]
                          ).length
                        }
                        /{item.DonationProgram.length})
                      </Heading>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <Wrap mb="2">
                        {item.DonationProgram.map((program) => (
                          <WrapItem key={program.id}>
                            <Checkbox
                              isChecked={!!programIds[program.id]}
                              onChange={(e) => {
                                setProgramIds((prev) => ({
                                  ...prev,
                                  [program.id]: e.target.checked,
                                }));
                              }}
                            >
                              {program.title}
                            </Checkbox>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </FormControl>
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
export const useDonaturFormStore = create<IStore>((set) => {
  return {
    data: undefined,
    isOpen: false,
    onOpen: (data?: FormData) => set({ isOpen: true, data }),
    onClose: () => set({ isOpen: false, data: undefined }),
  };
});

export default DonaturForm;
