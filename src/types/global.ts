export type Params = {
  slug?: string[] | string;
};

export type SearchParams = {
  preview?: string[] | string;
};

export type PageProps = {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
};

export type GenerateMetadataProps = {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
};

export type UserProfileData = {
  id: string;
  name: string;
  email: string;
  permissions: string[];
};
