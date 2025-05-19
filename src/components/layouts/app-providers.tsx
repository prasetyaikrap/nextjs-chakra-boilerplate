import { Container } from "@chakra-ui/react";
import { ReactNode } from "react";

import { Provider } from "@/components/ui/provider";

export function AppProviders({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Provider>
      <Container minHeight="100vh" maxWidth="2560px" px="0">
        {children}
      </Container>
    </Provider>
  );
}
