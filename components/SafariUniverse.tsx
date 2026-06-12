"use client";

import { Html, OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { ChevronDown, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group, Mesh } from "three";
import { AdditiveBlending, CatmullRomCurve3, Color, Vector3 } from "three";
import { quickJumpTargets, safariObjects, type SafariObject } from "@/data/safariSystem";

type Phase = "landing" | "system";
type MotionMode = "static" | "galactic";
type SafariUniverseProps = {
  initialPhase?: Phase;
};

const START_PROGRESS: Record<string, number> = {
  "safari-ventures": 0.58,
  "safari-research": 0.14,
  "safari-nation": 0.72,
  "charlie-safari": 0.34,
  philosophari: 0.86,
  "hidden-objects": 0.22,
  "updates-comet": 0.05
};

function systemRadius(object: SafariObject) {
  if (object.kind === "star") return object.radius * 0.52;
  if (object.kind === "comet") return object.radius * 0.42;
  if (object.kind === "hidden") return object.radius * 0.32;

  return object.radius * 0.28;
}

export function SafariUniverse({ initialPhase = "landing" }: SafariUniverseProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [motionMode, setMotionMode] = useState<MotionMode>("galactic");
  const [departingId, setDepartingId] = useState<string | null>(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return safariObjects
      .flatMap((object) => {
        const entries = [
          { id: object.id, objectId: object.id, label: object.name, type: object.kind },
          ...(object.tabs ?? []).map((tab) => ({
            id: `${object.id}-${tab.id}`,
            objectId: object.id,
            label: tab.label,
            type: object.name
          })),
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
  }

  function openWorld(id: string) {
    setSelectedId(id);
    setQuery("");
    setDepartingId(id);

    window.setTimeout(() => {
      router.push(`/worlds/${id}`);
    }, 520);
  }

  useEffect(() => {
    setPhase(initialPhase);
  }, [initialPhase]);

  useEffect(() => {
    function toggleMotionMode(event: KeyboardEvent) {
      if (event.altKey && event.key.toLowerCase() === "m") {
        setMotionMode((currentMode) => (currentMode === "galactic" ? "static" : "galactic"));
      }
    }

    window.addEventListener("keydown", toggleMotionMode);
    return () => window.removeEventListener("keydown", toggleMotionMode);
  }, []);

  return (
    <main className={`universe-shell ${departingId ? "is-departing" : ""}`}>
      <div className="universe-canvas" aria-hidden="true">
        <Canvas camera={{ position: phase === "landing" ? [0, 0.15, 7] : [0, 17, 48], fov: 44 }}>
          <SafariScene phase={phase} selectedId={selectedId} motionMode={motionMode} onSelect={openWorld} />
        </Canvas>
      </div>
      <div className={`nebula-field ${phase === "system" ? "is-live" : ""}`} aria-hidden="true" />

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
        <button className="brand-home" type="button" onClick={() => setQuery("")}>
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
            <button className="box-close" type="button" onClick={() => setQuery("")} aria-label="Close search results">
              <X size={13} aria-hidden="true" />
            </button>
            {results.map((result) => (
              <button className="search-result" key={result.id} type="button" onClick={() => openWorld(result.objectId)}>
                <strong>{result.label}</strong>
                <span>{result.type}</span>
              </button>
            ))}
          </div>
        ) : null}

        <div className="quick-jump">
          <label htmlFor="quick-jump">Quick jump</label>
          <ChevronDown size={16} aria-hidden="true" />
          <select id="quick-jump" value="" onChange={(event) => openWorld(event.target.value)}>
            <option value="" disabled>
              Choose world
            </option>
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
  motionMode,
  onSelect
}: {
  phase: Phase;
  selectedId: string;
  motionMode: MotionMode;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#01030a", 18, 44]} />
      <ambientLight intensity={0.24} />
      <GalacticParallax phase={phase} motionMode={motionMode} />
      {phase === "system" ? <DistantBlackHole motionMode={motionMode} /> : null}
      <SolarSystem phase={phase} selectedId={selectedId} motionMode={motionMode} onSelect={onSelect} />
      {phase === "system" ? <OrbitControls enablePan={false} minDistance={18} maxDistance={96} maxPolarAngle={Math.PI / 1.85} /> : null}
    </>
  );
}

function SolarSystem({
  phase,
  selectedId,
  motionMode,
  onSelect
}: {
  phase: Phase;
  selectedId: string;
  motionMode: MotionMode;
  onSelect: (id: string) => void;
}) {
  const solarSystemGroup = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!solarSystemGroup.current) return;

    if (phase !== "system" || motionMode === "static") {
      solarSystemGroup.current.position.set(0, 0, 0);
      return;
    }

    const elapsed = clock.getElapsedTime();
    solarSystemGroup.current.position.set(Math.sin(elapsed * 0.018) * 0.32, Math.sin(elapsed * 0.014) * 0.08, 0);
  });

  return (
    <group ref={solarSystemGroup}>
      <group rotation={phase === "landing" ? [0, 0, 0] : [-0.24, 0, 0]}>
        {phase === "system" ? <TrajectoryArchive /> : null}
        {safariObjects.map((object) =>
          object.kind === "star" ? (
            <SolariSafari key={object.id} object={object} phase={phase} motionMode={motionMode} onSelect={onSelect} showLabel={phase === "system"} />
          ) : object.kind === "comet" ? (
            <MessengerComet key={object.id} object={object} selected={selectedId === object.id} onSelect={onSelect} />
          ) : phase === "system" ? (
            <OrbitingWorld key={object.id} object={object} selected={selectedId === object.id} onSelect={onSelect} />
          ) : null
        )}
      </group>
    </group>
  );
}

function DistantBlackHole({ motionMode }: { motionMode: MotionMode }) {
  const blackHole = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!blackHole.current) return;

    const elapsed = clock.getElapsedTime();
    blackHole.current.rotation.z += 0.0012;
    blackHole.current.position.x = 23.5 + (motionMode === "galactic" ? Math.sin(elapsed * 0.04) * 0.22 : 0);
  });

  return (
    <group ref={blackHole} position={[23.5, 1.05, -4.4]} rotation={[0.18, 0, -0.16]}>
      <mesh>
        <sphereGeometry args={[0.62, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh rotation={[Math.PI / 2.35, 0, 0]}>
        <torusGeometry args={[1.42, 0.025, 12, 160]} />
        <meshBasicMaterial color="#6f7d96" transparent opacity={0.18} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.15, 0.14, 0]}>
        <torusGeometry args={[2.05, 0.014, 12, 180]} />
        <meshBasicMaterial color="#d6dfff" transparent opacity={0.07} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function GalacticParallax({ phase, motionMode }: { phase: Phase; motionMode: MotionMode }) {
  const farStars = useRef<Group>(null);
  const midStars = useRef<Group>(null);
  const nearDust = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (phase !== "system" || motionMode === "static") {
      farStars.current?.position.set(0, 0, 0);
      midStars.current?.position.set(0, 0, 0);
      nearDust.current?.position.set(0, 0, 0);
      return;
    }

    const elapsed = clock.getElapsedTime();

    if (farStars.current) farStars.current.position.set(-elapsed * 0.004, -elapsed * 0.0006, 0);
    if (midStars.current) midStars.current.position.set(-elapsed * 0.014, -elapsed * 0.0018, 0);
    if (nearDust.current) nearDust.current.position.set(-elapsed * 0.032, -elapsed * 0.004, 0);
  });

  return (
    <>
      <group ref={farStars}>
        <Stars radius={92} depth={52} count={phase === "landing" ? 1300 : 2800} factor={4.2} saturation={0.44} fade speed={0.18} />
      </group>
      <group ref={midStars}>
        <Stars radius={62} depth={34} count={phase === "landing" ? 420 : 1100} factor={2.2} saturation={0.58} fade speed={0.32} />
      </group>
      <group ref={nearDust}>
        <Stars radius={38} depth={18} count={phase === "landing" ? 90 : 260} factor={1.1} saturation={0.72} fade speed={0.5} />
      </group>
    </>
  );
}

function SolarLeadPaths() {
  const paths = useMemo(() => {
    const curves = [
      new CatmullRomCurve3(
        [new Vector3(-7.4, 0.02, -3.6), new Vector3(-2.1, 0.04, -1.2), new Vector3(0.4, 0.02, 0.25), new Vector3(4.8, 0.04, 3.2)],
        false,
        "catmullrom",
        0.5
      ),
      new CatmullRomCurve3(
        [new Vector3(-5.8, 0.03, 4.2), new Vector3(-1.8, 0.05, 1.6), new Vector3(0.3, 0.03, -0.2), new Vector3(5.7, 0.04, -2.9)],
        false,
        "catmullrom",
        0.5
      ),
      new CatmullRomCurve3(
        [new Vector3(-3.5, 0.02, -5.2), new Vector3(-0.8, 0.04, -1.8), new Vector3(1.0, 0.03, 0.7), new Vector3(2.6, 0.04, 5.6)],
        false,
        "catmullrom",
        0.5
      )
    ];

    return curves.map((curve, index) => ({
      key: `solar-lead-${index}`,
      positions: curvePositions(curve, 90),
      opacity: 0.2 - index * 0.035
    }));
  }, []);

  return (
    <group>
      {paths.map((path) => (
        <TrajectoryLine key={path.key} positions={path.positions} color="#ffe39a" opacity={path.opacity} />
      ))}
    </group>
  );
}

function SolariSafari({
  object,
  phase,
  motionMode,
  showLabel,
  onSelect
}: {
  object: SafariObject;
  phase: Phase;
  motionMode: MotionMode;
  showLabel: boolean;
  onSelect: (id: string) => void;
}) {
  const solarRoot = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const flare = useRef<Mesh>(null);
  const radius = systemRadius(object);
  const solarPath = useMemo(
    () =>
      new CatmullRomCurve3(
        [
          new Vector3(4.2, 0.04, -1.2),
          new Vector3(6.9, 0.08, 0.75),
          new Vector3(5.4, 0.05, 3.0),
          new Vector3(2.7, 0.06, 1.85),
          new Vector3(3.2, 0.04, -1.9)
        ],
        true,
        "catmullrom",
        0.48
      ),
    []
  );
  const solarPathPositions = useMemo(() => curvePositions(solarPath, 180), [solarPath]);

  useFrame(({ clock }, delta) => {
    if (solarRoot.current) {
      if (phase === "system" && motionMode === "galactic") {
        solarRoot.current.position.copy(solarPath.getPointAt((clock.getElapsedTime() * 0.012) % 1));
      } else {
        solarRoot.current.position.set(0, 0, 0);
      }
    }

    if (mesh.current) mesh.current.rotation.y += delta * 0.22;
    if (flare.current) {
      flare.current.rotation.z -= delta * 0.12;
      flare.current.scale.setScalar(1 + Math.sin(Date.now() * 0.0015) * 0.045);
    }
  });

  return (
    <>
      {phase === "system" ? <TrajectoryLine positions={solarPathPositions} color="#ffd26f" opacity={0.24} /> : null}
      <group ref={solarRoot}>
      <pointLight position={[0, 0, 0]} intensity={phase === "landing" ? 9 : 7} color="#ffd98a" distance={35} />
      <SolarLeadPaths />
      <mesh ref={flare}>
        <sphereGeometry args={[radius * 1.45, 48, 48]} />
        <meshBasicMaterial color="#ff7b24" transparent opacity={0.13} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={mesh} onClick={() => onSelect(object.id)}>
        <sphereGeometry args={[radius, 96, 96]} />
        <meshStandardMaterial
          color={object.color}
          emissive={new Color("#ff8d2b")}
          emissiveIntensity={1.7}
          roughness={0.42}
          metalness={0.05}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.35, 0.006, 12, 140]} />
        <meshBasicMaterial color="#ffd26f" transparent opacity={0.46} />
      </mesh>
      <mesh rotation={[Math.PI / 2.3, 0.2, 0.4]}>
        <torusGeometry args={[radius * 1.7, 0.005, 12, 160]} />
        <meshBasicMaterial color="#ff7a32" transparent opacity={0.3} />
      </mesh>
      {showLabel ? (
        <Html position={[0, radius + 0.42, 0]} center>
          <div className="planet-label">{object.name}</div>
        </Html>
      ) : null}
    </group>
    </>
  );
}

function OrbitingWorld({
  object,
  selected,
  onSelect
}: {
  object: SafariObject;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const world = useRef<Group>(null);
  const planet = useRef<Mesh>(null);
  const color = new Color(object.color);
  const path = useMemo(() => createWorldPath(object), [object]);
  const pathPositions = useMemo(() => curvePositions(path, 220), [path]);
  const radius = systemRadius(object);

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();
    const pathOffset = START_PROGRESS[object.id] ?? object.initialAngle / (Math.PI * 2);
    const progress = (pathOffset + elapsed * object.speed * 0.15) % 1;
    const position = path.getPointAt(progress);
    const nextPosition = path.getPointAt((progress + 0.006) % 1);

    if (world.current) {
      world.current.position.copy(position);
      world.current.lookAt(nextPosition);
      world.current.rotation.x = Math.sin(elapsed * object.speed + object.initialAngle) * 0.05;
    }

    if (planet.current) {
      planet.current.rotation.y += delta * 0.35;
      planet.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <>
      <TrajectoryLine positions={pathPositions} color="#edf1ff" opacity={object.kind === "hidden" ? 0.07 : 0.24} />
      <group ref={world}>
      <mesh ref={planet} onClick={() => onSelect(object.id)} scale={selected ? 1.16 : 1}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 0.42 : 0.18}
          roughness={0.58}
          metalness={object.kind === "hidden" ? 0.42 : 0.12}
        />
      </mesh>
      {object.kind === "planet" && object.moons ? <MoonRing object={object} planetRadius={radius} /> : null}
      {selected ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 1.8, 0.006, 12, 96]} />
          <meshBasicMaterial color={object.accent} transparent opacity={0.7} />
        </mesh>
      ) : null}
      <Html position={[0, radius + 0.34, 0]} center>
        <button className="planet-label" type="button" onClick={() => onSelect(object.id)}>
          {object.name}
        </button>
      </Html>
    </group>
    </>
  );
}

function createWorldPath(object: SafariObject) {
  // Wake lanes stay behind Solari Safari and keep the moving worlds from crossing each other.
  const pathSpecs: Record<string, [number, number, number, number, number, number]> = {
    "safari-ventures": [-4.6, -4.85, 2.15, 1.08, -0.18, 0.16],
    "safari-research": [-5.05, 4.85, 1.95, 1.08, 0.2, 0.14],
    "safari-nation": [-10.15, -0.2, 2.35, 1.34, 0.08, 0.16],
    "charlie-safari": [-12.9, 4.25, 1.64, 0.98, -0.3, 0.12],
    philosophari: [-14.8, -5.45, 1.68, 0.96, 0.28, 0.12],
    "hidden-objects": [-19.25, 0.7, 1.45, 0.86, -0.14, 0.1]
  };

  const spec = pathSpecs[object.id];
  if (!spec) return new CatmullRomCurve3([new Vector3(object.orbitRadius, 0, 0)], true, "catmullrom", 0.5);

  return new CatmullRomCurve3(createLoopPoints(...spec), true, "catmullrom", 0.52);
}

function createLoopPoints(centerX: number, centerZ: number, radiusX: number, radiusZ: number, rotation: number, wobble: number) {
  return Array.from({ length: 14 }).map((_, index) => {
    const theta = (index / 14) * Math.PI * 2;
    const x = Math.cos(theta) * (radiusX + Math.sin(theta * 3) * wobble);
    const z = Math.sin(theta) * (radiusZ + Math.cos(theta * 2) * wobble);
    const rotatedX = x * Math.cos(rotation) - z * Math.sin(rotation);
    const rotatedZ = x * Math.sin(rotation) + z * Math.cos(rotation);

    return new Vector3(centerX + rotatedX, 0.04 + Math.sin(theta * 2) * 0.08, centerZ + rotatedZ);
  });
}

function curvePositions(curve: CatmullRomCurve3, count: number) {
  const points = curve.getPoints(count);
  const positions = new Float32Array(points.length * 3);

  points.forEach((point, index) => {
    positions[index * 3] = point.x;
    positions[index * 3 + 1] = point.y;
    positions[index * 3 + 2] = point.z;
  });

  return positions;
}

function TrajectoryLine({ positions, color, opacity }: { positions: Float32Array; color: string; opacity: number }) {
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} blending={AdditiveBlending} depthWrite={false} />
    </line>
  );
}

function TrajectoryArchive() {
  const loops = useMemo(() => {
    return Array.from({ length: 15 }).map((_, index) => {
      const radius = 1.1 + index * 0.34;
      const centerX = -14.5 - index * 0.18;
      const centerZ = -6.8 + Math.sin(index * 0.8) * 1.1;
      const positions = new Float32Array(96 * 3);

      for (let step = 0; step < 96; step += 1) {
        const theta = (step / 95) * Math.PI * 2.25 + index * 0.7;
        const wobble = Math.sin(theta * 3 + index) * 0.22;
        positions[step * 3] = centerX + Math.cos(theta) * (radius + wobble);
        positions[step * 3 + 1] = 0.01;
        positions[step * 3 + 2] = centerZ + Math.sin(theta) * (radius * 0.62 + wobble);
      }

      return {
        key: `archive-loop-${index}`,
        opacity: 0.045 + (index % 4) * 0.015,
        positions
      };
    });
  }, []);

  return (
    <group>
      {loops.map((loop) => (
        <TrajectoryLine key={loop.key} positions={loop.positions} color="#e8edf7" opacity={loop.opacity} />
      ))}
    </group>
  );
}

function MessengerComet({
  object,
  selected,
  onSelect
}: {
  object: SafariObject;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const comet = useRef<Group>(null);
  const color = new Color(object.color);
  const path = useMemo(
    () =>
      new CatmullRomCurve3(
        [
          new Vector3(-25.2, 0.16, -11.4),
          new Vector3(-11.4, 0.28, -4.8),
          new Vector3(0.9, 0.12, -1.2),
          new Vector3(5.5, 0.08, 0.6),
          new Vector3(2.8, 0.1, 2.9),
          new Vector3(-8.6, 0.14, 6.8),
          new Vector3(-19.4, 0.2, 5.1),
          new Vector3(-30.8, 0.24, -1.8),
          new Vector3(-18.0, 0.18, -12.2),
          new Vector3(4.8, 0.32, -9.2),
          new Vector3(18.2, 0.26, -2.6),
          new Vector3(10.5, 0.16, 5.8)
        ],
        true,
        "catmullrom",
        0.54
      ),
    []
  );

  const pathPoints = useMemo(() => {
    const points = path.getPoints(180);
    const positions = new Float32Array(points.length * 3);

    points.forEach((point, index) => {
      positions[index * 3] = point.x;
      positions[index * 3 + 1] = point.y;
      positions[index * 3 + 2] = point.z;
    });

    return positions;
  }, [path]);

  useFrame(({ clock }) => {
    if (!comet.current) return;

    const elapsed = clock.getElapsedTime();
    const progress = (elapsed * 0.03 + START_PROGRESS[object.id]) % 1;
    const position = path.getPointAt(progress);
    const nextPosition = path.getPointAt((progress + 0.006) % 1);

    comet.current.position.copy(position);
    comet.current.lookAt(nextPosition);
  });

  return (
    <>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pathPoints, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#edf1ff" transparent opacity={0.28} blending={AdditiveBlending} depthWrite={false} />
      </line>
      <group ref={comet}>
        <CometTrail color={object.accent} />
        <mesh onClick={() => onSelect(object.id)} scale={selected ? 1.2 : 1}>
          <sphereGeometry args={[systemRadius(object), 24, 24]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} roughness={0.28} metalness={0.06} />
        </mesh>
        <Html position={[0, systemRadius(object) + 0.3, 0]} center>
          <button className="planet-label" type="button" onClick={() => onSelect(object.id)}>
            {object.name}
          </button>
        </Html>
      </group>
    </>
  );
}

function MoonRing({ object, planetRadius }: { object: SafariObject; planetRadius: number }) {
  const moonRing = useRef<Group>(null);
  const moonCount = object.moons?.length ?? 0;
  const moonColor = new Color(object.accent);

  useFrame((_, delta) => {
    if (moonRing.current) moonRing.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={moonRing}>
      {Array.from({ length: moonCount }).map((_, index) => {
        const angle = (index / moonCount) * Math.PI * 2;
        const distance = planetRadius * 2.4;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;

        return (
          <mesh position={[x, 0.05 * Math.sin(angle * 2), z]} key={`${object.id}-moon-${index}`}>
            <sphereGeometry args={[Math.max(0.025, planetRadius * 0.13), 14, 14]} />
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
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial color={color} transparent opacity={0.42 - index * 0.045} blending={AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}
