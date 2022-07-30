import React from 'react';
import { Box, Icon, Text, Stack, StackProps } from '@chakra-ui/react';
import { FaRegUser } from 'react-icons/fa';

interface UserCardProps extends StackProps {
  totalusers: string;
  title: string;
}
export const UserCard: React.FC<UserCardProps> = (props) => {
  const { totalusers, title } = props;
  return (
    <Stack
      direction="row"
      p="4"
      rounded="lg"
      align="center"
      justifyContent="space-between"
      bg="white"
      {...props}
    >
      <Icon as={FaRegUser} w="10" h="10"></Icon>
      <Box textAlign="right" fontWeight="bold">
        <Text>{totalusers}</Text>
        <Text>{title}</Text>
      </Box>
    </Stack>
  );
};
