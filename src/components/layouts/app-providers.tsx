import { Container } from "@chakra-ui/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import QueryClientProviders from "./queryclient-provider";
import { UISystemProvider } from "./ui-system-provider";

type AppProvidersProps = {
  children: ReactNode;
  i18n: {
    currentLocale: string;
    messages: Record<string, string>;
  };
};

export default async function AppProviders({
  children,
  i18n: { currentLocale, messages },
}: Readonly<AppProvidersProps>) {
  return (
    <NextIntlClientProvider locale={currentLocale} messages={messages}>
      <QueryClientProviders>
        <UISystemProvider>
          <Container
            minHeight="100vh"
            maxWidth="2560px"
            px="0"
            transition="all ease .5s"
            _light={{
              bg: "white",
            }}
          >
            {children}
          </Container>
        </UISystemProvider>
      </QueryClientProviders>
    </NextIntlClientProvider>
  );
}
