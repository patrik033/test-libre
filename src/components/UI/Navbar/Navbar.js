"use client";

import Link from "next/link";

const Navbar = () => (
  <nav className="bg-black text-white fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4">
    <div className="font-bold text-lg">Fastighetsplattform AB</div>
    <div className="ml-auto flex space-x-6">
      <Link href="/" className="hover:text-gray-300">
        Home
      </Link>
      <Link href="/Map" className="hover:text-gray-300">
        Map
      </Link>
      <Link href="/Dashboard" className="hover:text-gray-300">
        Dashboard
      </Link>
    </div>
  </nav>
);

export default Navbar;
