"use client";
import {
  Accordion,
  Box,
  Button,
  Container,
  Heading,
  Image,
  Link as ChakraLink,
  LinkBox,
  LinkOverlay,
  Span,
  Stack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactNode, useEffect, useState } from "react";

import useAdminMenu from "@/hooks/useAdminMenu";
import { MenuProviderProps } from "@/providers/admin-providers/type";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const adminMenuProps = useAdminMenu();
  const { collapsed } = adminMenuProps;

  return (
    <Stack
      position="relative"
      minH="100vh"
      pt="80px"
      pl={collapsed ? "90px" : "300px"}
      transition="all ease .5s"
    >
      <Header adminMenuProps={adminMenuProps} />
      <Sidebar adminMenuProps={adminMenuProps} />
      <Container p="16px">{children}</Container>
    </Stack>
  );
}

type HeaderProps = {
  adminMenuProps: ReturnType<typeof useAdminMenu>;
};

function Header({ adminMenuProps }: HeaderProps) {
  const { collapsed } = adminMenuProps;
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
  adminMenuProps: ReturnType<typeof useAdminMenu>;
};

function Sidebar({ adminMenuProps }: SideBarProps) {
  const { collapsed, items: menuItems } = adminMenuProps;

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
      _dark={{ bgColor: "blackAlpha.800" }}
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
      <Stack>
        {menuItems.map((item) => (
          <MenuItem
            key={item.name}
            item={item}
            adminMenuProps={adminMenuProps}
          />
        ))}
      </Stack>
    </Stack>
  );
}

type MenuItemProps = {
  item: MenuProviderProps;
  adminMenuProps: ReturnType<typeof useAdminMenu>;
  parents?: string[];
};

function MenuItem({ item, adminMenuProps, parents = [] }: MenuItemProps) {
  const { collapsed, selectedKeys, toggleSelectedKeys } = adminMenuProps;
  const fontSize = "1rem";
  const isSelected = selectedKeys.includes(item.name);
  const [accordionValues, setAccordionValues] = useState<string[]>();

  useEffect(() => {
    setAccordionValues(selectedKeys.filter((key) => key === item.name));
  }, [item.name, selectedKeys]);

  if (item.children) {
    return (
      <Accordion.Root
        key={item.name}
        variant="plain"
        value={accordionValues}
        onValueChange={(e) => setAccordionValues(e.value)}
        collapsible
      >
        <Accordion.Item value={item.name}>
          <Accordion.ItemTrigger
            fontSize={fontSize}
            p="10px 20px"
            cursor="pointer"
            _hover={{ bgColor: "blue.50" }}
          >
            <Span
              display="flex"
              flexDir="row"
              flex="1"
              gap="8px"
              justifyContent={collapsed ? "center" : "start"}
              alignItems="center"
            >
              {item.icon}
              {!collapsed && item.label}
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody py="0" pl="16px" pt="8px" spaceY="8px">
              {item.children.map((childItem) => (
                <MenuItem
                  key={childItem.name}
                  item={childItem}
                  adminMenuProps={adminMenuProps}
                  parents={[...parents, item.name]}
                />
              ))}
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    );
  }

  return (
    <LinkBox
      key={item.name}
      display="flex"
      flexDir="row"
      alignItems="center"
      gap="8px"
      p="10px 20px"
      fontSize={fontSize}
      justifyContent={collapsed ? "center" : "start"}
      bgColor={isSelected ? "blue.50" : "transparent"}
      _hover={{ bgColor: "blue.50" }}
      transition="all ease .5s"
      onClick={() => {
        toggleSelectedKeys([...parents, item.name]);
      }}
    >
      {item.icon}
      {!collapsed && <LinkOverlay href={item.list}>{item.label}</LinkOverlay>}
    </LinkBox>
  );
}
