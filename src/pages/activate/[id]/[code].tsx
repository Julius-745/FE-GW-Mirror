import { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useActivationInfo, useActivationMutation } from "@queries";

const ActivateAccount = () => {
  const router = useRouter();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmited, setSubmited] = useState(false);

  const {
    data: info,
    isLoading: loadingInfo,
    isError: errorInfo,
  } = useActivationInfo(router.query.id as any, router.query.code as any);

  const {
    mutateAsync,
    isLoading: loadingMutation,
    error: mutationError,
  } = useActivationMutation();

  useEffect(() => {
    if (mutationError) {
      toast({
        status: "error",
        title: "Error",
        description: "Terjadi sebuah kesalahan",
      });
    }
  }, [mutationError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmited(true);
    try {
      await mutateAsync({
        id: router.query.id as any,
        code: router.query.code as any,
        password,
      });
      toast({
        title: "Success",
        description: "Akunmu sudah aktif, silahkan login",
        status: "success",
      });
      router.replace("/login");
    } catch (error) {}
  };

  if (loadingInfo) return null;

  if (!loadingInfo && !info) {
    return (
      <Container maxW="container.sm" pt="8">
        <Heading as="h1" size="lg">
          Url tidak valid
        </Heading>
      </Container>
    );
  }

  return (
    <Container maxW="container.sm" pt="8">
      <Heading color="gray.600" as="h1" size="xl" mb="3">
        Aktifkan Akun
      </Heading>
      <Text mb="4" color="gray.600">
        Hi{" "}
        <Text as="span" fontWeight="bold">
          {info?.name}
        </Text>
        , Selangkah lagi agar akunmu aktif, silahkan membuat password pada form
        dibawah ini.
      </Text>
      <Stack as="form" onSubmit={handleSubmit} spacing={4}>
        <FormControl isInvalid={isSubmited && password.length < 8}>
          <FormLabel>Password</FormLabel>
          <Input
            required
            type="password"
            placeholder="Minimum 8 Karakter"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <FormErrorMessage>Password minimum harus 8 Karakter</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={isSubmited && password !== passwordConfirmation}
        >
          <FormLabel>Konfirmasi Password</FormLabel>
          <Input
            required
            type="password"
            placeholder="Konfirmasi Password"
            value={passwordConfirmation}
            onChange={(e) => {
              setPasswordConfirmation(e.target.value);
            }}
          />
          <FormErrorMessage>Konfirmasi Password Tidak Sesuai</FormErrorMessage>
        </FormControl>
        <Button type="submit" colorScheme="brand" isLoading={loadingMutation}>
          Submit
        </Button>
      </Stack>
    </Container>
  );
};

export default ActivateAccount;
