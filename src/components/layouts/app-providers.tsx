import { Container } from "@chakra-ui/react";
import { ReactNode } from "react";

import { Provider } from "@/components/ui/provider";

import RefineProviders from "./refine-providers";

export default function AppProviders({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Provider>
      <RefineProviders>
        <Container minHeight="100vh" maxWidth="2560px" px="0">
          {children}
        </Container>
      </RefineProviders>
    </Provider>
  );
}
