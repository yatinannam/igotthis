import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { HeroSection } from "@/components/layout/hero-section";

export default async function Home() {
  const user = await getSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return <HeroSection />;
}
