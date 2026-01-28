'use client';

import Link from 'next/link';
import { farms } from "@/src/data/dummyData";
import { Upload, FileText, Lock, CheckCircle2, X, Mail, Camera } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';

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

const STORAGE_KEY = 'agrireg_pilot_harparboda_v4';

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

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * FIX #1 + #10:
 * - Grön först vid 100%
 * - Låg procent får lugn text (“Startläge – börja checka av!”)
 */
function statusFromPercent(pct: number) {
  if (pct >= 100) {
    return {
      key: 'green',
      label: 'Klart – allt avprickat',
      pill: 'bg-green-100 text-green-800 border-green-200',
      ring: '#2E7D32',
    };
  }
  if (pct >= 50) {
    return {
      key: 'yellow',
      label: 'På gång – fortsätt så',
      pill: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ring: '#B45309',
    };
  }
  return {
    key: 'red',
    label: 'Startläge – börja checka av!',
    pill: 'bg-blue-100 text-blue-900 border-blue-200',
    ring: '#2563EB',
  };
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
/* (LÄMNAS OBEARBETAD – enligt din instruktion) */

function PilotView({ pilotFarm }: { pilotFarm: Farm }) {
  const modules = useMemo(() => {
    // Anpassat för: dikor & ungnöt
    return [
      {
        id: 'djurhallning-notkreatur',
        title: 'Djurhållning – dikor & ungnöt',
        items: [
          'Djur-ID/märkning kontrollerad (öronbrickor) + listor stämmer',
          'Stalljournal uppdaterad (flyttar, inköp/försäljning, dödsfall)',
          'Vatten: baljor/ventiler fungerar och inga frysproblem',
          'Liggplatser/strö: torrt, rent och tillräckligt',
          'Foderlager kontrollerat (dagar kvar + plan för nästa steg)',
          'Sjukbox/rutin: finns, ren och redo vid behov',
        ],
      },
      {
        id: 'journaler-dokumentation',
        title: 'Journaler & dokumentation',
        items: [
          'Stalljournal uppdaterad (senaste 30 dagarna)',
          'Foder-/inköpsunderlag sparat (kvitton, följesedlar)',
          'Veterinär/medicinering dokumenterad (om relevant)',
          'Kontaktlista uppdaterad (veterinär, jour, service)',
          'Foton sparade på riskpunkter (gödsellagring, kem, skyddszon)',
        ],
      },
      {
        id: 'egenkontroll-miljo',
        title: 'Egenkontroll – miljö (bas)',
        items: [
          'Gödsel: rundgång gjord (inga läckage vid brunn/platta)',
          'Skyddszoner/vattendrag: synliga och fria från spridning',
          'Kemikalier: förvaring låst/uppmärkt + spilltråg (om tillämpligt)',
          'Diesel/oljor: inga spill + absorptionsmedel finns',
          'Avfall: farligt avfall separerat och förvaras korrekt',
          'Jag vet var dokument/foton finns om kontroll kommer',
        ],
      },
      {
        id: 'tillsyn-sam',
        title: 'Tillsyn & arbetsmiljö (SAM)',
        items: [
          'Första hjälpen + brandsläckare finns och är kontrollerade',
          'Maskiner: synlig risk (läckage/skydd) avprickad',
          'Gångvägar/ramper: halkrisk åtgärdad där det behövs',
          'Skyltning: risk-områden uppmärkta där relevant',
          'Rutiner: “vem gör vad” vid kontroll (du + ev. ersättare)',
        ],
      },

      // FIX #7: KRAV delvis synlig (grund-checklista, utan export)
      {
        id: 'krav-grund',
        title: 'KRAV – grundkoll (valfri)',
        items: [
          'Foder: spårbarhet/anteckningar finns (vid behov)',
          'Djurvälfärd: rutin för tillsyn och åtgärd finns',
          'Stallmiljö: liggytor och utrymmen uppfyller grundkrav',
          'Dokument: relevanta papper samlade (kvitton/inköp)',
        ],
        note: 'Grundkoll för egen ordning. Ingen export/signering här.',
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
      seeded[m.id] =
        Array.isArray(existing) && existing.length === m.items.length
          ? existing
          : new Array(m.items.length).fill(false);
    }

    setChecks(seeded);
    setUploads(Array.isArray(loaded.uploads) ? loaded.uploads.slice(0, 12) : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist
  useEffect(() => {
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
    return { total, done, pct: clamp(pct, 0, 100) };
  }, [checks, modules]);

  const overall = useMemo(() => statusFromPercent(totals.pct), [totals.pct]);

  const perModule = useMemo(() => {
    return modules.map((m) => {
      const arr = checks[m.id] || [];
      const done = arr.filter(Boolean).length;
      const pct = m.items.length ? Math.round((done / m.items.length) * 100) : 0;
      return {
        id: m.id,
        title: m.title,
        done,
        total: m.items.length,
        pct: clamp(pct, 0, 100),
        status: statusFromPercent(pct),
        note: (m as any).note as string | undefined
      };
    });
  }, [checks, modules]);

  const todoList = useMemo(() => {
    const todos: { moduleTitle: string; text: string }[] = [];
    for (const m of modules) {
      const arr = checks[m.id] || [];
      m.items.forEach((text, idx) => {
        if (!arr[idx]) todos.push({ moduleTitle: m.title, text });
      });
    }
    return todos;
  }, [checks, modules]);

  const toggleItem = (moduleId: string, idx: number) => {
    setChecks((prev) => {
      const current = Array.isArray(prev[moduleId]) ? prev[moduleId] : [];
      const next = current.slice();
      next[idx] = !next[idx];
      return { ...prev, [moduleId]: next };
    });
  };

  const clearUploads = () => setUploads([]);
  const removeUpload = (id: string) => setUploads((prev) => prev.filter((u) => u.id !== id));

  const readFilesAsDataUrls = async (fileList: FileList) => {
    const files = Array.from(fileList).slice(0, 6);

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

    setUploads((prev) => [...results, ...prev].slice(0, 12));
  };

  const onInputFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await readFilesAsDataUrls(e.target.files);
    e.target.value = '';
  };

  const onDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await readFilesAsDataUrls(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  // FIX #6: behåll ring + text, ingen horisontell bar
  const ringStyle = {
    background: `conic-gradient(${overall.ring} ${totals.pct * 3.6}deg, rgba(0,0,0,0.08) 0deg)`,
  } as React.CSSProperties;

  // FIX #3: gör knappen tydligt ljusgrön (inte bg-primary)
  const exportBtnClass =
    "inline-flex items-center justify-center gap-3 bg-green-200 text-green-900 px-6 py-4 rounded-xl font-extrabold shadow border border-green-300 hover:bg-green-300 transition";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* PERSONLIG BANNER */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 md:p-8 bg-green-100 border-b border-green-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm font-semibold text-green-900/80">Harparboda Gård • dikor & ungnöt</p>
                <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
                  Hej Jocke – din vy för Harparboda Gård
                </h1>
                <p className="text-base md:text-lg mt-3 text-gray-800 max-w-2xl">
                  Bocka av checklistor, ladda upp underlag och skapa din förhandsrapport. Allt sparas lokalt i din webbläsare.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full p-1" style={ringStyle} aria-label={`Progress ${totals.pct}%`}>
                  <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-lg font-extrabold text-gray-900">{totals.pct}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Klart</p>
                  <p className="text-lg font-bold text-gray-900">
                    {totals.done} / {totals.total}
                  </p>
                  <span className={`inline-flex mt-2 items-center gap-2 px-3 py-1 rounded-full border text-xs font-extrabold ${overall.pill}`}>
                    {overall.label}
                  </span>
                </div>
              </div>
            </div>

            {/* TOP ACTIONS */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowReport(true)}
                className="inline-flex items-center justify-center gap-3 bg-green-600 text-white px-6 py-4 rounded-xl font-extrabold shadow hover:bg-green-700 transition"
              >
                <FileText className="w-5 h-5" />
                Generera förhandsrapport
              </button>

              <a
                href="mailto:pilot@agrireg.se?subject=Harparboda – hjälp att exportera rapport"
                className={exportBtnClass}
                title="Valfritt: om du vill få rapporten i ett specifikt format"
              >
                <Mail className="w-5 h-5" />
                Hjälp att exportera (valfritt)
              </a>
            </div>
          </div>

          {/* VAD SKA GÖRAS – OCH NÄR */}
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-6 text-center">
              Vad ska göras – och när
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-extrabold mb-2">Nästa åtgärd</h3>
                <p className="text-xl font-semibold text-gray-900">
                  {pilotFarm?.nextAction || "Fortsätt bocka av checklistan – du är på rätt väg."}
                </p>
                <p className="mt-3 text-sm text-gray-700">
                  Tips: välj 2 snabba punkter och gör dem direkt.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-extrabold mb-3">Kommande saker att hålla koll på</h3>
                <ul className="space-y-2">
                  {(pilotFarm?.upcomingRequirements || []).slice(0, 6).map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-800">
                      <span className="mt-1 text-gray-700">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-extrabold mb-3">Sånt som ofta glöms</h3>
                <ul className="space-y-2">
                  {(pilotFarm?.forgottenCommon || []).slice(0, 6).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-800">
                      <span className="mt-1 text-gray-700">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* UPPLADDNING */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold">Dokument & foton</h2>
              <p className="text-gray-700 mt-1">
                Välj filer eller dra in dem här. Du får preview direkt och allt sparas lokalt.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-5 py-3 rounded-xl font-extrabold shadow hover:bg-blue-700 transition cursor-pointer">
                <Upload className="w-5 h-5" />
                Ladda upp
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
                className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl font-extrabold shadow hover:bg-black transition"
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
                <p className="mt-4 text-green-700 font-extrabold inline-flex items-center gap-2 justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                  Uppladdat ({uploads.length})
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
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6">Checklistor</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((m) => {
              const meta = perModule.find(x => x.id === m.id);
              const modPct = meta?.pct ?? 0;
              const modStatus = meta?.status ?? statusFromPercent(0);
              const modNote = meta?.note;

              return (
                <div key={m.id} className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-extrabold">{m.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{modPct}% klart</p>
                      {modNote && (
                        <p className="text-xs text-gray-600 mt-2">{modNote}</p>
                      )}
                    </div>
                    <span className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full border text-xs font-extrabold ${modStatus.pill}`}>
                      {modPct === 100 ? 'Klart' : modPct >= 50 ? 'På gång' : 'Start'}
                    </span>
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
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-500 mt-10 pb-10">
          © 2026 AgriReg
        </div>

        {/* REPORT MODAL */}
        {showReport && (
          <ReportModal
            onClose={() => setShowReport(false)}
            farmName="Harparboda Gård"
            farmType="Dikor & ungnöt"
            summary={{
              percent: totals.pct,
              done: totals.done,
              total: totals.total,
              uploads: uploads,
              overallLabel: overall.label,
            }}
            modules={modules.map((m) => ({
              title: m.title,
              done: (checks[m.id] || []).filter(Boolean).length,
              total: m.items.length,
            }))}
            todos={todoList}
          />
        )}
      </div>
    </div>
  );
}

function ReportModal({
  onClose,
  farmName,
  farmType,
  summary,
  modules,
  todos,
}: {
  onClose: () => void;
  farmName: string;
  farmType: string;
  summary: { percent: number; done: number; total: number; uploads: UploadItem[]; overallLabel: string };
  modules: { title: string; done: number; total: number }[];
  todos: { moduleTitle: string; text: string }[];
}) {
  const status = statusFromPercent(summary.percent);
  const topTodos = todos.slice(0, 16);

  // close on overlay click
  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onOverlayClick}
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-extrabold">Förhandsrapport – {farmName}</h3>
            <p className="text-sm text-gray-600">
              {farmType} • <span className="font-bold">Ej inskickbar</span> (för egenkontroll)
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 font-bold hover:bg-gray-50"
          >
            Stäng
          </button>
        </div>

        <div className="p-6 grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-gray-900">Sammanfattning</h4>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${status.pill}`}>
                {summary.overallLabel}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-800">
              <p><span className="font-bold">Klarhet:</span> {summary.percent}% ({summary.done}/{summary.total})</p>
              <p><span className="font-bold">Filer:</span> {summary.uploads.length}</p>
            </div>

            <div className="mt-5 space-y-2">
              {modules.map((m, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3">
                  <span className="text-sm font-bold text-gray-900">{m.title}</span>
                  <span className="text-sm text-gray-700">{m.done}/{m.total}</span>
                </div>
              ))}
            </div>

            {summary.uploads.length > 0 && (
              <div className="mt-5 bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-extrabold text-gray-700">Bifogade filer</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-800">
                  {summary.uploads.slice(0, 12).map((u) => (
                    <li key={u.id} className="truncate">• {u.name}</li>
                  ))}
                  {summary.uploads.length > 12 && (
                    <li className="text-gray-600">… +{summary.uploads.length - 12} till</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 p-5">
            <h4 className="font-extrabold text-gray-900">Åtgärdslista</h4>
            <p className="text-sm text-gray-600 mt-1">
              Bygger på det som inte är avprickat ännu.
            </p>

            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
              {topTodos.length === 0 ? (
                <p className="text-green-700 font-extrabold">Klart! Inget kvar just nu.</p>
              ) : (
                <ul className="space-y-2 text-sm text-gray-800">
                  {topTodos.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 text-gray-700">•</span>
                      <span>
                        <span className="font-bold">{t.moduleTitle}:</span> {t.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-extrabold text-gray-700">Notis</p>
              <p className="mt-2 text-sm text-gray-800">
                Den här rapporten är för egenkontroll. Den är <span className="font-extrabold">inte inskickbar</span>.
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full bg-green-600 text-white py-3 rounded-xl font-extrabold shadow hover:bg-green-700 transition"
            >
              Klar
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 text-center text-xs text-gray-500">
          © 2026 AgriReg
        </div>
      </div>
    </div>
  );
}

/* ------------------------- DEMO VIEW ------------------------- */
/* FIXAD: återställer “resten av sidan” + gör den lik Jockes vy men icke-funktionell. */

function DemoView() {
  const exampleFarm = Array.isArray(farms) && farms.length > 0 ? farms[0] : null;

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [showHelpForm, setShowHelpForm] = useState(false);

  // “Ser ut som” Jockes vy men utan funktion: statiska siffror
  const demoPct = exampleFarm?.status === 'green' ? 78 : exampleFarm?.status === 'yellow' ? 55 : 25;
  const demoDone = Math.round((demoPct / 100) * 22);
  const demoTotal = 22;
  const overall = statusFromPercent(demoPct);

  const ringStyle = {
    background: `conic-gradient(${overall.ring} ${demoPct * 3.6}deg, rgba(0,0,0,0.08) 0deg)`,
  } as React.CSSProperties;

  const demoModules = useMemo(() => {
    return [
      {
        id: 'djurhallning',
        title: 'Djurhållning – exempel',
        note: 'I demon klickar du inte – detta är en förhandsvisning.',
        items: [
          'Djur-ID/märkning kontrollerad',
          'Vatten kontrollerat',
          'Liggplatser/strö kontrollerat',
          'Foderlager kontrollerat',
          'Sjukbox/rutin kontrollerad',
        ],
      },
      {
        id: 'journaler',
        title: 'Journaler & dokumentation – exempel',
        items: [
          'Stalljournal uppdaterad',
          'Foder-/inköpsunderlag sparat',
          'Kontaktlista uppdaterad',
          'Fotodokumentation sparad',
        ],
      },
      {
        id: 'miljo',
        title: 'Egenkontroll – miljö (bas) – exempel',
        items: [
          'Gödsel: rundgång gjord',
          'Skyddszoner/vattendrag kontrollerade',
          'Diesel/oljor kontrollerade',
          'Avfall sorterat',
        ],
      },
      {
        id: 'sam',
        title: 'Tillsyn & arbetsmiljö (SAM) – grund',
        note: 'Grundkoll synlig i demo. Full export/signering kräver rådgivarläge.',
        items: [
          'Första hjälpen + brandsläckare kontrollerade',
          'Maskiner: synlig risk avprickad',
          'Gångvägar/ramper: halkrisk åtgärdad',
        ],
      },
      {
        id: 'cert',
        title: 'Certifiering (KRAV / Mejeri / IP) – översikt',
        note: 'Visas som “låst” i demo. Du kan bjuda in rådgivare om du vill.',
        items: [
          'KRAV – grundkrav översikt',
          'Mejeri – dokumentöversikt',
          'IP Sigill – checklista översikt',
        ],
        locked: true,
      },
    ];
  }, []);

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

  // “Icke-funktionell” UI: knappar ser riktiga ut men är disabled
  const disabledBtn =
    "inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-extrabold shadow transition opacity-60 cursor-not-allowed";
  const disabledBtnGreen = `${disabledBtn} bg-green-600 text-white`;
  const disabledBtnBlue = `${disabledBtn} bg-blue-600 text-white`;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* DEMO-BANNER (liknar Jockes vy) */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 md:p-8 bg-green-100 border-b border-green-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm font-semibold text-green-900/80">Demo • lantbrukare</p>
                <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
                  Så här ser lantbrukarvyn ut
                </h1>
                <p className="text-base md:text-lg mt-3 text-gray-800 max-w-2xl">
                  Detta är en demo-layout. Den visar flödet och modulerna, men sparar inte och går inte att “skicka in”.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full p-1" style={ringStyle} aria-label={`Demo progress ${demoPct}%`}>
                  <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-lg font-extrabold text-gray-900">{demoPct}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Klart</p>
                  <p className="text-lg font-bold text-gray-900">
                    {demoDone} / {demoTotal}
                  </p>
                  <span className={`inline-flex mt-2 items-center gap-2 px-3 py-1 rounded-full border text-xs font-extrabold ${overall.pill}`}>
                    {overall.label}
                  </span>
                </div>
              </div>
            </div>

            {/* TOP ACTIONS (visuellt, ej funktionellt) */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button disabled className={disabledBtnGreen}>
                <FileText className="w-5 h-5" />
                Generera förhandsrapport
              </button>

              <button disabled className={disabledBtnBlue}>
                <Upload className="w-5 h-5" />
                Ladda upp dokument/foto
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-xl font-bold shadow border border-gray-200 hover:bg-gray-50 transition"
              >
                Tillbaka
              </Link>
            </div>
          </div>

          {/* “Din gård”-kort (demo) */}
          <div className="p-6 md:p-8">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Din gård (demo)</h2>
              <p className="mt-2 text-gray-700">
                {exampleFarm?.name || 'Exempelgård'} • Status: <span className="font-bold">{overall.label}</span>
              </p>
              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-600">Outnyttjat CAP-stöd (exempel)</p>
                  <p className="text-2xl font-extrabold text-primary">18 400 kr</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-600">Nästa deadline (exempel)</p>
                  <p className="text-2xl font-extrabold text-gray-900">15 mars 2026</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-600">Dokument klara (exempel)</p>
                  <p className="text-2xl font-extrabold text-gray-900">8 / 12</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHECKLISTOR (demo: synliga men icke-klickbara) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6">Checklistor (demo)</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {demoModules.map((m) => {
              const locked = Boolean((m as any).locked);
              return (
                <div key={m.id} className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-extrabold">{m.title}</h3>
                      {m.note && <p className="text-xs text-gray-600 mt-2">{m.note}</p>}
                    </div>

                    <span className={`shrink-0 inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-extrabold ${
                      locked ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-blue-100 text-blue-900 border-blue-200'
                    }`}>
                      {locked ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          Översikt
                        </>
                      ) : (
                        'Förhandsvisning'
                      )}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    {m.items.map((text, idx) => (
                      <div
                        key={idx}
                        className="w-full text-left flex items-start gap-3 rounded-xl px-4 py-3 border bg-gray-50 border-gray-200"
                      >
                        <span
                          className="mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center shrink-0 bg-white border-gray-300 text-gray-400"
                          aria-hidden
                          title="Demo (ej klickbar)"
                        >
                          •
                        </span>
                        <span className="text-sm md:text-[15px] text-gray-900 leading-snug">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BJUD IN RÅDGIVARE (som du ville återha) */}
        <div className="bg-gray-100 rounded-2xl shadow p-6 md:p-8 mb-8 border border-gray-300">
          <div className="flex items-center mb-4 justify-center">
            <Lock className="h-7 w-7 text-gray-700 mr-3" />
            <h3 className="text-xl md:text-2xl font-extrabold text-gray-900">Certifiering & export</h3>
          </div>

          <p className="text-center text-gray-800 mb-6 max-w-2xl mx-auto">
            Vill du aktivera certifiering eller få export i ett specifikt format? Då kan du bjuda in din rådgivare
            (eller be oss hjälpa dig hitta en).
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowInviteForm(true)}
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-extrabold hover:bg-green-700 transition shadow-lg"
            >
              Bjud in rådgivare
            </button>
            <button
              onClick={() => setShowHelpForm(true)}
              className="bg-gray-700 text-white px-8 py-4 rounded-xl font-extrabold hover:bg-gray-800 transition shadow-lg"
            >
              Jag har ingen rådgivare – hjälp mig
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => setShowInfoModal(true)}
              className="text-sm text-gray-600 underline"
            >
              Vad krävs för att aktivera detta?
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-500 mt-10 pb-10">
          © 2026 AgriReg
        </div>

        {/* modaler (samma som tidigare, men nu nås de faktiskt) */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">Vad krävs för att aktivera certifiering?</h3>
              <p className="text-gray-700 mb-6">
                KRAV, mejeri och andra certifieringar kräver rådgivarläge för:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Kvalitetssäkring och spårbarhet</li>
                <li>Full integration i tillsynsunderlag</li>
                <li>Signering och export</li>
              </ul>
              <button
                onClick={() => setShowInfoModal(false)}
                className="mt-2 w-full bg-gray-700 text-white py-3 rounded-lg font-bold hover:bg-gray-800"
              >
                Stäng
              </button>
            </div>
          </div>
        )}

        {showInviteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">Bjud in rådgivare</h3>
              {!inviteSent ? (
                <>
                  <p className="text-gray-700 mb-6">
                    Ange rådgivarens e-post – vi skickar en inbjudan.
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
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
                    >
                      Skicka
                    </button>
                    <button
                      onClick={() => {
                        setShowInviteForm(false);
                        setInviteSent(false);
                        setInviteEmail('');
                      }}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300"
                    >
                      Avbryt
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-center text-green-700 text-lg font-extrabold mb-6">
                    Inbjudan är skickad till {inviteEmail}!
                  </p>
                  <button
                    onClick={() => {
                      setShowInviteForm(false);
                      setInviteSent(false);
                      setInviteEmail('');
                    }}
                    className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold hover:bg-gray-800"
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
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">Hitta rådgivare</h3>
              <p className="text-gray-700 mb-6">
                Vi hjälper dig hitta en AgriReg-rådgivare i ditt område.
              </p>
              <button
                onClick={() => setShowHelpForm(false)}
                className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold hover:bg-gray-800"
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
