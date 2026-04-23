// app/reservation/page.jsx
"use client";
import { useState } from "react";
 import Link from "next/link";

const SEANCES = ["a recuperer", "______", "_________", "__________"];
const TARIFS = [
  { label: "Normal", price: 130.5 },
  { label: "Étudiant", price: 100.5 },
  { label: "Enfant (-12 ans)", price: 80.5 },
];
const TAKEN_SEATS = [3, 7, 8, 14, 21, 22, 23, 30, 31, 38, 45];
const FRAIS_SERVICE = 1.5;

export default function ReservationPage() {
  const [form, setForm] = useState({
    date: "",
    seance: SEANCES[0],
    salle: "Salle 1 · IMAX",
    tarif: TARIFS[0].price,
    seats: new Set(),
    prenom: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const toggleSeat = (seat) => {
    setForm((prev) => {
      const seats = new Set(prev.seats);
      seats.has(seat) ? seats.delete(seat) : seats.add(seat);
      return { ...prev, seats };
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.prenom.trim()) errs.prenom = "Le prénom est requis.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = "Email invalide.";
    if (form.seats.size === 0)
      errs.seats = "Veuillez sélectionner au moins une place.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const res = await fetch("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        seats: [...form.seats],
        total: form.seats.size * form.tarif + FRAIS_SERVICE,
      }),
    });

    setLoading(false);
    if (res.ok) setSuccess(true);
    else setErrors({ api: "Une erreur est survenue. Veuillez réessayer." });
  };

  const total = form.seats.size * form.tarif + FRAIS_SERVICE;

  if (success) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center">
        <p className="text-2xl mb-2">✅</p>
        <h2 className="text-xl font-medium mb-1">Réservation confirmée !</h2>
        <p className="text-gray-500 text-sm">Un email de confirmation vous a été envoyé.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-5">
      <h1 className="text-2xl font-semibold">Réserver un ticket</h1>

      {/* Film */}
      <div className="bg-gray-50 rounded-xl p-4 flex gap-4">
        <div className="w-14 h-20 rounded-lg bg-slate-800 flex items-center justify-center text-2xl shrink-0">🎬</div>
        <div>
          <p className="font-medium">Dune: Deuxième Partie</p>
          <p className="text-sm text-gray-500">Denis Villeneuve · 2h46</p>
        </div>
      </div>

      {/* Date & Séance */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Séance</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.seance}
            onChange={(e) => setForm({ ...form, seance: e.target.value })}
          >
            {SEANCES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Tarif */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Tarif</label>
        <select
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={form.tarif}
          onChange={(e) => setForm({ ...form, tarif: parseFloat(e.target.value) })}
        >
          {TARIFS.map((t) => (
            <option key={t.label} value={t.price}>
              {t.label} — {t.price.toFixed(2)} Dh
            </option>
          ))}
        </select>
      </div>

      {/* Sélection des places */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Places</label>

        <Link
             href="/confirmation"
             className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors text-center"
>            Visualiser les places
        </Link>
        
      </div>

      {/* Infos personnelles */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Prénom</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Votre prénom"
            value={form.prenom}
            onChange={(e) => setForm({ ...form, prenom: e.target.value })}
          />
          {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="email@exemple.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Récapitulatif */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
        <div className="flex justify-between text-gray-500">
          <span>{form.seats.size} place(s) × {form.tarif.toFixed(2)} Dh</span>
          <span>{(form.seats.size * form.tarif).toFixed(2)} Dh</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Frais de service</span>
          <span>{FRAIS_SERVICE.toFixed(2)} Dh</span>
        </div>
        <div className="flex justify-between font-medium text-base pt-2 border-t">
          <span>Total</span>
          <span>{total.toFixed(2)} Dh</span>
        </div>
      </div>

      {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}

      <button
        type="submit"
        disabled={loading || form.seats.size === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-3 rounded-xl transition-colors"
      >
        {loading ? "Traitement..." : "Réserver maintenant"}
      </button>
    </form>
  );
}