import NavBar from "@/components/navBar";
import AddWordModal from "@/components/AddWordModal";
import { Meteors } from "@/components/Meteors";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <>
      <Meteors />
      <div className="relative z-10">
        <NavBar username={session?.username} />
        <div className="pt-16">{children}</div>
        <AddWordModal />
      </div>
    </>
  );
}
