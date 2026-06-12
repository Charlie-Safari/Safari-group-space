import Link from "next/link";
import { notFound } from "next/navigation";
import { safariObjects } from "@/data/safariSystem";

type WorldPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return safariObjects.map((object) => ({
    id: object.id
  }));
}

export async function generateMetadata({ params }: WorldPageProps) {
  const { id } = await params;
  const world = safariObjects.find((object) => object.id === id);

  return {
    title: world ? `${world.name} | Safari Group` : "World | Safari Group",
    description: world?.summary ?? "Safari Group world page"
  };
}

export default async function WorldPage({ params }: WorldPageProps) {
  const { id } = await params;
  const world = safariObjects.find((object) => object.id === id);

  if (!world) notFound();

  const sectionLinks =
    world.tabs?.map((tab) => ({ href: `#${tab.id}`, label: tab.label })) ??
    [...(world.moons ?? []), ...world.destinations].map((destination) => ({ href: "#coming-soon", label: destination }));

  return (
    <main className="world-page">
      <nav className="world-nav" aria-label="World navigation">
        <Link href="/?view=system">Back to System</Link>
      </nav>

      <section className="world-hero">
        <p className="panel-eyebrow">{world.theme}</p>
        <h1>{world.name}</h1>
        <p>{world.summary}</p>
      </section>

      <section className="world-section" aria-labelledby="world-overview">
        <h2 id="world-overview">Overview</h2>
        <div className="world-link-grid">
          {sectionLinks.map((link) => (
            <a href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </div>
      </section>

      {world.tabs ? (
        <section className="world-section world-detail-sections" aria-label={`${world.name} sections`}>
          {world.tabs.map((tab) => (
            <article className="world-detail" id={tab.id} key={tab.id}>
              <h2>{tab.label}</h2>
              {tab.subtitle ? <h3>{tab.subtitle}</h3> : null}
              <p>{tab.body}</p>
            </article>
          ))}
        </section>
      ) : null}

      <section className="world-section coming-soon" id="coming-soon" aria-labelledby="coming-soon-title">
        <h2 id="coming-soon-title">Coming Soon!</h2>
        <p>Background images, deeper details, maps, media, and interactive sections will be added here as the world develops.</p>
      </section>
    </main>
  );
}
