import { SafariUniverse } from "@/components/SafariUniverse";

type HomeProps = {
  searchParams?: Promise<{
    view?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = searchParams ? await searchParams : undefined;

  return <SafariUniverse initialPhase={params?.view === "system" ? "system" : "landing"} />;
}
