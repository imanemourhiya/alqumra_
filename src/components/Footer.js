
"use client";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 px-8 py-10 mt-auto">
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo + description */}
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-3">🎬 EL Qumra</h2>
          <p className="text-sm">
            Réservez vos tickets de cinéma en ligne facilement et rapidement.
          </p>
        </div>

        {/* Liens rapides */}
        <div>
          <h3 className="text-white font-semibold mb-3">Liens rapides</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-red-400">Accueil</Link></li>
            <li><Link href="/films" className="hover:text-red-400">Films</Link></li>
            <li><Link href="/login" className="hover:text-red-400">Connexion</Link></li>
            <li><Link href="/register" className="hover:text-red-400">S'inscrire</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>📧 contact@cineapp.com</li>
            <li>📞 +212 6 00 00 00 00</li>
            <li>📍 Casablanca, Maroc</li>
          </ul>
        </div>

      </div>

      {/* Ligne de copyright */}
      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
        © {new Date().getFullYear()} EL Qumra — Tous droits réservés
      </div>

    </footer>
  );
}