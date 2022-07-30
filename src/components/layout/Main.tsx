import React, { useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { format } from "date-fns";
import {
  Flex,
  Box,
  Heading,
  Text,
  Stack,
  Icon,
  Avatar,
  Button,
  Spacer,
} from "@chakra-ui/react";
import { Footer } from "@components/layout";
import {
  MdDashboard,
  MdFolderOpen,
  MdMailOutline,
  MdOutlineSailing,
  MdCalendarToday,
  MdLogout,
  MdPayment,
  MdVerticalSplit,
  MdPerson,
} from "react-icons/md";
import { useMe, useLogoutMutation } from "@queries";

export interface MainProps {
  title?: string;
  bg?: string;
}

export const Main: React.FC<MainProps> = (props) => {
  const { children, bg, title } = props;
  return (
    <>
      <Head>
        <title>
          {title ? `${title} | Dompet Kebaikan` : "Dompet Kebaikan"}
        </title>
      </Head>

      <Flex direction="row">
        <Flex shadow="md" minW="15rem" maxW="20rem" h="100vh">
          <Sidebar />
        </Flex>
        <Flex h="100vh" flex={1} as="main" direction="column">
          <Stack
            bg="brand.500"
            direction="row"
            align="center"
            shadow="sm"
            minH="60px"
            px="8"
          >
            <Heading color="white" size="md">
              {title ?? "Dompet Kebaikan"}
            </Heading>
            <Spacer />
            <Stack direction="row">
              <Icon fontSize="xl" as={MdCalendarToday} color="white" />
              <Heading color="white" size="sm">
                {format(new Date(), "dd MMMM yyyy")}
              </Heading>
            </Stack>
          </Stack>
          <Stack bg={bg} position="relative" pt="4" overflowY="scroll" flex={1}>
            <Box px="8">{children}</Box>
            <Spacer />
            <Footer>
              Copyright &copy; {new Date().getFullYear()} Dompet Kebaikan
            </Footer>
          </Stack>
        </Flex>
      </Flex>
    </>
  );
};

const SidebarMenuItem: React.FC<{ icon: any; href: string }> = (props) => {
  const { icon, href, children } = props;
  const router = useRouter();
  const isActive = useMemo(() => {
    return router.pathname === href;
  }, [router.pathname, href]);

  return (
    <Link passHref href={href}>
      <Stack
        spacing="3"
        _hover={{ bg: "brand.100" }}
        borderColor="brand.500"
        bg={isActive ? "brand.50" : undefined}
        borderRightWidth={isActive ? "5px" : undefined}
        borderStyle="solid"
        px="6"
        py="3"
        w="full"
        cursor="pointer"
        direction="row"
        align="center"
      >
        <Icon color="gray.600" fontSize="lg" as={icon} />
        <Text color="gray.600">{children}</Text>
      </Stack>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <Stack w="full" pb="8">
      <Heading mb="4" px="6" py="3" size="sm">
        Dompet Kebaikan
      </Heading>
      <Box>
        <Heading px="6" size="sm" fontWeight="medium" color="gray.400">
          Main Menu
        </Heading>
        <Stack spacing="0" mt="2" w="full">
          <SidebarMenuItem icon={MdDashboard} href="/">
            Dashboard
          </SidebarMenuItem>
          <SidebarMenuItem icon={MdFolderOpen} href="/donasi">
            Donasi
          </SidebarMenuItem>
          <SidebarMenuItem icon={MdMailOutline} href="/donatur">
            Donatur
          </SidebarMenuItem>
          <SidebarMenuItem icon={MdOutlineSailing} href="/operational">
            Operational
          </SidebarMenuItem>
          <SidebarMenuItem icon={MdCalendarToday} href="/pendayagunaan">
            Pendayagunaan
          </SidebarMenuItem>
        </Stack>
        <Box>
          <Heading
            mt="6"
            mb="3"
            px="6"
            size="sm"
            fontWeight="medium"
            color="gray.400"
          >
            Admin
          </Heading>
          <SidebarMenuItem icon={MdPerson} href="/admin/user">
            Kelola Pengguna
          </SidebarMenuItem>
          <SidebarMenuItem icon={MdPayment} href="/admin/metode-pembayaran">
            Metode Pembayaran
          </SidebarMenuItem>
          <SidebarMenuItem icon={MdVerticalSplit} href="/admin/program-donasi">
            Program Donasi
          </SidebarMenuItem>
        </Box>
      </Box>
      <Spacer />
      <AuthCard />
    </Stack>
  );
};

const AuthCard: React.FC = () => {
  const { data } = useMe();
  const { mutateAsync, isLoading } = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await mutateAsync();
      router.replace("/login");
    } catch (error) {}
  };

  return (
    <Stack w="full" px="6">
      <Stack spacing="3" direction="row" align="start">
        <Avatar size="sm" name={data?.name} />
        <Box>
          <Heading size="sm">{data?.name}</Heading>
          <Text color="gray.400">{data?.email}</Text>
        </Box>
      </Stack>
      <Button
        size="sm"
        colorScheme="red"
        isLoading={isLoading}
        onClick={handleLogout}
      >
        <Icon as={MdLogout} mr="2" />
        Logout
      </Button>
    </Stack>
  );
};
