import React, { useEffect, useState } from 'react';

interface AcuerdoJsonPageProps {
  onNavigate: (route: string) => void;
}

export const AcuerdoJsonPage: React.FC<AcuerdoJsonPageProps> = ({ onNavigate }) => {
  const [acuerdoData, setAcuerdoData] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    fetch('/api/acuerdo-json')
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setAcuerdoData(j.data);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  const copiarJson = () => {
    if (!acuerdoData) return;
    navigator.clipboard.writeText(JSON.stringify(acuerdoData, null, 2));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const descargarJson = () => {
    if (!acuerdoData) return;
    const blob = new Blob([JSON.stringify(acuerdoData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Acuerdo_009_de_2024_SENA.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 font-bold">Cargando documento JSON del Acuerdo 009...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📄</span>
            <div>
              <h1 className="text-lg font-bold text-white">Estructura JSON: Acuerdo 009 de 2024</h1>
              <p className="text-xs text-slate-400">Reglamento del Aprendiz SENA en formato JSON estructurado</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={copiarJson}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700"
            >
              {copiado ? '✓ ¡Copiado!' : '📋 Copiar JSON'}
            </button>

            <button
              onClick={descargarJson}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
            >
              ⬇️ Descargar .json
            </button>

            <button
              onClick={() => onNavigate('/dashboard')}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              ← Volver
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-x-auto">
          <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
            {JSON.stringify(acuerdoData, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
};
