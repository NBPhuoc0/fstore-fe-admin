"use client";

import { axiosInstance } from "@refinedev/nestjsx-crud";
import Cookies from "js-cookie";
import { AuthProvider, HttpError } from "@refinedev/core";

export const authProviderClient: AuthProvider = {
  login: async ({ email, password }) => {
    // Suppose we actually send a request to the back end here.
    const response = await fetch("https://api.nbphuoc.xyz/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data) {
      if (!data.data.isAdmin) {
        return {
          success: false,
          error: {
            name: "Lỗi đăng nhập",
            message: "Bạn không có quyền truy cập trang này",
          },
        };
      }
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.data.accessToken}`;

      Cookies.set("refreshtoken", data.data.refreshToken, {
        expires: 3, // 30 days
      });
      Cookies.set("user", JSON.stringify(data.data), {
        expires: 3, // 30 days
      });
      return {
        success: true,
        redirectTo: "/",
      };
    }

    // if (true) {
    //   return {
    //     success: true,
    //     redirectTo: "/",
    //   };
    // }
    return {
      success: false,
      error: {
        name: "Lỗi đăng nhập",
        message: "Tên đăng nhập hoặc mật khẩu không đúng",
      },
    };
  },
  logout: async () => {
    Cookies.remove("refreshtoken");
    Cookies.remove("user");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const auth = JSON.parse(Cookies.get("user") || "null");

    if (auth?.isAdmin) {
      return {
        authenticated: true,
      };
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
  onError: async (error) => {
    console.log("in auth provider client");
    console.log("error", error);
    if (error.statusCode === 401) {
      console.log("in auth provider client 401");
      const token = Cookies.get("refreshtoken");
      if (!token) {
        console.log("in auth provider client 401 no token");
        return {
          logout: true,
          redirectTo: "/login",
        };
      }

      const response = await fetch("https://api.nbphuoc.xyz/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.data.accessToken}`;

        Cookies.set("refreshtoken", data.data.refreshToken, {
          expires: 3, // 30 days
        });
        Cookies.set("user", JSON.stringify(data.data), {
          expires: 3, // 30 days
        });
        return {
          success: true,
        };
      } else {
        console.log("in auth provider client 401 no user");
        return {
          logout: true,
          redirectTo: "/login",
        };
      }
    }

    return {
      error,
    };
  },
  // getPermissions: async () => {
  //   const auth = Cookies.get("user");
  //   if (auth) {
  //     const parsedUser = JSON.parse(auth);
  //     return parsedUser.roles;
  //   }
  //   return null;
  // },
  // getIdentity: async () => {
  //   const auth = Cookies.get("user");
  //   if (auth) {
  //     const parsedUser = JSON.parse(auth);
  //     return parsedUser;
  //   }
  //   return null;
  // },
};
