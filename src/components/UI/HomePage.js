import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

const HomePage = () => {
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  return (
    <div className="font-sans bg-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-black bg-opacity-75 fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
        <div className="text-white font-bold text-xl">Fastighetsplattform AB</div>

        {/* Mobile Menu Toggle */}
        <div
          className="text-white text-2xl cursor-pointer sm:hidden"
          onClick={toggleNav}
        >
          {navOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Links - Visible on large screens */}
        <div
          className={`absolute sm:relative top-full left-0 w-full sm:w-auto sm:flex flex-col sm:flex-row items-center sm:space-x-6 sm:mt-0 mt-4 bg-black sm:bg-transparent transition-all ${navOpen ? "flex" : "hidden"
            }`}
        >
          <a href="#" className="text-white hover:text-gray-300 py-2 px-4">
            Hem
          </a>
          <Link className="text-white hover:text-gray-300 py-2 px-4" href="/Map">
            Tjänster
          </Link>
          <a
            href="#why-choose-us"
            className="text-white hover:text-gray-300 py-2 px-4"
          >
            Varför oss
          </a>
          <a
            href="#contact"
            className="text-white hover:text-gray-300 py-2 px-4"
          >
            Kontakt
          </a>
          <button className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600">
            Logga in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-cover bg-center bg-[url('/housing.jpg')] h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Kartlägg Fastighetsmarknaden – Enkelt och Smart
          </h1>
          <p className="text-white text-lg sm:text-xl mb-6">
            Vi erbjuder marknadsledande analys- och kartverktyg för att hjälpa
            dig fatta välgrundade beslut på fastighetsmarknaden.
          </p>
          <button className="bg-green-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-600">
            Utforska Kartan
          </button>
          <ul className="text-white mt-4 space-y-2">
            <li>✔ Interaktiva kartor för detaljerad överblick</li>
            <li>✔ Dataanalys i realtid</li>
            <li>✔ Anpassningsbara verktyg för fastighetsvärdering</li>
          </ul>
        </motion.div>
        <motion.div
          className="absolute bottom-0 w-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-16"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#ffffff"
              d="M0,288L60,277.3C120,267,240,245,360,218.7C480,192,600,160,720,160C840,160,960,192,1080,192C1200,192,1320,160,1380,144L1440,128V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl font-semibold mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Våra Tjänster
          </motion.h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Dataanalys",
                description:
                  "Få djupgående insikter och marknadsövervakning som hjälper dig att ligga steget före.",
                link: "Läs Mer",
                linkText: "Läs Mer"
              },
              {
                title: "Karttjänster",
                description:
                  "Utforska och visualisera fastighetsdata på detaljnivå direkt i våra interaktiva kartor.",
                link: "Läs Mer",
                linkText: "Läs Mer"
              },
              {
                title: "Fastighetsvärdering",
                description:
                  "Tillförlitliga och uppdaterade fastighetsvärderingar anpassade efter marknadsförändringar.",
                link: "Läs Mer",
                linkText: "Läs Mer"
              },
              {
                title: "Fastighetsbevakning",
                description:
                  "Vi håller koll på marknaden åt dig så att du aldrig missar en viktig transaktion.",
                link: "Läs Mer",
                linkText: "Läs Mer"
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p>{service.description}</p>
                <button href={service.link} className="mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600">
                  {service.linkText}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold mb-8">Varför välja oss?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Tillförlitlighet",
                description: "Vi erbjuder datakvalitet och insikter du kan lita på.",
              },
              {
                title: "Innovation",
                description:
                  "Med teknik i framkant gör vi avancerad analys enkel och användarvänlig.",
              },
              {
                title: "Anpassade lösningar",
                description:
                  "Våra tjänster kan skräddarsys för dina behov, oavsett om du är fastighetsägare eller analytiker.",
              },
              {
                title: "Support",
                description:
                  "Vårt supportteam är alltid redo att hjälpa dig med alla frågor.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="p-6 bg-gray-50 rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold mb-8">Vad våra kunder säger</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[{
              name: "Anna Svensson",
              feedback: "Plattformen hjälpte oss att hitta rätt fastighet till rätt pris."
            },
            {
              name: "Erik Johansson",
              feedback: "Fantastiska visualiseringar – sparar oss timmar i analys!"
            }].map((testimonial, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-lg">
                <p className="italic">"{testimonial.feedback}"</p>
                <p className="mt-4 font-bold">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold mb-8">Kontakta Oss</h2>
          <form className="max-w-lg mx-auto space-y-4">
            <input type="text" placeholder="Ditt namn" className="w-full p-4 rounded border" />
            <input type="email" placeholder="Din e-post" className="w-full p-4 rounded border" />
            <textarea placeholder="Ditt meddelande" className="w-full p-4 rounded border" rows="4"></textarea>
            <button className="bg-green-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-600">
              Skicka
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>© {new Date().getFullYear()} Fastighetsplattform AB. Alla rättigheter reserverade.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
