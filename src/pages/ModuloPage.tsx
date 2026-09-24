import React, { useEffect, useState } from 'react';

interface Seccion {
  id: number;
  titulo: string;
  contenido: string;
  puntosClave: string[];
  orden: number;
}

interface Modulo {
  id: number;
  slug: string;
  titulo: string;
  descripcion: string;
  icono: string;
  secciones: Seccion[];
}

interface Regional {
  id: number;
  nombre: string;
  departamento: string;
  descripcion: string;
  director: string;
  contacto: string;
  programasDestacados: string[];
}

interface Articulo {
  id: number;
  numero: string;
  titulo: string;
  categoria: string;
  contenido: string;
  consecuencia: string | null;
  orden: number;
}

interface ModuloPageProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export const ModuloPage: React.FC<ModuloPageProps> = ({ slug, onNavigate }) => {
  const [aprendizId, setAprendizId] = useState<string | null>(null);
  const [modulo, setModulo] = useState<Modulo | null>(null);
  const [regionalesAll, setRegionalesAll] = useState<Regional[]>([]);
  const [regionalSel, setRegionalSel] = useState<Regional | null>(null);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [seccionActiva, setSeccionActiva] = useState(0);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const id = localStorage.getItem('aprendizId');
    if (!id) {
      onNavigate('/caracterizacion');
      return;
    }
    setAprendizId(id);

    const cargarTodo = async () => {
      const modRes = await fetch('/api/modulos');
      const modJson = await modRes.json();
      if (modJson.ok) {
        const m = modJson.data.find((x: Modulo) => x.slug === slug);
        if (m) {
          setModulo(m);
          if (m.secciones.length > 0) {
            marcarSeccionVista(id, m.slug, m.secciones[0].id);
          }
        }
      }

      if (slug === 'regionales') {
        const regRes = await fetch('/api/regionales');
        const regJson = await regRes.json();
        if (regJson.ok) setRegionalesAll(regJson.data);
      }

      if (slug === 'reglamento') {
        const evalRes = await fetch('/api/evaluacion?slug=reglamento');
        const evalJson = await evalRes.json();
        if (evalJson.ok) setArticulos(evalJson.articulos || []);
      }
    };

    cargarTodo();
  }, [slug, onNavigate]);

  const marcarSeccionVista = async (id: string, slugModulo: string, seccionId: number) => {
    try {
      const r = await fetch('/api/progreso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aprendizId: parseInt(id, 10), moduloSlug: slugModulo, seccionId }),
      });
      const j = await r.json();
      if (j.ok) setProgreso(j.porcentaje);
    } catch {
      // noop
    }
  };

  if (!modulo) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 font-medium">Cargando módulo...</p>
      </div>
    );
  }

  const seccionActual = modulo.secciones[seccionActiva];

  const avanzar = () => {
    if (seccionActiva < modulo.secciones.length - 1) {
      const next = seccionActiva + 1;
      setSeccionActiva(next);
      if (aprendizId) marcarSeccionVista(aprendizId, modulo.slug, modulo.secciones[next].id);
    }
  };

  const retroceder = () => {
    if (seccionActiva > 0) setSeccionActiva(seccionActiva - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => onNavigate('/dashboard')} className="flex items-center gap-3 text-left">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#39a935' }}
            >
              S
            </div>
            <span className="font-bold text-slate-900 text-lg">SENA Inducción</span>
          </button>

          <button
            onClick={() => onNavigate('/dashboard')}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            ← Volver al dashboard
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-6">
        {/* Module Header */}
        <div
          className="card shadow-lg rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, #00304d 0%, #007832 100%)', color: 'white' }}
        >
          <div className="flex items-start gap-4">
            <div className="text-5xl">{modulo.icono}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{modulo.titulo}</h1>
              <p className="text-white/90 mt-1 text-sm">{modulo.descripcion}</p>

              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Progreso del módulo</span>
                  <span>{progreso}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${progreso}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="card sticky top-20 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">
                Contenido
              </h3>
              <ol className="space-y-2">
                {modulo.secciones.map((s, i) => {
                  const activo = i === seccionActiva;
                  const completadoLocal = i < seccionActiva;
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => {
                          setSeccionActiva(i);
                          if (aprendizId) marcarSeccionVista(aprendizId, modulo.slug, s.id);
                        }}
                        className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-2.5 text-xs font-medium ${
                          activo
                            ? 'bg-green-50 text-green-900 font-bold border border-green-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold ${
                            completadoLocal
                              ? 'bg-green-600 text-white'
                              : activo
                              ? 'bg-green-200 text-green-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {completadoLocal ? '✓' : i + 1}
                        </span>
                        <span>{s.titulo}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          {/* Active Section Article */}
          <article className="lg:col-span-3 space-y-6">
            {seccionActual && (
              <div className="card shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">{seccionActual.titulo}</h2>
                <p className="text-slate-700 leading-relaxed mt-4 text-base">
                  {seccionActual.contenido}
                </p>

                {seccionActual.puntosClave.length > 0 && (
                  <div
                    className="mt-6 p-5 rounded-xl border-l-4"
                    style={{ backgroundColor: '#f0f9f4', borderColor: '#39a935' }}
                  >
                    <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">
                      📌 Puntos clave
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {seccionActual.puntosClave.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-800">
                          <span className="text-green-600 font-bold">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={retroceder}
                    disabled={seccionActiva === 0}
                    className="btn-secundario text-sm"
                  >
                    ← Anterior
                  </button>

                  {seccionActiva < modulo.secciones.length - 1 ? (
                    <button onClick={avanzar} className="btn-sena text-sm">
                      Siguiente →
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate(`/modulo/${slug}/evaluacion`)}
                      className="btn-sena text-sm shadow-md"
                    >
                      Ir a evaluación →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Extra widget for Regionales */}
            {slug === 'regionales' && (
              <div className="card shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900">🔍 Explora las regionales</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Selecciona una regional para ver su información detallada.
                </p>

                <select
                  onChange={(e) => {
                    const r = regionalesAll.find((x) => x.id === parseInt(e.target.value, 10));
                    setRegionalSel(r || null);
                  }}
                  className="w-full p-3 border border-slate-300 rounded-xl mt-4 text-sm bg-white"
                  defaultValue=""
                >
                  <option value="">Selecciona una regional...</option>
                  {regionalesAll.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre} ({r.departamento})
                    </option>
                  ))}
                </select>

                {regionalSel && (
                  <div className="mt-4 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-bold text-lg text-slate-900">{regionalSel.nombre}</h4>
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      {regionalSel.departamento}
                    </p>
                    <p className="text-sm text-slate-700 mt-2">{regionalSel.descripcion}</p>

                    <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-xs">
                      <div>
                        <strong className="text-slate-900">Director regional:</strong>
                        <p className="text-slate-700">{regionalSel.director}</p>
                      </div>
                      <div>
                        <strong className="text-slate-900">Contacto:</strong>
                        <p className="text-slate-700">{regionalSel.contacto}</p>
                      </div>
                    </div>

                    {regionalSel.programasDestacados?.length > 0 && (
                      <div className="pt-2 text-xs">
                        <strong className="text-slate-900">Programas destacados:</strong>
                        <ul className="mt-1 space-y-1 text-slate-700 list-disc list-inside">
                          {regionalSel.programasDestacados.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Extra widget for Reglamento */}
            {slug === 'reglamento' && articulos.length > 0 && (
              <div className="card shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900">📖 Artículos del Reglamento</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Referencia rápida de los artículos clave del Acuerdo 009 de 2024.
                </p>

                <div className="mt-5 space-y-4">
                  {articulos.map((a) => {
                    const color =
                      {
                        deber: '#00304d',
                        derecho: '#39a935',
                        prohibicion: '#dc2626',
                      }[a.categoria] || '#64748b';

                    return (
                      <div
                        key={a.id}
                        className="border-l-4 pl-4 py-2"
                        style={{ borderColor: color }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-bold text-slate-900 text-sm">
                            {a.numero} - {a.titulo}
                          </h4>
                          <span
                            className="badge text-xs uppercase"
                            style={{ backgroundColor: `${color}15`, color }}
                          >
                            {a.categoria}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                          {a.contenido}
                        </p>

                        {a.consecuencia && (
                          <p className="text-xs text-red-700 font-medium mt-2 bg-red-50 p-2 rounded-lg border border-red-100">
                            ⚠️ Consecuencia: {a.consecuencia}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </article>
        </div>
      </main>
    </div>
  );
};
