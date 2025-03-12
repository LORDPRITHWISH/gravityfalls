"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Silkscreen, Creepster, Nosifer } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const silkscreen = Silkscreen({
  weight: "400",
  subsets: ["latin"],
});

const creepster = Creepster({
  weight: "400",
  subsets: ["latin"],
});

const nosifer = Nosifer({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showBill, setShowBill] = useState(false);
  const [showJumpScare, setShowJumpScare] = useState(false);
  const [showRandomText, setShowRandomText] = useState(false);
  const [randomTextPosition, setRandomTextPosition] = useState({ x: 0, y: 0 });
  const [randomSymbol, setRandomSymbol] = useState("");
  const [bloodDrops, setBloodDrops] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const [whisperText, setWhisperText] = useState("");
  const [showWhisper, setShowWhisper] = useState(false);
  const [showEyes, setShowEyes] = useState(false);
  const [distortionLevel, setDistortionLevel] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const whisperAudioRef = useRef<HTMLAudioElement>(null);
  const heartbeatAudioRef = useRef<HTMLAudioElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setTheme } = useTheme();

  const weirdSymbols = ["⚠️", "👁️", "🔮", "⚡", "🧿", "🗝️", "📓", "🔍", "⏳", "🧩", "💀", "🪦", "🩸", "🔪", "⛓️"];
  const weirdTexts = [
    "TRUST NO ONE",
    "THE DARKNESS IS COMING",
    "HE'S WATCHING",
    "REALITY IS AN ILLUSION",
    "THE UNIVERSE IS A HOLOGRAM",
    "BUY GOLD",
    "CIPHER'S WATCHING",
    "DON'T LOOK BEHIND YOU",
    "BEWARE THE BEAST WITH ONE EYE",
    "YOUR SOUL IS MINE",
    "THE SHADOWS SPEAK",
    "THEY'RE IN YOUR HEAD",
    "CAN YOU FEEL THEM WATCHING?",
    "THE WALLS BLEED",
    "THERE'S NO ESCAPE",
    "THE END IS NEAR",
  ];

  const whispers = [
    "behind you",
    "don't turn around",
    "can you hear me?",
    "I see you",
    "let me in",
    "help me",
    "it's too late",
    "run while you can",
    "they're coming",
    "you can't escape",
    "I'm inside your head",
  ];

  useEffect(() => {
    setTheme("dark");

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });

        // Random chance to create blood drops where mouse moves
        if (Math.random() > 0.95) {
          const newDrop = {
            id: Date.now(),
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            size: Math.random() * 15 + 5,
          };
          setBloodDrops((prev) => [...prev, newDrop]);

          // Limit the number of blood drops to prevent performance issues
          if (bloodDrops.length > 30) {
            setBloodDrops((prev) => prev.slice(1));
          }
        }
      }
    };

    // Start heartbeat sound
    if (heartbeatAudioRef.current) {
      heartbeatAudioRef.current.volume = 0.2;
      heartbeatAudioRef.current.play().catch((e) => console.log("Audio play prevented:", e));
    }

    // Random Bill appearances with higher frequency
    const billInterval = setInterval(() => {
      if (Math.random() > 0.6 && !entered) {
        setShowBill(true);
        setTimeout(() => setShowBill(false), 1500);

        if (audioRef.current) {
          audioRef.current.volume = 0.3;
          audioRef.current.play().catch((e) => console.log("Audio play prevented:", e));
        }
      }
    }, 4000);

    // Random text appearances
    const textInterval = setInterval(() => {
      if (Math.random() > 0.5 && !entered) {
        const x = Math.random() * 80 + 10; // 10-90% of screen width
        const y = Math.random() * 80 + 10; // 10-90% of screen height
        setRandomTextPosition({ x, y });
        setRandomSymbol(weirdSymbols[Math.floor(Math.random() * weirdSymbols.length)]);
        setShowRandomText(true);
        setTimeout(() => setShowRandomText(false), 2000);
      }
    }, 2500);

    // Random whispers
    const whisperInterval = setInterval(() => {
      if (Math.random() > 0.7 && !entered) {
        const randomWhisper = whispers[Math.floor(Math.random() * whispers.length)];
        setWhisperText(randomWhisper);
        setShowWhisper(true);

        if (whisperAudioRef.current) {
          whisperAudioRef.current.volume = 0.15;
          whisperAudioRef.current.play().catch((e) => console.log("Audio play prevented:", e));
        }

        setTimeout(() => setShowWhisper(false), 3000);
      }
    }, 7000);

    // Random eyes in the darkness
    const eyesInterval = setInterval(() => {
      if (Math.random() > 0.7 && !entered) {
        setShowEyes(true);
        setTimeout(() => setShowEyes(false), 3000);
      }
    }, 8000);

    // Random screen distortion
    const distortionInterval = setInterval(() => {
      if (Math.random() > 0.6 && !entered) {
        setDistortionLevel(Math.random() * 20);
        setTimeout(() => setDistortionLevel(0), 1000);
      }
    }, 5000);

    // Random jump scares (less frequent)
    const jumpScareInterval = setInterval(() => {
      if (Math.random() > 0.85 && !entered && !showJumpScare) {
        setShowJumpScare(true);

        if (audioRef.current) {
          audioRef.current.src = "/jumpscare-sound.mp3"; // Replace with actual jumpscare sound
          audioRef.current.volume = 0.5;
          audioRef.current.play().catch((e) => console.log("Audio play prevented:", e));
        }

        setTimeout(() => setShowJumpScare(false), 500);
      }
    }, 15000);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(billInterval);
      clearInterval(textInterval);
      clearInterval(whisperInterval);
      clearInterval(eyesInterval);
      clearInterval(distortionInterval);
      clearInterval(jumpScareInterval);

      if (heartbeatAudioRef.current) {
        heartbeatAudioRef.current.pause();
      }
    };
  }, [entered, bloodDrops.length, setTheme]);

  const handleEnter = () => {
    setEntered(true);

    if (audioRef.current) {
      audioRef.current.src = "/portal-sound.mp3"; // Replace with actual portal sound
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch((e) => console.log("Audio play prevented:", e));
    }

    // Trigger a final jumpscare after portal animation
    setTimeout(() => {
      setShowJumpScare(true);

      if (audioRef.current) {
        audioRef.current.src = "/final-jumpscare.mp3"; // Replace with actual jumpscare sound
        audioRef.current.volume = 0.6;
        audioRef.current.play().catch((e) => console.log("Audio play prevented:", e));
      }

      setTimeout(() => setShowJumpScare(false), 800);
    }, 2500);

    // Uncomment to navigate to another page
    // setTimeout(() => router.push('/hackathon'), 4000)
  };

  // Flashlight size changes based on mouse movement to make it more natural
  const flashlightSize = Math.max(80, 120 + Math.sin(Date.now() / 1000) * 20);

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black"
      ref={containerRef}
      style={{
        filter: `blur(${distortionLevel}px) contrast(${1 + distortionLevel / 50})`,
        transition: "filter 0.3s ease-in-out",
      }}
    >
      {/* Audio elements */}
      <audio ref={audioRef} src="/bill-laugh.mp3" preload="auto"></audio>
      <audio ref={whisperAudioRef} src="/whisper.mp3" preload="auto" loop></audio>
      <audio ref={heartbeatAudioRef} src="/heartbeat.mp3" preload="auto" loop></audio>

      {/* Background with noise texture */}
      <div className="absolute inset-0 z-0 bg-black opacity-50 noise-bg"></div>

      {/* Hidden background that's revealed with flashlight */}
      <div
        className="absolute inset-0 z-10 bg-cover bg-center opacity-0 transition-all duration-300"
        style={{
          backgroundImage: "url('/dark.jpg?height=1080&width=1920')",
          mask: `radial-gradient(circle ${flashlightSize}px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.3) ${
            flashlightSize + 10
          }px, transparent ${flashlightSize + 30}px)`,
          WebkitMask: `radial-gradient(circle ${flashlightSize}px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.3) ${
            flashlightSize + 10
          }px, transparent ${flashlightSize + 30}px)`,
          opacity: 1,
        }}
      />

      {/* Blood splatters on background */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div className="blood-splatter top-0 left-0"></div>
        <div className="blood-splatter top-0 right-0"></div>
        <div className="blood-splatter bottom-0 left-0"></div>
        <div className="blood-splatter bottom-0 right-0"></div>
        <div className="blood-splatter top-1/2 lehttps://prod.liveshare.vsengsaas.visualstudio.com/join?2AC7CA92C27F4A6A3F4AA07CFEB4FB5820B0ft-1/4"></div>
        <div className="blood-splatter top-1/3 right-1/3"></div>
      </div>

      {/* Blood drops from mouse movement */}
      {bloodDrops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute z-20 rounded-full bg-red-900"
          style={{
            left: drop.x,
            top: drop.y,
            width: drop.size,
            height: drop.size * 1.5,
            boxShadow: "0 0 5px rgba(139, 0, 0, 0.7)",
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0.8],
            y: [0, drop.size * 3],
            width: [drop.size, drop.size, drop.size * 1.2],
          }}
          transition={{ duration: 2 + Math.random() * 3 }}
        />
      ))}

      {/* Mysterious symbols scattered around */}
      <div className="absolute inset-0 z-0">
        {weirdSymbols.map((symbol, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl opacity-20"
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              y: [0, -10, 0],
              rotate: [0, index % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3 + index,
              ease: "easeInOut",
            }}
            style={{
              top: `${10 + index * 8}%`,
              left: `${5 + index * 9}%`,
              color: index < 10 ? `hsl(${index * 36}, 100%, 70%)` : "#8B0000",
              textShadow: `0 0 5px ${index < 10 ? `hsl(${index * 36}, 100%, 70%)` : "#FF0000"}`,
              transform: `rotate(${index * 10}deg)`,
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      {/* Eyes in the darkness */}
      <AnimatePresence>
        {showEyes && (
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              const x = Math.random() * 100;
              const y = Math.random() * 100;
              const size = Math.random() * 20 + 10;
              return (
                <motion.div
                  key={`eye-${i}`}
                  className="absolute z-25"
                  style={{
                    top: `${y}%`,
                    left: `${x}%`,
                    width: size,
                    height: size / 2,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 3,
                    times: [0, 0.1, 1],
                  }}
                >
                  <div className="eye">
                    <div className="pupil"></div>
                  </div>
                </motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Random appearing text */}
      <AnimatePresence>
        {showRandomText && (
          <motion.div
            className={`${silkscreen.className} absolute z-30 text-sm text-red-500 md:text-base`}
            style={{
              top: `${randomTextPosition.y}%`,
              left: `${randomTextPosition.x}%`,
              textShadow: "0 0 5px #FF0000, 0 0 10px #FF0000",
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: [-5, 5, -5] }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            {randomSymbol} {weirdTexts[Math.floor(Math.random() * weirdTexts.length)]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Whispers */}
      <AnimatePresence>
        {showWhisper && (
          <motion.div
            className={`${nosifer.className} absolute z-30 text-xl text-red-700 opacity-70`}
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              textShadow: "0 0 8px #8B0000",
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
          >
            {whisperText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bill Cipher random appearances */}
      <AnimatePresence>
        {showBill && (
          <motion.div
            className="absolute z-40"
            style={{
              top: `${Math.random() * 70 + 15}%`,
              left: `${Math.random() * 70 + 15}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{ opacity: 1, scale: [0, 1.5, 1], rotate: 360 }}
            exit={{ opacity: 0, scale: 0, rotate: -360 }}
            transition={{ duration: 0.7 }}
          >
            <div className="bill-cipher-evil"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Jump scare */}
      <AnimatePresence>
        {showJumpScare && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 1] }} exit={{ scale: 0 }} transition={{ duration: 0.3 }} className="relative">
              <div className="jumpscare-face"></div>
              <motion.div
                className={`${nosifer.className} text-center text-5xl text-red-600`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ textShadow: "0 0 10px #FF0000, 0 0 20px #FF0000" }}
              >
                RUN
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center">
        <motion.div className="glitch-container mb-8" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5 }}>
          <h1
            className={`${nosifer.className} glitch-text text-center text-5xl font-bold tracking-wider text-transparent md:text-7xl`}
            data-text="MYSTERY HACK"
            style={{
              textShadow: "0 0 10px #FF0000, 0 0 20px #FF0000",
              WebkitTextStroke: "1px #FF0000",
            }}
          >
            MYSTERY HACK
          </h1>
        </motion.div>

        <motion.div className="relative mb-12 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 1 }}>
          <div className={`${silkscreen.className} flicker-text text-center text-lg text-red-500 md:text-xl`} style={{ textShadow: "0 0 5px #FF0000, 0 0 10px #FF0000" }}>
            THE NIGHTMARE BEGINS
          </div>
          <div className={`${silkscreen.className} mt-2 text-center text-sm text-red-500 md:text-base`} style={{ textShadow: "0 0 5px #FF0000, 0 0 10px #FF0000" }}>
            HACKATHON 2025
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1.5,
          }}
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.9 }}
        >
          <button
            onClick={handleEnter}
            className={`${nosifer.className} pulse-button relative overflow-hidden rounded-lg border-2 border-red-700 bg-black px-8 py-3 text-lg font-bold text-red-700 transition-all duration-300 hover:bg-red-900 hover:text-white hover:shadow-[0_0_15px_5px_rgba(139,0,0,0.7)]`}
            style={{ textShadow: "0 0 5px #8B0000" }}
          >
            ENTER IF YOU DARE
          </button>
        </motion.div>

        {/* Floating Bill Cipher */}
        <motion.div className="absolute bottom-10 w-full text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 2 }}>
          <motion.div
            className="bill-cipher-container mx-auto"
            animate={{
              y: [0, -10, 0],
              rotateY: [0, 180, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5,
              ease: "easeInOut",
            }}
          >
            <div className="bill-cipher-eye-evil"></div>
          </motion.div>
          <div className={`${nosifer.className} mt-2 text-xs text-red-600`} style={{ textShadow: "0 0 10px #8B0000" }}>
            HE&apos;S ALWAYS WATCHING
          </div>
        </motion.div>
      </div>

      {/* Portal effect when entering */}
      <AnimatePresence>
        {entered && (
          <>
            <motion.div
              className="portal-container"
              ref={portalRef}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 20], opacity: [0, 0.8, 1] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 3 }}
            >
              <div className="portal-outer-evil"></div>
              <div className="portal-middle-evil"></div>
              <div className="portal-inner-evil"></div>
            </motion.div>

            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <motion.div
                className={`${nosifer.className} text-center text-6xl font-bold text-red-600`}
                initial={{ scale: 3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
                style={{ textShadow: "0 0 10px #FF0000, 0 0 20px #FF0000" }}
              >
                YOUR SOUL IS MINE
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Pentagram overlay that fades in and out */}
      <div className="absolute inset-0 z-15 pointer-events-none pentagram-overlay"></div>

      {/* Vignette effect around the edges */}
      <div className="absolute inset-0 z-15 pointer-events-none vignette-effect"></div>

      {/* Scanlines effect */}
      <div className="absolute inset-0 z-15 pointer-events-none scanlines"></div>

      {/* TV static overlay */}
      <div className="absolute inset-0 z-16 pointer-events-none tv-static"></div>
    </div>
  );
}
