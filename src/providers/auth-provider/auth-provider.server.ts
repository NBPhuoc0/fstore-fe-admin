import type { AuthProvider } from "@refinedev/core";
import { cookies } from "next/headers";

export const authProviderServer: Pick<AuthProvider, "check"> = {
  check: async () => {
    const cookieStore = cookies();
    const auth = cookieStore.get("user");

    // Check if the user cookie exists
    // and if it contains the isAdmin property set to true
    if (auth && auth.value) {
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
        name: "Không có quyền truy cập",
        message: "Bạn không có quyền truy cập trang này",
      },
    };
  },
};
