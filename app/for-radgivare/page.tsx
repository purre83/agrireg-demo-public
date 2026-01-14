'use client';

import { farms } from "@/src/data/dummyData";
import FarmsTable from "@/components/FarmsTable";

export default function RadgivarePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Välkommen till AgriReg
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Rådgivarportal för miljöplaner, tillsynsunderlag och CAP-optimering.
          Spara tid per gård, få kontroll inför tillsyn och synliggör outnyttjat stöd.
        </p>
      </section>

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