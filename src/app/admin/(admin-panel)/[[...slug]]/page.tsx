import { Box } from "@chakra-ui/react";
import { Metadata } from "next";
import { match, P } from "ts-pattern";

import { GenerateMetadataProps, PageProps } from "@/types/global";

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { slug } = await params;

  const pageMeta: Metadata | undefined = match(slug)
    .with(P.nullish, () => ({ title: "Admin Panel - Dashboard" }))
    .otherwise(() => ({ title: "Admin Panel" }));

  return {
    ...pageMeta,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return match(slug)
    .with(P.nullish, () => <Box>Admin Dashboard</Box>)
    .otherwise(() => <div>Not Found</div>);
}
