export type SafariObjectKind = "star" | "planet" | "comet" | "hidden";

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
  destinations: string[];
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
    moons: ["Astra", "Holy State", "Arcadia", "Democratic State", "Kiri", "Garden State", "Duskwind", "Lawless State"],
    destinations: [
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
    moons: ["DDP", "Bay Oracle Research", "Disability Research", "Sleep Apnea Studies", "Future Research Concepts"],
    destinations: ["Abstract", "Theory", "Evidence", "Videos", "Downloads", "Discussion"]
  },
  {
    id: "safaralosophi",
    name: "Safaralosophi",
    kind: "planet",
    theme: "Libraries, gardens, temples, observatories, floating books",
    summary: "The most beautiful planet: philosophy as a physical place, where each question becomes a destination.",
    color: "#c3a4ff",
    accent: "#ffe6ff",
    radius: 0.9,
    orbitRadius: 11.6,
    speed: 0.032,
    initialAngle: 5.2,
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
  ["safari-nation", "safari-ventures", "safari-research", "safaralosophi", "charlie-safari"].includes(object.id)
);

