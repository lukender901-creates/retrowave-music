import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import {
  Bell,
  ChevronRight,
  Clock,
  Disc3,
  Download,
  Heart,
  MessageSquare,
  Mic2,
  Music2,
  Pause,
  Play,
  Radio,
  Search,
  SkipBack,
  SkipForward,
  TrendingUp,
  Volume2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Track } from "./backend.d";
import { MINI_BARS, WaveformBars } from "./components/WaveformBars";
import {
  useAllTracks,
  useFeaturedTracks,
  useIncrementPlays,
  useSearchTracks,
  useTracksByGenre,
} from "./hooks/useQueries";

const SAMPLE_TRACKS: Track[] = [
  {
    id: 1n,
    title: "Neon Nights Drive",
    artist: "Chromatic Pulse",
    genre: "MUSIC",
    duration: "4:32",
    description: "A smooth retrowave journey through neon-lit highways",
    downloadUrl: "#",
    coverEmoji: "🌃",
    plays: 12450n,
    likes: 892n,
    year: 2024n,
    tags: ["synthwave", "retrowave", "electronic"],
  },
  {
    id: 2n,
    title: "Digital Dreams",
    artist: "VHS Ghost",
    genre: "MUSIC",
    duration: "3:58",
    description: "Fuzzy analog warmth with digital precision",
    downloadUrl: "#",
    coverEmoji: "📼",
    plays: 9870n,
    likes: 654n,
    year: 2023n,
    tags: ["vaporwave", "lo-fi"],
  },
  {
    id: 3n,
    title: "Synth & Society",
    artist: "The Retrocast",
    genre: "PODCASTS",
    duration: "42:15",
    description:
      "Exploring the intersection of vintage synthesis and modern culture",
    downloadUrl: "#",
    coverEmoji: "🎙️",
    plays: 5430n,
    likes: 321n,
    year: 2024n,
    tags: ["podcast", "music-culture"],
  },
  {
    id: 4n,
    title: "Outrun Horizons",
    artist: "Solar Arcade",
    genre: "MUSIC",
    duration: "5:14",
    description: "Racing towards an electric sunset at 120 BPM",
    downloadUrl: "#",
    coverEmoji: "🌅",
    plays: 18920n,
    likes: 1240n,
    year: 2024n,
    tags: ["outrun", "synthwave", "energetic"],
  },
  {
    id: 5n,
    title: "Late Night FM",
    artist: "Night Frequency",
    genre: "RADIO",
    duration: "live",
    description: "24/7 retrowave and synthwave radio",
    downloadUrl: "#",
    coverEmoji: "📻",
    plays: 45600n,
    likes: 3200n,
    year: 2024n,
    tags: ["radio", "live"],
  },
  {
    id: 6n,
    title: "Memory Palace",
    artist: "Echo Chamber",
    genre: "MUSIC",
    duration: "6:02",
    description: "Ambient synthscapes for late night reflection",
    downloadUrl: "#",
    coverEmoji: "🏛️",
    plays: 7830n,
    likes: 445n,
    year: 2023n,
    tags: ["ambient", "synthwave"],
  },
  {
    id: 7n,
    title: "Thoughts at 3AM",
    artist: "Midnight Writer",
    genre: "THOUGHTS",
    duration: "12:30",
    description: "Personal reflections on creativity and nostalgia",
    downloadUrl: "#",
    coverEmoji: "✨",
    plays: 3210n,
    likes: 287n,
    year: 2024n,
    tags: ["thoughts", "creative"],
  },
  {
    id: 8n,
    title: "Cassette Nostalgia",
    artist: "Rewind FM",
    genre: "RADIO",
    duration: "live",
    description: "Playing only the finest 80s and 90s classics",
    downloadUrl: "#",
    coverEmoji: "📼",
    plays: 32100n,
    likes: 2100n,
    year: 2023n,
    tags: ["80s", "90s", "classics"],
  },
  {
    id: 9n,
    title: "Electric Requiem",
    artist: "Phantom Circuit",
    genre: "MUSIC",
    duration: "7:45",
    description: "Cinematic synthwave for rainy evenings",
    downloadUrl: "#",
    coverEmoji: "⚡",
    plays: 6540n,
    likes: 512n,
    year: 2024n,
    tags: ["cinematic", "synthwave"],
  },
  {
    id: 10n,
    title: "Wave Theory Podcast",
    artist: "Studio 808",
    genre: "PODCASTS",
    duration: "55:20",
    description: "Deep dives into electronic music production",
    downloadUrl: "#",
    coverEmoji: "🎛️",
    plays: 4320n,
    likes: 398n,
    year: 2024n,
    tags: ["production", "electronic"],
  },
  {
    id: 11n,
    title: "Crystal Frequencies",
    artist: "Laser Dreams",
    genre: "MUSIC",
    duration: "4:18",
    description: "Pure synthesized crystal tones",
    downloadUrl: "#",
    coverEmoji: "💎",
    plays: 8760n,
    likes: 623n,
    year: 2023n,
    tags: ["electronic", "ambient"],
  },
  {
    id: 12n,
    title: "Future Nostalgia",
    artist: "Time Traveller",
    genre: "THOUGHTS",
    duration: "18:44",
    description: "A philosophical journey through sound and memory",
    downloadUrl: "#",
    coverEmoji: "🕰️",
    plays: 2890n,
    likes: 201n,
    year: 2024n,
    tags: ["philosophical", "nostalgia"],
  },
];

const GENRES = ["ALL", "MUSIC", "PODCASTS", "RADIO", "THOUGHTS"] as const;

const GENRE_ICONS: Record<string, React.ReactNode> = {
  ALL: <Music2 size={14} />,
  MUSIC: <Disc3 size={14} />,
  PODCASTS: <Mic2 size={14} />,
  RADIO: <Radio size={14} />,
  THOUGHTS: <MessageSquare size={14} />,
};

const CARD_COLORS = [
  "from-[oklch(0.85_0.18_200/0.3)] to-[oklch(0.55_0.22_280/0.2)]",
  "from-[oklch(0.65_0.28_320/0.3)] to-[oklch(0.55_0.22_280/0.2)]",
  "from-[oklch(0.78_0.18_55/0.3)] to-[oklch(0.65_0.28_320/0.2)]",
  "from-[oklch(0.55_0.22_280/0.3)] to-[oklch(0.85_0.18_200/0.2)]",
];

function TrackCard({
  track,
  onPlay,
  isPlaying,
}: { track: Track; onPlay: (t: Track) => void; isPlaying: boolean }) {
  const incrementPlays = useIncrementPlays();

  const handlePlay = () => {
    onPlay(track);
    incrementPlays.mutate(track.id);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`glass-card rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 ${isPlaying ? "neon-border-cyan shadow-neon-cyan" : "hover:neon-border-cyan"}`}
      onClick={handlePlay}
    >
      <div className="relative aspect-square bg-gradient-to-br from-[oklch(0.15_0.08_290)] to-[oklch(0.10_0.05_300)] flex items-center justify-center overflow-hidden">
        <div className="retro-grid absolute inset-0 opacity-30" />
        <span className="text-6xl z-10 relative filter drop-shadow-lg">
          {track.coverEmoji}
        </span>
        {isPlaying && (
          <div className="absolute inset-0 bg-[oklch(0.85_0.18_200/0.1)] flex items-center justify-center z-20">
            <div className="flex items-center gap-[2px]">
              {MINI_BARS.map(({ id, h }, i) => (
                <span
                  key={id}
                  className="waveform-bar"
                  style={{
                    height: `${h * 20}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-[oklch(0_0_0/0.5)] opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-[oklch(0.85_0.18_200)] flex items-center justify-center shadow-neon-cyan">
            <Play size={18} className="text-[oklch(0.85_0.18_200)] ml-1" />
          </div>
        </div>
        <div className="absolute top-2 left-2 z-30">
          <span className="text-[10px] font-bold font-orbitron px-2 py-0.5 rounded-full bg-[oklch(0_0_0/0.7)] text-[oklch(0.85_0.18_200)] border border-[oklch(0.85_0.18_200/0.4)]">
            {track.genre}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-orbitron font-bold text-sm text-[oklch(0.97_0.01_280)] truncate mb-0.5">
          {track.title}
        </h3>
        <p className="text-xs text-[oklch(0.75_0.06_280)] truncate mb-2">
          {track.artist}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-[oklch(0.75_0.06_280)]">
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {track.duration}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp size={10} />
              {Number(track.plays).toLocaleString()}
            </span>
          </div>
          <a
            href={track.downloadUrl}
            onClick={(e) => e.stopPropagation()}
            className="text-[oklch(0.75_0.06_280)] hover:text-[oklch(0.85_0.18_200)] transition-colors"
          >
            <Download size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedCard({
  track,
  onPlay,
  isPlaying,
  index,
}: {
  track: Track;
  onPlay: (t: Track) => void;
  isPlaying: boolean;
  index: number;
}) {
  const incrementPlays = useIncrementPlays();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className={`glass-card rounded-2xl overflow-hidden cursor-pointer group ${isPlaying ? "neon-border-cyan" : "hover:neon-border-cyan"} transition-all duration-300`}
      onClick={() => {
        onPlay(track);
        incrementPlays.mutate(track.id);
      }}
    >
      <div
        className={`h-40 bg-gradient-to-br ${CARD_COLORS[index % 4]} relative flex items-center justify-center overflow-hidden`}
      >
        <div className="retro-grid absolute inset-0 opacity-50" />
        <span
          className="text-7xl z-10 animate-float"
          style={{ animationDelay: `${index * 0.5}s` }}
        >
          {track.coverEmoji}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.11_0.05_285)] to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="font-orbitron font-bold text-sm text-[oklch(0.97_0.01_280)] mb-1 truncate">
          {track.title}
        </h3>
        <p className="text-xs text-[oklch(0.75_0.06_280)] mb-3">
          {track.artist}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[oklch(0.85_0.18_200)] flex items-center gap-1">
            <TrendingUp size={12} /> {Number(track.plays).toLocaleString()}{" "}
            plays
          </span>
          <button
            type="button"
            className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${isPlaying ? "border-[oklch(0.65_0.28_320)] bg-[oklch(0.65_0.28_320/0.2)] shadow-neon-magenta" : "border-[oklch(0.85_0.18_200)] hover:bg-[oklch(0.85_0.18_200/0.1)] shadow-neon-cyan"}`}
          >
            {isPlaying ? (
              <Pause size={14} className="text-[oklch(0.65_0.28_320)]" />
            ) : (
              <Play size={14} className="text-[oklch(0.85_0.18_200)] ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState<string>("ALL");
  const [nowPlaying, setNowPlaying] = useState<Track | null>(SAMPLE_TRACKS[3]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: featuredTracksData } = useFeaturedTracks(4);
  const { data: genreTracksData } = useTracksByGenre(activeGenre);
  const { data: searchResults } = useSearchTracks(debouncedSearch);
  const { data: allTracksData } = useAllTracks();

  const featuredTracks =
    featuredTracksData && featuredTracksData.length > 0
      ? featuredTracksData
      : SAMPLE_TRACKS.slice(0, 4);
  const genreTracks =
    genreTracksData && genreTracksData.length > 0
      ? genreTracksData
      : SAMPLE_TRACKS.filter(
          (t) => activeGenre === "ALL" || t.genre === activeGenre,
        );
  const displayTracks =
    debouncedSearch && searchResults && searchResults.length > 0
      ? searchResults
      : genreTracks;
  const allTracks: Track[] =
    allTracksData && allTracksData.length > 0 ? allTracksData : SAMPLE_TRACKS;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => setDebouncedSearch(searchQuery),
      400,
    );
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const handlePlay = useCallback(
    (track: Track) => {
      if (nowPlaying?.id === track.id) {
        setIsPlaying((p) => !p);
      } else {
        setNowPlaying(track);
        setIsPlaying(true);
        const idx = allTracks.findIndex((t) => t.id === track.id);
        if (idx !== -1) setCurrentIndex(idx);
        toast.success(`Now playing: ${track.title}`, {
          description: track.artist,
        });
      }
    },
    [nowPlaying, allTracks],
  );

  const handlePrev = () => {
    const newIdx = (currentIndex - 1 + allTracks.length) % allTracks.length;
    setCurrentIndex(newIdx);
    setNowPlaying(allTracks[newIdx]);
    setIsPlaying(true);
  };

  const handleNext = () => {
    const newIdx = (currentIndex + 1) % allTracks.length;
    setCurrentIndex(newIdx);
    setNowPlaying(allTracks[newIdx]);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Toaster theme="dark" />
      <div className="fixed inset-0 retro-grid opacity-40 pointer-events-none z-0" />

      {/* NAVBAR */}
      <header
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[oklch(0.85_0.18_200/0.1)] backdrop-blur-xl"
        data-ocid="nav.panel"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.78_0.18_55)] to-[oklch(0.65_0.28_320)] flex items-center justify-center shadow-neon-magenta">
              <Disc3 size={16} className="text-white" />
            </div>
            <span className="font-orbitron font-black text-lg neon-text tracking-wider">
              RETROWAVE
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {["DISCOVER", "MUSIC", "PODCASTS", "RADIO", "THOUGHTS"].map(
              (link) => (
                <button
                  key={link}
                  type="button"
                  data-ocid="nav.link"
                  onClick={() => {
                    const target = link === "DISCOVER" ? "ALL" : link;
                    setActiveGenre(target);
                    document
                      .getElementById("browse")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="font-orbitron text-xs font-bold tracking-widest text-[oklch(0.75_0.06_280)] hover:text-[oklch(0.85_0.18_200)] transition-all duration-200"
                >
                  {link}
                </button>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                >
                  <Input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tracks..."
                    data-ocid="nav.search_input"
                    className="h-8 text-xs bg-[oklch(0.11_0.05_285/0.8)] border-[oklch(0.85_0.18_200/0.4)] text-[oklch(0.97_0.01_280)] placeholder:text-[oklch(0.55_0.06_280)] focus:border-[oklch(0.85_0.18_200)] font-exo"
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              type="button"
              data-ocid="nav.button"
              onClick={() => {
                setIsSearchOpen((s) => !s);
                setTimeout(() => searchRef.current?.focus(), 100);
              }}
              className="text-[oklch(0.75_0.06_280)] hover:text-[oklch(0.85_0.18_200)] transition-colors"
            >
              <Search size={18} />
            </button>
            <button
              type="button"
              className="text-[oklch(0.75_0.06_280)] hover:text-[oklch(0.65_0.28_320)] transition-colors"
            >
              <Bell size={18} />
            </button>
            <button
              type="button"
              data-ocid="nav.primary_button"
              className="hidden sm:flex items-center gap-1 px-4 py-1.5 rounded-full border border-[oklch(0.85_0.18_200/0.5)] text-[oklch(0.85_0.18_200)] font-orbitron text-xs font-bold tracking-widest hover:bg-[oklch(0.85_0.18_200/0.1)] hover:shadow-neon-cyan transition-all"
            >
              LOGIN
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
        data-ocid="hero.section"
      >
        <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
          <div className="retro-grid-perspective w-full h-full opacity-30" />
        </div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[oklch(0.78_0.18_55/0.15)] to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[oklch(0.85_0.18_200/0.08)] blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 w-full py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(0.85_0.18_200/0.3)] mb-6">
              <Radio size={12} className="text-[oklch(0.85_0.18_200)]" />
              <span className="font-orbitron text-xs text-[oklch(0.85_0.18_200)] tracking-widest">
                LIVE NOW
              </span>
              <span className="w-2 h-2 rounded-full bg-[oklch(0.85_0.18_200)] animate-glow-pulse" />
            </div>

            <h1 className="font-orbitron font-black text-4xl sm:text-5xl xl:text-6xl leading-none uppercase mb-6">
              <span className="neon-text">RETROWAVE:</span>
              <br />
              <span className="text-[oklch(0.97_0.01_280)]">THE RETRO-</span>
              <br />
              <span className="neon-text-magenta">FUTURE SOUND</span>
            </h1>

            <p className="text-[oklch(0.75_0.06_280)] text-base leading-relaxed mb-8 max-w-md font-exo">
              Dive into the neon-soaked world of synthwave, retrowave, and
              vaporwave. Stream thousands of tracks, discover new artists, and
              lose yourself in the retro-future.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-ocid="hero.primary_button"
                onClick={() =>
                  document
                    .getElementById("browse")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[oklch(0.85_0.18_200)] to-[oklch(0.55_0.22_280)] text-[oklch(0.08_0.04_300)] font-orbitron font-bold text-sm tracking-widest shadow-neon-cyan hover:shadow-neon-violet transition-all"
              >
                <Play size={16} fill="currentColor" /> EXPLORE NOW
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-ocid="hero.secondary_button"
                onClick={() =>
                  document
                    .getElementById("featured")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[oklch(0.65_0.28_320/0.6)] text-[oklch(0.65_0.28_320)] font-orbitron font-bold text-sm tracking-widest hover:bg-[oklch(0.65_0.28_320/0.1)] hover:shadow-neon-magenta transition-all"
              >
                GET STARTED <ChevronRight size={16} />
              </motion.button>
            </div>

            <div className="flex gap-8 mt-10">
              {[
                ["12K+", "TRACKS"],
                ["3.2K", "ARTISTS"],
                ["89K", "LISTENERS"],
              ].map(([num, label]) => (
                <div key={label}>
                  <div className="font-orbitron font-black text-2xl neon-text">
                    {num}
                  </div>
                  <div className="text-xs font-orbitron text-[oklch(0.55_0.06_280)] tracking-widest">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[oklch(0.85_0.18_200/0.2)] to-[oklch(0.65_0.28_320/0.2)] blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden neon-border-cyan shadow-neon-card">
                <img
                  src="/assets/generated/hero-retrowave.dim_600x500.png"
                  alt="Retrowave hero art"
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 scanlines" />
              </div>
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -left-4 glass-card rounded-xl px-4 py-2 neon-border-magenta"
              >
                <div className="font-orbitron text-xs text-[oklch(0.65_0.28_320)] font-bold">
                  NOW STREAMING
                </div>
                <div className="font-orbitron text-sm text-[oklch(0.97_0.01_280)] font-black">
                  {SAMPLE_TRACKS[0].title}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED STREAMS */}
      <section id="featured" className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-orbitron font-black text-2xl sm:text-3xl uppercase">
              <span className="neon-text">FEATURED</span>{" "}
              <span className="text-[oklch(0.97_0.01_280)]">STREAMS</span>
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[oklch(0.85_0.18_200/0.4)] to-transparent" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTracks.map((track, i) => (
              <FeaturedCard
                key={String(track.id)}
                track={track}
                onPlay={handlePlay}
                isPlaying={nowPlaying?.id === track.id && isPlaying}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BROWSE / NEW RELEASES */}
      <section id="browse" className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-orbitron font-black text-2xl sm:text-3xl uppercase">
              <span className="text-[oklch(0.97_0.01_280)]">NEW</span>{" "}
              <span className="neon-text">RELEASES</span>
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[oklch(0.65_0.28_320/0.4)] to-transparent" />
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                data-ocid="browse.tab"
                onClick={() => setActiveGenre(genre)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-orbitron text-xs font-bold tracking-widest transition-all duration-200 ${activeGenre === genre ? "bg-gradient-to-r from-[oklch(0.85_0.18_200)] to-[oklch(0.55_0.22_280)] text-[oklch(0.08_0.04_300)] shadow-neon-cyan" : "border border-[oklch(0.85_0.18_200/0.25)] text-[oklch(0.75_0.06_280)] hover:border-[oklch(0.85_0.18_200/0.5)] hover:text-[oklch(0.85_0.18_200)]"}`}
              >
                {GENRE_ICONS[genre]}
                {genre}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full border border-[oklch(0.85_0.18_200/0.25)] bg-[oklch(0.11_0.05_285/0.6)]">
              <Search size={14} className="text-[oklch(0.55_0.06_280)]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracks..."
                data-ocid="browse.search_input"
                className="bg-transparent text-xs text-[oklch(0.97_0.01_280)] placeholder:text-[oklch(0.55_0.06_280)] outline-none w-36 font-exo"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeGenre + debouncedSearch}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
              data-ocid="browse.list"
            >
              {displayTracks.map((track, i) => (
                <div key={String(track.id)} data-ocid={`browse.item.${i + 1}`}>
                  <TrackCard
                    track={track}
                    onPlay={handlePlay}
                    isPlaying={nowPlaying?.id === track.id && isPlaying}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {displayTracks.length === 0 && (
            <div className="text-center py-20" data-ocid="browse.empty_state">
              <div className="text-5xl mb-4">🎵</div>
              <p className="font-orbitron text-[oklch(0.55_0.06_280)] text-sm tracking-widest">
                NO TRACKS FOUND
              </p>
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM PLAYER */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        data-ocid="player.panel"
      >
        <div className="glass-card border-t border-[oklch(0.85_0.18_200/0.15)] backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
            <div className="flex items-center gap-3 w-48 min-w-0 flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.85_0.18_200/0.3)] to-[oklch(0.65_0.28_320/0.3)] flex items-center justify-center flex-shrink-0">
                <span className="text-lg">
                  {nowPlaying?.coverEmoji ?? "🎵"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-orbitron text-xs font-bold text-[oklch(0.97_0.01_280)] truncate">
                  {nowPlaying?.title ?? "Select a track"}
                </p>
                <p className="text-[10px] text-[oklch(0.75_0.06_280)] truncate">
                  {nowPlaying?.artist ?? ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                data-ocid="player.button"
                onClick={handlePrev}
                className="text-[oklch(0.75_0.06_280)] hover:text-[oklch(0.85_0.18_200)] transition-colors"
              >
                <SkipBack size={18} />
              </button>
              <button
                type="button"
                data-ocid="player.toggle"
                onClick={() => setIsPlaying((p) => !p)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[oklch(0.85_0.18_200)] to-[oklch(0.55_0.22_280)] flex items-center justify-center shadow-neon-cyan hover:shadow-neon-violet transition-all"
              >
                {isPlaying ? (
                  <Pause size={16} className="text-[oklch(0.08_0.04_300)]" />
                ) : (
                  <Play
                    size={16}
                    className="text-[oklch(0.08_0.04_300)] ml-0.5"
                  />
                )}
              </button>
              <button
                type="button"
                data-ocid="player.button"
                onClick={handleNext}
                className="text-[oklch(0.75_0.06_280)] hover:text-[oklch(0.85_0.18_200)] transition-colors"
              >
                <SkipForward size={18} />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <WaveformBars playing={isPlaying} />
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                className="text-[oklch(0.75_0.06_280)] hover:text-[oklch(0.85_0.18_200)] transition-colors"
              >
                <Volume2 size={18} />
              </button>
              <button
                type="button"
                data-ocid="player.secondary_button"
                className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border border-[oklch(0.65_0.28_320/0.5)] text-[oklch(0.65_0.28_320)] font-orbitron text-xs font-bold tracking-wider hover:bg-[oklch(0.65_0.28_320/0.1)] hover:shadow-neon-magenta transition-all"
              >
                <Disc3 size={12} /> VINYL SHOP
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 pb-20 pt-16 border-t border-[oklch(0.85_0.18_200/0.08)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.78_0.18_55)] to-[oklch(0.65_0.28_320)] flex items-center justify-center">
                  <Disc3 size={16} className="text-white" />
                </div>
                <span className="font-orbitron font-black text-lg neon-text tracking-wider">
                  RETROWAVE
                </span>
              </div>
              <p className="text-sm text-[oklch(0.65_0.06_280)] leading-relaxed max-w-xs font-exo">
                The ultimate destination for synthwave, retrowave, vaporwave,
                and all things retro-future.
              </p>
              <div className="flex gap-4 mt-6">
                {[
                  { label: "Twitter", icon: "𝕏" },
                  { label: "Discord", icon: "💬" },
                  { label: "Instagram", icon: "📸" },
                  { label: "YouTube", icon: "▶" },
                ].map(({ label, icon }) => (
                  <button
                    key={label}
                    type="button"
                    title={label}
                    className="w-9 h-9 rounded-lg border border-[oklch(0.85_0.18_200/0.2)] flex items-center justify-center text-sm text-[oklch(0.75_0.06_280)] hover:border-[oklch(0.85_0.18_200/0.5)] hover:text-[oklch(0.85_0.18_200)] transition-all"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-xs tracking-widest text-[oklch(0.85_0.18_200)] mb-4">
                EXPLORE
              </h4>
              <ul className="space-y-2">
                {[
                  "Discover",
                  "New Releases",
                  "Top Charts",
                  "Live Radio",
                  "Podcasts",
                ].map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      data-ocid="footer.link"
                      className="text-sm text-[oklch(0.65_0.06_280)] hover:text-[oklch(0.85_0.18_200)] transition-colors font-exo"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-xs tracking-widest text-[oklch(0.65_0.28_320)] mb-4">
                COMMUNITY
              </h4>
              <ul className="space-y-2">
                {[
                  "Forums",
                  "Artist Spotlight",
                  "Events",
                  "Newsletter",
                  "About Us",
                ].map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      data-ocid="footer.link"
                      className="text-sm text-[oklch(0.65_0.06_280)] hover:text-[oklch(0.65_0.28_320)] transition-colors font-exo"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[oklch(0.85_0.18_200/0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[oklch(0.55_0.06_280)] font-exo">
              © {new Date().getFullYear()} RETROWAVE. All rights reserved.
            </p>
            <p className="text-xs text-[oklch(0.55_0.06_280)] font-exo">
              Built with{" "}
              <Heart size={10} className="inline text-[oklch(0.65_0.28_320)]" />{" "}
              using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noreferrer"
                className="text-[oklch(0.85_0.18_200)] hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
