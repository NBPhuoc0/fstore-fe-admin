import type { AuthProvider } from "@refinedev/core";
import { cookies } from "next/headers";

export const authProviderServer: Pick<AuthProvider, "check"> = {
  check: async () => {
    const cookieStore = cookies();
    const auth = cookieStore.get("user");

    if (auth?.value) {
      if (JSON.parse(auth.value).isAdmin) {
        return {
          authenticated: true,
        };
      }
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
      error: {
        name: "Unauthorized",
        message: "You are not authorized to access this page",
      },
    };
  },
};
