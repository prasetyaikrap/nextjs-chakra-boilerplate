import { Metadata } from "next";

import { ENVS } from "./envs";

export const baseMetadata: Metadata = {
  title: "Nextjs 15 with Chakra UI",
  description: "Frontend Boilerplate with Nextjs 15 and Chakra UI",
  metadataBase: new URL(ENVS.APP_HOST),
  applicationName: "Nextjs 15 with Chakra UI",
  creator: "Prasetya Ikra Priyadi",
  publisher: "Prasetya Ikra Priyadi",
  authors: [
    {
      name: "Prasetya Ikra Priyadi",
      url: "https://www.linkedin.com/in/prasetya-ikrapriyadi",
    },
  ],
  alternates: {
    canonical: ENVS.APP_HOST,
  },
  icons: `${ENVS.APP_HOST}/icon.ico`,
  openGraph: {
    title: "Nextjs 15 with Chakra UI",
    description: "Frontend Boilerplate with Nextjs 15 and Chakra UI",
    url: ENVS.APP_HOST,
    siteName: "Nextjs 15 with Chakra UI",
    emails: ["prasetya.ikrapriyadi@gmail.com"],
    locale: "id_ID",
    alternateLocale: ["en_US"],
    countryName: "Indonesia",
    type: "website",
    images: [`${ENVS.APP_HOST}/main.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nextjs 15 with Chakra UI",
    description: "Frontend Boilerplate with Nextjs 15 and Chakra UI",
  },
  category: "technology",
  robots: {
    index: true,
    follow: true,
  },
};
