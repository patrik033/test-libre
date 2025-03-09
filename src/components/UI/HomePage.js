import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import { motion } from "framer-motion";
import Fireworks from "@fireworks-js/react";
import Link from "next/link";
import Image from "next/image";

const HomePage = () => {

  const [fireworksActive, setFireworksActive] = useState(false);


  const triggerFireworks = () => {
    setFireworksActive(true);
    setTimeout(() => setFireworksActive(false), 3000);
  };

  return (
    <div className="font-sans bg-gray-100 text-gray-800">
      {/* <Navbar navOpen={navOpen} toggleNav={toggleNav} /> */}






      {/* Hero Section */}
      <section
        id="hero"
        className="relative bg-cover bg-center bg-[url('/housing.jpg')] min-h-screen py-20 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 to-gray-800 to-gray-700 opacity-70"></div>
        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h1 className="max-w-5xl text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            Utforska Sveriges Kommuner Med Data-Driven Insikt
          </h1>
          <div className="text-gray-300 text-lg sm:text-xl mb-6">
            <ul className="list-none mt-4 space-y-2">
              <li>✔ Utforska interaktiva kartor över kommunerna.</li>
              <li>✔ Få tillgång till statistik på brott, skolresultat och fastighetsmarknaden.</li>
              <li>✔ Lättanvända verktyg för att hämta ut rapporter.</li>
            </ul>
          </div>
          <button className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 shadow-md transition">
            Börja Utforska
          </button>
        </motion.div>
      </section>



      {/* Call to Action Section */}
      <section
        id="call-to-action"
        className="relative py-16 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600 text-white"
      >
        {/* Overlay för mjuk övergång */}
        <div className="absolute  w-full  bg-gradient-to-b from-transparent via-gray-700 to-gray-800 opacity-90"></div>

        <div className="max-w-screen-2xl mx-auto text-center px-6 ">
          <h2 className="text-4xl font-bold mb-6">Utforska Vår Plattform</h2>
          <p className="text-lg mb-8 text-gray-300">
            Kombinera dataanalys och karttjänster för att upptäcka nya insikter. Utforska fastighetsmarknaden, skolresultat och demografi på ett visuellt och enkelt sätt.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dataanalys Block */}
            <motion.div
              className="relative bg-gradient-to-t from-gray-400 via-gray-900 opacity-70 shadow-lg rounded-lg p-6 flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              {/* Bild med gradient-overlay */}
              <div className="relative w-full mb-4" style={{ height: "50vh" }}>
                <Image
                  src="/data-analys.jpg"
                  alt="Dataanalys"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg shadow-md"
                />
              </div>

              <h3 className="text-2xl font-bold mb-4 text-gray-100">Dataanalys</h3>
              <p className="mb-4 text-gray-300 text-center">
                Utforska nationella provresultat, medellivslängd och inkomstnivåer. Upptäck hur data kan ge insikter för bättre beslut och analyser av kommuners utveckling.
              </p>
              <Link className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 shadow-md transition-transform transform hover:scale-105 glow-button"
              href={"/ComingSoon"}
              >
                Utforska Dataanalys
              </Link>
            </motion.div>

            {/* Karttjänster Block */}
            <motion.div
              className="relative bg-gradient-to-t from-gray-400 via-gray-900 opacity-70 shadow-lg rounded-lg p-6 flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {/* Bild med gradient-overlay */}
              <div className="relative w-full mb-4" style={{ height: "50vh" }}>
                <Image
                  src="/mapillustration.jpg"
                  alt="Karttjänster"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg w-full shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-75 rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-100">Karttjänster</h3>
              <p className="mb-4 text-gray-300 text-center">
                Kombinera olika datalager på kartan för att analysera fastighetsdata, bullernivåer och andra viktiga insikter. Karttjänster ger dig verktygen för att förstå lokala trender.
              </p>
              <Link className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 shadow-md transition-transform transform hover:scale-105 glow-button" href={"/ComingSoon"}>
                Se Karttjänster
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section id="offers" className="relative py-16 bg-gray-600 text-white">
        <div className="max-w-screen-2xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Våra Tjänster</h2>
          <p className="text-lg mb-8 text-gray-300">
            Upptäck de viktigaste funktionerna som vår plattform erbjuder och börja analysera data på ett nytt sätt.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Fastighetsanalys",
                description: "Analysera fastighetspriser, marknadstrender och framtidsutsikter.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-12 h-12 text-blue-500"
                  >
                    <path d="M12 2L2 12h3v8h5v-4h4v4h5v-8h3L12 2zm0 3.5l7 7V18h-3v-4H8v4H5v-5.5l7-7z" />
                  </svg>
                ),
              },
              {
                title: "Interaktiva Kartor",
                description: "Utforska fastighetsdata och statistik i visuella kartor.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    fill="currentColor"
                    className="w-12 h-12 text-teal-500"
                  >
                    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 24h24M24 12v24M18 18l12 12M30 18l-12 12" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
              },
              {
                title: "Rapporter",
                description: "Generera rapporter med avancerade dataanalyser.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-12 h-12 text-red-500"
                  >
                    <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3h6v2H9V9zm0 4h8v2H9v-2z" />
                  </svg>
                ),
              },
            ].map((offer, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-t from-gray-500 via-gray-700 to-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center"
              >
                {/* Ikon */}
                <div className="mb-4">{offer.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-100">{offer.title}</h3>
                <p className="text-gray-300 text-center">{offer.description}</p>


                <Link className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 shadow-md transition-transform transform hover:scale-105"
                  href={"/ComingSoon"}
                >
                  Läs Mer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section
        id="try"
        className="relative py-16 bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 text-white"
      >
        <div className="max-w-screen-2xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Prova Vår Plattform</h2>
          <p className="text-lg mb-8 text-gray-300">
            Testa en begränsad version av våra tjänster och upptäck hur vår plattform kan hjälpa dig att analysera data och fatta bättre beslut.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Utforska Kartan",
                description:
                  "Interagera med kartor för att analysera fastighetspriser, brottsstatistik och viktiga insikter om din kommun.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-12 h-12 text-blue-400"
                  >
                    <path d="M3.5 3L9 5.5L15 3L21 5.5V21L15 18.5L9 21L3.5 18.5V3ZM9 8L4 6.5V17.5L9 19.5V8ZM10 19.5L14 17.5V6.5L10 8V19.5ZM15 6.5V17.5L20 19.5V8L15 6.5ZM12 12C13.1 12 14 11.1 14 10C14 8.9 13.1 8 12 8C10.9 8 10 8.9 10 10C10 11.1 10.9 12 12 12ZM12 13.2C10.3 13.2 8.8 14.1 7.9 15.4C7.7 15.6 7.9 16 8.2 16H15.8C16.1 16 16.3 15.6 16.1 15.4C15.2 14.1 13.7 13.2 12 13.2Z" />
                  </svg>
                ),
                buttonText: "Utforska",
                buttonColor: "bg-blue-600 hover:bg-blue-700",
              },
              {
                title: "Analysera Statistik",
                description:
                  "Granska nationella provresultat, demografi och inkomstnivåer för att identifiera mönster och trender.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    fill="currentColor"
                    className="w-12 h-12 text-green-400"
                  >
                    <path d="M4 40h8V20H4v20zm12-12h8V12h-8v16zm12-8h8V8h-8v20zm12-12h8v32h-8V8z" />
                  </svg>
                ),
                buttonText: "Analysera",
                buttonColor: "bg-green-600 hover:bg-green-700",
              },
              {
                title: "Skapa En Rapport",
                description:
                  "Skapa rapporter baserade på fastighets- och demografidata och exportera dem för vidare användning.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    fill="currentColor"
                    className="w-12 h-12 text-yellow-400"
                  >
                    <path d="M12 4h24l8 8v32H12V4zm24 2H14v36h28V14H30V6z" />
                    <path d="M20 20h12v2H20v-2zm0 6h8v2h-8v-2z" />
                  </svg>
                ),
                buttonText: "Skapa Rapport",
                buttonColor: "bg-yellow-600 hover:bg-yellow-700",
              },
            ].map((tryItem, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-t from-gray-600 via-gray-700 to-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transform transition-transform hover:scale-105"
              >
                <div className="mb-4">{tryItem.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-100">{tryItem.title}</h3>
                <p className="text-gray-300 text-center">{tryItem.description}</p>
                <Link
                  href={"/ComingSoon"}
                  className={`${tryItem.buttonColor} mt-4 text-white px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105`}
                >
                  {tryItem.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>





      <section
        id="insights"
        className="py-16 bg-gradient-to-b from-gray-700 via-gray-600  to-gray-500 text-gray-900"
      >
        <div className="max-w-screen-2xl mx-auto px-6 ">
          <h2 className="text-4xl font-bold mb-6 text-center text-gray-100">Senaste Insikter</h2>
          <p className="text-center text-gray-200 mb-8">
            Håll dig uppdaterad med de senaste trenderna och insikterna från Sveriges kommuner.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Fastighetspriser 2023",
                description:
                  "Fastighetspriserna ökade med 5% i genomsnitt under 2023. Kommun X såg en ökning på 12%, medan Kommun Y hade en minskning på 3%.",
                image: "/huspriser.jpg",
                date: "1 januari 2024",
                buttonText: "Läs Mer",
                backgroundColorStart: "from-bg-gray-500",
                backgroundColorVia: "via-gray-600",
                backgroundColorEnd: "to-gray-800",

              },
              {
                title: "Brottsstatistik",
                description:
                  "Brottsnivåerna minskade med 10% i genomsnitt under året, särskilt i Kommun Z som rapporterade 15% färre incidenter.",
                image: "/brott.jpg",
                date: "15 december 2023",
                buttonText: "Utforska",
                backgroundColorStart: "from-bg-gray-500",
                backgroundColorVia: "via-gray-600",
                backgroundColorEnd: "to-gray-800",

              },
              {
                title: "Betygsförbättringar",
                description:
                  "Nationella provresultat förbättrades med 4% i matematik för årskurs 9. Kommunerna i norra Sverige hade högst förbättringar.",
                image: "/skola.jpg",
                date: "22 november 2023",
                buttonText: "Se Detaljer",
                backgroundColorStart: "from-bg-gray-500",
                backgroundColorVia: "via-gray-600",
                backgroundColorEnd: "to-gray-800",


              },
            ].map((insight, index) => (
              <div
                key={index}
                className="relative bg-white shadow-lg shadow-gray-700 rounded-lg overflow-hidden flex flex-col transform transition-transform "
              >
                {/* Bild och Overlay */}
                <div className="relative w-full h-48">
                  <img
                    src={insight.image}
                    alt={insight.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
                  <div className="absolute bottom-0 left-0 p-2 bg-black bg-opacity-50 text-white text-xs font-semibold rounded-tr-lg">
                    {insight.date}
                  </div>
                </div>

                {/* Textinnehåll */}
                <div className={`p-6 flex flex-col justify-between flex-grow bg-gradient-to-b ${insight.backgroundColorStart} ${insight.backgroundColorVia} ${insight.backgroundColorEnd}`}>
                  <h3 className="text-2xl font-bold mb-2 text-white">{insight.title}</h3>
                  <p className="text-gray-300 mb-4 text-sm">{insight.description}</p>
                  {/* <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 shadow-md transition-transform transform hover:scale-105"> */}
                  <Link className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 shadow-md transition-transform transform hover:scale-105 text-center" href={"/ComingSoon"}>
                    {insight.buttonText}
                  </Link>
                  {/* </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Fireworks Section */}
      {/* <section
        id="fireworks"
        className="py-16 bg-purple-700 text-white text-center"
      >
        <h2 className="text-4xl font-semibold mb-8">Fira Framgång</h2>
        <button
          onClick={triggerFireworks}
          className="bg-green-500 px-6 py-3 text-lg font-semibold rounded-full hover:bg-green-600"
        >
          Starta Fyrverkeri
        </button>
      </section>
      {fireworksActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Fireworks
            options={{
              acceleration: 1.1,
              explosion: 7,
              particles: 100,
              opacity: 0.7,
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      )} */}

      <section
        id="testimonials"
        className="py-16 bg-gradient-to-b from-gray-500 via-gray-600  to-gray-800 text-white"
      >
        <div className="max-w-screen-2xl mx-auto text-center px-6 ">
          <h2 className="text-4xl font-bold mb-6 text-gray-100">Vad våra kunder säger</h2>
          <p className="text-lg mb-12 text-gray-200">
            Våra användare älskar vad vi gör. Läs vad de har att säga om våra tjänster.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Anna Svensson",
                feedback:
                  "Plattformen är enkel att använda och har gett mig en djupare förståelse för fastighetsmarknaden.",
                role: "Fastighetsmäklare",
                date: "10 januari 2024",
              },
              {
                name: "Erik Johansson",
                feedback:
                  "Dataanalysverktygen är fantastiska och har hjälpt mig att göra mer informerade beslut.",
                role: "Dataanalytiker",
                date: "5 december 2023",
              },
              {
                name: "Maria Karlsson",
                feedback:
                  "Otroligt intuitiv och användarvänlig. Jag kan varmt rekommendera den här plattformen!",
                role: "Kommunchef",
                date: "22 november 2023",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="relative bg-gradient-to-b from-gray-500 via-gray-700 to-gray-900 p-6 rounded-lg shadow-lg flex flex-col justify-between"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.2 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-gray-200 mb-4">"{testimonial.feedback}"</p>
                <hr className="border-gray-600 my-4" />
                <div className="text-xs text-gray-300 text-right">{testimonial.date}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
