import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import { motion } from "framer-motion";
import Fireworks from "@fireworks-js/react";

const Navbar = ({ navOpen, toggleNav }) => (
  <nav className="bg-black bg-opacity-60 fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
    <div className="text-white font-bold text-xl">Fastighetsplattform AB</div>
    <button className="text-white text-2xl sm:hidden" onClick={toggleNav}>
      {navOpen ? <FaTimes /> : <FaBars />}
    </button>
    <div
      className={`absolute top-full left-0 w-full sm:w-auto sm:relative sm:flex sm:space-x-6 ${navOpen ? "block" : "hidden"
        } bg-black sm:bg-transparent`}
    >
      {/* Global links */}
      <a href="/Map" className="block text-white hover:text-gray-300 py-2 px-4">
        Karta
      </a>
      <a
        href="/Login"
        className="block text-white hover:text-gray-300 py-2 px-4"
      >
        Logga in
      </a>

      {/* Page-specific links */}
      <ScrollLink
        to="hero"
        smooth={true}
        offset={-70}
        duration={800}
        className="block text-white hover:text-gray-300 py-2 px-4"
      >
        Hem
      </ScrollLink>
      <ScrollLink
        to="services"
        smooth={true}
        offset={-70}
        duration={800}
        className="block text-white hover:text-gray-300 py-2 px-4"
      >
        Tjänster
      </ScrollLink>
      <ScrollLink
        to="offers"
        smooth={true}
        offset={-70}
        duration={800}
        className="block text-white hover:text-gray-300 py-2 px-4"
      >
        Våra erbjudanden
      </ScrollLink>
      <ScrollLink
        to="fireworks"
        smooth={true}
        offset={-70}
        duration={800}
        className="block text-white hover:text-gray-300 py-2 px-4"
      >
        Fyrverkeri
      </ScrollLink>
    </div>
  </nav>
);

const HomePage = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [fireworksActive, setFireworksActive] = useState(false);

  const toggleNav = () => setNavOpen(!navOpen);

  const triggerFireworks = () => {
    setFireworksActive(true);
    setTimeout(() => setFireworksActive(false), 3000);
  };

  return (
    <div className="font-sans bg-gray-100 text-gray-800">
      <Navbar navOpen={navOpen} toggleNav={toggleNav} />

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
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Utforska Fastighetsmarknaden Med Data-Drivna Insikter
          </h1>
          <p className="text-white text-lg sm:text-xl mb-6">
            Vi erbjuder marknadsledande analys- och kartverktyg för att hjälpa
            dig fatta välgrundade beslut på fastighetsmarknaden.
          </p>
        </motion.div>
      </section>

      {/* Services section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
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
                className="w-full rounded-lg shadow-md  transition-transform"
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
              <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Dataanalys</h2>
              <p className="text-gray-600 text-lg mb-4">
                Med våra avancerade verktyg kan du analysera fastighetsmarknaden och få djupgående insikter.
              </p>
              <p className="text-gray-600 text-lg mb-4">
                Vi samlar in och analyserar data från flera källor för att ge dig det bästa beslutsunderlaget.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service 2 */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1,delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/mapillustration.jpg"
                alt="Karttjänster"
                className="w-full rounded-lg shadow-md  transition-transform"
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
              <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Karttjänster</h2>
              <p className="text-gray-600 text-lg mb-4">
                Utforska vår interaktiva karta för att visualisera fastighetsdata på detaljnivå.
              </p>
              <p className="text-gray-600 text-lg mb-4">
                Våra karttjänster hjälper dig förstå området och dess potential.
              </p>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Offers Section */}
      <section id="offers" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl font-bold mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1 }}
          >
            Våra Viktigaste Erbjudanden
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
              title: "Fastighetsanalys",
              description: "Få djupgående insikter om marknaden för att fatta välgrundade beslut.",
            },
            {
              title: "Områdesdata",
              description: "Analysera demografisk data och områdets utvecklingspotential.",
            },
            {
              title: "Prognoser",
              description: "Få framtidsanalyser baserade på aktuella marknadstrender.",
            },
            {
              title: "Värderingar",
              description: "Tillförlitliga fastighetsvärderingar som håller sig uppdaterade.",
            }].map((offer, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-bold mb-4">{offer.title}</h3>
                <p className="text-gray-700">{offer.description}</p>
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

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-8">
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
      </footer>
    </div>
  );
};

export default HomePage;
