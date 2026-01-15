'use client';

import { farms } from "@/src/data/dummyData";
import Link from 'next/link';
import { Upload, FileText, Lock, Info } from 'lucide-react';
import { useState } from 'react';

export default function LantbrukarePage() {
  const exampleFarm = farms[0]; // Första fake-gården för demo

  const bondStatusColor = exampleFarm.status === 'green' ? 'bg-green-600 text-white' : 
                          exampleFarm.status === 'yellow' ? 'bg-yellow-600 text-white' : 
                          'bg-red-600 text-white';

  const statusText = exampleFarm.status === 'green' ? 'Grön – allt under kontroll' : 
                     exampleFarm.status === 'yellow' ? 'Gul – viss risk' : 
                     'Röd – hög risk';

  const unusedSupport = 18400; // Demo-värde för outnyttjat CAP-stöd (+18 400 kr)

  // State för info-modal
  const [showInfoModal, setShowInfoModal] = useState(false);

  // State för inbjudan-form (mock)
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  // State för hjälp-form (mock)
  const [showHelpForm, setShowHelpForm] = useState(false);

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

        {/* NY SEKTION: Egenkontroll */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Egenkontroll</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Snabbkoll på vad som är klart inför tillsyn. Full version med rådgivare ger kvalitetssäkrat underlag.
          </p>

          {/* Certifiering & specialkontroller – paywall högst upp */}
          <div className="bg-gray-100 rounded-2xl shadow-lg p-8 mb-12 border border-gray-300 relative">
            <div className="flex items-center mb-6">
              <Lock className="h-8 w-8 text-gray-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Certifiering & specialkontroller</h3>
              <span className="ml-4 px-4 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Ej aktiverat</span>
            </div>
            <p className="text-gray-700 mb-6">
              Dessa moduler är inte aktiverade för din gård i demon. De kräver rådgivarläge för kvalitetssäkring och full integration i tillsynsunderlag.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center justify-between">
                <span className="text-lg text-gray-900">KRAV-kontroller</span>
                <span className="text-gray-500 font-medium">Ej aktiverat</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-lg text-gray-900">Mejeri-kontroller</span>
                <span className="text-gray-500 font-medium">Ej aktiverat</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-lg text-gray-900">IP Sigill / Svenskt Sigill</span>
                <span className="text-gray-500 font-medium">Ej aktiverat</span>
              </li>
            </ul>

            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button
                onClick={() => setShowInviteForm(true)}
                className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg text-lg flex items-center justify-center gap-3"
              >
                Bjud in min rådgivare
              </button>
              <button
                onClick={() => setShowHelpForm(true)}
                className="bg-gray-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-700 transition shadow-lg text-lg flex items-center justify-center gap-3"
              >
                Jag har ingen rådgivare – hjälp mig
              </button>
            </div>

            <button
              onClick={() => setShowInfoModal(true)}
              className="mt-6 text-center text-gray-600 underline text-sm"
            >
              Vad krävs för att aktivera detta?
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Block A: Dokumentstatus – alignment fixad */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Dokumentstatus</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Gödselplan</span>
                  <span className="text-green-600 font-medium text-2xl">🟢</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Sprutjournal</span>
                  <span className="text-green-600 font-medium text-2xl">🟢</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Växtodlingsplan</span>
                  <span className="text-green-600 font-medium text-2xl">🟢</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Stalljournal</span>
                  <span className="text-yellow-600 font-medium text-2xl">🟡</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Markkartering</span>
                  <span className="text-red-600 font-medium text-2xl">🔴</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Kemikalieförteckning</span>
                  <span className="text-green-600 font-medium text-2xl">🟢</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Skyddszonskarta</span>
                  <span className="text-green-600 font-medium text-2xl">🟢</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Arrendeavtal / blockunderlag</span>
                  <span className="text-yellow-600 font-medium text-2xl">🟡</span>
                </li>
              </ul>
            </div>

            {/* Block B: Miljörisk – snabbkoll – alignment fixad */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Miljörisk – snabbkoll</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Gödsel sprids enligt plan</span>
                  <span className="text-green-600 font-medium text-2xl">🟢</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Inga spridningar nära vattendrag</span>
                  <span className="text-green-600 font-medium text-2xl">🟢</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Skyddszoner finns och är synliga</span>
                  <span className="text-green-600 font-medium text-2xl">🟢</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Inga läckage runt gödselbrunn</span>
                  <span className="text-yellow-600 font-medium text-2xl">🟡</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Kemikalier förvaras korrekt</span>
                  <span className="text-green-600 font-medium text-2xl">🟢</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Sprutan är besiktad</span>
                  <span className="text-red-600 font-medium text-2xl">🔴</span>
                </li>
              </ul>
              <p className="mt-6 text-center text-lg font-semibold text-green-600">Låg risk</p>
            </div>

            {/* Block C: Deadline-koll – alignment fixad */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Deadline-koll</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Årlig gödselplan uppdaterad</span>
                  <span className="text-green-600 font-medium">OK</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Växtnäringsbalans klar</span>
                  <span className="text-green-600 font-medium">OK</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Sprutjournal uppdaterad</span>
                  <span className="text-yellow-600 font-medium">Snart</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Markkartering inom 8 år</span>
                  <span className="text-red-600 font-medium">För sent</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Skyddszoner fotograferade</span>
                  <span className="text-green-600 font-medium">OK</span>
                </li>
              </ul>
            </div>

            {/* Block D: Fält & skyddszoner (foto-uppladdning placeholder) – alignment fixad */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Fält & skyddszoner – foton</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Foton på skyddszoner</span>
                  <span className="text-green-600 font-medium">🟢 3 st</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Foton på gödselplatta</span>
                  <span className="text-green-600 font-medium">🟢 2 st</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Foton på kemikalieförråd</span>
                  <span className="text-yellow-600 font-medium">🟡 1 st</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Foton på känsliga fält</span>
                  <span className="text-red-600 font-medium">🔴 Saknas</span>
                </li>
              </ul>
              <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
                Ladda upp foto
              </button>
            </div>

            {/* Block E: Om kontrollen kommer i morgon – alignment fixad */}
            <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Om kontrollen kommer i morgon</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Jag hittar mina dokument</span>
                  <span className="text-green-600 font-medium">🟢 Ja</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">De är uppdaterade</span>
                  <span className="text-green-600 font-medium">🟢 Ja</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Jag kan visa hur jag jobbar</span>
                  <span className="text-yellow-600 font-medium">🟡 Delvis</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Jag kan visa foton</span>
                  <span className="text-yellow-600 font-medium">🟡 Delvis</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="min-w-0 flex-1 pr-4">Jag kan visa status</span>
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

        {/* Info-modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
              <h3 className="text-2xl font-bold mb-4">Vad krävs för att aktivera certifiering?</h3>
              <p className="text-gray-700 mb-6">
                KRAV, mejeri och andra certifieringar kräver rådgivarläge för:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Kvalitetssäkring och spårbarhet</li>
                <li>Full integration i tillsynsunderlag</li>
                <li>Signering och export till Länsstyrelsen</li>
              </ul>
              <p className="text-gray-700">
                Kontakta eller bjud in din rådgivare för att aktivera.
              </p>
              <button
                onClick={() => setShowInfoModal(false)}
                className="mt-6 w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700"
              >
                Stäng
              </button>
            </div>
          </div>
        )}

        {/* Inbjudan-form mock */}
        {showInviteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
              <h3 className="text-2xl font-bold mb-4">Bjud in rådgivare</h3>
              {!inviteSent ? (
                <>
                  <p className="text-gray-700 mb-6">
                    Ange rådgivarens e-post – vi skickar inbjudan (mock i demo).
                  </p>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="radgivare@email.se"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setInviteSent(true);
                      }}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
                    >
                      Skicka inbjudan
                    </button>
                    <button
                      onClick={() => {
                        setShowInviteForm(false);
                        setInviteSent(false);
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium"
                    >
                      Avbryt
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-center text-green-600 text-xl font-medium mb-6">
                    Inbjudan skickad till {inviteEmail}! (mock)
                  </p>
                  <button
                    onClick={() => {
                      setShowInviteForm(false);
                      setInviteSent(false);
                    }}
                    className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700"
                  >
                    Stäng
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Hjälp-form mock */}
        {showHelpForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
              <h3 className="text-2xl font-bold mb-4">Hitta rådgivare</h3>
              <p className="text-gray-700 mb-6">
                Vi hjälper dig hitta en AgriReg-rådgivare i ditt område.
              </p>
              <p className="text-center text-green-600 text-xl font-medium mb-6">
                Tack för intresset – vi kontaktar dig snart! (mock)
              </p>
              <button
                onClick={() => setShowHelpForm(false)}
                className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700"
              >
                Stäng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}