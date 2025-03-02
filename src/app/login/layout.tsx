// import authOptions from "@app/api/auth/[...nextauth]/options";
// import { getServerSession } from "next-auth/next";
// import { redirect } from "next/navigation";
import { authProviderServer } from "@providers/auth-provider/auth-provider.server";
import { redirect } from "next/navigation";
import React from "react";

export default async function LoginLayout({
  children,
}: React.PropsWithChildren) {
  // const data = await getData();

  // if (data.session?.user) {
  //   return redirect("/");
  // }
  const data = await getData();

  if (data.authenticated) {
    redirect(data?.redirectTo || "/");
  }

  return <>{children}</>;
}

// async function getData() {
//   const session = await getServerSession(authOptions);

//   return {
//     session,
//   };
// }
async function getData() {
  const { authenticated, redirectTo, error } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
    error,
  };
}
