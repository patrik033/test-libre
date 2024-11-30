import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import { motion } from "framer-motion";
import Fireworks from "@fireworks-js/react";


const HomePage = () => {
  // const [navOpen, setNavOpen] = useState(false);
  const [fireworksActive, setFireworksActive] = useState(false);

  // const toggleNav = () => setNavOpen(!navOpen);

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
        className="relative bg-cover bg-center bg-[url('/housing.jpg')] h-screen flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
          <h1 className="max-w-5xl text-4xl sm:text-5xl font-extrabold text-white mb-6  leading-tight">
            Utforska Sveriges Kommuner Med Data-Driven Insikt
          </h1>
          <div className="text-white text-lg sm:text-xl mb-6">
            <ul className="list-none mt-4 space-y-2">
              <li>✔ Utforska interaktiva kartor över kommunerna.</li>
              <li>✔ Få tillgång till  statistik på brott, skolresultat och fastighetsmarknaden</li>
              <li>✔ Lättanvända verktyg för att hämta ut rapporter.</li>
            </ul>
          </div>
          <button className="dark:text-white bg-indigo-600 inline-flex text-gray-900 text-center font-semibold py-3 px-8 rounded-lg  hover:bg-gray-100 border-gray-300 focus:ring-4 focus:ring-gray-100">
            Börja Utforska
          </button>
        </motion.div>
      </section>

      {/* data analys section */}
      <section className="py-4 ">
        <div className=" mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/data-analys.jpg"
                alt="Dataanalys"
                className="w-full rounded-lg shadow-md transition-transform"
              />
            </motion.div>

            <motion.div
              className="md:w-1/2 text-left"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Skolresultat och Demografi</h2>
              <p className="text-gray-600 text-lg mb-4">
                Jämför skolstatistik som nationella provresultat med demografisk data
                som genomsnittsålder och inkomstnivåer.
              </p>
              <ul className="list-none list-disc list-inside text-gray-600 mb-4">
                <li>✔ Nationella provresultat per kommun och årskurs.</li>
                <li>✔ Medellivslängd och genomsnittsålder.</li>
                <li>✔ Inkomstnivåer per hushåll.</li>
              </ul>

              <div className="mt-4">
                <img src="/dataanalysexempel.jpg" alt="Exempel på dataanalys" className="w-full rounded-lg shadow-md" />
              </div>
              <button className="mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600">
                Läs mer
              </button>
            </motion.div>
          </div>
        </div>
      </section>




      {/* kart sektion 2 */}
      <section className="py-4 ">
        <div className=" mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/mapillustration.jpg"
                alt="Karttjänster"
                className="w-full rounded-lg shadow-md transition-transform"
              />
            </motion.div>

            <motion.div
              className="md:w-1/2 text-left"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Interaktiva Karttjänster</h2>
              <p className="text-gray-600 text-lg mb-4">
                Upptäck nya insikter genom att kombinera data på kartan.
                Jämför fastighetspriser, brottsstatistik och demografiska faktorer i realtid.
              </p>
              <ul className="list-none list-disc list-inside text-gray-600 mb-4">
                <li>✔ Anpassa kartvyn med olika lager.</li>
                <li>✔ Visualisera data med färgkodning och grafer.</li>
                <li>✔ Exportera analyser som rapporter.</li>
              </ul>
              <button className="mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600">
                Utforska Kartan
              </button>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Offers Section */}
      <section id="offers" className="py-4 ">
        <div className="mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            Våra Viktigaste Erbjudanden
          </motion.h2>
          {[
            {
              title: "Fastighetsanalys",
              description:
                "Utforska fastighetsdata och trender från 2016–2023. Få insikter om priser, antal sålda bostäder och marknadens utveckling.",
              image: "/fastighetsanalys.jpg",
              details: [
                "✔ Medelpriser per kommun och år",
                "✔ Trender inom bostadsmarknaden",
                "✔ Analyser av olika bostadstyper",
              ],
            },
            {
              title: "Områdesdata",
              description:
                "Analysera demografiska data som inkomst, ålder och livslängd för att förstå kommunens potential och utveckling.",
              image: "/omradesdata.jpg",
              details: [
                "✔ Genomsnittsålder och medellivslängd",
                "✔ Hushållsinkomster",
                "✔ Befolkningsutveckling",
              ],
            },
            {
              title: "Rapporter och Visualiseringar",
              description:
                "Generera och exportera rapporter med lättanvända verktyg. Anpassa grafer och tabeller för att passa dina behov.",
              image: "/rapporter.jpg",
              details: [
                "✔ Exportera PDF-rapporter",
                "✔ Färdiga grafer och tabeller",
                "✔ Anpassade analyser",
              ],
            },
          ].map((offer, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden mb-12 flex flex-col md:flex-row"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={offer.image}
                alt={offer.title}
                className="md:w-1/2 object-cover"
              />
              <div className="p-6 md:w-1/2 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">{offer.title}</h3>
                <p className="text-gray-700 mb-4">{offer.description}</p>
                <ul className="list-none list-disc list-inside text-gray-600 mb-4">
                  {offer.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
                <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
                  Läs Mer
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      <section id="try" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Prova På Vår Tjänst</h2>
          <p className="text-gray-600 text-lg mb-12">
            Testa en begränsad version av våra tjänster och upptäck hur vår plattform kan hjälpa dig.
          </p>
          <div className="space-y-8">
            {[
              {
                title: "Utforska Kartan",
                description:
                  "Interagera med vår karta och se data om fastighetspriser och brottsstatistik i en utvald kommun. Utforska möjligheterna och lär känna våra funktioner.",
                image: "/prova-karta.jpg",
                buttonText: "Utforska Karta",
              },
              {
                title: "Analysera Statistik",
                description:
                  "Utforska exempelrapporter och grafer som visar nationella provresultat och demografi. Få en känsla för våra analysverktyg.",
                image: "/prova-statistik.jpg",
                buttonText: "Prova Statistik",
              },
              {
                title: "Skapa En Rapport",
                description:
                  "Generera en anpassad rapport baserad på utvald data om demografi och fastighetsmarknad. Perfekt för beslutsfattare och analyser.",
                image: "/prova-rapport.jpg",
                buttonText: "Skapa Rapport",
              },
            ].map((tryOption, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row items-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.2 }}
              >
                <img
                  src={tryOption.image}
                  alt={tryOption.title}
                  className="w-full md:w-1/2 object-cover h-64"
                />
                <div className="p-6 md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">{tryOption.title}</h3>
                  <p className="text-gray-700 mb-6">{tryOption.description}</p>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
                    {tryOption.buttonText}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section id="insights" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Senaste Insikter</h2>
          <div className="space-y-8">
            {[
              {
                title: "Fastighetspriser 2023",
                description:
                  "Fastighetspriserna ökade med 5% i genomsnitt under 2023. Kommun X såg den största ökningen på 12%, medan Kommun Y hade en minskning på 3%.",
                image: "/insight-fastighet.jpg",
              },
              {
                title: "Brottsstatistik",
                description:
                  "Brottsnivåerna minskade med 10% i genomsnitt under året, särskilt i Kommun Z som rapporterade 15% färre incidenter.",
                image: "/insight-brott.jpg",
              },
              {
                title: "Betygsförbättringar",
                description:
                  "Nationella provresultat förbättrades med 4% i matematik för årskurs 9. Kommunerna i norra Sverige hade högst förbättringar.",
                image: "/insight-skolor.jpg",
              },
            ].map((insight, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row items-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.2 }}
              >
                <img
                  src={insight.image}
                  alt={insight.title}
                  className="w-full md:w-1/2 object-cover h-64"
                />
                <div className="p-6 md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">{insight.title}</h3>
                  <p className="text-gray-700 mb-6">{insight.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fireworks Section */}
      <section
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
      )}

      <section id="testimonials" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Vad våra kunder säger</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Anna Svensson",
                feedback: "Analyserna hjälpte mig hitta rätt fastighet snabbt.",
              },
              {
                name: "Erik Johansson",
                feedback: "Karttjänsterna gav oss insikter vi aldrig haft tidigare.",
              },
              {
                name: "Maria Karlsson",
                feedback: "Enkel och kraftfull plattform för fastighetsdata.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <p className="italic mb-4">"{testimonial.feedback}"</p>
                <p className="font-bold">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}

      {/* <Footer/> */}

      {/* <footer id="contact" className="bg-gray-900 text-white py-8">

        <div className="mx-4 mb-4">
          <form className="space-y-4">
            <input type="text" placeholder="Namn" className="w-full p-3 rounded border" />
            <input type="email" placeholder="E-post" className="w-full p-3 rounded border" />
            <textarea placeholder="Ditt meddelande" className="w-full p-3 rounded border" rows="4"></textarea>
            <button className="bg-green-500 text-white font-semibold py-2 px-6 rounded hover:bg-green-600">
              Skicka
            </button>
          </form>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Fastighetsplattform AB</h3>
            <p>Sveavägen 123, Stockholm</p>
            <p>Email: info@fastighetsplattform.se</p>
            <p>Telefon: 08-123 456 78</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Länkar</h3>
            <a href="/About" className="block hover:underline">Om oss</a>
            <a href="/Contact" className="block hover:underline">Kontakta oss</a>
            <a href="/Map" className="block hover:underline">Karta</a>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Följ oss</h3>
            <a href="#" className="block hover:underline">LinkedIn</a>
            <a href="#" className="block hover:underline">Twitter</a>
            <a href="#" className="block hover:underline">Facebook</a>
          </div>
        </div>
        <div className="text-center mt-8">
          © {new Date().getFullYear()} Fastighetsplattform AB. Alla rättigheter
          reserverade.
        </div>
      </footer> */}
    </div>
  );
};

export default HomePage;
