import React, { useEffect, useState } from 'react';

interface AdminPageProps {
  onNavigate: (route: string) => void;
}

interface AprendizAdmin {
  id: number;
  documento: string;
  nombreCompleto: string;
  correo: string;
  telefono?: string;
  perfil: 'nuevo' | 'antiguo' | 'reingreso';
  modalidad: string;
  nivel: string;
  programa: string;
  ficha: string;
  regionalNombre: string;
  regionalDepartamento: string;
  progresoPorcentaje: number;
  modulosCompletados: number;
  ultimaCalificacion?: number | null;
  ultimaEvaluacionAprobada?: boolean | null;
  createdAt: string;
}

interface PreguntaAdmin {
  id: number;
  moduloId: number;
  moduloSlug: string;
  moduloTitulo: string;
  enunciado: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion: string;
}

interface KPIStats {
  totalAprendices: number;
  totalEvaluaciones: number;
  promedioCalificacion: number;
  tasaAprobacion: number;
  totalPreguntasBanco: number;
  totalRegionalesActivas: number;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'kpis' | 'directory' | 'questions'>('kpis');
  const [kpis, setKpis] = useState<KPIStats | null>(null);
  const [perfilesData, setPerfilesData] = useState<Record<string, number>>({});
  const [modalidadesData, setModalidadesData] = useState<Record<string, number>>({});
  const [regionalesData, setRegionalesData] = useState<Record<string, number>>({});
  const [aprendices, setAprendices] = useState<AprendizAdmin[]>([]);
  const [preguntas, setPreguntas] = useState<PreguntaAdmin[]>([]);

  const [cargando, setCargando] = useState(true);
  const [busquedaDir, setBusquedaDir] = useState('');
  const [filtroPerfil, setFiltroPerfil] = useState('all');

  // Form state for adding custom questions
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [newModSlug, setNewModSlug] = useState('reglamento');
  const [newEnunciado, setNewEnunciado] = useState('');
  const [newOpciones, setNewOpciones] = useState(['', '', '', '']);
  const [newCorrecta, setNewCorrecta] = useState(0);
  const [newExplicacion, setNewExplicacion] = useState('');
  const [savingQuestion, setSavingQuestion] = useState(false);

  useEffect(() => {
    cargarDatosAdmin();
  }, []);

  const cargarDatosAdmin = async () => {
    setCargando(true);
    try {
      const [statsRes, aprendicesRes, preguntasRes] = await Promise.all([
        fetch('/api/admin/stats').then((r) => r.json()),
        fetch('/api/admin/aprendices').then((r) => r.json()),
        fetch('/api/admin/preguntas').then((r) => r.json()),
      ]);

      if (statsRes.ok) {
        setKpis(statsRes.kpis);
        setPerfilesData(statsRes.porPerfil);
        setModalidadesData(statsRes.porModalidad);
        setRegionalesData(statsRes.porRegional);
      }
      if (aprendicesRes.ok) setAprendices(aprendicesRes.data || []);
      if (preguntasRes.ok) setPreguntas(preguntasRes.data || []);
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleCrearPregunta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnunciado.trim() || newOpciones.some((o) => !o.trim()) || !newExplicacion.trim()) {
      alert('Por favor completa el enunciado, las 4 opciones y la explicación.');
      return;
    }

    setSavingQuestion(true);
    try {
      const res = await fetch('/api/admin/preguntas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduloSlug: newModSlug,
          enunciado: newEnunciado.trim(),
          opciones: newOpciones,
          respuestaCorrecta: newCorrecta,
          explicacion: newExplicacion.trim(),
        }),
      });

      const json = await res.json();
      if (json.ok) {
        setShowAddQuestionModal(false);
        setNewEnunciado('');
        setNewOpciones(['', '', '', '']);
        setNewExplicacion('');
        cargarDatosAdmin();
      } else {
        alert(json.error || 'Error al guardar pregunta');
      }
    } catch (err) {
      console.error('Error adding question:', err);
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleBorrarPregunta = async (id: number) => {
    if (!confirm('¿Deseas eliminar esta pregunta del banco?')) return;
    try {
      const res = await fetch(`/api/admin/preguntas/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.ok) cargarDatosAdmin();
    } catch (err) {
      console.error('Error deleting question:', err);
    }
  };

  const aprendicesFiltrados = aprendices.filter((a) => {
    const coincideBusqueda =
      a.nombreCompleto.toLowerCase().includes(busquedaDir.toLowerCase()) ||
      a.documento.includes(busquedaDir) ||
      a.correo.toLowerCase().includes(busquedaDir.toLowerCase()) ||
      a.programa.toLowerCase().includes(busquedaDir.toLowerCase()) ||
      a.ficha.includes(busquedaDir);

    const coincidePerfil = filtroPerfil === 'all' || a.perfil === filtroPerfil;
    return coincideBusqueda && coincidePerfil;
  });

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">Cargando Panel de Administración SENA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm"
              style={{ backgroundColor: '#007832' }}
            >
              📊
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900">Panel de Administración Prototipo</h1>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold">
                  Consolidado SENA
                </span>
              </div>
              <p className="text-xs text-slate-500">Indicadores de funcionalidad y registro de aprendices</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Volver
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('kpis')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'kpis'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              📈 Indicadores & KPIs
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'directory'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              👥 Consolidado de Aprendices ({aprendices.length})
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'questions'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ❓ Banco de Preguntas ({preguntas.length})
            </button>
          </div>

          <button
            onClick={cargarDatosAdmin}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300"
          >
            🔄 Actualizar Datos
          </button>
        </div>

        {/* TAB 1: KPIs & INDICADORES */}
        {activeTab === 'kpis' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Aprendices Registrados</span>
                <p className="text-3xl font-extrabold text-slate-900">{kpis?.totalAprendices || 0}</p>
                <p className="text-[11px] text-emerald-600 font-semibold">↑ Datos en tiempo real</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Evaluaciones Presentadas</span>
                <p className="text-3xl font-extrabold text-slate-900">{kpis?.totalEvaluaciones || 0}</p>
                <p className="text-[11px] text-blue-600 font-semibold">Tasa Aprobación: {kpis?.tasaAprobacion}%</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Promedio Calificación</span>
                <p className="text-3xl font-extrabold text-green-700">{kpis?.promedioCalificacion || 0} pts</p>
                <p className="text-[11px] text-slate-500 font-medium">Sobre 100 puntos posibles</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Banco de Preguntas</span>
                <p className="text-3xl font-extrabold text-slate-900">{kpis?.totalPreguntasBanco || 0}</p>
                <p className="text-[11px] text-amber-600 font-semibold">Sin repetición estática</p>
              </div>
            </div>

            {/* Breakdown Charts / Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Profile Breakdown */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Distribución por Perfil
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Aprendiz Nuevo</span>
                      <span>{perfilesData.nuevo || 0}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${
                            kpis?.totalAprendices
                              ? Math.round(((perfilesData.nuevo || 0) / kpis.totalAprendices) * 100)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Aprendiz Antiguo</span>
                      <span>{perfilesData.antiguo || 0}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${
                            kpis?.totalAprendices
                              ? Math.round(((perfilesData.antiguo || 0) / kpis.totalAprendices) * 100)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Reingreso</span>
                      <span>{perfilesData.reingreso || 0}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{
                          width: `${
                            kpis?.totalAprendices
                              ? Math.round(((perfilesData.reingreso || 0) / kpis.totalAprendices) * 100)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modalidad Breakdown */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Distribución por Modalidad
                </h3>
                <div className="space-y-3">
                  {Object.entries(modalidadesData).map(([mod, cnt]) => (
                    <div key={mod}>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1 capitalize">
                        <span>{mod.replace('_', ' ')}</span>
                        <span>{cnt}</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500"
                          style={{
                            width: `${
                              kpis?.totalAprendices
                                ? Math.round((cnt / kpis.totalAprendices) * 100)
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Breakdown */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Regionales con Mayor Registro
                </h3>
                <div className="space-y-2.5 max-h-52 overflow-y-auto">
                  {Object.entries(regionalesData).map(([reg, cnt]) => (
                    <div
                      key={reg}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs"
                    >
                      <span className="font-bold text-slate-800 truncate max-w-[180px]">{reg}</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 font-extrabold rounded-full">
                        {cnt} aprendices
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIRECTORY / CONSOLIDADO DE APRENDICES */}
        {activeTab === 'directory' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <input
                type="text"
                value={busquedaDir}
                onChange={(e) => setBusquedaDir(e.target.value)}
                placeholder="Filtrar por nombre, documento, correo o ficha..."
                className="bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 flex-1"
              />

              <select
                value={filtroPerfil}
                onChange={(e) => setFiltroPerfil(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <option value="all">Todos los Perfiles</option>
                <option value="nuevo">Aprendiz Nuevo</option>
                <option value="antiguo">Aprendiz Antiguo</option>
                <option value="reingreso">Reingreso</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 uppercase text-[10px] font-bold border-b border-slate-200">
                    <th className="p-3">Documento</th>
                    <th className="p-3">Aprendiz</th>
                    <th className="p-3">Perfil & Modalidad</th>
                    <th className="p-3">Programa / Ficha</th>
                    <th className="p-3">Regional SENA</th>
                    <th className="p-3">Progreso Inducción</th>
                    <th className="p-3 text-right">Última Nota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {aprendicesFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 italic">
                        No se encontraron aprendices registrados con este criterio.
                      </td>
                    </tr>
                  ) : (
                    aprendicesFiltrados.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-900">{a.documento}</td>
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{a.nombreCompleto}</p>
                          <p className="text-[10px] text-slate-500">{a.correo}</p>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              a.perfil === 'nuevo'
                                ? 'bg-emerald-100 text-emerald-800'
                                : a.perfil === 'antiguo'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {a.perfil}
                          </span>
                          <p className="text-[10px] text-slate-500 mt-0.5 capitalize">{a.modalidad}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-slate-800 truncate max-w-[180px]">{a.programa}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Ficha: {a.ficha}</p>
                        </td>
                        <td className="p-3 font-medium text-slate-800">{a.regionalNombre}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-600"
                                style={{ width: `${a.progresoPorcentaje}%` }}
                              />
                            </div>
                            <span className="font-bold text-[11px] text-slate-900">
                              {a.progresoPorcentaje}%
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          {a.ultimaCalificacion !== null && a.ultimaCalificacion !== undefined ? (
                            <span
                              className={`font-bold px-2 py-1 rounded text-[11px] ${
                                a.ultimaEvaluacionAprobada
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {a.ultimaCalificacion}/100
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Pendiente</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BANCO DE PREGUNTAS */}
        {activeTab === 'questions' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Banco de Preguntas Dinámico ({preguntas.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Preguntas cargadas en la base de datos PostgreSQL para rotación aleatoria sin repetición.
                </p>
              </div>

              <button
                onClick={() => setShowAddQuestionModal(true)}
                className="btn-sena text-xs font-bold shadow-md"
              >
                + Agregar Nueva Pregunta
              </button>
            </div>

            <div className="space-y-4">
              {preguntas.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded font-extrabold uppercase text-[10px]">
                      {p.moduloTitulo} ({p.moduloSlug})
                    </span>

                    <button
                      onClick={() => handleBorrarPregunta(p.id)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>

                  <p className="font-bold text-slate-900 text-sm">
                    {idx + 1}. {p.enunciado}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {p.opciones.map((op, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border ${
                          i === p.respuestaCorrecta
                            ? 'bg-emerald-100/70 border-emerald-300 font-bold text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-mono mr-1">{i + 1})</span> {op}
                        {i === p.respuestaCorrecta && ' ✓'}
                      </div>
                    ))}
                  </div>

                  <p className="text-slate-500 italic pt-1 border-t border-slate-200">
                    💡 Explicación: {p.explicacion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal para Agregar Pregunta */}
        {showAddQuestionModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 text-base">Agregar Pregunta al Banco</h3>
                <button
                  onClick={() => setShowAddQuestionModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCrearPregunta} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Módulo Evaluado *</label>
                  <select
                    value={newModSlug}
                    onChange={(e) => setNewModSlug(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-semibold text-slate-800"
                  >
                    <option value="conocer-sena">Conocer el SENA</option>
                    <option value="regionales">Regionales y Centros</option>
                    <option value="reglamento">Reglamento (Acuerdo 009 de 2024)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enunciado de la Pregunta *</label>
                  <textarea
                    value={newEnunciado}
                    onChange={(e) => setNewEnunciado(e.target.value)}
                    placeholder="Escribe la pregunta clara sobre el reglamento o el SENA..."
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 resize-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Opciones de Respuesta *</label>
                  <div className="space-y-1.5">
                    {newOpciones.map((op, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="correctaRadio"
                          checked={newCorrecta === idx}
                          onChange={() => setNewCorrecta(idx)}
                          className="accent-emerald-600"
                        />
                        <input
                          type="text"
                          value={op}
                          onChange={(e) => {
                            const copy = [...newOpciones];
                            copy[idx] = e.target.value;
                            setNewOpciones(copy);
                          }}
                          placeholder={`Opción ${idx + 1}`}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    * Marca el círculo radio para la opción correcta.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Explicación Normativa *</label>
                  <input
                    type="text"
                    value={newExplicacion}
                    onChange={(e) => setNewExplicacion(e.target.value)}
                    placeholder="Ej: Según el Art. 8 Num. 5 del Acuerdo 009 de 2024..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddQuestionModal(false)}
                    className="btn-secundario text-xs py-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingQuestion}
                    className="btn-sena text-xs py-2 shadow-md"
                  >
                    {savingQuestion ? 'Guardando...' : 'Guardar Pregunta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
