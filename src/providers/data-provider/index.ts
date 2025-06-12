"use client";

import dataProviderNestjsxCrud, {
  axiosInstance,
} from "@refinedev/nestjsx-crud";

// const API_URL = "https://api.nestjsx-crud.refine.dev";
const API_URL_LOCAL = "http://localhost:8080/admin";
const API_URL_SV = "http://api.nbphuoc.xyz/admin";
// const API_URL_AUTH = "http://localhost:8080/auth";

export const dataProviderRes = dataProviderNestjsxCrud(
  API_URL_SV, // Use API_URL_LOCAL for local development
  axiosInstance
);
// export const dataProviderAuth = dataProviderNestjsxCrud(API_URL_AUTH);
