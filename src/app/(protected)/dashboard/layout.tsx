import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidenavbar from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    role: (session.user as any).role as string,
  };

  return (
    <Sidenavbar user={user}>
      {children}
    </Sidenavbar>
  );
}