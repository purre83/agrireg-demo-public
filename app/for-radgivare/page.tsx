'use client';

import { farms } from "@/src/data/dummyData";
import FarmsTable from "@/components/FarmsTable";

export default function RadgivarePage() {
  const total = farms.length;
  const green = farms.filter((f) => f.status === "green").length;
  const yellow = farms.filter((f) => f.status === "yellow").length;
  const red = farms.filter((f) => f.status === "red").length;
  const atRisk = yellow + red; // Gårdar i risk = gul + röd

  return (
    <div className="space-y-8 p-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Välkommen till AgriReg
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Rådgivarportal för miljöplaner, tillsynsunderlag och CAP-optimering.
          Spara tid per gård, få kontroll inför tillsyn och synliggör outnyttjat stöd.
        </p>
      </section>

      {/* Stats-rutor – identiska med din skärmdump */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm">Totalt antal gårdar</p>
          <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm">Gröna gårdar</p>
          <p className="text-3xl font-bold text-green-600">{green}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm">Gula gårdar</p>
          <p className="text-3xl font-bold text-yellow-600">{yellow}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm">Röda gårdar</p>
          <p className="text-3xl font-bold text-red-600">{red}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm">Gårdar i risk</p>
          <p className="text-3xl font-bold text-orange-600">{atRisk}</p>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-2">Dina gårdar</h2>
        <p className="text-sm text-gray-600 mb-4">
          Klicka på en rad för att öppna gårdsprofilen med miljöplan &amp; CAP-översikt.
        </p>
        <FarmsTable />
      </section>
    </div>
  );
}