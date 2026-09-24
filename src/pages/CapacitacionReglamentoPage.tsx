import React, { useState } from 'react';

interface CapacitacionPageProps {
  onNavigate: (route: string) => void;
}

interface ItemNorma {
  numeral: string;
  titulo: string;
  tipo: 'derecho' | 'deber' | 'prohibicion';
  articulo: string;
  descripcion: string;
  ejemploReal: string;
  consecuencia?: string;
  categoria: string;
}

const ITEMS_DERECHOS: ItemNorma[] = [
  {
    numeral: '1',
    titulo: 'Inducción Institucional Completa',
    tipo: 'derecho',
    articulo: 'Art. 5 Numeral 1',
    categoria: 'Formación',
    descripcion: 'Conocer el reglamento, la estructura del SENA, el plan de bienestar y los requisitos de certificación.',
    ejemploReal: 'Recibir acompañamiento desde el primer día para entender Sofía Plus, la ficha de caracterización y las rutas formativas.',
  },
  {
    numeral: '2',
    titulo: 'Formación de Calidad y Recursos Insumos',
    tipo: 'derecho',
    articulo: 'Art. 5 Numeral 2',
    categoria: 'Formación',
    descripcion: 'Aprender con instructores idóneos, talleres, laboratorios y herramientas tecnológicas suficientes.',
    ejemploReal: 'Contar con computadores, software especializado o talleres equipados según las competencias de tu programa.',
  },
  {
    numeral: '5',
    titulo: 'Entrega de Elementos de Protección Personal (EPP)',
    tipo: 'derecho',
    articulo: 'Art. 5 Numeral 5',
    categoria: 'SST e Inclusión',
    descripcion: 'Recibir del Centro de Formación los EPP necesarios para realizar prácticas seguras en ambientes de aprendizaje.',
    ejemploReal: 'Gafas de seguridad, cascos, guantes o batas requeridas en laboratorios de cocina, electricidad o construcciones.',
  },
  {
    numeral: '10',
    titulo: 'Garantía del Debido Proceso y Defensa',
    tipo: 'derecho',
    articulo: 'Art. 5 Numeral 10',
    categoria: 'Debido Proceso',
    descripcion: 'Derecho a ser escuchado, presentar descargos, pruebas y contradicción ante cualquier investigación disciplinaria.',
    ejemploReal: 'Si eres citado a un comité de evaluación, tienes derecho a rendir tus explicaciones escritas o verbales y aportar pruebas.',
  },
  {
    numeral: '13',
    titulo: 'Protección ante Acoso, Violencia y Discriminación',
    tipo: 'derecho',
    articulo: 'Art. 5 Numeral 13',
    categoria: 'Bienestar e Inclusión',
    descripcion: 'Asesoría y activación de la ruta de atención por presunta vulneración de derechos, violencia o acoso (Ley 2365 de 2024).',
    ejemploReal: 'Acceso confidencial al equipo de Bienestar al Aprendiz y activación inmediata de protocolos de atención.',
  },
  {
    numeral: '15',
    titulo: 'Conocer Calificaciones en Máximo 8 Días Hábiles',
    tipo: 'derecho',
    articulo: 'Art. 5 Numeral 15',
    categoria: 'Evaluación',
    descripcion: 'Recibir evaluación objetiva y ser informado del resultado en máximo 8 días hábiles posteriores a la presentación.',
    ejemploReal: 'El instructor debe registrar la nota en el sistema dentro del término legal y retroalimentar tus evidencias.',
  },
  {
    numeral: '21',
    titulo: 'Representatividad Democrática',
    tipo: 'derecho',
    articulo: 'Art. 5 Numeral 21',
    categoria: 'Participación',
    descripcion: 'Elegir y ser elegido democráticamente como vocero de grupo, representante del centro o vocero poblacional.',
    ejemploReal: 'Postularte libremente en las elecciones anuales del mes de septiembre.',
  },
];

const ITEMS_DEBERES: ItemNorma[] = [
  {
    numeral: '5',
    titulo: 'Puntualidad y Asistencia Mínima del 80%',
    tipo: 'deber',
    articulo: 'Art. 8 Numeral 5',
    categoria: 'Asistencia y Compromiso',
    descripcion: 'Asistir con puntualidad a todas las actividades programadas en el cronograma de formación.',
    ejemploReal: 'Cumplir la jornada pactada. Acumular más del 20% de inasistencias injustificadas origina deserción.',
    consecuencia: 'Reporte de inasistencia, llamado de atención escrito o proceso de deserción.',
  },
  {
    numeral: '7',
    titulo: 'Justificación Oportuna de Inasistencias',
    tipo: 'deber',
    articulo: 'Art. 8 Numeral 7',
    categoria: 'Asistencia y Compromiso',
    descripcion: 'Presentar ante el instructor los soportes médicos o legales dentro de los 5 días hábiles siguientes.',
    ejemploReal: 'Entregar la incapacidad de la EPS o cita judicial oficial en el plazo establecido para excusar la falla.',
    consecuencia: 'La inasistencia no justificada a tiempo se considera falta o deserción.',
  },
  {
    numeral: '11',
    titulo: 'Cuidado de Infraestructura y Equipos SENA',
    tipo: 'deber',
    articulo: 'Art. 8 Numeral 11',
    categoria: 'Convivencia y Bienes',
    descripcion: 'Hacer uso responsable de laboratorios, maquinaria, muebles y ambientes virtuales sin causar deterioro o daño.',
    ejemploReal: 'Apagar correctamente los equipos de computó y mantener limpios los talleres de aprendizaje.',
    consecuencia: 'Obligación de reparación o reposición del bien y sanción disciplinaria.',
  },
  {
    numeral: '13',
    titulo: 'Autoría Personal en Evidencias y Trabajos',
    tipo: 'deber',
    articulo: 'Art. 8 Numeral 13',
    categoria: 'Académico',
    descripcion: 'Realizar personalmente las evaluaciones, investigaciones y evidencias haciendo uso de conocimientos y esfuerzo propio.',
    ejemploReal: 'Redactar tus propios informes y citar adecuadamente las fuentes bibliográficas.',
    consecuencia: 'Presentar trabajos ajenos o plagio genera falta grave con proceso en comité.',
  },
  {
    numeral: '15',
    titulo: 'Uso Obligatorio de Elementos de Protección Personal (EPP)',
    tipo: 'deber',
    articulo: 'Art. 8 Numeral 15',
    categoria: 'SST y Seguridad',
    descripcion: 'Usar obligatoriamente y promover los EPP requeridos en las prácticas en ambientes de formación.',
    ejemploReal: 'Ingresar a los talleres de mecánica con botas de puntera y gafas protectoras puestas.',
    consecuencia: 'Suspensión del ingreso a la práctica de laboratorio por riesgo a la salud.',
  },
  {
    numeral: '20',
    titulo: 'Porte del Uniforme e Identificación',
    tipo: 'deber',
    articulo: 'Art. 8 Numeral 20',
    categoria: 'Convivencia',
    descripcion: 'Portar el carné visible y las prendas distintivas asociadas a la especialidad durante la formación.',
    ejemploReal: 'Llevar el carné institucional colgado para el ingreso a la sede presencial.',
    consecuencia: 'Restricción del acceso a las instalaciones por seguridad.',
  },
];

const ITEMS_PROHIBICIONES: ItemNorma[] = [
  {
    numeral: '1',
    titulo: 'Suministrar Información o Documentos Falsos',
    tipo: 'prohibicion',
    articulo: 'Art. 9 Numeral 1',
    categoria: 'Sanciones Graves',
    descripcion: 'Aportar datos falsos en matrícula, postulación a subsidios de sostenimiento o certificación.',
    ejemploReal: 'Presentar un certificado médico o un diploma adulterado para ingresar al programa.',
    consecuencia: 'Falta gravísima que anula la matrícula e invalida el trámite.',
  },
  {
    numeral: '2',
    titulo: 'Suplantación de Identidad',
    tipo: 'prohibicion',
    articulo: 'Art. 9 Numeral 2',
    categoria: 'Sanciones Graves',
    descripcion: 'Suplantar a otra persona o permitir ser suplantado en evaluaciones o plataformas virtuales.',
    ejemploReal: 'Prestar tu usuario de Sofía Plus para que otra persona realice un examen en tu lugar.',
    consecuencia: 'Cancelación inmediata de matrícula para los involucrados.',
  },
  {
    numeral: '4',
    titulo: 'Plagio de Trabajos y Evidencias',
    tipo: 'prohibicion',
    articulo: 'Art. 9 Numeral 4',
    categoria: 'Académico',
    descripcion: 'Copiar parcialmente o totalmente trabajos, investigaciones o guías desarrolladas por otros compañeros o de internet.',
    ejemploReal: 'Descargar un proyecto completo de internet y colocarle tu nombre para entregarlo al instructor.',
    consecuencia: 'Evaluación Reprobada (D) y proceso disciplinario en Comité.',
  },
  {
    numeral: '6',
    titulo: 'Alcohol y Sustancias Psicoactivas',
    tipo: 'prohibicion',
    articulo: 'Art. 9 Numeral 6',
    categoria: 'Sanciones Gravísimas',
    descripcion: 'Ingresar, comercializar o consumir bebidas alcohólicas o alucinógenos en sedes SENA o bajo sus efectos.',
    ejemploReal: 'Asistir al centro de formación en estado de embriaguez o consumir drogas en las zonas comunes.',
    consecuencia: 'Falta gravísima con expulsión inmediata y cancelación de matrícula.',
  },
  {
    numeral: '7',
    titulo: 'Porte de Armas u Objetos Cortopunzantes',
    tipo: 'prohibicion',
    articulo: 'Art. 9 Numeral 7',
    categoria: 'Sanciones Gravísimas',
    descripcion: 'Portar cualquier clase de arma de fuego, explosivo u objeto cortopunzante que ponga en peligro la vida.',
    ejemploReal: 'Llevar navajas u objetos peligrosos que no corresponden a insumos autorizados del programa.',
    consecuencia: 'Sanción disciplinaria expedita y entrega a las autoridades de policía.',
  },
  {
    numeral: '14',
    titulo: 'Discriminación e Intolerancia',
    tipo: 'prohibicion',
    articulo: 'Art. 9 Numeral 14',
    categoria: 'Convivencia',
    descripcion: 'Agredir o discriminar por sexo, etnia, religión, género, orientación sexual, discapacidad o política.',
    ejemploReal: 'Realizar burlas o ciberacoso dirigido a un compañero por su orientación sexual o condición étnica.',
    consecuencia: 'Comité interdisciplinario y sanción por faltas graves a la convivencia.',
  },
];

const CASOS_SIMULADOR = [
  {
    id: 1,
    situacion: 'Mateo no usó las gafas ni las botas dieléctricas en el taller de electricidad a pesar del aviso del instructor.',
    pregunta: '¿A qué categoría corresponde este comportamiento?',
    opciones: [
      { texto: 'Un Derecho del aprendiz', esCorrecta: false },
      { texto: 'Incumplimiento del Deber de usar los EPP (Art. 8 Num. 15)', esCorrecta: true },
      { texto: 'Una Prohibición gravísima de tipo penal', esCorrecta: false },
    ],
    explicacion: 'El Art. 8 Numeral 15 exige el uso obligatorio de los Elementos de Protección Personal (EPP) para cuidar la integridad en ambientes de práctica.',
  },
  {
    id: 2,
    situacion: 'Sofía fue evaluada en su evidencia pero pasaron 12 días hábiles y el instructor aún no registra ni publica la calificación en Sofía Plus.',
    pregunta: '¿Qué norma ampara a Sofía en esta situación?',
    opciones: [
      { texto: 'Derecho a conocer la evaluación en máximo 8 días hábiles (Art. 5 Num. 15)', esCorrecta: true },
      { texto: 'Prohibición de consultar notas al instructor', esCorrecta: false },
      { texto: 'Deber de esperar hasta el final del año sin reclamar', esCorrecta: false },
    ],
    explicacion: 'El Art. 5 Numeral 15 del Acuerdo 009 de 2024 otorga al aprendiz el derecho de recibir su resultado en máximo 8 días hábiles.',
  },
  {
    id: 3,
    situacion: 'Un aprendiz trajo cerveza en su maleta y la compartió con amigos en la cafetería del Centro.',
    pregunta: '¿Cuál es la consecuencia normativa de este hecho?',
    opciones: [
      { texto: 'Un simple llamado de atención verbal sin registro', esCorrecta: false },
      { texto: 'Violación de la Prohibición del Art. 9 Numeral 6 (Falta Gravísima y Cancelación de Matrícula)', esCorrecta: true },
      { texto: 'Derecho a consumir bebidas en horarios de descanso', esCorrecta: false },
    ],
    explicacion: 'El consumo o ingreso de bebidas alcohólicas o sustancias alucinógenas está prohibido expresamente en el Art. 9 Num. 6 y es falta gravísima.',
  },
  {
    id: 4,
    situacion: 'Carlos faltó 4 días continuos por enfermedad sin avisar a su EPS ni solicitar incapacidad médica.',
    pregunta: '¿Qué situación administrativa se genera?',
    opciones: [
      { texto: 'Se le aprueba la formación de todas formas', esCorrecta: false },
      { texto: 'Configura deserción por tener 3 o más días continuos de inasistencia injustificada (Art. 30)', esCorrecta: true },
      { texto: 'Se le concede aplazamiento automático por 1 año', esCorrecta: false },
    ],
    explicacion: 'El Art. 30 establece que 3 días continuos o 5 días no continuos de inasistencia injustificada se consideran deserción del programa.',
  },
];

export const CapacitacionReglamentoPage: React.FC<CapacitacionPageProps> = ({ onNavigate }) => {
  const [tab, setTab] = useState<'derechos' | 'deberes' | 'prohibiciones' | 'simulador'>('derechos');
  const [busqueda, setBusqueda] = useState('');
  const [casoActual, setCasoActual] = useState(0);
  const [respSeleccionada, setRespSeleccionada] = useState<number | null>(null);
  const [puntosSimulador, setPuntosSimulador] = useState(0);

  const getListaActual = (): ItemNorma[] => {
    let lista: ItemNorma[] = [];
    if (tab === 'derechos') lista = ITEMS_DERECHOS;
    if (tab === 'deberes') lista = ITEMS_DEBERES;
    if (tab === 'prohibiciones') lista = ITEMS_PROHIBICIONES;

    if (!busqueda.trim()) return lista;
    return lista.filter(
      (item) =>
        item.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.articulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  const responderCaso = (indexOpcion: number) => {
    setRespSeleccionada(indexOpcion);
    if (CASOS_SIMULADOR[casoActual].opciones[indexOpcion].esCorrecta) {
      setPuntosSimulador((prev) => prev + 25);
    }
  };

  const siguienteCaso = () => {
    setRespSeleccionada(null);
    if (casoActual < CASOS_SIMULADOR.length - 1) {
      setCasoActual((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => onNavigate('/dashboard')} className="flex items-center gap-3 text-left">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
              style={{ backgroundColor: '#39a935' }}
            >
              S
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg block">Capacitación de Reglamento</span>
              <span className="text-xs text-slate-500 font-medium">Acuerdo 009 de 2024 SENA</span>
            </div>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section
        className="py-10 px-6 text-white text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #00304d 0%, #007832 100%)' }}
      >
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="inline-block bg-white/20 text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20">
            Módulo Interactivo
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Derechos, Deberes y Prohibiciones
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Conoce de manera clara e intuitiva tus garantías institucionales, obligaciones académicas y las conductas no permitidas en el SENA.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTab('derechos')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center space-x-2 ${
                tab === 'derechos'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>📜</span>
              <span>Derechos (Art. 5)</span>
            </button>

            <button
              onClick={() => setTab('deberes')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center space-x-2 ${
                tab === 'deberes'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>✍️</span>
              <span>Deberes (Art. 8)</span>
            </button>

            <button
              onClick={() => setTab('prohibiciones')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center space-x-2 ${
                tab === 'prohibiciones'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🚫</span>
              <span>Prohibiciones (Art. 9)</span>
            </button>

            <button
              onClick={() => setTab('simulador')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center space-x-2 ${
                tab === 'simulador'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>💡</span>
              <span>Simulador de Casos</span>
            </button>
          </div>

          {tab !== 'simulador' && (
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar artículo o tema..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>

        {/* Tab Content Cards */}
        {tab !== 'simulador' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {getListaActual().map((item) => (
              <div
                key={item.numeral}
                className={`card border-l-4 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between ${
                  item.tipo === 'derecho'
                    ? 'border-emerald-500 bg-white'
                    : item.tipo === 'deber'
                    ? 'border-blue-500 bg-white'
                    : 'border-rose-500 bg-white'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        item.tipo === 'derecho'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.tipo === 'deber'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.articulo}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{item.categoria}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {item.numeral}. {item.titulo}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">{item.descripcion}</p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">💡 Situación en el SENA:</span>
                    <p className="text-slate-600 italic">{item.ejemploReal}</p>
                  </div>
                </div>

                {item.consecuencia && (
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-rose-700 font-semibold flex items-center space-x-1">
                    <span>⚠️ Consecuencia: {item.consecuencia}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Interactive Scenario Simulator */
          <div className="max-w-2xl mx-auto card shadow-xl border border-slate-200 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Caso {casoActual + 1} de {CASOS_SIMULADOR.length}
                </span>
                <h2 className="text-lg font-bold text-slate-900">Simulador de Situaciones Reales</h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500">Puntaje</span>
                <p className="text-xl font-extrabold text-green-700">{puntosSimulador} pts</p>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold uppercase text-amber-800 tracking-wider">
                Situación en el ambiente SENA:
              </span>
              <p className="text-slate-900 font-medium text-base leading-relaxed">
                "{CASOS_SIMULADOR[casoActual].situacion}"
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase text-slate-500">
                {CASOS_SIMULADOR[casoActual].pregunta}
              </p>

              {CASOS_SIMULADOR[casoActual].opciones.map((opcion, idx) => {
                const esSeleccionada = respSeleccionada === idx;
                let estilo = 'border-slate-200 hover:border-slate-300 bg-white';
                if (respSeleccionada !== null) {
                  if (opcion.esCorrecta) {
                    estilo = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                  } else if (esSeleccionada) {
                    estilo = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={respSeleccionada !== null}
                    onClick={() => responderCaso(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm leading-snug flex items-center justify-between ${estilo}`}
                  >
                    <span>{opcion.texto}</span>
                    {respSeleccionada !== null && opcion.esCorrecta && (
                      <span className="text-emerald-600 font-bold text-lg">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {respSeleccionada !== null && (
              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-300 space-y-3">
                <div className="text-xs text-slate-800">
                  <strong className="text-slate-900 block mb-1">Explicación del Acuerdo 009 de 2024:</strong>
                  {CASOS_SIMULADOR[casoActual].explicacion}
                </div>

                {casoActual < CASOS_SIMULADOR.length - 1 ? (
                  <button
                    onClick={siguienteCaso}
                    className="btn-sena w-full justify-center text-sm font-bold py-3"
                  >
                    Siguiente Caso →
                  </button>
                ) : (
                  <div className="text-center pt-2">
                    <p className="text-base font-bold text-slate-900">
                      ¡Has completado la capacitación interactiva! 🎉
                    </p>
                    <p className="text-xs text-slate-600 mt-1 mb-4">
                      Puntaje final acumulado: {puntosSimulador} / 100 puntos.
                    </p>
                    <button
                      onClick={() => onNavigate('/dashboard')}
                      className="btn-sena inline-flex text-sm"
                    >
                      Ir al Dashboard e Iniciar Evaluación
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
