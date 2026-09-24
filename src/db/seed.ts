import { db } from './index.ts';
import {
  regionales,
  modulos,
  secciones,
  preguntas,
  reglamentoArticulos,
  aprendices,
  progreso,
  evaluaciones,
} from './schema.ts';

// Seed de Regionales del SENA
const regionalesData = [
  {
    nombre: 'SENA Regional Antioquia',
    departamento: 'Antioquia',
    descripcion:
      'Regional líder en formación técnica y tecnológica del occidente colombiano. Atiende los 125 municipios del departamento.',
    director: 'Jaime Tobón Villa',
    contacto: 'antioquia@sena.edu.co',
    programasDestacados: [
      'Tecnología en Gestión Logística',
      'Técnico en Programación de Software',
      'Tecnología en Análisis y Desarrollo de Software',
    ],
  },
  {
    nombre: 'SENA Regional Bogotá',
    departamento: 'Bogotá D.C.',
    descripcion:
      'La regional con mayor oferta de programas en el país. Centro neurálgico de formación para la capital y municipios cercanos.',
    director: 'Orlando Salinas Trespalacios',
    contacto: 'bogota@sena.edu.co',
    programasDestacados: [
      'Tecnología en Producción de Audio',
      'Técnico en Cocina',
      'Tecnología en Gestión de Mercados',
    ],
  },
  {
    nombre: 'SENA Regional Valle del Cauca',
    departamento: 'Valle del Cauca',
    descripcion:
      'Regional con enfoque agroindustrial y tecnológico, ubicada en el Pacífico colombiano.',
    director: 'Adriana Solarte López',
    contacto: 'valle@sena.edu.co',
    programasDestacados: [
      'Tecnología en Producción Agropecuaria Ecológica',
      'Técnico en Mecánica Diesel',
      'Tecnología en Desarrollo de Software',
    ],
  },
  {
    nombre: 'SENA Regional Atlántico',
    departamento: 'Atlántico',
    descripcion:
      'Sede del Caribe colombiano con fuerte formación en industria, logística portuaria y servicios.',
    director: 'Jacqueline Rojas Solano',
    contacto: 'atlantico@sena.edu.co',
    programasDestacados: [
      'Técnico en Mantenimiento Electrónico',
      'Tecnología en Gestión Logística',
      'Técnico en Soldadura',
    ],
  },
  {
    nombre: 'SENA Regional Santander',
    departamento: 'Santander',
    descripcion:
      'Reconocida por su formación en calzado, petróleos y desarrollo empresarial del nororiente colombiano.',
    director: 'Dionisio Vélez Lerma',
    contacto: 'santander@sena.edu.co',
    programasDestacados: [
      'Técnico en Diseño y Fabricación de Calzado',
      'Tecnología en Mantenimiento Mecatrónico',
      'Técnico en Servicios Farmacéuticos',
    ],
  },
];

// Seed de Módulos
const modulosData = [
  {
    slug: 'conocer-sena',
    titulo: 'Conocer el SENA',
    descripcion:
      'Historia, misión, valores, estructura organizacional y plataforma Sofía Plus.',
    orden: 1,
    obligatorio: true,
    icono: '🏛️',
  },
  {
    slug: 'regionales',
    titulo: 'Regionales y Centros de Formación',
    descripcion:
      'Cobertura nacional, regionales, centros de formación y cómo encontrar el tuyo.',
    orden: 2,
    obligatorio: true,
    icono: '🗺️',
  },
  {
    slug: 'reglamento',
    titulo: 'Reglamento del Aprendiz (Acuerdo 009 de 2024)',
    descripcion:
      'Derechos (Art. 5), Deberes (Art. 8), Prohibiciones (Art. 9), Faltas y Procedimientos Sancionatorios.',
    orden: 3,
    obligatorio: true,
    icono: '📜',
  },
];

// Seed de Secciones por módulo
const seccionesData = [
  // Conocer el SENA
  {
    moduloSlug: 'conocer-sena',
    titulo: 'Misión y Visión Institucional',
    contenido:
      'El SENA es una entidad pública colombiana que ofrece formación técnica, tecnológica y complementaria. Su misión es contribuir al desarrollo social, económico y tecnológico del país mediante la formación profesional integral.',
    puntosClave: [
      'Formación gratuita para todos los colombianos',
      'Más de 33 regionales en todo el territorio nacional',
      'Más de 200 centros de formación profesional',
      'Convenios con empresas nacionales e internacionales',
    ],
    orden: 1,
  },
  {
    moduloSlug: 'conocer-sena',
    titulo: 'Valores Institucionales',
    contenido:
      'Los valores del SENA rigen el comportamiento de aprendices, instructores y funcionarios: Respeto, Responsabilidad, Honradez, Solidaridad y Trabajo en Equipo.',
    puntosClave: [
      'Respeto: trato digno y libre de discriminación',
      'Responsabilidad: cumplimiento ético de deberes',
      'Honestidad: actuar con transparencia y veracidad',
      'Solidaridad: vocación de servicio a la comunidad',
    ],
    orden: 2,
  },
  {
    moduloSlug: 'conocer-sena',
    titulo: 'Plataforma Sofía Plus y LMS',
    contenido:
      'Sofía Plus y el LMS institucional son los canales oficiales para gestionar la matrícula, consultar horarios, presentar evidencias de aprendizaje y descargar certificados.',
    puntosClave: [
      'Ingreso con credenciales personales e intransferibles',
      'Registro continuo de evidencias y actividades',
      'Descarga de certificados oficiales con código de verificación',
    ],
    orden: 3,
  },
  // Regionales
  {
    moduloSlug: 'regionales',
    titulo: 'Organización Territorial del SENA',
    contenido:
      'El SENA opera a través de 33 regionales departamentales que agrupan los centros de formación técnica y tecnológica del país.',
    puntosClave: [
      '33 regionales departamentales',
      'Centros de formación especializados por sector',
      'Atención presencial, virtual y a distancia',
    ],
    orden: 1,
  },
  {
    moduloSlug: 'regionales',
    titulo: 'Bienestar al Aprendiz y Apoyos',
    contenido:
      'El Plan Nacional de Bienestar al Aprendiz ofrece servicios de salud, deporte, cultura, apoyo psicosocial y apoyos socioeconómicos de sostenimiento.',
    puntosClave: [
      'Acompañamiento psicológico y social',
      'Estrategias deportivas, artísticas y culturales',
      'Subsidios y apoyos de alimentación y transporte',
    ],
    orden: 2,
  },
  // Reglamento Acuerdo 009 de 2024
  {
    moduloSlug: 'reglamento',
    titulo: 'Marco Legal: Acuerdo 009 de 2024',
    contenido:
      'Adopta el Reglamento del Aprendiz SENA mediante el Acuerdo 009 de 2024. Garantiza el debido proceso, la inclusión con enfoque diferencial y rutas para la prevención de acoso sexual y discriminación (Ley 2365 de 2024).',
    puntosClave: [
      'Normativa vigente aplicable a todas las modalidades',
      'Derechos, deberes y prohibiciones expresas',
      'Límites de inasistencias y causales de deserción',
      'Garantía del debido proceso y comités disciplinarios',
    ],
    orden: 1,
  },
  {
    moduloSlug: 'reglamento',
    titulo: 'Derechos del Aprendiz (Artículo 5)',
    contenido:
      'El Acuerdo 009 de 2024 consagra 24 derechos del aprendiz SENA, destacando la inducción oportuna, la formación de calidad, los elementos de protección personal, el debido proceso y la libertad de expresión respetuosa.',
    puntosClave: [
      'Recibir inducción y formación de calidad',
      'Contar con recursos e infraestructura adecuada',
      'Protección contra acoso, violencia y discriminación',
      'Conocer los resultados de evaluaciones en máximo 8 días hábiles',
    ],
    orden: 2,
  },
  {
    moduloSlug: 'reglamento',
    titulo: 'Deberes del Aprendiz (Artículo 8)',
    contenido:
      'Contempla 24 obligaciones esenciales: suscribir el acta de compromiso, cumplir con la asistencia mínima del 80%, entregar evidencias a tiempo, portar carné/uniforme y usar obligatoriamente los EPP en ambientes prácticos.',
    puntosClave: [
      'Asistencia mínima obligatoria del 80%',
      'Uso correcto y obligatorio de los EPP e higiene laboral',
      'Veracidad en los datos y documentos aportados',
      'Cuidado del mobiliario e infraestructura institucional',
    ],
    orden: 3,
  },
  {
    moduloSlug: 'reglamento',
    titulo: 'Prohibiciones y Faltas (Artículos 9, 41 y 47)',
    contenido:
      'Las 14 prohibiciones incluyen: aportar información falsa, suplantar identidad, plagio de trabajos, consumo o ingreso de sustancias psicoactivas o alcohol, portar armas, violencia o vandalismo. Su vulneración constituye falta disciplinaria que puede acarrear la cancelación de la matrícula.',
    puntosClave: [
      'Prohibición total de sustancias psicoactivas y alcohol',
      'Cero tolerancia al plagio y la suplantación',
      'Prohibición de armas y actos de violencia o discriminación',
      'Cancelación de matrícula e inhabilitación por 6 meses ante faltas gravísimas',
    ],
    orden: 4,
  },
];

// Seed del Reglamento (artículos del Acuerdo 009)
const reglamentoData = [
  {
    numero: 'Art. 5 Num. 1',
    titulo: 'Derecho a Inducción Institucional',
    categoria: 'derecho',
    contenido:
      'Recibir una inducción que le permita conocer el reglamento del aprendiz, bienestar al aprendiz, la organización de la entidad y requisitos de certificación.',
    consecuencia: null,
    aplicaPara: ['nuevo', 'antiguo', 'reingreso'],
    orden: 1,
  },
  {
    numero: 'Art. 5 Num. 15',
    titulo: 'Derecho a Evaluación Objetiva y Oportuna',
    categoria: 'derecho',
    contenido:
      'Ser evaluado objetiva e integralmente y conocer los resultados de las evaluaciones dentro de los ocho (8) días hábiles siguientes a su realización.',
    consecuencia: null,
    aplicaPara: ['nuevo', 'antiguo', 'reingreso'],
    orden: 2,
  },
  {
    numero: 'Art. 5 Num. 13',
    titulo: 'Ruta de Atención ante Acoso y Violencia',
    categoria: 'derecho',
    contenido:
      'Recibir asesoría y activar rutas de atención ante vulneración de derechos, acoso sexual, trato degradante o actos inmorales según protocolo institucional (Ley 2365 de 2024).',
    consecuencia: null,
    aplicaPara: ['nuevo', 'antiguo', 'reingreso'],
    orden: 3,
  },
  {
    numero: 'Art. 8 Num. 5',
    titulo: 'Deber de Puntualidad y Asistencia (80%)',
    categoria: 'deber',
    contenido:
      'Asistir con puntualidad a todas las actividades programadas en su proceso de formación. La asistencia mínima obligatoria es del 80% para conservar la calidad de aprendiz.',
    consecuencia:
      'Inasistencias superiores al 20% injustificadas generan llamado de atención o reporte de deserción.',
    aplicaPara: ['nuevo', 'antiguo', 'reingreso'],
    orden: 4,
  },
  {
    numero: 'Art. 8 Num. 15',
    titulo: 'Deber de Uso de Elementos de Protección Personal (EPP)',
    categoria: 'deber',
    contenido:
      'Usar apropiadamente y promover el uso de los elementos de protección personal que correspondan a su especialidad aplicándolas buenas prácticas de SST.',
    consecuencia:
      'Sanciones por poner en riesgo la integridad propia o la de sus compañeros en talleres y laboratorios.',
    aplicaPara: ['nuevo', 'antiguo', 'reingreso'],
    orden: 5,
  },
  {
    numero: 'Art. 8 Num. 13',
    titulo: 'Deber de Autoria Personal en Evaluaciones',
    categoria: 'deber',
    contenido:
      'Realizar personalmente las evaluaciones, actividades e investigaciones haciendo uso de sus conocimientos y autoría propia.',
    consecuencia: 'Plagiar o presentar trabajos ajenos constituye falta grave o gravísima.',
    aplicaPara: ['nuevo', 'antiguo', 'reingreso'],
    orden: 6,
  },
  {
    numero: 'Art. 9 Num. 6',
    titulo: 'Prohibición de Alcohol y Sustancias Psicoactivas',
    categoria: 'prohibicion',
    contenido:
      'Ingresar, ingerir, comercializar, promocionar o suministrar bebidas alcohólicas o sustancias psicoactivas en instalaciones físicas o virtuales del SENA o ingresar bajo sus efectos.',
    consecuencia:
      'Falta gravísima que origina procedimiento disciplinario e inminente cancelación de matrícula.',
    aplicaPara: ['nuevo', 'antiguo', 'reingreso'],
    orden: 7,
  },
  {
    numero: 'Art. 9 Num. 7',
    titulo: 'Prohibición de Armas y Objetos Cortopunzantes',
    categoria: 'prohibicion',
    contenido:
      'Ingresar o portar cualquier tipo de armas, objetos cortopunzantes, explosivos u objetos que representen riesgo para la vida o integridad física.',
    consecuencia: 'Falta gravísima con reporte inmediato a autoridades competentes y cancelación de matrícula.',
    aplicaPara: ['nuevo', 'antiguo', 'reingreso'],
    orden: 8,
  },
  {
    numero: 'Art. 9 Num. 14',
    titulo: 'Prohibición de Discriminación',
    categoria: 'prohibicion',
    contenido:
      'Discriminar a cualquier miembro de la comunidad SENA por condiciones de sexo, nacionalidad, etnia, religión, identidad de género, orientación sexual o discapacidad.',
    consecuencia: 'Falta grave o gravísima susceptible de sanción disciplinaria.',
    aplicaPara: ['nuevo', 'antiguo', 'reingreso'],
    orden: 9,
  }
];

// Banco Ampliado de Preguntas de Evaluación
const preguntasData = [
  // Conocer el SENA
  {
    moduloSlug: 'conocer-sena',
    enunciado: '¿Cuál es la plataforma oficial del SENA para la gestión de matrículas, evidencias y certificados?',
    opciones: ['Sofía Plus', 'Moodle Libre', 'Plataforma SAVIA', 'Aulas Territorio'],
    respuestaCorrecta: 0,
    explicacion: 'Sofía Plus es el sistema académico oficial donde gestionas matrícula, registro de calificaciones y certificados oficiales.',
  },
  {
    moduloSlug: 'conocer-sena',
    enunciado: '¿Cuál es la misión principal del Servicio Nacional de Aprendizaje - SENA?',
    opciones: [
      'Ofrecer títulos universitarios de posgrado exclusivamente',
      'Invertir en el desarrollo social y técnico de los trabajadores colombianos mediante la formación profesional integral',
      'Cobrar matrículas a estudiantes de educación superior',
      'Administrar únicamente bolsas de empleo privadas'
    ],
    respuestaCorrecta: 1,
    explicacion: 'La misión del SENA es contribuir al desarrollo social, económico y tecnológico del país mediante la formación profesional integral gratuita.',
  },
  {
    moduloSlug: 'conocer-sena',
    enunciado: '¿Cuáles de los siguientes son valores institucionales del SENA?',
    opciones: [
      'Individualismo, Lucro y Competencia desleal',
      'Respeto, Responsabilidad, Honradez, Solidaridad y Trabajo en Equipo',
      'Exclusividad, Secreto y Tolerancia cero',
      'Burocracia, Jerarquía estricta e Inflexibilidad'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Los valores éticos fundamentales del SENA guían el comportamiento de aprendices, instructores y funcionarios en la comunidad educativa.',
  },

  // Regionales
  {
    moduloSlug: 'regionales',
    enunciado: '¿En cuántas regionales se organiza territorialmente el SENA en Colombia?',
    opciones: ['10 regionales', '20 regionales', '33 regionales', '50 regionales'],
    respuestaCorrecta: 2,
    explicacion: 'El SENA cuenta con 33 regionales que abarcan todos los departamentos del territorio colombiano.',
  },
  {
    moduloSlug: 'regionales',
    enunciado: '¿Qué beneficios ofrece el Plan Nacional de Bienestar al Aprendiz en los centros de formación?',
    opciones: [
      'Préstamos bancarios con intereses',
      'Servicios de salud, apoyo psicosocial, actividades deportivas, culturales y apoyos de sostenimiento',
      'Venta de uniformes de marcas de lujo',
      'Exención de evaluaciones académicas'
    ],
    respuestaCorrecta: 1,
    explicacion: 'El Plan Nacional de Bienestar al Aprendiz promueve la permanencia mediante acompañamiento integral, cultura, deporte y apoyos socioeconómicos.',
  },

  // Reglamento (Acuerdo 009 de 2024)
  {
    moduloSlug: 'reglamento',
    enunciado: 'Según el Acuerdo 009 de 2024, ¿cuál es el porcentaje de asistencia mínima obligatoria a la formación presencial?',
    opciones: ['60%', '70%', '80%', '95%'],
    respuestaCorrecta: 2,
    explicacion: 'El Art. 8 Numeral 5 establece que la asistencia mínima obligatoria es del 80% para conservar la calidad de aprendiz.',
  },
  {
    moduloSlug: 'reglamento',
    enunciado: 'Un aprendiz se presenta al Centro de Formación bajo los efectos del alcohol o sustancias psicoactivas. Según el Art. 9 Numeral 6, ¿qué tipo de falta comete?',
    opciones: [
      'Una falta leve con recomendación verbal',
      'Una falta académica corregible con un trabajo extra',
      'Una falta gravísima que origina proceso disciplinario e inminente cancelación de matrícula',
      'Una conducta permitida si no interrumpe la clase'
    ],
    respuestaCorrecta: 2,
    explicacion: 'Ingresar o estar bajo los efectos del alcohol o sustancias psicoactivas es una prohibición expresa (Art. 9 Num. 6) catalogada como falta gravísima.',
  },
  {
    moduloSlug: 'reglamento',
    enunciado: '¿En qué plazo máximo debe un instructor publicar o informar los resultados de una evaluación a los aprendices?',
    opciones: ['2 días hábiles', '8 días hábiles', '15 días calendario', '30 días hábiles'],
    respuestaCorrecta: 1,
    explicacion: 'El Art. 5 Numeral 15 garantiza al aprendiz conocer los resultados de las evaluaciones dentro de los ocho (8) días hábiles siguientes a su realización.',
  },
  {
    moduloSlug: 'reglamento',
    enunciado: 'Si un aprendiz falta a la formación por motivos de incapacidad médica de 3 días, ¿cuántos días hábiles tiene para presentar el soporte al instructor?',
    opciones: ['Al instante', 'Dentro de los 5 días hábiles siguientes a la ocurrencia', 'Al finalizar el trimestre', '30 días calendario'],
    respuestaCorrecta: 1,
    explicacion: 'El Art. 8 Numeral 7 y Art. 28 establecen que la justificación con soportes debe presentarse dentro de los 5 días hábiles siguientes.',
  },
  {
    moduloSlug: 'reglamento',
    enunciado: 'En la formación presencial, ¿cuándo se configura la Deserción por Inasistencia segun el Acuerdo 009 de 2024 (Art. 30)?',
    opciones: [
      'Al faltar a una sola clase',
      'Al tener 3 días continuos de inasistencia injustificada o acumular 5 días no continuos injustificados',
      'Al llegar 10 minutos tarde dos veces',
      'Al no solicitar carné institucional'
    ],
    respuestaCorrecta: 1,
    explicacion: 'El Art. 30 establece que la deserción por inasistencia se configura con 3 días continuos o 5 días no continuos de inasistencia injustificada.',
  },
  {
    moduloSlug: 'reglamento',
    enunciado: '¿Qué ocurre en la modalidad virtual si un aprendiz no ingresa al ambiente virtual de aprendizaje (LMS)?',
    opciones: [
      'No sucede nada mientras entregue el proyecto al final',
      'Se configura deserción si no ingresa durante 20 días consecutivos o falta a 3 citaciones continuas sin excusa',
      'Se le cobra una multa económica',
      'Se le cambia automáticamente a modalidad presencial'
    ],
    respuestaCorrecta: 1,
    explicacion: 'En modalidad virtual, no ingresar durante 20 días consecutivos o faltar a 3 citaciones del instructor sin justificación constituye causal de deserción (Art. 30).',
  },
  {
    moduloSlug: 'reglamento',
    enunciado: 'Un aprendiz copia un trabajo de investigación de un compañero y lo presenta como propio. ¿Qué deber o prohibición ha vulnerado?',
    opciones: [
      'Cumplió con el deber de trabajo en equipo',
      'Vulneró el Deber de Autoría Personal (Art. 8 Num. 13) e incurrió en la Prohibición de Plagio (Art. 9 Num. 4)',
      'Solo cometió una falta leve sin trascendencia',
      'No vulneró nada si mencionó el nombre de su compañero en letra pequeña'
    ],
    respuestaCorrecta: 1,
    explicacion: 'El plagio y la suplantación de autoría constituyen faltas disciplinarias graves o gravísimas violando el Art. 8 Num. 13 y Art. 9 Num. 4.',
  },
  {
    moduloSlug: 'reglamento',
    enunciado: '¿Cuál es la consecuencia de la Cancelación de Matrícula por sanción disciplinaria en programas laborales o tecnológicos?',
    opciones: [
      'El aprendiz puede matricularse al día siguiente en otro centro',
      'El aprendiz queda retirado del programa e inhabilitado para ingresar al SENA por seis (6) meses',
      'Se le suspende únicamente por una semana',
      'Debe pagar una penalidad en dinero'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Según el Art. 47 Parágrafo 2, la cancelación de matrícula sancionatoria implica el retiro e inhabilitación para presentarse por 6 meses.',
  },
  {
    moduloSlug: 'reglamento',
    enunciado: '¿Qué norma rige actualmente el Reglamento del Aprendiz SENA en todo el territorio nacional?',
    opciones: [
      'Normativa anterior derogada',
      'Acuerdo 009 de 2024 expedido por el Consejo Directivo Nacional del SENA',
      'Decreto 1075 de 2015',
      'Ley 30 de 1992'
    ],
    respuestaCorrecta: 1,
    explicacion: 'El Acuerdo 009 del 5 de noviembre de 2024 adopta el Reglamento del Aprendiz SENA vigente en todo el territorio nacional.',
  },
  {
    moduloSlug: 'reglamento',
    enunciado: '¿Qué norma ratifica la protección de los aprendices contra el acoso sexual, discriminación y violencia en instituciones de educación en Colombia?',
    opciones: ['Ley 2365 de 2024 y Art. 5 Numeral 13 del Reglamento (Acuerdo 009 de 2024)', 'Ley 100 de 1993', 'Decreto 007 de 2010', 'Acuerdo de Transporte 2018'],
    respuestaCorrecta: 0,
    explicacion: 'La Ley 2365 de 2024 y el Art. 5 Numeral 13 del Acuerdo 009 de 2024 consagran la ruta obligatoria de atención institucional ante acoso, violencia o trato degradante.',
  }
];

export async function seed() {
  try {
    // 1. Insertar o refrescar regionales
    const regionalesCreadas = await db
      .insert(regionales)
      .values(regionalesData)
      .returning();

    // 2. Insertar módulos
    const modulosCreados = await db
      .insert(modulos)
      .values(modulosData)
      .returning();

    const modulosMap = new Map(modulosCreados.map((m) => [m.slug, m.id]));

    // 3. Insertar secciones
    await db.insert(secciones).values(
      seccionesData.map((s) => ({
        moduloId: modulosMap.get(s.moduloSlug)!,
        titulo: s.titulo,
        contenido: s.contenido,
        puntosClave: s.puntosClave,
        orden: s.orden,
      }))
    );

    // 4. Insertar banco amplio de preguntas
    await db.insert(preguntas).values(
      preguntasData.map((p, idx) => ({
        moduloId: modulosMap.get(p.moduloSlug)!,
        enunciado: p.enunciado,
        opciones: p.opciones,
        respuestaCorrecta: p.respuestaCorrecta,
        explicacion: p.explicacion,
        orden: idx + 1,
      }))
    );

    // 5. Insertar artículos del reglamento
    await db.insert(reglamentoArticulos).values(reglamentoData);

    // 6. Insertar aprendices de prueba iniciales para alimentar el panel administrativo con indicadores reales
    if (regionalesCreadas.length > 0) {
      const regId1 = regionalesCreadas[0].id;
      const regId2 = regionalesCreadas[1]?.id || regId1;

      const demoAprendices = await db
        .insert(aprendices)
        .values([
          {
            documento: '1012345678',
            nombreCompleto: 'Carlos Eduardo Ramírez',
            correo: 'carlos.ramirez@soy.sena.edu.co',
            telefono: '3109876543',
            perfil: 'nuevo',
            modalidad: 'presencial',
            nivel: 'tecnologo',
            programa: 'Análisis y Desarrollo de Software',
            ficha: '2876541',
            regionalId: regId1,
            expectativas: 'Aprender desarrollo web y bases de datos relacionales.',
          },
          {
            documento: '1023456789',
            nombreCompleto: 'María Fernanda Gómez',
            correo: 'mf.gomez@soy.sena.edu.co',
            telefono: '3201234567',
            perfil: 'antiguo',
            modalidad: 'virtual',
            nivel: 'tecnico',
            programa: 'Programación de Software',
            ficha: '2987123',
            regionalId: regId2,
            senaAnterior: true,
            expectativas: 'Actualizarme en las normativas del Acuerdo 009 de 2024.',
          },
          {
            documento: '1034567890',
            nombreCompleto: 'Juan David Martínez',
            correo: 'jd.martinez@soy.sena.edu.co',
            telefono: '3005558899',
            perfil: 'reingreso',
            modalidad: 'presencial',
            nivel: 'tecnologo',
            programa: 'Gestión Logística',
            ficha: '2765123',
            regionalId: regId1,
            senaAnterior: true,
            motivoReingreso: 'Retomé mi formación tras superar un problema de salud.',
          },
        ])
        .returning();

      // Insertar progresos iniciales de prueba
      if (demoAprendices.length > 0 && modulosCreados.length > 0) {
        const a1 = demoAprendices[0].id;
        const m1 = modulosCreados[0].id;
        const m2 = modulosCreados[1].id;
        const m3 = modulosCreados[2].id;

        await db.insert(progreso).values([
          {
            aprendizId: a1,
            moduloId: m1,
            estado: 'completado',
            porcentaje: 100,
            seccionesVistas: [1, 2, 3],
          },
          {
            aprendizId: a1,
            moduloId: m2,
            estado: 'completado',
            porcentaje: 100,
            seccionesVistas: [1, 2],
          },
          {
            aprendizId: a1,
            moduloId: m3,
            estado: 'en_progreso',
            porcentaje: 75,
            seccionesVistas: [1, 2, 3],
          },
        ]);

        await db.insert(evaluaciones).values([
          {
            aprendizId: a1,
            moduloId: m1,
            calificacion: 100,
            totalPreguntas: 3,
            aprobado: true,
            detalle: [
              { preguntaId: 1, correcta: true },
              { preguntaId: 2, correcta: true },
              { preguntaId: 3, correcta: true },
            ],
          },
          {
            aprendizId: a1,
            moduloId: m2,
            calificacion: 100,
            totalPreguntas: 2,
            aprobado: true,
            detalle: [
              { preguntaId: 4, correcta: true },
              { preguntaId: 5, correcta: true },
            ],
          },
        ]);
      }
    }

    return {
      regionales: regionalesCreadas.length,
      modulos: modulosCreados.length,
      secciones: seccionesData.length,
      preguntas: preguntasData.length,
      articulos: reglamentoData.length,
    };
  } catch (error) {
    console.error('Error during seed execution:', error);
    throw error;
  }
}
