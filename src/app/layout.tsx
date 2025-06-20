import type { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { Refine } from "@refinedev/core";
import { AppIcon } from "@components/app-icon";
import {
  AppstoreOutlined,
  AreaChartOutlined,
  BankOutlined,
  ContainerOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  MailOutlined,
  QrcodeOutlined,
  SelectOutlined,
  SketchOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { useNotificationProvider } from "@refinedev/antd";
import { authProviderClient } from "@providers/auth-provider/auth-provider.client";
import { dataProviderRes } from "@providers/data-provider";
import routerProvider from "@refinedev/nextjs-router";
import { OrderNotificationClient } from "@components/notification/order-noti";
import { TicketNotificationClient } from "@components/notification/ticket-noti";

export const metadata: Metadata = {
  title: "Fstore",
  description: "fStore Admin Panel",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en">
      <body>
        <Suspense>
          {/* <RefineContext defaultMode={defaultMode}>{children}</RefineContext> */}
          <RefineKbarProvider>
            <AntdRegistry>
              <ColorModeContextProvider defaultMode={defaultMode}>
                <Refine
                  routerProvider={routerProvider}
                  dataProvider={dataProviderRes} //!
                  notificationProvider={useNotificationProvider}
                  authProvider={authProviderClient} //!
                  resources={[
                    {
                      name: "products",
                      list: "/products",
                      create: "/products/create",
                      meta: {
                        canDelete: true,
                        icon: <AppstoreOutlined />,
                      },
                    },
                    {
                      name: "inventory",
                      list: "/inventory",
                      meta: {
                        canDelete: true,
                        icon: <QrcodeOutlined />,
                      },
                    },
                    {
                      name: "products utils",
                      meta: {
                        icon: <DatabaseOutlined />,
                      },
                    },
                    {
                      name: "categories",
                      list: "/categories",
                      meta: {
                        canDelete: true,
                        icon: <TagsOutlined />,
                        parent: "products utils",
                      },
                    },
                    {
                      name: "brands",
                      list: "/brands",
                      meta: {
                        canDelete: true,
                        icon: <BankOutlined />,
                        parent: "products utils",
                      },
                    },
                    {
                      name: "colors",
                      list: "/colors",
                      meta: {
                        canDelete: true,
                        icon: <ExperimentOutlined />,
                        parent: "products utils",
                      },
                    },
                    {
                      name: "sizes",
                      list: "/sizes",
                      meta: {
                        canDelete: true,
                        icon: <SelectOutlined />,
                        parent: "products utils",
                      },
                    },
                    {
                      name: "vouchers",
                      list: "/vouchers",
                      meta: {
                        canDelete: true,
                        icon: <SketchOutlined />,
                      },
                    },
                    {
                      name: "orders",
                      list: "/orders",
                      meta: {
                        canDelete: true,
                        icon: <ContainerOutlined />,
                      },
                    },
                    {
                      name: "dashboard",
                      list: "/dashboard",
                      meta: {
                        canDelete: true,
                        icon: <AreaChartOutlined />,
                      },
                    },
                    {
                      name: "tickets",
                      list: "/tickets",
                      meta: {
                        canDelete: true,
                        icon: <MailOutlined />,
                      },
                    },
                  ]}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    useNewQueryKeys: true,
                    title: { text: "Fstore Admin", icon: <AppIcon /> },
                  }}
                >
                  <OrderNotificationClient />
                  <TicketNotificationClient />
                  {children}
                  <RefineKbar />
                </Refine>
              </ColorModeContextProvider>
            </AntdRegistry>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
