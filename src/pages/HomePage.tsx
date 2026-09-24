import React, { useEffect, useState } from 'react';

interface Regional {
  id: number;
  nombre: string;
  departamento: string;
  descripcion: string;
  director: string;
  contacto: string;
}

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [todasRegionales, setTodasRegionales] = useState<Regional[]>([]);

  useEffect(() => {
    fetch('/api/regionales')
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setTodasRegionales(j.data);
      })
      .catch(() => setTodasRegionales([]));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md"
              style={{ backgroundColor: 'var(--sena-verde)' }}
            >
              S
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Servicio Nacional de Aprendizaje
              </p>
              <h1 className="text-lg font-bold text-slate-900">
                Inducción Institucional (Acuerdo 009)
              </h1>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-4 text-xs font-bold text-slate-700">
            <button onClick={() => onNavigate('/')} className="hover:text-green-700">
              Inicio
            </button>

            <button onClick={() => onNavigate('/capacitacion')} className="hover:text-green-700 flex items-center gap-1">
              <span>📜</span> Capacitación
            </button>

            <button onClick={() => onNavigate('/acuerdo-json')} className="hover:text-green-700 flex items-center gap-1">
              <span>📄</span> Acuerdo 009 (JSON)
            </button>

            <button
              onClick={() => onNavigate('/admin')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-1"
            >
              <span>📊</span> Panel Admin
            </button>

            <button
              onClick={() => onNavigate('/caracterizacion')}
              className="btn-sena text-xs py-2 shadow-sm"
            >
              Iniciar Inducción →
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #007832 0%, #39a935 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-yellow-400" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wider border border-white/20">
              REGLAMENTO DEL APRENDIZ - ACUERDO 009 DE 2024
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Plataforma de Inducción y Reglamento SENA
            </h2>

            <p className="text-lg text-white/95 leading-relaxed">
              Capacitación interactiva de Derechos (Art. 5), Deberes (Art. 8) y Prohibiciones (Art. 9), simulador de casos reales, evaluaciones con retroalimentación inmediata, banco de preguntas dinámico y panel de administración consolidado.
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('/caracterizacion')}
                className="btn-sena shadow-xl py-3 px-6 text-sm"
                style={{ backgroundColor: 'white', color: '#007832' }}
              >
                Comenzar mi inducción →
              </button>

              <button
                onClick={() => onNavigate('/capacitacion')}
                className="btn-secundario text-sm py-3 px-6"
                style={{ borderColor: 'white', color: 'white', backgroundColor: 'transparent' }}
              >
                📜 Capacitación Interactiva
              </button>

              <button
                onClick={() => onNavigate('/admin')}
                className="btn-secundario text-sm py-3 px-6"
                style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', backgroundColor: 'rgba(0,0,0,0.2)' }}
              >
                📊 Panel de Administración
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Flujo / Arquitectura */}
      <section id="flujo" className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center">
          <p
            className="text-sm font-semibold tracking-wider uppercase"
            style={{ color: 'var(--sena-verde-oscuro)' }}
          >
            Funcionalidades del Prototipo
          </p>

          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            Ruta Integral de Inducción Institucional
          </h3>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              icono: '👤',
              titulo: '1. Caracterización',
              desc: 'Registro por perfil (nuevo, antiguo o reingreso) y asignación de regional.',
            },
            {
              icono: '📜',
              titulo: '2. Capacitación Intuitiva',
              desc: 'Derechos (Art. 5), Deberes (Art. 8), Prohibiciones (Art. 9) y simulador de casos.',
            },
            {
              icono: '❓',
              titulo: '3. Evaluaciones Dinámicas',
              desc: 'Preguntas aleatorias del banco de datos con retroalimentación y citas normativas.',
            },
            {
              icono: '📊',
              titulo: '4. Panel Admin & JSON',
              desc: 'Indicadores KPI, directorio consolidado de aprendices y descarga de la norma en JSON.',
            },
          ].map((paso) => (
            <div key={paso.titulo} className="card hover:shadow-lg transition-shadow border border-slate-200">
              <div className="text-4xl">{paso.icono}</div>
              <h4 className="font-bold text-slate-900 text-base mt-3">{paso.titulo}</h4>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">{paso.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Regionales preview */}
      <section id="regionales" className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="text-3xl font-bold text-slate-900">Regionales del SENA</h3>
            <p className="text-slate-600 mt-2 text-sm">
              Cobertura nacional. Encuentra tu regional y centro de formación.
            </p>
          </div>

          <span className="badge" style={{ backgroundColor: '#e7f6e9', color: '#007832' }}>
            {todasRegionales.length} regionales activas
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {todasRegionales.map((r) => (
            <div key={r.id} className="card hover:shadow-lg transition border border-slate-200">
              <div className="flex items-start justify-between">
                <h4 className="font-bold text-slate-900 text-base">{r.nombre}</h4>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {r.departamento}
                </span>
              </div>

              <p className="text-sm text-slate-600 mt-3 line-clamp-3">{r.descripcion}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <p><strong className="text-slate-700">Director:</strong> {r.director}</p>
                <p className="mt-1"><strong className="text-slate-700">Contacto:</strong> {r.contacto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-6 text-center text-sm border-t border-slate-900">
        {new Date().getFullYear()} SENA - Inducción Institucional. Reglamento del Aprendiz (Acuerdo 009 de 2024).
      </footer>
    </div>
  );
};
