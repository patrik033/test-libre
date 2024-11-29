const Footer = () => {
    return (
       

        <footer className="bg-gray-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Fastighetsplattform AB</h3>
            <p className="text-sm">Sveavägen 123, Stockholm</p>
            <p className="text-sm">Email: <a href="mailto:info@fastighetsplattform.se" className="text-green-400 hover:underline">info@fastighetsplattform.se</a></p>
            <p className="text-sm">Telefon: <a href="tel:0812345678" className="text-green-400 hover:underline">08-123 456 78</a></p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Snabblänkar & Sociala medier</h3>
            <ul className="list-none space-y-1">
              <li><a href="/About" className="text-gray-300 hover:underline text-sm">Om oss</a></li>
              <li><a href="/Contact" className="text-gray-300 hover:underline text-sm">Kontakta oss</a></li>
              <li><a href="/Map" className="text-gray-300 hover:underline text-sm">Karta</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Kontakta oss</h3>
            <form className="space-y-2 mt-4">
              <input type="text" placeholder="Ditt namn" className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white text-sm" />
              <input type="email" placeholder="Din e-post" className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white text-sm" />
              <textarea placeholder="Ditt meddelande" className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white text-sm" rows="3"></textarea>
              <button className="bg-green-500 text-white font-semibold py-1 px-4 rounded hover:bg-green-600 text-sm">Skicka</button>
            </form>
          </div>
        </div>
        <div className="text-center text-xs mt-4">
          © {new Date().getFullYear()} Fastighetsplattform AB. Alla rättigheter reserverade.
        </div>
      </footer>
        
    )
}

export default Footer;


