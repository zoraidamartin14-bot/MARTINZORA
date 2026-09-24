import React, { useEffect, useState } from 'react';

interface Regional {
  id: number;
  nombre: string;
  departamento: string;
}

type Perfil = 'nuevo' | 'antiguo' | 'reingreso';
type Modalidad = 'presencial' | 'virtual' | 'a_distancia' | 'mixta';
type Nivel = 'tecnico' | 'tecnologo' | 'especializacion' | 'auxiliar';

interface CaracterizacionPageProps {
  onNavigate: (route: string) => void;
}

export const CaracterizacionPage: React.FC<CaracterizacionPageProps> = ({ onNavigate }) => {
  const [regionales, setRegionales] = useState<Regional[]>([]);
  const [paso, setPaso] = useState(1);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    documento: '',
    nombreCompleto: '',
    correo: '',
    telefono: '',
    perfil: '' as Perfil | '',
    modalidad: '' as Modalidad | '',
    nivel: '' as Nivel | '',
    programa: '',
    ficha: '',
    regionalId: 0,
    senaAnterior: false,
    motivoReingreso: '',
    expectativas: '',
  });

  useEffect(() => {
    fetch('/api/regionales')
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setRegionales(j.data);
      })
      .catch(() => setRegionales([]));
  }, []);

  const siguiente = () => {
    setError(null);
    if (paso === 1) {
      if (!form.documento || !form.nombreCompleto || !form.correo) {
        setError('Completa todos los campos personales requeridos.');
        return;
      }
    }
    if (paso === 2) {
      if (!form.perfil || !form.modalidad || !form.nivel) {
        setError('Selecciona tu perfil, modalidad y nivel de formación.');
        return;
      }
    }
    if (paso === 3) {
      if (!form.programa || !form.ficha || !form.regionalId) {
        setError('Completa la información de tu programa y regional.');
        return;
      }
    }
    if (paso === 4 && (form.perfil === 'antiguo' || form.perfil === 'reingreso')) {
      if (form.perfil === 'reingreso' && !form.motivoReingreso) {
        setError('Cuéntanos brevemente por qué regresas al SENA.');
        return;
      }
    }
    setPaso(paso + 1);
  };

  const anterior = () => setPaso(paso - 1);

  const enviar = async () => {
    setGuardando(true);
    setError(null);
    try {
      const r = await fetch('/api/aprendices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'Error al guardar caracterización');

      localStorage.setItem('aprendizId', String(j.aprendizId));
      localStorage.setItem('aprendizNombre', form.nombreCompleto);
      localStorage.setItem('aprendizPerfil', form.perfil);

      onNavigate('/dashboard');
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setGuardando(false);
    }
  };

  const perfilLabel = {
    nuevo: 'Aprendiz nuevo',
    antiguo: 'Aprendiz antiguo',
    reingreso: 'Reingreso',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => onNavigate('/')} className="flex items-center gap-3 text-left">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#39a935' }}
            >
              S
            </div>
            <span className="font-bold text-slate-900 text-lg">SENA Inducción</span>
          </button>

          <button
            onClick={() => onNavigate('/')}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            ← Volver al inicio
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Caracterización del Aprendiz
          </h1>
          <p className="text-slate-600 mt-2">
            Esta información personaliza tu inducción. Tus respuestas determinan qué módulos verás y con qué profundidad.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center mb-8">
          {[1, 2, 3, 4].map((n) => (
            <React.Fragment key={n}>
              <div className="flex items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    paso >= n ? 'text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                  style={paso >= n ? { backgroundColor: '#39a935' } : {}}
                >
                  {n}
                </div>
              </div>
              {n < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition-all ${
                    paso > n ? '' : 'bg-slate-200'
                  }`}
                  style={paso > n ? { backgroundColor: '#39a935' } : {}}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="card shadow-lg border border-slate-200">
          {paso === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900">1. Datos personales</h2>
              <p className="text-sm text-slate-600 mt-1">Información de identificación del aprendiz.</p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <Campo
                  label="Documento de identidad *"
                  valor={form.documento}
                  onChange={(v) => setForm({ ...form, documento: v })}
                  placeholder="1234567890"
                />
                <Campo
                  label="Nombre completo *"
                  valor={form.nombreCompleto}
                  onChange={(v) => setForm({ ...form, nombreCompleto: v })}
                  placeholder="Nombres y apellidos"
                />
                <Campo
                  label="Correo institucional *"
                  valor={form.correo}
                  type="email"
                  onChange={(v) => setForm({ ...form, correo: v })}
                  placeholder="aprendiz@soy.sena.edu.co"
                />
                <Campo
                  label="Teléfono"
                  valor={form.telefono}
                  onChange={(v) => setForm({ ...form, telefono: v })}
                  placeholder="3001234567"
                />
              </div>
            </div>
          )}

          {paso === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900">2. Perfil académico</h2>
              <p className="text-sm text-slate-600 mt-1">
                Tu perfil determina la ruta. Sé honesto: esto garantiza una inducción útil.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ¿Cuál es tu perfil? *
                  </label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {(['nuevo', 'antiguo', 'reingreso'] as Perfil[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setForm({ ...form, perfil: p })}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          form.perfil === p
                            ? 'border-green-600 bg-green-50/80 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-bold text-slate-900">{perfilLabel[p]}</div>
                        <div className="text-xs text-slate-600 mt-1">
                          {p === 'nuevo' && 'Primera vez en el SENA'}
                          {p === 'antiguo' && 'Ya cursó otro programa'}
                          {p === 'reingreso' && 'Retomó tras una ausencia'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Modalidad *
                    </label>
                    <select
                      value={form.modalidad}
                      onChange={(e) =>
                        setForm({ ...form, modalidad: e.target.value as Modalidad })
                      }
                      className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                    >
                      <option value="">Selecciona modalidad...</option>
                      <option value="presencial">Presencial</option>
                      <option value="virtual">Virtual</option>
                      <option value="a_distancia">A distancia</option>
                      <option value="mixta">Mixta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nivel de formación *
                    </label>
                    <select
                      value={form.nivel}
                      onChange={(e) => setForm({ ...form, nivel: e.target.value as Nivel })}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                    >
                      <option value="">Selecciona nivel...</option>
                      <option value="auxiliar">Auxiliar</option>
                      <option value="tecnico">Técnico</option>
                      <option value="tecnologo">Tecnólogo</option>
                      <option value="especializacion">Especialización tecnológica</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paso === 3 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900">3. Programa y regional</h2>
              <p className="text-sm text-slate-600 mt-1">¿Dónde y qué vas a estudiar?</p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <Campo
                  label="Programa de formación *"
                  valor={form.programa}
                  onChange={(v) => setForm({ ...form, programa: v })}
                  placeholder="Ej: Análisis y desarrollo de software"
                />
                <Campo
                  label="Número de ficha *"
                  valor={form.ficha}
                  onChange={(v) => setForm({ ...form, ficha: v })}
                  placeholder="Ej: 2654321"
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Regional y centro *
                  </label>
                  <select
                    value={form.regionalId}
                    onChange={(e) =>
                      setForm({ ...form, regionalId: parseInt(e.target.value, 10) })
                    }
                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                  >
                    <option value={0}>Selecciona tu regional...</option>
                    {regionales.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre} ({r.departamento})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {paso === 4 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                4. {form.perfil === 'nuevo' ? 'Bienvenida' : 'Información adicional'}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {form.perfil === 'nuevo' &&
                  'Cuéntanos qué esperas de tu formación. Esto nos ayuda a acompañarte mejor.'}
                {form.perfil === 'antiguo' &&
                  'Confirma si tuviste experiencia previa en el SENA.'}
                {form.perfil === 'reingreso' &&
                  'Necesitamos entender tu reingreso para darte una ruta adecuada.'}
              </p>

              <div className="mt-6 space-y-4">
                {form.perfil === 'antiguo' && (
                  <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={form.senaAnterior}
                      onChange={(e) => setForm({ ...form, senaAnterior: e.target.checked })}
                      className="mt-1 accent-green-600"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">
                        Confirmo que cursé un programa SENA anteriormente
                      </div>
                      <div className="text-xs text-slate-500">Verificaremos tu historial en el sistema.</div>
                    </div>
                  </label>
                )}

                {form.perfil === 'reingreso' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        ¿Por qué estás reingresando? *
                      </label>
                      <textarea
                        value={form.motivoReingreso}
                        onChange={(e) => setForm({ ...form, motivoReingreso: e.target.value })}
                        rows={3}
                        placeholder="Cuéntanos brevemente..."
                        className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                      />
                    </div>

                    <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={form.senaAnterior}
                        onChange={(e) => setForm({ ...form, senaAnterior: e.target.checked })}
                        className="mt-1 accent-green-600"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">
                          Cursé previamente otro programa en el SENA
                        </div>
                        <div className="text-xs text-slate-500">Marca esta opción si aplica.</div>
                      </div>
                    </label>
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ¿Qué expectativas tienes del SENA? <span className="text-slate-400 font-normal">(opcional)</span>
                  </label>
                  <textarea
                    value={form.expectativas}
                    onChange={(e) => setForm({ ...form, expectativas: e.target.value })}
                    rows={3}
                    placeholder="Cuéntanos qué esperas aprender, qué te motiva, etc."
                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={anterior}
              disabled={paso === 1}
              className="btn-secundario text-sm"
            >
              Anterior
            </button>

            {paso < 4 ? (
              <button type="button" onClick={siguiente} className="btn-sena text-sm">
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                onClick={enviar}
                disabled={guardando}
                className="btn-sena text-sm shadow-md"
              >
                {guardando ? 'Guardando...' : 'Finalizar caracterización'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

function Campo({
  label,
  valor,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
      />
    </div>
  );
}
