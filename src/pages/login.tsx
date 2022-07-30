import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Stack,
  Input,
  FormLabel,
  FormControl,
  Box,
  Button,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import Image from "next/image";
import { Square } from "@module/login";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { useForm } from "react-hook-form";
import { ILoginDTO } from "@interface/auth";
import * as yup from "yup";
import { useLoginMutation } from "@queries";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  })
  .required();

const LoginPage = () => {
  const router = useRouter();
  const { mutateAsync, isLoading, error, isError } = useLoginMutation();
  const { register, handleSubmit, formState } = useForm<ILoginDTO>({
    resolver: yupResolver(schema),
  });
  const errors = formState.errors;

  const onSubmit = handleSubmit(async (loginData) => {
    await mutateAsync(loginData);
    router.replace((router.query.redirectTo as string) ?? "/");
  });

  return (
    <>
      <Box
        w="100vw"
        h="100vh"
        bg="#008240"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <Square />
        <Head>
          <title>Login</title>
        </Head>
        <Box
          px={10}
          pb={8}
          bg="white"
          borderRadius="2xl"
          boxShadow="lg"
          position="fixed"
        >
          <Stack
            onSubmit={onSubmit}
            as="form"
            spacing="1.2rem"
            textAlign="center"
            display="flex"
          >
            <Image
              src="/logo-bma.png"
              width="250"
              height="100%"
              layout="fixed"
              alt="logo-bma"
            />
            {isError ? (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>{error.error}</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            ) : null}
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                {...register("email")}
                type="email"
                placeholder="email address"
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                {...register("password")}
                type="password"
                placeholder="password"
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
              Login
            </Button>
            <Button variant="link">Forgot Password</Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
