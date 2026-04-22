"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      {/* Bouton toggle — visible partout */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded"
        onClick={() => setOpen(!open)}
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Overlay sombre derrière la sidebar */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-800 text-white transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 mt-14"> {/* mt-14 pour éviter le bouton */}
          <h2 className="text-xl font-bold mb-6">🎬 Cinema App</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="block p-2 rounded hover:bg-gray-700">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded hover:bg-gray-700">
                Movies
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded hover:bg-gray-700">
                Reservations
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded hover:bg-gray-700">
                Profile
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}