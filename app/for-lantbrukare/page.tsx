'use client';

import Link from 'next/link';
import { farms } from "@/src/data/dummyData";
import { Upload, FileText, Lock, CheckCircle2, X, Mail, Camera } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Farm = any;

type UploadItem = {
  id: string;
  name: string;
  dataUrl: string; // thumbnail / preview
  mime: string;
  createdAt: number;
};

type PilotStorage = {
  checks: Record<string, boolean[]>; // moduleId -> checked[]
  uploads: UploadItem[];
};

const STORAGE_KEY = 'agrireg_pilot_harparboda_v2';

function safeLoad(): PilotStorage {
  if (typeof window === 'undefined') return { checks: {}, uploads: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { checks: {}, uploads: [] };
    const parsed = JSON.parse(raw);
    return {
      checks: parsed?.checks && typeof parsed.checks === 'object' ? parsed.checks : {},
      uploads: Array.isArray(parsed?.uploads) ? parsed.uploads : [],
    };
  } catch {
    return { checks: {}, uploads: [] };
  }
}

function safeSave(data: PilotStorage) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export default function LantbrukarePage() {
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
    window.addEventListener('popstate', readPilot);
    return () => window.removeEventListener('popstate', readPilot);
  }, []);

  const pilotFarm = useMemo(
    () => (Array.isArray(farms) ? farms : []).find((f: Farm) => f.id === 'harparboda' && f.isPilot),
    []
  );

  if (pilotId === 'harparboda' && pilotFarm) {
    return <PilotView pilotFarm={pilotFarm} />;
  }

  return <DemoView />;
}

/* ------------------------- PILOT VIEW ------------------------- */

function PilotView({ pilotFarm }: { pilotFarm: Farm }) {
  const modules = useMemo(() => {
    // Anpassat för: dikor & ungnöt
    return [
      {
        id: 'djurhallning-notkreatur',
        title: 'Djurhållning – dikor & ungnöt',
        items: [
          'Kontrollera djur-ID/märkning (öronbrickor) och att listor stämmer',
          'Se över stalljournal/händelser (flytt, dödfödda, inköp/försäljning)',
          'Kontrollera vattenförsörjning och funktion på frostskydd/ventiler',
          'Gå igenom liggplatser/strö – torrt, rent och tillräckligt',
          'Foderlager: räkna dagar kvar + plan för nästa leverans/ensilage',
          'Sjukbox/rutiner: finns, ren, och används vid behov',
        ],
      },
      {
        id: 'journaler-dokumentation',
        title: 'Journaler & dokumentation',
        items: [
          'Stalljournal uppdaterad (senaste 30 dagarna)',
          'Foder-/inköpsunderlag sparat (kvitton, följesedlar)',
          'Veterinärbesök/medicinering dokumenterad (om relevant)',
          'Uppdaterad kontaktlista (jour, veterinär, service)',
          'Fotodokumentation på riskpunkter (gödsellagring, kemikalier, skyddszon)',
        ],
      },
      {
        id: 'egenkontroll-miljo',
        title: 'Egenkontroll – miljö (bas)',
        items: [
          'Gödselhantering: inga läckage vid brunn/platta (snabb rundgång)',
          'Skyddszoner/vattendrag: synliga och fria från spridning',
          'Kemikalieförvaring: låst, uppmärkt, spilltråg (om tillämpligt)',
          'Diesel/oljor: inga spill, uppsamling/absorptionsmedel finns',
          'Avfall: farligt avfall separerat och förvaras korrekt',
          'Rutin: “om kontroll imorgon” – vet var allt finns',
        ],
      },
      {
        id: 'tillsyn-sam',
        title: 'Tillsyn & SAM-relaterat',
        items: [
          'SAM/arbetsmiljö: första hjälpen + brandsläckare på plats och kollad',
          'Maskiner: synlig risk (läckage, skydd, nödstopp) avprickad',
          'Gångvägar/ramper: halkrisk åtgärdad där det behövs',
          'Skyltning: kem/brand/risk-områden uppmärkta där relevant',
          'Rutiner: vem gör vad vid kontroll (du + ev. ersättare)',
        ],
      },
    ];
  }, []);

  const [checks, setChecks] = useState<Record<string, boolean[]>>({});
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [showReport, setShowReport] = useState(false);

  // init from localStorage
  useEffect(() => {
    const loaded = safeLoad();

    const seeded: Record<string, boolean[]> = {};
    for (const m of modules) {
      const existing = loaded.checks?.[m.id];
      seeded[m.id] = Array.isArray(existing) && existing.length === m.items.length
        ? existing
        : new Array(m.items.length).fill(false);
    }

    setChecks(seeded);
    setUploads(Array.isArray(loaded.uploads) ? loaded.uploads.slice(0, 12) : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist
  useEffect(() => {
    // only save when we have initialized with modules
    if (!modules?.length) return;
    safeSave({ checks, uploads });
  }, [checks, uploads, modules]);

  const totals = useMemo(() => {
    let total = 0;
    let done = 0;
    for (const m of modules) {
      total += m.items.length;
      const arr = checks[m.id] || [];
      done += arr.filter(Boolean).length;
    }
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pct };
  }, [checks, modules]);

  const toggleItem = (moduleId: string, idx: number) => {
    setChecks(prev => {
      const current = Array.isArray(prev[moduleId]) ? prev[moduleId] : [];
      const next = current.slice();
      next[idx] = !next[idx];
      return { ...prev, [moduleId]: next };
    });
  };

  const clearUploads = () => {
    setUploads([]);
  };

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  const readFilesAsDataUrls = async (fileList: FileList) => {
    const files = Array.from(fileList).slice(0, 6); // håll det rimligt
    const readOne = (file: File) =>
      new Promise<UploadItem>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
            name: file.name,
            mime: file.type || 'application/octet-stream',
            dataUrl: typeof reader.result === 'string' ? reader.result : '',
            createdAt: Date.now(),
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const results: UploadItem[] = [];
    for (const f of files) {
      try {
        results.push(await readOne(f));
      } catch {
        // skip
      }
    }

    setUploads(prev => [...results, ...prev].slice(0, 12));
  };

  const onInputFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await readFilesAsDataUrls(e.target.files);
    e.target.value = '';
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await readFilesAsDataUrls(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const ringStyle = {
    background: `conic-gradient(var(--tw-prose-links, #2E7D32) ${totals.pct * 3.6}deg, rgba(0,0,0,0.08) 0deg)`,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* PERSONLIG BANNER */}
        <div className="bg-green-100 p-6 md:p-8 rounded-2xl mb-8 shadow-md border border-green-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-green-900/80">Harparboda Gård • dikor & ungnöt</p>
              <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
                Hej Jocke – din vy för Harparboda Gård
              </h1>
              <p className="text-base md:text-lg mt-3 text-gray-800 max-w-2xl">
                Här är din egen “vad ska göras – och när”-vy. Bocka av, ladda upp, och få en förhandsrapport som känns som den ska.
              </p>
            </div>

            {/* PROGRESS RING */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full p-1" style={ringStyle} aria-label={`Progress ${totals.pct}%`}>
                <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-lg font-extrabold text-green-800">{totals.pct}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-700">Klart</p>
                <p className="text-lg font-bold text-gray-900">
                  {totals.done} / {totals.total}
                </p>
              </div>
            </div>
          </div>

          {/* Kontakt-knapp: alltid synlig */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:pilot@agrireg.se?subject=Harparboda pilot – hjälp med egenkontroll"
              className="inline-flex items-center justify-center gap-3 bg-primary text-white px-6 py-4 rounded-xl font-extrabold shadow hover:bg-green-700 transition"
            >
              <Mail className="w-5 h-5" />
              Kontakta rådgivare
            </a>

            <button
              onClick={() => setShowReport(true)}
              className="inline-flex items-center justify-center gap-3 bg-green-600 text-white px-6 py-4 rounded-xl font-extrabold shadow hover:bg-green-700 transition"
            >
              <FileText className="w-5 h-5" />
              Generera förhandsrapport
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-xl font-bold shadow border border-gray-200 hover:bg-gray-50 transition"
            >
              Tillbaka
            </Link>
          </div>
        </div>

        {/* VAD SKA GÖRAS – OCH NÄR */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-6 text-center">
            Vad ska göras – och när
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h3 className="text-lg font-extrabold mb-2">Nästa åtgärd</h3>
              <p className="text-xl font-semibold text-red-700">
                {pilotFarm?.nextAction || "Ingen akut åtgärd just nu – bra jobbat!"}
              </p>
              <p className="mt-3 text-sm text-gray-700">
                Tips: bocka av 3 grejer idag så känns allt 10× lugnare.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="text-lg font-extrabold mb-3">Kommande krav att ha koll på</h3>
              <ul className="space-y-2">
                {(pilotFarm?.upcomingRequirements || []).slice(0, 6).map((req: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-800">
                    <span className="mt-1 text-yellow-700">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="text-lg font-extrabold mb-3">Saker som lätt glöms bort</h3>
              <ul className="space-y-2">
                {(pilotFarm?.forgottenCommon || []).slice(0, 6).map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-800">
                    <span className="mt-1 text-amber-700">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* UPPLADDNING */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold">Dokument & foton</h2>
              <p className="text-gray-700 mt-1">
                Dra in filer här eller välj via knapp. Du får “Uppladdat!” och en snabb preview.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold shadow hover:bg-blue-700 transition cursor-pointer">
                <Upload className="w-5 h-5" />
                Ladda upp dokument/foto
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={onInputFiles}
                />
              </label>

              <button
                onClick={clearUploads}
                className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-5 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-200 transition"
              >
                Rensa
              </button>
            </div>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="mt-6 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 md:p-10 text-center"
          >
            <div className="inline-flex items-center gap-3 text-gray-700 font-semibold">
              <Camera className="w-5 h-5" />
              Släpp filer här (foton/PDF)
            </div>

            {uploads.length > 0 && (
              <>
                <p className="mt-4 text-green-700 font-bold inline-flex items-center gap-2 justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                  Uppladdat! ({uploads.length})
                </p>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploads.map((u) => (
                    <div key={u.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
                      <button
                        onClick={() => removeUpload(u.id)}
                        className="absolute top-2 right-2 bg-white/90 border border-gray-200 rounded-full p-1 hover:bg-gray-100"
                        aria-label="Ta bort fil"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="h-24 bg-gray-100 flex items-center justify-center">
                        {u.dataUrl?.startsWith('data:image') ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.dataUrl} alt={u.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex items-center gap-2 text-gray-700">
                            <FileText className="w-5 h-5" />
                            <span className="text-xs font-semibold">PDF</span>
                          </div>
                        )}
                      </div>

                      <div className="p-3">
                        <p className="text-xs font-semibold text-gray-900 truncate" title={u.name}>
                          {u.name}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          Sparas lokalt i din webbläsare
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* CHECKLISTOR */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6">Dina checklistor</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((m) => (
              <div key={m.id} className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-lg font-extrabold">{m.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Bocka av – progress uppdateras direkt.
                  </p>
                </div>

                <div className="p-5 space-y-3">
                  {m.items.map((text, idx) => {
                    const checked = Boolean(checks?.[m.id]?.[idx]);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleItem(m.id, idx)}
                        className={`w-full text-left flex items-start gap-3 rounded-xl px-4 py-3 border transition ${
                          checked
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${
                            checked ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300'
                          }`}
                          aria-hidden
                        >
                          {checked ? '✓' : ''}
                        </span>
                        <span className="text-sm md:text-[15px] text-gray-900 leading-snug">{text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CERTIFIERING (låst) */}
        <div className="bg-gray-100 rounded-2xl shadow p-6 md:p-8 mb-8 border border-gray-300">
          <div className="flex items-center mb-4 justify-center">
            <Lock className="h-7 w-7 text-gray-600 mr-3" />
            <h3 className="text-xl md:text-2xl font-extrabold text-gray-900">KRAV / certifiering / mejeri</h3>
          </div>

          <p className="text-center text-gray-800 mb-6 max-w-2xl mx-auto">
            Du kan fortfarande göra allt du behöver i din egenkontroll här – men certifiering kräver rådgivarläge för signering och “rätt format” på export.
          </p>

          <div className="text-center">
            <a
              href="mailto:pilot@agrireg.se?subject=Harparboda pilot – aktivera KRAV/mejeri"
              className="inline-flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-extrabold shadow hover:bg-green-700 transition"
            >
              <Mail className="w-5 h-5" />
              Kontakta rådgivare för att aktivera
            </a>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-200">
          <p className="text-base md:text-lg font-semibold text-blue-900">
            Din pilot är byggd för lugn: checklista + filer + rapportpreview. Du äger koll-läget.
          </p>
        </div>

        {/* REPORT MODAL */}
        {showReport && (
          <ReportModal
            onClose={() => setShowReport(false)}
            farmName="Harparboda Gård"
            summary={{
              percent: totals.pct,
              done: totals.done,
              total: totals.total,
              uploads: uploads.length,
            }}
            modules={modules.map(m => ({
              title: m.title,
              done: (checks[m.id] || []).filter(Boolean).length,
              total: m.items.length,
            }))}
          />
        )}
      </div>
    </div>
  );
}

function ReportModal({
  onClose,
  farmName,
  summary,
  modules,
}: {
  onClose: () => void;
  farmName: string;
  summary: { percent: number; done: number; total: number; uploads: number };
  modules: { title: string; done: number; total: number }[];
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold">Förhandsrapport – {farmName}</h3>
            <p className="text-sm text-gray-600">
              Preview (mock) • sammanfattning + status per område
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 font-bold hover:bg-gray-50"
          >
            Stäng
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h4 className="font-extrabold text-gray-900">Sammanfattning</h4>
            <div className="mt-4 space-y-2 text-sm text-gray-800">
              <p><span className="font-bold">Klarhet:</span> {summary.percent}% ({summary.done}/{summary.total})</p>
              <p><span className="font-bold">Uppladdade filer:</span> {summary.uploads}</p>
              <p className="text-gray-600 mt-3">
                Den här preview:n visar hur exporten “kommer kännas”. (I skarp export lägger vi in rätt rubriker, bilagor och sign-off.)
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {modules.map((m, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3">
                  <span className="text-sm font-bold text-gray-900">{m.title}</span>
                  <span className="text-sm text-gray-700">{m.done}/{m.total}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 p-5">
            <h4 className="font-extrabold text-gray-900">Rapport-preview</h4>
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Status</p>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                  summary.percent >= 80 ? 'bg-green-100 text-green-800' :
                  summary.percent >= 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {summary.percent >= 80 ? 'Lugn läge' : summary.percent >= 50 ? 'Viss risk' : 'Hög risk'}
                </span>
              </div>

              <div className="mt-4 text-sm text-gray-800 space-y-2">
                <p>• Översikt per område (djur, journaler, miljö, SAM)</p>
                <p>• Bilagor: filer och foton kopplas till rätt avsnitt</p>
                <p>• “Åtgärdslista” genereras från ej avprickade punkter</p>
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 border border-gray-200 p-4">
                <p className="text-xs text-gray-600 font-semibold">EXEMPEL (mock)</p>
                <p className="mt-2 text-sm font-bold text-gray-900">Åtgärdslista – nästa 7 dagar</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-800">
                  <li>• Bocka av 3 punkter i “Djurhållning”</li>
                  <li>• Ladda upp 2 foton på riskpunkter (brunn/platta, kem)</li>
                  <li>• Kontrollera stalljournalen senaste 30 dagar</li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="mt-5 w-full bg-green-600 text-white py-3 rounded-xl font-extrabold shadow hover:bg-green-700 transition"
              >
                Klart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- DEMO VIEW ------------------------- */

function DemoView() {
  const exampleFarm = Array.isArray(farms) && farms.length > 0 ? farms[0] : null;

  const bondStatusColor =
    exampleFarm?.status === 'green'
      ? 'bg-green-600 text-white'
      : exampleFarm?.status === 'yellow'
        ? 'bg-yellow-600 text-white'
        : 'bg-red-600 text-white';

  const statusText =
    exampleFarm?.status === 'green'
      ? 'Grön – allt under kontroll'
      : exampleFarm?.status === 'yellow'
        ? 'Gul – viss risk'
        : 'Röd – hög risk';

  const unusedSupport = 18400;

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [showHelpForm, setShowHelpForm] = useState(false);

  if (!exampleFarm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Demo saknar data</h1>
            <p className="text-gray-600">dummyData.farms verkar vara tom. Lägg in minst en gård i farms[] för att visa vyn.</p>
            <div className="mt-6">
              <Link href="/" className="text-primary font-semibold underline">
                Tillbaka till startsidan
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Din befintliga demo-markup fortsätter här (oförändrad i din nuvarande fil) */}
          {/* Jag lämnar resten som du redan har, eftersom du bad om pilotfixarna. */}

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
