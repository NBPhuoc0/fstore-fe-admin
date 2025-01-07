"use client";

import dataProviderNestjsxCrud from "@refinedev/nestjsx-crud";

// const API_URL = "https://api.nestjsx-crud.refine.dev";
const API_URL = "http://localhost:8080";

export const dataProvider = dataProviderNestjsxCrud(API_URL);
