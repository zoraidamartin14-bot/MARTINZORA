import React, { useEffect, useState } from 'react';

interface Pregunta {
  id: number;
  enunciado: string;
  opciones: string[];
}

interface FeedbackItem {
  preguntaId: number;
  correcta: boolean;
  explicacion: string;
  respuestaCorrecta: string;
  respuestaUsuario: string;
}

interface EvaluacionPageProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export const EvaluacionPage: React.FC<EvaluacionPageProps> = ({ slug, onNavigate }) => {
  const [aprendizId, setAprendizId] = useState<string | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [enviado, setEnviado] = useState(false);
  const [calificacion, setCalificacion] = useState(0);
  const [aprobado, setAprobado] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('aprendizId');
    if (!id) {
      onNavigate('/caracterizacion');
      return;
    }
    setAprendizId(id);

    fetch(`/api/evaluacion?slug=${slug}&aprendizId=${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) {
          setPreguntas(j.preguntas || []);
        }
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [slug, onNavigate]);

  const enviar = async () => {
    if (!aprendizId) return;
    const sinResponder = preguntas.filter((p) => respuestas[p.id] === undefined);
    if (sinResponder.length > 0) {
      alert(`Te faltan ${sinResponder.length} pregunta(s) por responder.`);
      return;
    }

    setEnviando(true);
    try {
      const r = await fetch('/api/evaluacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aprendizId: parseInt(aprendizId, 10),
          moduloSlug: slug,
          respuestas: Object.entries(respuestas).map(([pid, resp]) => ({
            preguntaId: parseInt(pid, 10),
            respuesta: resp,
          })),
        }),
      });

      const j = await r.json();
      if (j.ok) {
        setCalificacion(j.calificacion);
        setAprobado(j.aprobado);
        setFeedback(j.feedback || []);
        setEnviado(true);

        if (j.aprobado) {
          await fetch('/api/progreso', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aprendizId: parseInt(aprendizId, 10), moduloSlug: slug }),
          });
        }
      }
    } catch (err) {
      console.error('Error submitting evaluation:', err);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 font-medium">Cargando evaluación del Acuerdo 009...</p>
      </div>
    );
  }

  if (preguntas.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="card text-center max-w-md w-full p-8 space-y-4">
          <p className="text-slate-700">No hay preguntas disponibles para este módulo.</p>
          <button onClick={() => onNavigate('/dashboard')} className="btn-sena inline-flex">
            Volver al dashboard
          </button>
        </div>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="card max-w-2xl w-full shadow-xl border border-slate-200 p-8 space-y-6">
          <div className="text-center">
            <div className="text-6xl">{aprobado ? '🎉' : '⚠️'}</div>
            <h1 className="text-3xl font-extrabold mt-4 text-slate-900">
              {aprobado ? '¡Evaluación Aprobada!' : 'Necesitas Reforzar El Reglamento'}
            </h1>

            <p className="text-slate-600 mt-2">
              Tu calificación:{' '}
              <strong
                className="text-3xl font-extrabold"
                style={{ color: aprobado ? '#39a935' : '#f59e0b' }}
              >
                {calificacion}/100
              </strong>
            </p>

            <p className="text-sm text-slate-500 mt-1">
              {aprobado
                ? 'Has demostrado dominio de las normas del Acuerdo 009 de 2024.'
                : 'Revisa las explicaciones de las preguntas donde fallaste y vuelve a intentarlo.'}
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-2">
              Retroalimentación Intuitiva por Pregunta
            </h3>

            {feedback.map((f, i) => (
              <div
                key={f.preguntaId}
                className={`p-4 rounded-xl border-2 space-y-2 ${
                  f.correcta
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>
                    {i + 1}. {f.correcta ? '✓ Respuesta Correcta' : '✗ Respuesta Incorrecta'}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      f.correcta ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                    }`}
                  >
                    {f.correcta ? 'Aprobada' : 'Requiere Repaso'}
                  </span>
                </div>

                {!f.correcta && (
                  <div className="text-xs space-y-1 pt-1 border-t border-rose-200">
                    <p>
                      <strong>Tu respuesta:</strong> <span className="line-through">{f.respuestaUsuario}</span>
                    </p>
                    <p className="text-emerald-800 font-bold">
                      <strong>Respuesta correcta:</strong> {f.respuestaCorrecta}
                    </p>
                  </div>
                )}

                <p className="text-xs italic bg-white/70 p-2.5 rounded-lg border border-slate-200 mt-2">
                  💡 <strong>Fundamento normativo (Acuerdo 009 de 2024):</strong> {f.explicacion}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="btn-sena flex-1 justify-center text-sm font-bold"
            >
              Volver al Dashboard
            </button>

            {!aprobado && (
              <button
                onClick={() => {
                  setEnviado(false);
                  setRespuestas({});
                }}
                className="btn-secundario flex-1 justify-center text-sm font-bold"
              >
                Reintentar Evaluación
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => onNavigate('/dashboard')} className="flex items-center gap-3 text-left">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#39a935' }}
            >
              S
            </div>
            <span className="font-bold text-slate-900 text-lg">Evaluación de Conocimientos</span>
          </button>

          <button
            onClick={() => onNavigate(`/modulo/${slug}`)}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            ← Volver al módulo
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-6">
        <div
          className="card shadow-md rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, #f4b223 0%, #d97706 100%)', color: 'white' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Evaluación: {slug}</h1>
              <p className="text-white/95 text-sm mt-1">
                Responde las preguntas generadas aleatoriamente del banco sin repetición estática.
              </p>
            </div>
            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
              Umbral: 70/100
            </span>
          </div>
        </div>

        <div className="space-y-5">
          {preguntas.map((p, idx) => (
            <div key={p.id} className="card shadow-sm border border-slate-200 p-6 space-y-4">
              <p className="font-bold text-slate-900 text-base">
                <span className="text-amber-600 font-extrabold mr-2">{idx + 1}.</span>
                {p.enunciado}
              </p>

              <div className="space-y-2.5">
                {p.opciones.map((op, i) => {
                  const sel = respuestas[p.id] === i;
                  return (
                    <label
                      key={i}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                        sel
                          ? 'border-green-600 bg-green-50/80 font-bold text-green-950 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`p-${p.id}`}
                        checked={sel}
                        onChange={() => setRespuestas({ ...respuestas, [p.id]: i })}
                        className="mt-0.5 accent-green-600"
                      />
                      <span className="text-slate-800">{op}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={enviar}
            disabled={enviando}
            className="btn-sena w-full justify-center py-4 text-base font-bold shadow-xl"
          >
            {enviando ? 'Verificando Respuestas...' : 'Enviar Evaluación y Ver Retroalimentación'}
          </button>
        </div>
      </main>
    </div>
  );
};
