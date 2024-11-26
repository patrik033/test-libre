import React, { useState } from "react";
import { motion } from "framer-motion";

const CurvedBranches = () => {
  const [activeCard, setActiveCard] = useState(null);

  // Information om varje knapp och stam
  const branches = [
    {
      id: 1,
      title: "Dataanalys",
      description: "Utforska marknadsdata och analyser.",
      path: "M400,600 C400,500 300,400 200,300", // Vänsterkurva
      buttonPosition: { x: 200, y: 300 },
      color: "url(#gradient1)",
    },
    {
      id: 2,
      title: "Karttjänster",
      description: "Visualisera fastighetsinformation.",
      path: "M400,600 C400,500 500,400 600,300", // Högerkurva
      buttonPosition: { x: 600, y: 300 },
      color: "url(#gradient2)",
    },
    {
      id: 3,
      title: "Prognoser",
      description: "Förutsägelser baserade på trender.",
      path: "M400,600 C400,500 400,400 400,300", // Rakt upp
      buttonPosition: { x: 400, y: 300 },
      color: "url(#gradient3)",
    },
  ];

  const handleCardClose = () => setActiveCard(null);

  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-purple-900 py-16 text-white min-h-screen">
      <div className="max-w-4xl mx-auto relative">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Utforska våra Tjänster
        </h1>

        {/* SVG: Stammar */}
        <svg
          className="w-full h-[600px] relative mx-auto"
          viewBox="0 0 800 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definiera gradienter */}
          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF7F50" />
              <stop offset="100%" stopColor="#FF4500" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6A5ACD" />
              <stop offset="100%" stopColor="#483D8B" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#32CD32" />
              <stop offset="100%" stopColor="#228B22" />
            </linearGradient>
          </defs>

          {/* Rita stammar */}
          {branches.map((branch) => (
            <path
              key={branch.id}
              d={branch.path}
              stroke={branch.color}
              strokeWidth="8"
              fill="transparent"
            />
          ))}
        </svg>

        {/* Knappar */}
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="absolute"
            style={{
              top: `${branch.buttonPosition.y}px`,
              left: `${branch.buttonPosition.x}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <button
              onClick={() => setActiveCard(branch.id)}
              className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <span>{branch.title.charAt(0)}</span>
            </button>
          </div>
        ))}

        {/* Flytande kort */}
        {activeCard !== null && (
          <motion.div
            className="fixed top-[40%] left-1/2 bg-white text-gray-800 shadow-lg z-50 p-8 rounded-lg"
            initial={{ opacity: 0, x: "-50%" }}
            animate={{ opacity: 1, x: "-50%" }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={handleCardClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {branches.find((branch) => branch.id === activeCard).title}
            </h2>
            <p>{branches.find((branch) => branch.id === activeCard).description}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CurvedBranches;
