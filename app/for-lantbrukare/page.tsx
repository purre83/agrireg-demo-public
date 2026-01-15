'use client';

import { farms } from "@/src/data/dummyData";
import Link from 'next/link';
import { Upload, FileText } from 'lucide-react';

export default function LantbrukarePage() {
  const exampleFarm = farms[0]; // Första fake-gården för demo

  const bondStatusColor = exampleFarm.status === 'green' ? 'bg-green-600 text-white' : 
                          exampleFarm.status === 'yellow' ? 'bg-yellow-600 text-white' : 
                          'bg-red-600 text-white';

  const statusText = exampleFarm.status === 'green' ? 'Grön – allt under kontroll' : 
                     exampleFarm.status === 'yellow' ? 'Gul – viss risk' : 
                     'Röd – hög risk';

  const unusedSupport = 18400; // Demo-värde för outnyttjat CAP-stöd (+18 400 kr)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Välkomst */}
        <div className="bg-green-100 p-8 rounded-xl mb-12 text-center shadow-md">
          <h1 className="text-4xl font-bold mb-4">Välkommen som lantbrukare!</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Här ser du vy för din egen gård. Testa att ladda upp dokument och generera förhandsrapport – allt samlat på ett ställe.
          </p>
        </div>

        {/* Gård-kort */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Status-badge högst upp */}
          <div className={`p-4 text-center font-bold text-xl ${bondStatusColor}`}>
            {statusText}
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Din gård</h2>
            
            <h3 className="text-2xl font-bold mb-6 text-center">{exampleFarm.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <p className="text-lg text-gray-600">Outnyttjat CAP-stöd</p>
                <p className="text-4xl font-bold text-primary">{unusedSupport.toLocaleString()} kr</p>
              </div>
              <div className="text-center">
                <p className="text-lg text-gray-600">Nästa deadline</p>
                <p className="text-3xl font-bold">15 mars 2026</p>
              </div>
              <div className="text-center">
                <p className="text-lg text-gray-600">Dokument klara</p>
                <p className="text-3xl font-bold">8 / 12</p>
              </div>
            </div>

            {/* Knappar – "Generera förhandsrapport" för bönder */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <button className="flex items-center justify-center gap-4 bg-blue-600 text-white px-10 py-6 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg text-xl">
                <Upload size={32} />
                Ladda upp dokument
              </button>
              <button className="flex items-center justify-center gap-4 bg-green-600 text-white px-10 py-6 rounded-xl font-bold hover:bg-green-700 transition shadow-lg text-xl">
                <FileText size={32} />
                Generera förhandsrapport
              </button>
            </div>

            <p className="text-center text-gray-600 mt-8">
              (Förhandsrapport i demo – full version: rådgivare låser, signerar och exporterar till Länsstyrelsen)
            </p>
          </div>
        </div>

        {/* NY SEKTION: Min gård – Egenkontroll */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Min gård – Egenkontroll</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Snabbkoll på vad som är klart inför tillsyn. Full version med rådgivare ger kvalitetssäkrat underlag.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Block A: Dokumentstatus */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Dokumentstatus</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span>Gödselplan</span>
                  <span className="text-green-600 font-medium">🟢 Finns</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Sprutjournal</span>
                  <span className="text-green-600 font-medium">🟢 Finns</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Växtodlingsplan</span>
                  <span className="text-green-600 font-medium">🟢 Finns</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Stalljournal</span>
                  <span className="text-yellow-600 font-medium">🟡 Gammal</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Markkartering</span>
                  <span className="text-red-600 font-medium">🔴 Saknas</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Kemikalieförteckning</span>
                  <span className="text-green-600 font-medium">🟢 Finns</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Skyddszonskarta</span>
                  <span className="text-green-600 font-medium">🟢 Finns</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Arrendeavtal / blockunderlag</span>
                  <span className="text-yellow-600 font-medium">🟡 Gammal</span>
                </li>
              </ul>
            </div>

            {/* Block B: Miljörisk – snabbkoll */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Miljörisk – snabbkoll</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span>Gödsel sprids enligt plan</span>
                  <span className="text-green-600 font-medium">🟢 OK</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Inga spridningar nära vattendrag</span>
                  <span className="text-green-600 font-medium">🟢 OK</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Skyddszoner finns och är synliga</span>
                  <span className="text-green-600 font-medium">🟢 OK</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Inga läckage runt gödselbrunn</span>
                  <span className="text-yellow-600 font-medium">🟡 Risk</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Kemikalier förvaras korrekt</span>
                  <span className="text-green-600 font-medium">🟢 OK</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Sprutan är besiktad</span>
                  <span className="text-red-600 font-medium">🔴 Ej OK</span>
                </li>
              </ul>
              <p className="mt-6 text-center text-lg font-semibold text-green-600">Låg risk</p>
            </div>

            {/* Block C: Deadline-koll */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Deadline-koll</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span>Årlig gödselplan uppdaterad</span>
                  <span className="text-green-600 font-medium">OK</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Växtnäringsbalans klar</span>
                  <span className="text-green-600 font-medium">OK</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Sprutjournal uppdaterad</span>
                  <span className="text-yellow-600 font-medium">Snart</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Markkartering inom 8 år</span>
                  <span className="text-red-600 font-medium">För sent</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Skyddszoner fotograferade</span>
                  <span className="text-green-600 font-medium">OK</span>
                </li>
              </ul>
            </div>

            {/* Block D: Fält & skyddszoner (foto-uppladdning placeholder) */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Fält & skyddszoner – foton</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span>Foton på skyddszoner</span>
                  <span className="text-green-600 font-medium">🟢 3 st</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Foton på gödselplatta</span>
                  <span className="text-green-600 font-medium">🟢 2 st</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Foton på kemikalieförråd</span>
                  <span className="text-yellow-600 font-medium">🟡 1 st</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Foton på känsliga fält</span>
                  <span className="text-red-600 font-medium">🔴 Saknas</span>
                </li>
              </ul>
              <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
                Ladda upp foto
              </button>
            </div>

            {/* Block E: Om kontrollen kommer i morgon */}
            <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Om kontrollen kommer i morgon</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span>Jag hittar mina dokument</span>
                  <span className="text-green-600 font-medium">🟢 Ja</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>De är uppdaterade</span>
                  <span className="text-green-600 font-medium">🟢 Ja</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Jag kan visa hur jag jobbar</span>
                  <span className="text-yellow-600 font-medium">🟡 Delvis</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Jag kan visa foton</span>
                  <span className="text-yellow-600 font-medium">🟡 Delvis</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Jag kan visa status</span>
                  <span className="text-green-600 font-medium">🟢 Ja</span>
                </li>
              </ul>
              <p className="mt-6 text-center text-2xl font-bold text-green-600">Redo</p>
            </div>

            {/* Block F: Min att-göra-lista */}
            <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Min att-göra-lista</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-red-600 mr-3">•</span>
                  <span>Uppdatera markkartering (äldre än 8 år)</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-600 mr-3">•</span>
                  <span>Ladda upp foto på känsliga fält</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-600 mr-3">•</span>
                  <span>Uppdatera sprutjournal (snart deadline)</span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-12 text-sm">
            Egenkontroll – ej kvalitetssäkrat. För färdigt tillsynsunderlag, export och kvalitetssäkring krävs rådgivarläge.
          </p>
        </div>

        {/* Länk tillbaka */}
        <div className="text-center mt-12">
          <Link href="/" className="text-primary font-semibold underline">
            Tillbaka till startsidan
          </Link>
        </div>
      </div>
    </div>
  );
}