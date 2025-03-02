"use client";

import dataProviderNestjsxCrud, {
  axiosInstance,
} from "@refinedev/nestjsx-crud";

// const API_URL = "https://api.nestjsx-crud.refine.dev";
const API_URL_RES = "http://localhost:8080/admin";
// const API_URL_AUTH = "http://localhost:8080/auth";

export const dataProviderRes = dataProviderNestjsxCrud(
  API_URL_RES,
  axiosInstance
);
// export const dataProviderAuth = dataProviderNestjsxCrud(API_URL_AUTH);
