import React, { useEffect, useState } from 'react';

interface Progreso {
  moduloSlug: string;
  moduloTitulo: string;
  porcentaje: number;
  estado: string;
}

interface CertificadoPageProps {
  onNavigate: (route: string) => void;
}

export const CertificadoPage: React.FC<CertificadoPageProps> = ({ onNavigate }) => {
  const [nombre, setNombre] = useState('');
  const [perfil, setPerfil] = useState('');
  const [progresos, setProgresos] = useState<Progreso[]>([]);
  const [fecha] = useState(
    new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  );

  useEffect(() => {
    const id = localStorage.getItem('aprendizId');
    if (!id) {
      onNavigate('/caracterizacion');
      return;
    }
    setNombre(localStorage.getItem('aprendizNombre') || 'Aprendiz SENA');
    setPerfil(localStorage.getItem('aprendizPerfil') || 'nuevo');

    fetch(`/api/progreso?aprendizId=${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setProgresos(j.data || []);
      })
      .catch((err) => console.error('Error fetching progress:', err));
  }, [onNavigate]);

  const todoCompleto =
    progresos.length > 0 && progresos.every((p) => p.estado === 'completado');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 print:hidden">
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

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
        {!todoCompleto ? (
          <div className="card text-center py-16 shadow-lg border border-slate-200">
            <div className="text-6xl">🔒</div>
            <h1 className="text-2xl font-bold mt-4 text-slate-900">
              Aún no has completado la inducción
            </h1>
            <p className="text-slate-600 mt-2 text-sm">
              Debes completar todos los módulos y evaluaciones para obtener la constancia.
            </p>

            <div className="mt-6 inline-block text-left bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              {progresos.map((p) => (
                <div key={p.moduloSlug} className="flex items-center gap-4 text-sm">
                  <span
                    className={
                      p.estado === 'completado' ? 'text-green-600 font-bold' : 'text-slate-400'
                    }
                  >
                    {p.estado === 'completado' ? '✓' : '○'}
                  </span>
                  <span
                    className={
                      p.estado === 'completado'
                        ? 'text-slate-900 font-semibold'
                        : 'text-slate-500'
                    }
                  >
                    {p.moduloTitulo}
                  </span>
                  <span className="text-xs text-slate-500 ml-auto font-mono">
                    {p.porcentaje}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button onClick={() => onNavigate('/dashboard')} className="btn-sena inline-flex">
                Ir al dashboard
              </button>
            </div>
          </div>
        ) : (
          <div
            className="card relative overflow-hidden shadow-2xl border-2 border-slate-200 p-10"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f9f4 100%)',
            }}
          >
            {/* Top Ribbon */}
            <div
              className="absolute top-0 left-0 w-full h-3"
              style={{
                background: 'linear-gradient(90deg, #39a935, #007832, #00304d)',
              }}
            />

            <div className="text-center py-6">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg"
                style={{ backgroundColor: '#39a935' }}
              >
                <span className="text-white text-4xl font-extrabold">S</span>
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
                Servicio Nacional de Aprendizaje
              </p>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                Constancia de Inducción Institucional
              </h1>

              <p className="text-slate-600 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
                Se certifica que el(la) aprendiz ha completado satisfactoriamente el programa de inducción institucional.
              </p>

              <div className="my-8 py-6 border-y-2 border-dashed border-slate-300">
                <p
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-wide"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {nombre}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Perfil: <span className="capitalize font-bold text-slate-800">{perfil}</span>
                </p>
              </div>

              <p className="text-slate-700 max-w-2xl mx-auto text-sm leading-relaxed">
                A través de los módulos de Conocer el SENA, Regionales y Centros de Formación y Reglamento del Aprendiz (Acuerdo 009 de 2024),
                demostró comprensión de la misión institucional, su regional de adscripción y los derechos, deberes y obligaciones que rigen su formación profesional integral.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 max-w-2xl mx-auto">
                {progresos.map((p) => (
                  <div key={p.moduloSlug} className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-left">
                    <p className="font-bold text-xs text-green-700 flex items-center">
                      <span className="mr-1">✓</span> {p.moduloTitulo}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Aprobado 100%</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-around text-xs text-slate-600 gap-4">
                <div>
                  <p className="font-bold text-slate-900">Fecha de emisión</p>
                  <p>{fecha}</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900">Código de verificación</p>
                  <p className="font-mono text-slate-800 font-bold">
                    SENA-IND-{Date.now().toString().slice(-8)}
                  </p>
                </div>
              </div>

              <div className="mt-8 print:hidden">
                <button onClick={() => window.print()} className="btn-sena shadow-md">
                  🖨️ Imprimir / Descargar constancia
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
