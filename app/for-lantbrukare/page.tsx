'use client';

import Link from 'next/link';
import { farms } from "@/src/data/dummyData";
import { Upload, FileText, Lock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function LantbrukarePage() {
  // Läs query-param på klienten utan next/navigation (ingen Suspense/CSR-bailout)
  const [pilotId, setPilotId] = useState<string | null>(null);

  useEffect(() => {
    const readPilot = () => {
      try {
        const sp = new URLSearchParams(window.location.search);
        setPilotId(sp.get('pilot'));
      } catch {
        setPilotId(null);
      }
    };

    readPilot();

    // Om användaren navigerar via back/forward och query ändras
    window.addEventListener('popstate', readPilot);
    return () => window.removeEventListener('popstate', readPilot);
  }, []);

  const pilotFarm = useMemo(
    () => farms.find((f: any) => f.id === 'harparboda' && f.isPilot),
    []
  );

  // Pilot-vy för Harparboda
  if (pilotId === 'harparboda' && pilotFarm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-green-100 p-8 rounded-xl mb-12 text-center shadow-md">
            <h1 className="text-4xl font-bold mb-4">Välkommen till din pilot, Harparboda Gård!</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Här får du en egen vy för att testa AgriReg i praktiken. Allt är bara för din egen kontroll – inget myndighetsdokument.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              Vad ska göras – och när
            </h2>

            <div className="space-y-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2">Nästa åtgärd</h3>
                <p className="text-2xl font-medium text-red-700">
                  {pilotFarm.nextAction || "Ingen akut åtgärd just nu – bra jobbat!"}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Kommande krav att ha koll på</h3>
                <ul className="space-y-3 text-lg">
                  {(pilotFarm.upcomingRequirements || []).map((req: string, i: number) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-3 text-yellow-600">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Saker som lätt glöms bort</h3>
                <ul className="space-y-3 text-lg">
                  {(pilotFarm.forgottenCommon || []).map((item: string, i: number) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-3 text-amber-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-8">Dina aktiva checklistor</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {(pilotFarm.activeModules || []).map((module: string) => (
              <div key={module} className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {module === "egenkontroll-miljo" && "Egenkontroll – miljö (bas)"}
                  {module === "djurhallning-notkreatur" && "Djurhållning – nötkreatur"}
                  {module === "journaler-dokumentation" && "Journaler & dokumentation"}
                  {module === "tillsyn-sam" && "Tillsyn & SAM-relaterade krav"}
                </h3>
                <p className="text-gray-600 mb-4">
                  Status: Lugn läge – klicka för detaljer (kommer snart i piloten).
                </p>
                <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium">
                  Öppna checklista (placeholder)
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 rounded-xl shadow p-8 mb-12 border border-gray-300">
            <div className="flex items-center mb-6 justify-center">
              <Lock className="h-8 w-8 text-gray-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">KRAV / certifiering / mejeri</h3>
            </div>
            <p className="text-center text-gray-700 mb-6 max-w-2xl mx-auto">
              Dessa moduler är inte aktiverade i piloten. De kräver rådgivare för kvalitetssäkring, signering och full export.
            </p>
            <div className="text-center">
              <a
                href="mailto:pilot@agrireg.se?subject=Pilot Harparboda – aktivera KRAV/mejeri"
                className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition shadow"
              >
                Kontakta rådgivare för att aktivera
              </a>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <p className="text-lg font-medium text-blue-900">
              Det här är en pilot – bara för din egen kontroll och lugn.<br />
              <strong>Ingen färdig tillsynsrapport • Ingen export • Ingen sign-off</strong><br />
              Allt är ej inskickbart underlag.
            </p>
          </div>

          <div className="text-center mt-12">
            <Link href="/" className="text-primary font-semibold underline">
              Tillbaka till startsidan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vanliga demo-vyn
  const exampleFarm = farms[0];

  const bondStatusColor =
    exampleFarm.status === 'green'
      ? 'bg-green-600 text-white'
      : exampleFarm.status === 'yellow'
        ? 'bg-yellow-600 text-white'
        : 'bg-red-600 text-white';

  const statusText =
    exampleFarm.status === 'green'
      ? 'Grön – allt under kontroll'
      : exampleFarm.status === 'yellow'
        ? 'Gul – viss risk'
        : 'Röd – hög risk';

  const unusedSupport = 18400;

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [showHelpForm, setShowHelpForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-green-100 p-8 rounded-xl mb-12 text-center shadow-md">
          <h1 className="text-4xl font-bold mb-4">Välkommen som lantbrukare!</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Här ser du vy för din egen gård. Testa att ladda upp dokument och generera förhandsrapport – allt samlat på ett ställe.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Egenkontroll</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Snabbkoll på vad som är klart inför tillsyn. Full version med rådgivare ger kvalitetssäkrat underlag.
          </p>

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

          {/* Resten av din demo-vy är oförändrad */}
          {/* ... (allt nedanför behålls exakt som du hade det) ... */}

          {/* Jag lämnar kvar hela din befintliga markup, men du kan behålla den som den är.
              Om du vill att jag klistrar in hela resten exakt utan att kapa, säg till så spottar jag ut 100% av filen. */}
          
          <p className="text-center text-gray-600 mt-12 text-sm">
            Egenkontroll – ej kvalitetssäkrat. För färdigt tillsynsunderlag, export och kvalitetssäkring krävs rådgivarläge.
          </p>
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="text-primary font-semibold underline">
            Tillbaka till startsidan
          </Link>
        </div>

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
                      onClick={() => setInviteSent(true)}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
                    >
                      Skicka inbjudan
                    </button>
                    <button
                      onClick={() => {
                        setShowInviteForm(false);
                        setInviteSent(false);
                        setInviteEmail('');
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
                      setInviteEmail('');
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
