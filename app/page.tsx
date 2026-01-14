'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { farms } from "@/src/data/dummyData";
import { StatsCards } from "@/components/StatsCards";
import FarmsTable from "@/components/FarmsTable";
import Link from 'next/link';
import { Upload, FileText } from 'lucide-react';
export const dynamic = 'force-dynamic'; // Fixar prerender-error för useSearchParams
export default function DashboardPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const total = farms.length;
  const green = farms.filter((f) => f.status === "green").length;
  const yellow = farms.filter((f) => f.status === "yellow").length;
  const red = farms.filter((f) => f.status === "red").length;

  const exampleFarm = farms[0];

  const bondStatusColor = exampleFarm.status === 'green' ? 'bg-green-600 text-white' : 
                          exampleFarm.status === 'yellow' ? 'bg-yellow-600 text-white' : 
                          'bg-red-600 text-white';

  const statusText = exampleFarm.status === 'green' ? 'Grön – allt under kontroll' : 
                     exampleFarm.status === 'yellow' ? 'Gul – viss risk' : 
                     'Röd – hög risk';

  const unusedSupport = 18400; // Hardcode demo-värde (+18 400 kr outnyttjat CAP-stöd)

  return (
    <div className="space-y-8">
      {role === 'bonde' && (
        <div className="bg-green-100 p-8 rounded-xl mb-8 text-center shadow-md">
          <h2 className="text-3xl font-bold mb-4">Välkommen som lantbrukare!</h2>
          <p className="text-lg max-w-2xl mx-auto">Här ser du vy för din egen gård. Testa att ladda upp dokument och generera underlag – allt samlat på ett ställe.</p>
        </div>
      )}

      {role !== 'bonde' && (
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Välkommen till AgriReg
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Rådgivarportal för miljöplaner, tillsynsunderlag och CAP-optimering.
            Spara tid per gård, få kontroll inför tillsyn och synliggör outnyttjat stöd.
          </p>
        </section>
      )}

      {/* GÅRD-KORT FÖRST – med status integrerad högst upp */}
      {role === 'bonde' && (
        <section className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Status-badge högst upp */}
            <div className={`p-4 text-center font-bold text-xl ${bondStatusColor}`}>
              {statusText}
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Din gård</h2>
              
              <h3 className="text-2xl font-bold mb-6 text-center">{exampleFarm.name}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Outnyttjat CAP-stöd</p>
                  <p className="text-3xl font-bold text-primary">{unusedSupport.toLocaleString()} kr</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Nästa deadline</p>
                  <p className="text-2xl font-bold">15 mars 2026</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Dokument</p>
                  <p className="text-2xl font-bold">8 / 12 klara</p>
                </div>
              </div>

              {/* Knappar – stora och tydliga */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg text-lg">
                  <Upload size={28} />
                  Ladda upp dokument
                </button>
                <button className="flex items-center justify-center gap-3 bg-green-600 text-white px-8 py-5 rounded-xl font-bold hover:bg-green-700 transition shadow-lg text-lg">
                  <FileText size={28} />
                  Generera tillsynsunderlag
                </button>
              </div>

              <p className="text-sm text-gray-600 text-center mt-6">
                (Funktionerna är placeholders i demon – full version kommer med riktig uppladdning och generering)
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Rådgivarvy */}
      {role !== 'bonde' && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Dina gårdar</h2>
          <p className="text-sm text-gray-600 mb-4">
            Klicka på en rad för att öppna gårdsprofilen med miljöplan &amp; CAP-översikt.
          </p>
          <FarmsTable />
        </section>
      )}
    </div>
  );
}