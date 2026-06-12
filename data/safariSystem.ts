export type SafariObjectKind = "star" | "planet" | "comet" | "hidden";

export type SafariTab = {
  id: string;
  label: string;
  subtitle?: string;
  body: string;
};

export type SafariObject = {
  id: string;
  name: string;
  kind: SafariObjectKind;
  theme: string;
  summary: string;
  color: string;
  accent: string;
  radius: number;
  orbitRadius: number;
  speed: number;
  initialAngle: number;
  procession?: {
    x: number;
    z: number;
    sway: number;
  };
  destinations: string[];
  tabs?: SafariTab[];
  moons?: string[];
};

export const safariObjects: SafariObject[] = [
  {
    id: "solari-safari",
    name: "Solari Safari",
    kind: "star",
    theme: "Solar origin point",
    summary: "The center of Safari Group: a living sun, a signal flare, and the first invitation into the system.",
    color: "#ffb23f",
    accent: "#fff0a8",
    radius: 1.75,
    orbitRadius: 0,
    speed: 0,
    initialAngle: 0,
    destinations: ["Building Worlds", "Explore the Universe Under Construction", "Solar Archive"]
  },
  {
    id: "safari-nation",
    name: "Safari Nation",
    kind: "planet",
    theme: "Golden atmosphere, marble cities, gardens, forum, solar pathways",
    summary: "The primary attraction: a sovereign world for constitution, citizenship, culture, housing, AI infrastructure, and the space colony program.",
    color: "#e6bc66",
    accent: "#fff8df",
    radius: 1.18,
    orbitRadius: 5.2,
    speed: 0.08,
    initialAngle: 0.8,
    procession: { x: 12.8, z: -0.2, sway: 0.34 },
    moons: ["Astra", "Arcadia", "Kiri", "Duskwind"],
    destinations: [
      "Astra",
      "Arcadia",
      "Kiri",
      "Duskwind",
      "Constitution",
      "Citizenship",
      "Calendar",
      "Licenses",
      "Housing",
      "Transportation",
      "Agriculture",
      "Education",
      "AI Infrastructure",
      "Space Colony Program",
      "Future Development"
    ],
    tabs: [
      {
        id: "astra",
        label: "Astra",
        subtitle: "The Holy State",
        body: "Astra serves as the spiritual, cultural, and symbolic center of Safari Nation. Home to the Safari Forum, temples, archives, gardens, and institutions of reflection, Astra is dedicated to wisdom, stewardship, philosophy, and long-term civilization building. It is governed directly by Emperor Safari and serves as the seat of national leadership."
      },
      {
        id: "arcadia",
        label: "Arcadia",
        subtitle: "The Democratic State",
        body: "Arcadia is the state of people, innovation, education, and civic life. Designed to support the majority of the Nation's population, Arcadia contains universities, research centers, businesses, public institutions, and residential communities. It is intended to be a living experiment in representative governance, civic engagement, and human development."
      },
      {
        id: "kiri",
        label: "Kiri",
        subtitle: "The Garden State",
        body: "Kiri is the ecological heart of Safari Nation. Dedicated to conservation, sustainability, wildlife, agriculture, and natural beauty, Kiri serves as a reminder that civilization must remain connected to the natural world. Vast forests, sanctuaries, botanical gardens, and agricultural projects define the landscape of this state."
      },
      {
        id: "duskwind",
        label: "Duskwind",
        subtitle: "The Lawless State",
        body: "Duskwind is the frontier of Safari Nation. It exists as a place of experimentation, radical freedom, cultural diversity, and independent community formation. While basic constitutional protections remain, local communities possess broad autonomy to develop their own customs, traditions, and ways of life. Duskwind embraces uncertainty, exploration, and personal responsibility."
      },
      {
        id: "constitution",
        label: "Constitution",
        body: "The Constitution establishes the foundational principles of Safari Nation. It defines the rights of citizens, the structure of government, the responsibilities of leadership, and the relationship between the four states. The Constitution serves as the common framework that unites the Nation while allowing each state to maintain its own unique character."
      },
      {
        id: "citizenship",
        label: "Citizenship",
        body: "Citizenship represents membership within Safari Nation and participation in its cultural, social, and civic life. Citizens may contribute to community projects, governance, education, research, artistic endeavors, and the long-term development of the Nation."
      },
      {
        id: "calendar",
        label: "Calendar",
        body: "Safari Nation utilizes a proposed alternative calendar system designed around ten months, thirty-six day months, and nine-day weeks. The calendar is intended to simplify planning, improve consistency, and create a unique cultural identity for the Nation."
      },
      {
        id: "licenses",
        label: "Licenses",
        body: "Safari Nation issues a variety of licenses recognizing training, competency, and community participation. Proposed licenses include driving, piloting, motorcycling, scooter operation, and specialized certifications. These licenses are intended to encourage education and responsibility while maintaining accessibility."
      },
      {
        id: "housing",
        label: "Housing",
        body: "Housing within Safari Nation is envisioned as affordable, attractive, energy-efficient, and community-oriented. Future concepts include AI-assisted construction, sustainable materials, walkable neighborhoods, and designs that prioritize quality of life over speculation or excessive cost."
      },
      {
        id: "transportation",
        label: "Transportation",
        body: "Transportation systems are designed around efficiency, accessibility, and sustainability. Planned infrastructure includes autonomous transit systems, scooter networks, pedestrian pathways, intelligent traffic management, and renewable energy-powered transportation technologies."
      },
      {
        id: "agriculture",
        label: "Agriculture",
        body: "Agriculture focuses on local food production, environmental stewardship, and long-term sustainability. Community gardens, regenerative farming practices, greenhouses, and locally sourced food systems are intended to provide healthy and affordable nutrition while reducing environmental impact."
      },
      {
        id: "education",
        label: "Education",
        body: "Education in Safari Nation is designed to be lifelong, personalized, and widely accessible. AI-assisted learning systems, digital academies, mentorship networks, project-based learning, and community education programs form the foundation of a flexible educational ecosystem."
      },
      {
        id: "ai-infrastructure",
        label: "AI Infrastructure",
        body: "Artificial intelligence serves as a foundational technology throughout Safari Nation. AI systems assist with education, transportation, construction, administration, maintenance, research, and public services. The goal is to reduce unnecessary labor while increasing human opportunity, creativity, and quality of life."
      },
      {
        id: "space-colony-program",
        label: "Space Colony Program",
        body: "The Space Colony Program explores how communities might one day expand beyond Earth. Safari Nation views itself as a potential testing ground for technologies, governance systems, infrastructure, and cultural practices that could support future off-world settlements."
      },
      {
        id: "future-development",
        label: "Future Development",
        body: "Future Development serves as the living roadmap of Safari Nation. This section tracks proposed projects, emerging technologies, community initiatives, research efforts, infrastructure plans, and long-term goals. The Nation remains an evolving vision, continuously refined through experimentation, learning, and collaboration."
      }
    ]
  },
  {
    id: "safari-ventures",
    name: "Safari Ventures",
    kind: "planet",
    theme: "Advanced civilization, spaceports, commercial hubs, research stations",
    summary: "The company constellation: resort worlds, media systems, Bay-Space, Bay Oracle, Sea Scope, Crawler, and SAFARAI.",
    color: "#58d6ff",
    accent: "#a8f4ff",
    radius: 0.94,
    orbitRadius: 7.5,
    speed: 0.055,
    initialAngle: 2.4,
    procession: { x: 5.7, z: -2.7, sway: 0.3 },
    moons: ["Safari Resort", "Safari Media Group", "Bay-Space", "Bay Oracle", "Sea Scope", "Crawler", "SAFARAI"],
    destinations: ["Mission", "Technology", "Future Roadmap", "Gallery", "Videos", "Investment Potential"]
  },
  {
    id: "safari-research",
    name: "Safari Research",
    kind: "planet",
    theme: "Futuristic university, observatories, research domes, libraries",
    summary: "A research planet for DDP, Bay Oracle research, disability research, sleep apnea studies, and future concepts.",
    color: "#7ff0b0",
    accent: "#d5ffe4",
    radius: 0.82,
    orbitRadius: 9.65,
    speed: 0.041,
    initialAngle: 4.1,
    procession: { x: 8.9, z: 2.65, sway: 0.28 },
    moons: ["DDP", "Bay Oracle Research", "Disability Research", "Sleep Apnea Studies", "Future Research Concepts"],
    destinations: ["Abstract", "Theory", "Evidence", "Videos", "Downloads", "Discussion"]
  },
  {
    id: "philosophari",
    name: "Philosophari",
    kind: "planet",
    theme: "Libraries, gardens, temples, observatories, floating books",
    summary: "The most beautiful planet: philosophy as a physical place, where each question becomes a destination.",
    color: "#c3a4ff",
    accent: "#ffe6ff",
    radius: 0.9,
    orbitRadius: 11.6,
    speed: 0.032,
    initialAngle: 5.2,
    procession: { x: 20.5, z: -3.45, sway: 0.26 },
    moons: ["What Is God?", "Meaning Of Life", "Ethics", "Proverbs", "Human Nature", "Civilization", "Future Of Humanity"],
    destinations: ["Temple Walk", "Garden Library", "Observatory", "Book Fields", "Question Archive"]
  },
  {
    id: "charlie-safari",
    name: "Charlie Safari",
    kind: "planet",
    theme: "Earth, travel, adventure, human story",
    summary: "The furthest world answers the human question behind the universe: who built all of this?",
    color: "#4e8dff",
    accent: "#f5fbff",
    radius: 0.76,
    orbitRadius: 13.6,
    speed: 0.026,
    initialAngle: 3.3,
    procession: { x: 16.7, z: 3.75, sway: 0.24 },
    destinations: ["Biography", "Photos", "Projects", "Interviews", "Interests", "Books", "Travel", "Safari Universe Origins", "Future Vision"]
  },
  {
    id: "updates-comet",
    name: "Updates Comet",
    kind: "comet",
    theme: "Fast-moving dispatches from the active build",
    summary: "A moving trail for announcements, construction logs, release notes, and discoveries.",
    color: "#ffffff",
    accent: "#80f3ff",
    radius: 0.34,
    orbitRadius: 15.2,
    speed: 0.085,
    initialAngle: 1.6,
    procession: { x: -2.8, z: 5.2, sway: 1.35 },
    destinations: ["Announcements", "Construction Logs", "Release Notes", "Field Notes"]
  },
  {
    id: "hidden-objects",
    name: "Hidden Objects",
    kind: "hidden",
    theme: "Asteroids, abandoned stations, signals, archives, unfinished worlds",
    summary: "The Carson layer: buried experiments and strange unfinished things for people who explore beyond the obvious path.",
    color: "#151c2a",
    accent: "#ff7a9f",
    radius: 0.5,
    orbitRadius: 16.8,
    speed: 0.018,
    initialAngle: 4.75,
    procession: { x: 24.6, z: 0.55, sway: 0.2 },
    destinations: [
      "Hidden Asteroids",
      "Experimental Projects",
      "Abandoned Space Station",
      "Safari Forum",
      "Deep Space Signal",
      "Bay Oracle Secret Research",
      "Black Hole",
      "Concept Archive",
      "Unfinished Planet",
      "Future Ventures"
    ]
  }
];

export const quickJumpTargets = safariObjects.filter((object) =>
  ["safari-nation", "safari-ventures", "safari-research", "philosophari", "charlie-safari"].includes(object.id)
);
