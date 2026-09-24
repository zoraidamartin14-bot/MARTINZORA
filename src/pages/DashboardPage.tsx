import React, { useEffect, useState } from 'react';

interface Modulo {
  id: number;
  slug: string;
  titulo: string;
  descripcion: string;
  orden: number;
  obligatorio: boolean;
  icono: string;
  secciones: { id: number; titulo: string }[];
}

interface Progreso {
  id: number;
  moduloId: number;
  moduloSlug: string;
  moduloTitulo: string;
  estado: 'no_iniciado' | 'en_progreso' | 'completado';
  porcentaje: number;
}

interface DashboardPageProps {
  onNavigate: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [nombre, setNombre] = useState('');
  const [perfil, setPerfil] = useState('');
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [progresos, setProgresos] = useState<Progreso[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('aprendizId');
    const nom = localStorage.getItem('aprendizNombre');
    const per = localStorage.getItem('aprendizPerfil');

    if (!id) {
      onNavigate('/caracterizacion');
      return;
    }

    setNombre(nom || 'Aprendiz');
    setPerfil(per || 'nuevo');

    Promise.all([
      fetch(`/api/modulos?perfil=${per}`).then((r) => r.json()),
      fetch(`/api/progreso?aprendizId=${id}`).then((r) => r.json()),
    ])
      .then(([mod, prog]) => {
        if (mod.ok) setModulos(mod.data);
        if (prog.ok) setProgresos(prog.data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error loading dashboard data:', err);
        setCargando(false);
      });
  }, [onNavigate]);

  const progresoPorSlug = (slug: string) =>
    progresos.find((p) => p.moduloSlug === slug);

  const totalPorcentaje = (() => {
    if (modulos.length === 0) return 0;
    const suma = modulos.reduce((acc, m) => {
      const p = progresoPorSlug(m.slug);
      return acc + (p?.porcentaje ?? 0);
    }, 0);
    return Math.round(suma / modulos.length);
  })();

  const recomendacionesPorPerfil: Record<string, string> = {
    nuevo: "Comienza por 'Conocer el SENA' e ingresa al módulo de Capacitación de Derechos, Deberes y Prohibiciones.",
    antiguo: 'Te recomendamos validar rápidamente los cambios del Acuerdo 009 de 2024 en la capacitación interactiva.',
    reingreso: 'Repasa el reglamento del Acuerdo 009 de 2024 para asegurar un reingreso exitoso a la formación.',
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-bounce">⏳</div>
          <p className="text-sm font-semibold text-slate-600">
            Cargando tu ruta personalizada de inducción SENA...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => onNavigate('/')} className="flex items-center gap-3 text-left">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#39a935' }}
            >
              S
            </div>
            <span className="font-bold text-slate-900 text-lg">SENA Inducción</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('/capacitacion')}
              className="hidden sm:inline-flex items-center px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300"
            >
              📜 Capacitación Reglamento
            </button>

            <button
              onClick={() => onNavigate('/admin')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              📊 Panel Admin
            </button>

            <div className="text-right hidden md:block border-l border-slate-200 pl-3">
              <p className="text-xs font-bold text-slate-900">{nombre}</p>
              <p className="text-[10px] text-slate-500 capitalize">Perfil: {perfil}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Welcome Banner */}
        <div
          className="card shadow-xl rounded-2xl p-8"
          style={{
            background: 'linear-gradient(135deg, #007832 0%, #39a935 100%)',
            color: 'white',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block bg-white/20 text-white px-3 py-0.5 rounded-full text-xs font-extrabold uppercase">
                ACUERDO 009 DE 2024
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                ¡Hola, {nombre.split(' ')[0]}!
              </h1>
              <p className="text-white/95 text-sm sm:text-base leading-relaxed">
                {perfil === 'nuevo' &&
                  'Bienvenido por primera vez al SENA. Esta inducción te dará las bases sobre la institución, tu regional y el Reglamento del Aprendiz.'}
                {perfil === 'antiguo' &&
                  'Como ya conoces el SENA, te mostramos los cambios clave del Acuerdo 009 de 2024 y tus normativas vigentes.'}
                {perfil === 'reingreso' &&
                  'Nos alegra tenerte de vuelta. Repasemos juntos el reglamento para retomar con pie derecho tu formación.'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shrink-0 w-full md:w-64 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Progreso General</span>
                <span>{totalPorcentaje}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${totalPorcentaje}%` }}
                />
              </div>
              <button
                onClick={() => onNavigate('/capacitacion')}
                className="w-full mt-2 py-2 bg-white text-emerald-800 rounded-xl text-xs font-extrabold shadow-md hover:bg-slate-100 transition-colors"
              >
                📜 Capacitación Interactiva →
              </button>
            </div>
          </div>
        </div>

        {/* Personalized Recommendation */}
        <div className="card border-l-4 shadow-sm" style={{ borderColor: '#39a935' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recomendación personalizada</h3>
              <p className="text-sm text-slate-700 mt-1">
                {recomendacionesPorPerfil[perfil] || recomendacionesPorPerfil.nuevo}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Tools Banner */}
        <div>
          <div
            onClick={() => onNavigate('/capacitacion')}
            className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl cursor-pointer hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Módulo Interactivo</span>
              <h4 className="font-bold text-slate-900 text-base">Capacitación: Derechos, Deberes y Prohibiciones</h4>
              <p className="text-xs text-slate-600">Simulador de casos reales del Acuerdo 009 de 2024</p>
            </div>
            <span className="text-2xl">📜</span>
          </div>
        </div>

        {/* Modules Route */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Tu ruta de inducción</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {modulos.map((m) => {
              const prog = progresoPorSlug(m.slug);
              const estado = prog?.estado ?? 'no_iniciado';

              const color = {
                no_iniciado: '#94a3b8',
                en_progreso: '#f59e0b',
                completado: '#39a935',
              }[estado];

              const label = {
                no_iniciado: 'Por iniciar',
                en_progreso: 'En progreso',
                completado: 'Completado',
              }[estado];

              return (
                <div
                  key={m.id}
                  onClick={() => onNavigate(`/modulo/${m.slug}`)}
                  className="card hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden flex flex-col justify-between border border-slate-200"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: color }} />

                  <div>
                    <div className="text-5xl mt-2">{m.icono}</div>
                    <h3 className="font-bold text-lg mt-3 text-slate-900 group-hover:text-green-700 transition-colors">
                      {m.titulo}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{m.descripcion}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-500 font-medium">
                        {m.secciones.length} secciones
                      </span>
                      <span className="font-bold" style={{ color }}>
                        {prog?.porcentaje ?? 0}%
                      </span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${prog?.porcentaje ?? 0}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: `${color}15`,
                          color,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        {label}
                      </span>

                      <span className="text-green-700 text-sm font-bold group-hover:translate-x-1 transition-transform">
                        {estado === 'completado' ? 'Revisar →' : 'Iniciar →'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Card */}
        <div className="card text-center py-10 bg-white border border-slate-200 shadow-md">
          <div className="text-5xl">🎓</div>
          <h3 className="font-bold text-xl mt-3 text-slate-900">Constancia de Inducción Institucional</h3>
          <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
            Al completar todos los módulos y aprobar las evaluaciones, podrás descargar tu constancia oficial del SENA.
          </p>

          {totalPorcentaje === 100 ? (
            <button
              onClick={() => onNavigate('/certificado')}
              className="btn-sena inline-flex mt-6 shadow-md"
            >
              Descargar constancia oficial →
            </button>
          ) : (
            <button disabled className="btn-sena mt-6 opacity-50 cursor-not-allowed">
              Completa los módulos ({totalPorcentaje}%)
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
