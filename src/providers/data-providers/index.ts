import { DataProviders } from "@refinedev/core";

import { ENVS } from "@/configs/envs";

import { dataProvider } from "./defaultDataProvider";

const dataProviders: DataProviders = {
  default: dataProvider(`${ENVS.APP_HOST}/api`),
};

export default dataProviders;
