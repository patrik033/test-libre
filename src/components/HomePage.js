import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link'

const HomePage = () => {

    
      const [navOpen, setNavOpen] = useState(false);
    
      const toggleNav = () => {
        setNavOpen(!navOpen);
      };

  return (
    <div className="font-sans bg-gray-100 text-gray-800">
       {/* Navbar */}
       <nav className="bg-black bg-opacity-60 absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
        <div className="text-white font-bold text-xl">Fastighetsplattform AB</div>
        
        {/* Mobile Menu Toggle */}
        <div className="text-white text-2xl cursor-pointer sm:hidden" onClick={toggleNav}>
          {navOpen ? <FaTimes /> : <FaBars />}
        </div>
        
        {/* Links - Visible on large screens, hidden on mobile */}
        <div className={`flex-col sm:flex-row flex-grow items-center sm:justify-between sm:flex ${navOpen ? 'flex' : 'hidden'} sm:flex`}>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0 text-center sm:text-left">
            <a href="#" className="text-white hover:text-gray-300">Hem</a>
            <Link href={`/Map`} className="text-white hover:text-gray-300">Tjänster</Link>
            <a href="#why-choose-us" className="text-white hover:text-gray-300">Varför oss</a>
            <a href="#contact" className="text-white hover:text-gray-300">Kontakt</a>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 mt-4 sm:mt-0">
            Logga in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-cover bg-center bg-[url('/housing.jpg')] h-screen flex items-center">
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
        <div className="relative z-10 p-8 sm:max-w-xl text-left ml-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Utforska Fastighetsmarknaden Med Data-Drivna Insikter
          </h1>
          <p className="text-white text-lg sm:text-xl mb-6">
            Vi erbjuder marknadsledande analys- och kartverktyg för att hjälpa dig fatta välgrundade beslut på fastighetsmarknaden.
          </p>
          <button className="bg-green-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-600">
            Läs Mer
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-4xl font-semibold mb-6">Våra Tjänster</h2>
          <p className="max-w-xl mx-auto mb-12">
            Med vår plattform kan du analysera, övervaka och prognostisera fastighetsmarknaden i realtid. Vi gör data begriplig och lättillgänglig för fastighetsägare, investerare och analytiker.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Dataanalys', description: 'Få djupgående insikter och marknadsövervakning som hjälper dig att ligga steget före.' },
              { title: 'Karttjänster', description: 'Utforska och visualisera fastighetsdata på detaljnivå direkt i våra interaktiva kartor.' },
              { title: 'Fastighetsvärdering', description: 'Tillförlitliga och uppdaterade fastighetsvärderingar anpassade efter marknadsförändringar.' },
              { title: 'Fastighetsbevakning', description: 'Vi håller koll på marknaden åt dig så att du aldrig missar en viktig transaktion.' },
            ].map((service, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-4xl font-semibold mb-6">Varför välja oss?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Tillförlitlighet', description: 'Vi erbjuder datakvalitet och insikter du kan lita på.' },
              { title: 'Innovation', description: 'Med teknik i framkant gör vi avancerad analys enkel och användarvänlig.' },
              { title: 'Anpassade lösningar', description: 'Oavsett om du är fastighetsägare eller analytiker, kan våra tjänster skräddarsys för dina behov.' },
              { title: 'Support', description: 'Vårt supportteam är alltid redo att hjälpa dig med alla frågor.' },
            ].map((value, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Services Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-4xl font-semibold mb-6">Upptäck mer</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Fastighetspriser', description: 'Se historisk prisutveckling och aktuella värderingar för alla fastighetstyper.' },
              { title: 'Områdesdata', description: 'Analysera demografiska och ekonomiska data i valda områden.' },
              { title: 'Marknadstrender', description: 'Följ trender som påverkar fastighetsvärden.' },
              { title: 'Prognoser', description: 'Få exakta prognoser baserade på marknadens senaste data.' },
            ].map((keyService, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{keyService.title}</h3>
                <p>{keyService.description}</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Läs mer</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-12 sm:py-20 bg-gray-100">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-4xl font-semibold mb-6">Vår Interaktiva Karta</h2>
          <p className="max-w-xl mx-auto mb-12">Vår interaktiva karta gör det enkelt att utforska fastighetsdata på detaljnivå. Se marknadsinsikter och fastighetsinformation i ditt område.</p>
          <div className="h-96 bg-blue-200 rounded-lg mb-6 flex items-center justify-center">
            <span className="text-blue-600">[Karta Placeholder]</span>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">Utforska kartan nu</button>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-12 sm:py-20 bg-blue-600 text-white text-center">
        <h2 className="text-2xl sm:text-4xl font-semibold mb-4">Redo att börja?</h2>
        <p className="max-w-xl mx-auto mb-6">Få tillgång till avancerade fastighetsinsikter idag. Skapa ett konto och börja analysera marknaden.</p>
        <button className="px-6 py-3 bg-white text-blue-600 rounded-lg">Kontakta oss</button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto text-center sm:flex sm:justify-between sm:text-left px-4">
          <div>
            <h3 className="font-semibold text-lg mb-4">Fastighetsplattform AB</h3>
            <p>Sveavägen 123, Stockholm</p>
            <p>Email: info@fastighetsplattform.se</p>
            <p>Telefon: 08-123 456 78</p>
          </div>
          <div className="mt-6 sm:mt-0">
            <p>© {new Date().getFullYear()} Fastighetsplattform. Alla rättigheter reserverade.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
