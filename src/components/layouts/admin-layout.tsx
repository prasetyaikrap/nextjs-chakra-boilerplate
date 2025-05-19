"use client";
import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Link as ChakraLink,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactNode, useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const isSmallScreen = useBreakpointValue(
    { base: true, sm: true, md: true, lg: false, xl: false, "2xl": false },
    { ssr: false }
  );
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isSmallScreen === undefined) return;
    setCollapsed(isSmallScreen);
  }, [isSmallScreen]);

  return (
    <Stack
      position="relative"
      minH="100vh"
      pt="80px"
      pl={collapsed ? "90px" : "300px"}
      transition="all ease .5s"
    >
      <Header collapsed={collapsed} />
      <Sidebar collapsed={collapsed} />
      <Container p="16px">{children}</Container>
    </Stack>
  );
}

type HeaderProps = {
  collapsed: boolean;
};

function Header({ collapsed }: HeaderProps) {
  const handleLogout = () => {};
  return (
    <Stack
      position="fixed"
      top="0"
      left={collapsed ? "90px" : "300px"}
      direction="row"
      width={`calc(100% - ${collapsed ? "90px" : "300px"})`}
      minH="80px"
      boxShadow="md"
      bgColor="white"
      justifyContent="space-between"
      alignItems="center"
      padding="10px 80px 10px 40px"
      transition="all ease .5s"
    >
      <Box>APP</Box>
      <Stack direction="row" justifyContent="flex-end">
        <Button onClick={handleLogout}>Logout</Button>
      </Stack>
    </Stack>
  );
}

type SideBarProps = {
  collapsed: boolean;
};

function Sidebar({ collapsed }: SideBarProps) {
  return (
    <Stack
      position="fixed"
      top="0"
      left="0"
      width={collapsed ? "90px" : "300px"}
      height="100vh"
      bgColor="white"
      boxShadow="md"
      gap="16px"
      transition="all ease .5s"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={collapsed ? "center" : "start"}
        p="20px"
        transition="all ease .5s"
      >
        <ChakraLink asChild variant="plain">
          <NextLink href="/" target="_blank">
            <Image
              src="/fox-prasetya.png"
              alt="Prasetya Priyadi"
              boxSize="40px"
              bg="blue.900"
              borderRadius="full"
            />
            {!collapsed && (
              <Heading
                as="h1"
                fontSize="18px"
                textWrap="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                Prasetya Priyadi
              </Heading>
            )}
          </NextLink>
        </ChakraLink>
      </Stack>
    </Stack>
  );
}
