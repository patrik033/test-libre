const Footer = () => {
    return (
        <div>

            <footer id="contact" className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Företagsinfo */}
                    <div>
                        <h3 className="font-bold text-lg mb-2">Fastighetsplattform AB</h3>
                        <p className="text-sm">Sveavägen 123, Stockholm</p>
                        <p className="text-sm">
                            Email: <a href="mailto:info@fastighetsplattform.se" className="text-green-400 hover:underline">info@fastighetsplattform.se</a>
                        </p>
                        <p className="text-sm">
                            Telefon: <a href="tel:0812345678" className="text-green-400 hover:underline">08-123 456 78</a>
                        </p>
                    </div>

                    {/* Länkar och Sociala medier */}
                    <div>
                        <h3 className="font-bold text-lg mb-2">Snabblänkar & Sociala medier</h3>
                        <ul className="list-none space-y-1">
                            <li><a href="/About" className="text-gray-300 hover:underline text-sm">Om oss</a></li>
                            <li><a href="/Contact" className="text-gray-300 hover:underline text-sm">Kontakta oss</a></li>
                            <li><a href="/Map" className="text-gray-300 hover:underline text-sm">Karta</a></li>
                        </ul>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" className="hover:text-green-400 text-sm">LinkedIn</a>
                            <a href="#" className="hover:text-green-400 text-sm">Twitter</a>
                            <a href="#" className="hover:text-green-400 text-sm">Facebook</a>
                        </div>
                    </div>

                    {/* Kontaktformulär */}
                    <div>
                        <h3 className="font-bold text-lg mb-2">Kontakta oss</h3>
                        <details className="text-sm">
                            <summary className="cursor-pointer text-green-400 hover:underline">
                                Visa kontaktformulär
                            </summary>
                            <form className="space-y-2 mt-4">
                                <input
                                    type="text"
                                    placeholder="Ditt namn"
                                    className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Din e-post"
                                    className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white text-sm"
                                />
                                <textarea
                                    placeholder="Ditt meddelande"
                                    className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white text-sm"
                                    rows="3"
                                ></textarea>
                                <button className="bg-green-500 text-white font-semibold py-1 px-4 rounded hover:bg-green-600 text-sm">
                                    Skicka
                                </button>
                            </form>
                        </details>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs">
                    <p>© {new Date().getFullYear()} Fastighetsplattform AB. Alla rättigheter reserverade.</p>
                    <p className="mt-2 text-gray-400">
                        Designad av <a href="https://www.dittforetag.se" className="text-green-400 hover:underline">Ditt Företag</a>.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Footer;


