"use client";

import { Html, OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { ChevronDown, Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Mesh } from "three";
import { AdditiveBlending, Color } from "three";
import { quickJumpTargets, safariObjects, type SafariObject } from "@/data/safariSystem";

type Phase = "landing" | "system";

export function SafariUniverse() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [selectedId, setSelectedId] = useState("solari-safari");
  const [query, setQuery] = useState("");

  const selected = safariObjects.find((object) => object.id === selectedId) ?? safariObjects[0];
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return safariObjects
      .flatMap((object) => {
        const entries = [
          { id: object.id, objectId: object.id, label: object.name, type: object.kind },
          ...object.destinations.map((destination) => ({
            id: `${object.id}-${destination}`,
            objectId: object.id,
            label: destination,
            type: object.name
          })),
          ...(object.moons ?? []).map((moon) => ({
            id: `${object.id}-${moon}`,
            objectId: object.id,
            label: moon,
            type: `${object.name} moon`
          }))
        ];

        return entries;
      })
      .filter((entry) => `${entry.label} ${entry.type}`.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [query]);

  function enterSystem() {
    setPhase("system");
    setSelectedId("safari-nation");
  }

  function selectObject(id: string) {
    setSelectedId(id);
    setQuery("");
  }

  return (
    <main className="universe-shell">
      <div className="universe-canvas" aria-hidden="true">
        <Canvas camera={{ position: phase === "landing" ? [0, 0.15, 7] : [0, 8.2, 17], fov: 48 }}>
          <SafariScene phase={phase} selectedId={selectedId} onSelect={selectObject} />
        </Canvas>
      </div>

      {phase === "landing" ? (
        <>
          <div className="intro-blackout" />
          <div className="intro-starfield" />
          <section className="intro-panel" aria-label="Safari Group landing">
            <div className="intro-content">
              <div className="intro-sun" />
              <h1 className="intro-title">Safari Group</h1>
              <p className="intro-kicker">Building Worlds.</p>
              <button className="enter-system" type="button" onClick={enterSystem}>
                Enter the System
              </button>
            </div>
          </section>
        </>
      ) : null}

      <section className={`system-ui ${phase === "system" ? "is-live" : ""}`} aria-label="Safari System controls">
        <button className="brand-home" type="button" onClick={() => selectObject("solari-safari")}>
          <span className="brand-mark" />
          <span>Safari Group</span>
        </button>

        <div className="search-box">
          <Search size={17} aria-hidden="true" />
          <label className="sr-only" htmlFor="universe-search">
            Search the universe
          </label>
          <input
            id="universe-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the universe"
            type="search"
          />
        </div>

        {results.length > 0 ? (
          <div className="search-results" role="listbox" aria-label="Universe search results">
            {results.map((result) => (
              <button className="search-result" key={result.id} type="button" onClick={() => selectObject(result.objectId)}>
                <strong>{result.label}</strong>
                <span>{result.type}</span>
              </button>
            ))}
          </div>
        ) : null}

        <aside className="planet-panel" aria-live="polite">
          <p className="panel-eyebrow">{selected.theme}</p>
          <h2>{selected.name}</h2>
          <p>{selected.summary}</p>
          <div className="destination-grid" aria-label={`${selected.name} destinations`}>
            {[...(selected.moons ?? []), ...selected.destinations].map((destination) => (
              <span className="destination-chip" key={destination}>
                {destination}
              </span>
            ))}
          </div>
        </aside>

        <div className="quick-jump">
          <label htmlFor="quick-jump">Quick jump</label>
          <ChevronDown size={16} aria-hidden="true" />
          <select id="quick-jump" value={selectedId} onChange={(event) => selectObject(event.target.value)}>
            {quickJumpTargets.map((object) => (
              <option value={object.id} key={object.id}>
                {object.name.replace("Safari ", "")}
              </option>
            ))}
          </select>
        </div>

        <p className="stage-note">Click, drag, zoom, and rotate. Solari Safari awaits.</p>
      </section>
    </main>
  );
}

function SafariScene({
  phase,
  selectedId,
  onSelect
}: {
  phase: Phase;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#01030a", 18, 44]} />
      <ambientLight intensity={0.24} />
      <pointLight position={[0, 0, 0]} intensity={phase === "landing" ? 9 : 7} color="#ffd98a" distance={35} />
      <Stars radius={80} depth={42} count={phase === "landing" ? 1400 : 4200} factor={4} saturation={0.6} fade speed={0.7} />
      <SolarSystem phase={phase} selectedId={selectedId} onSelect={onSelect} />
      {phase === "system" ? <OrbitControls enablePan={false} minDistance={7} maxDistance={26} maxPolarAngle={Math.PI / 1.85} /> : null}
    </>
  );
}

function SolarSystem({
  phase,
  selectedId,
  onSelect
}: {
  phase: Phase;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <group rotation={phase === "landing" ? [0, 0, 0] : [-0.24, 0, 0]}>
      {safariObjects.map((object) =>
        object.kind === "star" ? (
          <SolariSafari key={object.id} object={object} onSelect={onSelect} showLabel={phase === "system"} />
        ) : phase === "system" ? (
          <OrbitingObject key={object.id} object={object} selected={selectedId === object.id} onSelect={onSelect} />
        ) : null
      )}
      {phase === "system" ? <OrbitLines /> : null}
    </group>
  );
}

function SolariSafari({
  object,
  showLabel,
  onSelect
}: {
  object: SafariObject;
  showLabel: boolean;
  onSelect: (id: string) => void;
}) {
  const mesh = useRef<Mesh>(null);
  const flare = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.22;
    if (flare.current) {
      flare.current.rotation.z -= delta * 0.12;
      flare.current.scale.setScalar(1 + Math.sin(Date.now() * 0.0015) * 0.045);
    }
  });

  return (
    <group>
      <mesh ref={flare}>
        <sphereGeometry args={[2.35, 48, 48]} />
        <meshBasicMaterial color="#ff7b24" transparent opacity={0.13} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={mesh} onClick={() => onSelect(object.id)}>
        <sphereGeometry args={[object.radius, 96, 96]} />
        <meshStandardMaterial
          color={object.color}
          emissive={new Color("#ff8d2b")}
          emissiveIntensity={1.7}
          roughness={0.42}
          metalness={0.05}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.16, 0.012, 12, 140]} />
        <meshBasicMaterial color="#ffd26f" transparent opacity={0.46} />
      </mesh>
      <mesh rotation={[Math.PI / 2.3, 0.2, 0.4]}>
        <torusGeometry args={[2.72, 0.01, 12, 160]} />
        <meshBasicMaterial color="#ff7a32" transparent opacity={0.3} />
      </mesh>
      {showLabel ? (
        <Html position={[0, 2.35, 0]} center>
          <div className="planet-label">{object.name}</div>
        </Html>
      ) : null}
    </group>
  );
}

function OrbitingObject({
  object,
  selected,
  onSelect
}: {
  object: SafariObject;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const pivot = useRef<Mesh>(null);
  const planet = useRef<Mesh>(null);
  const color = new Color(object.color);
  const angle = object.initialAngle;

  useFrame((_, delta) => {
    if (pivot.current) pivot.current.rotation.y += delta * object.speed;
    if (planet.current) {
      planet.current.rotation.y += delta * 0.35;
      planet.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={pivot} rotation={[0, angle, 0]}>
      <group position={[object.orbitRadius, 0, 0]}>
        {object.kind === "comet" ? <CometTrail color={object.accent} /> : null}
        <mesh ref={planet} onClick={() => onSelect(object.id)} scale={selected ? 1.16 : 1}>
          <sphereGeometry args={[object.radius, 56, 56]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={selected ? 0.42 : 0.18}
            roughness={0.58}
            metalness={object.kind === "hidden" ? 0.42 : 0.12}
          />
        </mesh>
        {object.kind === "planet" && object.moons ? <MoonRing object={object} /> : null}
        {selected ? (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[object.radius * 1.62, 0.018, 12, 96]} />
            <meshBasicMaterial color={object.accent} transparent opacity={0.7} />
          </mesh>
        ) : null}
        <Html position={[0, object.radius + 0.62, 0]} center>
          <button className="planet-label" type="button" onClick={() => onSelect(object.id)}>
            {object.name}
          </button>
        </Html>
      </group>
    </group>
  );
}

function MoonRing({ object }: { object: SafariObject }) {
  const moonCount = object.moons?.length ?? 0;
  const moonColor = new Color(object.accent);

  return (
    <group>
      {Array.from({ length: moonCount }).map((_, index) => {
        const angle = (index / moonCount) * Math.PI * 2;
        const distance = object.radius * 1.95;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;

        return (
          <mesh position={[x, 0.05 * Math.sin(angle * 2), z]} key={`${object.id}-moon-${index}`}>
            <sphereGeometry args={[Math.max(0.07, object.radius * 0.09), 18, 18]} />
            <meshStandardMaterial color={moonColor} emissive={moonColor} emissiveIntensity={0.12} roughness={0.65} />
          </mesh>
        );
      })}
    </group>
  );
}

function CometTrail({ color }: { color: string }) {
  return (
    <group rotation={[0, 0.2, 0]}>
      {Array.from({ length: 7 }).map((_, index) => (
        <mesh position={[-0.42 - index * 0.22, 0, 0]} scale={1 - index * 0.11} key={`trail-${index}`}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.42 - index * 0.045} blending={AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function OrbitLines() {
  return (
    <group>
      {safariObjects
        .filter((object) => object.orbitRadius > 0)
        .map((object) => (
          <mesh rotation={[Math.PI / 2, 0, 0]} key={`${object.id}-orbit`}>
            <torusGeometry args={[object.orbitRadius, 0.004, 8, 220]} />
            <meshBasicMaterial color="#dfe8ff" transparent opacity={object.kind === "hidden" ? 0.05 : 0.11} />
          </mesh>
        ))}
    </group>
  );
}

