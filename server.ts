import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { db } from './src/db/index.ts';
import {
  regionales,
  aprendices,
  modulos,
  secciones,
  progreso,
  preguntas,
  evaluaciones,
  reglamentoArticulos,
} from './src/db/schema.ts';
import { seed } from './src/db/seed.ts';
import { eq, and, desc, sql } from 'drizzle-orm';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Auto seed helper
async function ensureSeeded() {
  try {
    const existing = await db.select().from(regionales).limit(1);
    if (existing.length === 0) {
      console.log('Seeding initial SENA induction data...');
      await seed();
      console.log('SENA induction database seeded successfully.');
    }
  } catch (err) {
    console.error('Error during auto-seed check:', err);
  }
}

// Health Check
app.get('/api/health', async (_req, res) => {
  try {
    await ensureSeeded();
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Seed API
app.post('/api/seed', async (_req, res) => {
  try {
    await db.delete(evaluaciones);
    await db.delete(progreso);
    await db.delete(preguntas);
    await db.delete(secciones);
    await db.delete(reglamentoArticulos);
    await db.delete(modulos);
    await db.delete(aprendices);
    await db.delete(regionales);

    const result = await seed();
    res.json({ ok: true, ...result });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

// Acuerdo 009 de 2024 JSON API
app.get('/api/acuerdo-json', (_req, res) => {
  try {
    const filePath = path.join(__dirname, 'src', 'data', 'acuerdo_009_2024.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      res.json({ ok: true, data });
    } else {
      res.status(404).json({ ok: false, error: 'Archivo JSON del acuerdo no encontrado' });
    }
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

// Regionales API
app.get('/api/regionales', async (_req, res) => {
  try {
    await ensureSeeded();
    const data = await db.select().from(regionales).orderBy(regionales.nombre);
    res.json({ ok: true, data });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

// Aprendices API
app.post('/api/aprendices', async (req, res) => {
  try {
    await ensureSeeded();
    const {
      documento,
      nombreCompleto,
      correo,
      telefono,
      perfil,
      modalidad,
      nivel,
      programa,
      ficha,
      regionalId,
      senaAnterior,
      motivoReingreso,
      expectativas,
    } = req.body;

    if (!documento || !nombreCompleto || !correo || !perfil || !regionalId) {
      return res.status(400).json({ ok: false, error: 'Faltan datos obligatorios' });
    }

    const existente = await db
      .select()
      .from(aprendices)
      .where(eq(aprendices.documento, documento))
      .limit(1);

    let aprendizId: number;

    if (existente.length > 0) {
      aprendizId = existente[0].id;
      await db
        .update(aprendices)
        .set({
          nombreCompleto,
          correo,
          telefono: telefono ?? null,
          perfil,
          modalidad,
          nivel,
          programa,
          ficha,
          regionalId,
          senaAnterior: senaAnterior ?? false,
          motivoReingreso: motivoReingreso ?? null,
          expectativas: expectativas ?? null,
        })
        .where(eq(aprendices.id, aprendizId));
    } else {
      const creado = await db
        .insert(aprendices)
        .values({
          documento,
          nombreCompleto,
          correo,
          telefono: telefono ?? null,
          perfil,
          modalidad,
          nivel,
          programa,
          ficha,
          regionalId,
          senaAnterior: senaAnterior ?? false,
          motivoReingreso: motivoReingreso ?? null,
          expectativas: expectativas ?? null,
        })
        .returning();
      aprendizId = creado[0].id;
    }

    res.json({ ok: true, aprendizId });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

app.get('/api/aprendices', async (req, res) => {
  try {
    await ensureSeeded();
    const documento = req.query.documento as string;

    if (!documento) {
      return res.status(400).json({ ok: false, error: 'Falta documento' });
    }

    const resultado = await db
      .select()
      .from(aprendices)
      .where(eq(aprendices.documento, documento))
      .limit(1);

    if (resultado.length === 0) {
      return res.status(404).json({ ok: false, error: 'No encontrado' });
    }

    res.json({ ok: true, data: resultado[0] });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

// Modulos API
app.get('/api/modulos', async (req, res) => {
  try {
    await ensureSeeded();
    const perfil = req.query.perfil as string;

    let lista = await db.select().from(modulos).orderBy(modulos.orden);

    if (perfil) {
      lista = lista.filter((m) => {
        const applies = m.aplicaPara as string[];
        return applies.includes(perfil);
      });
    }

    const conSecciones = await Promise.all(
      lista.map(async (m) => {
        const secs = await db
          .select()
          .from(secciones)
          .where(eq(secciones.moduloId, m.id))
          .orderBy(secciones.orden);
        return { ...m, secciones: secs };
      })
    );

    res.json({ ok: true, data: conSecciones });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

// Progreso API
app.get('/api/progreso', async (req, res) => {
  try {
    await ensureSeeded();
    const aprendizId = req.query.aprendizId as string;

    if (!aprendizId) {
      return res.status(400).json({ ok: false, error: 'Falta aprendizId' });
    }

    const lista = await db
      .select({
        id: progreso.id,
        moduloId: progreso.moduloId,
        moduloSlug: modulos.slug,
        moduloTitulo: modulos.titulo,
        estado: progreso.estado,
        porcentaje: progreso.porcentaje,
        seccionesVistas: progreso.seccionesVistas,
        finalizadoEn: progreso.finalizadoEn,
      })
      .from(progreso)
      .leftJoin(modulos, eq(progreso.moduloId, modulos.id))
      .where(eq(progreso.aprendizId, parseInt(aprendizId, 10)));

    res.json({ ok: true, data: lista });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

app.post('/api/progreso', async (req, res) => {
  try {
    await ensureSeeded();
    const { aprendizId, moduloSlug, seccionId } = req.body;

    if (!aprendizId || !moduloSlug) {
      return res.status(400).json({ ok: false, error: 'Faltan datos' });
    }

    const moduloRecord = await db
      .select()
      .from(modulos)
      .where(eq(modulos.slug, moduloSlug))
      .limit(1);

    if (moduloRecord.length === 0) {
      return res.status(404).json({ ok: false, error: 'Módulo no existe' });
    }

    const moduloId = moduloRecord[0].id;
    const totalSecciones = await db
      .select()
      .from(secciones)
      .where(eq(secciones.moduloId, moduloId));

    const existente = await db
      .select()
      .from(progreso)
      .where(
        and(eq(progreso.aprendizId, parseInt(aprendizId, 10)), eq(progreso.moduloId, moduloId))
      )
      .limit(1);

    let seccionesVistas: number[] = (existente[0]?.seccionesVistas as number[]) ?? [];
    if (seccionId && !seccionesVistas.includes(seccionId)) {
      seccionesVistas = [...seccionesVistas, seccionId];
    }

    const porcentaje = totalSecciones.length
      ? Math.round((seccionesVistas.length / totalSecciones.length) * 100)
      : 0;

    let estado: 'no_iniciado' | 'en_progreso' | 'completado' = 'no_iniciado';
    if (porcentaje === 0) estado = 'no_iniciado';
    else if (porcentaje < 100) estado = 'en_progreso';
    else estado = 'completado';

    if (existente.length > 0) {
      await db
        .update(progreso)
        .set({
          seccionesVistas,
          porcentaje,
          estado,
          finalizadoEn: estado === 'completado' ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(progreso.id, existente[0].id));
    } else {
      await db.insert(progreso).values({
        aprendizId: parseInt(aprendizId, 10),
        moduloId,
        seccionesVistas,
        porcentaje,
        estado,
        finalizadoEn: estado === 'completado' ? new Date() : null,
      });
    }

    res.json({ ok: true, porcentaje, estado });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

// Evaluacion API - Randomized Question Pool to prevent repetition!
app.get('/api/evaluacion', async (req, res) => {
  try {
    await ensureSeeded();
    const slug = req.query.slug as string;
    const aprendizId = req.query.aprendizId as string;

    if (!slug) {
      return res.status(400).json({ ok: false, error: 'Falta slug' });
    }

    const moduloRecord = await db
      .select()
      .from(modulos)
      .where(eq(modulos.slug, slug))
      .limit(1);

    if (moduloRecord.length === 0) {
      return res.status(404).json({ ok: false, error: 'Módulo no existe' });
    }

    // Fetch questions for this module
    const lista = await db
      .select()
      .from(preguntas)
      .where(eq(preguntas.moduloId, moduloRecord[0].id));

    // Shuffle questions randomly to avoid static/repetitive order
    const shuffled = [...lista].sort(() => 0.5 - Math.random());

    let articulos = null;
    if (slug === 'reglamento') {
      articulos = await db
        .select()
        .from(reglamentoArticulos)
        .orderBy(reglamentoArticulos.orden);
    }

    let ultimoResultado = null;
    if (aprendizId) {
      const ult = await db
        .select()
        .from(evaluaciones)
        .where(
          and(
            eq(evaluaciones.aprendizId, parseInt(aprendizId, 10)),
            eq(evaluaciones.moduloId, moduloRecord[0].id)
          )
        )
        .orderBy(desc(evaluaciones.createdAt))
        .limit(1);
      ultimoResultado = ult[0] ?? null;
    }

    res.json({
      ok: true,
      totalBancoPreguntas: lista.length,
      preguntas: shuffled.map((p) => ({
        id: p.id,
        enunciado: p.enunciado,
        opciones: p.opciones,
      })),
      articulos,
      ultimoResultado,
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

app.post('/api/evaluacion', async (req, res) => {
  try {
    await ensureSeeded();
    const { aprendizId, moduloSlug, respuestas } = req.body;

    if (!aprendizId || !moduloSlug || !Array.isArray(respuestas)) {
      return res.status(400).json({ ok: false, error: 'Datos incompletos' });
    }

    const moduloRecord = await db
      .select()
      .from(modulos)
      .where(eq(modulos.slug, moduloSlug))
      .limit(1);

    if (moduloRecord.length === 0) {
      return res.status(404).json({ ok: false, error: 'Módulo no existe' });
    }

    const todasPreguntas = await db
      .select()
      .from(preguntas)
      .where(eq(preguntas.moduloId, moduloRecord[0].id));

    let correctas = 0;
    const detalle: { preguntaId: number; correcta: boolean }[] = [];

    // Filter to only evaluated questions
    const answeredQuestionIds = respuestas.map((r: any) => r.preguntaId);
    const questionsEvaluated = todasPreguntas.filter((p) => answeredQuestionIds.includes(p.id));

    for (const p of questionsEvaluated) {
      const respuesta = respuestas.find((r: { preguntaId: number }) => r.preguntaId === p.id);
      const ok = respuesta && respuesta.respuesta === p.respuestaCorrecta;
      if (ok) correctas++;
      detalle.push({ preguntaId: p.id, correcta: !!ok });
    }

    const totalElegidas = Math.max(questionsEvaluated.length, 1);
    const calificacion = Math.round((correctas / totalElegidas) * 100);
    const aprobado = calificacion >= 70;

    const guardado = await db
      .insert(evaluaciones)
      .values({
        aprendizId: parseInt(aprendizId, 10),
        moduloId: moduloRecord[0].id,
        calificacion,
        totalPreguntas: totalElegidas,
        aprobado,
        detalle,
      })
      .returning();

    const feedback = questionsEvaluated.map((p) => {
      const r = respuestas.find((x: { preguntaId: number }) => x.preguntaId === p.id);
      const options = p.opciones as string[];
      return {
        preguntaId: p.id,
        correcta: r?.respuesta === p.respuestaCorrecta,
        explicacion: p.explicacion,
        respuestaCorrecta: options[p.respuestaCorrecta],
        respuestaUsuario: r ? options[r.respuesta] : 'No respondida',
      };
    });

    res.json({
      ok: true,
      calificacion,
      aprobado,
      feedback,
      total: totalElegidas,
      correctas,
      id: guardado[0].id,
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

// Admin KPIs & Consolidated Statistics API
app.get('/api/admin/stats', async (_req, res) => {
  try {
    await ensureSeeded();

    const todosAprendices = await db.select().from(aprendices);
    const todasEvaluaciones = await db.select().from(evaluaciones);
    const todosProgresos = await db.select().from(progreso);
    const todasRegionalesList = await db.select().from(regionales);
    const todasPreguntasList = await db.select().from(preguntas);

    const totalAprendices = todosAprendices.length;
    
    // Profiles breakdown
    const porPerfil = {
      nuevo: todosAprendices.filter((a) => a.perfil === 'nuevo').length,
      antiguo: todosAprendices.filter((a) => a.perfil === 'antiguo').length,
      reingreso: todosAprendices.filter((a) => a.perfil === 'reingreso').length,
    };

    // Regional breakdown
    const porRegionalMap: Record<string, number> = {};
    for (const a of todosAprendices) {
      const reg = todasRegionalesList.find((r) => r.id === a.regionalId);
      const regName = reg ? reg.nombre : `Regional #${a.regionalId}`;
      porRegionalMap[regName] = (porRegionalMap[regName] || 0) + 1;
    }

    // Modalidad breakdown
    const porModalidad = {
      presencial: todosAprendices.filter((a) => a.modalidad === 'presencial').length,
      virtual: todosAprendices.filter((a) => a.modalidad === 'virtual').length,
      a_distancia: todosAprendices.filter((a) => a.modalidad === 'a_distancia').length,
      mixta: todosAprendices.filter((a) => a.modalidad === 'mixta').length,
    };

    // Completion Metrics
    const totalCompletados = todosProgresos.filter((p) => p.estado === 'completado').length;
    const promedioCalificacion = todasEvaluaciones.length > 0
      ? Math.round(todasEvaluaciones.reduce((acc, e) => acc + e.calificacion, 0) / todasEvaluaciones.length)
      : 0;

    const evaluacionesAprobadas = todasEvaluaciones.filter((e) => e.aprobado).length;
    const tasaAprobacion = todasEvaluaciones.length > 0
      ? Math.round((evaluacionesAprobadas / todasEvaluaciones.length) * 100)
      : 0;

    res.json({
      ok: true,
      kpis: {
        totalAprendices,
        totalEvaluaciones: todasEvaluaciones.length,
        promedioCalificacion,
        tasaAprobacion,
        totalPreguntasBanco: todasPreguntasList.length,
        totalRegionalesActivas: todasRegionalesList.length,
      },
      porPerfil,
      porModalidad,
      porRegional: porRegionalMap,
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

// Admin Apprentices Directory API
app.get('/api/admin/aprendices', async (_req, res) => {
  try {
    await ensureSeeded();

    const listaAprendices = await db.select().from(aprendices).orderBy(desc(aprendices.createdAt));
    const listaRegionales = await db.select().from(regionales);
    const listaProgresos = await db.select().from(progreso);
    const listaEvaluaciones = await db.select().from(evaluaciones);

    const consolidados = listaAprendices.map((a) => {
      const regional = listaRegionales.find((r) => r.id === a.regionalId);
      const progresosAprendiz = listaProgresos.filter((p) => p.aprendizId === a.id);
      const evaluacionesAprendiz = listaEvaluaciones.filter((e) => e.aprendizId === a.id);

      const completados = progresosAprendiz.filter((p) => p.estado === 'completado').length;
      const progresoPorcentaje = progresosAprendiz.length > 0
        ? Math.round(progresosAprendiz.reduce((acc, p) => acc + p.porcentaje, 0) / 3)
        : 0;

      const ultimaEval = evaluacionesAprendiz[evaluacionesAprendiz.length - 1];

      return {
        ...a,
        regionalNombre: regional ? regional.nombre : 'SENA General',
        regionalDepartamento: regional ? regional.departamento : '',
        modulosCompletados: completados,
        progresoPorcentaje,
        ultimaCalificacion: ultimaEval ? ultimaEval.calificacion : null,
        ultimaEvaluacionAprobada: ultimaEval ? ultimaEval.aprobado : null,
      };
    });

    res.json({ ok: true, data: consolidados });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

// Admin Question Bank Management API
app.get('/api/admin/preguntas', async (_req, res) => {
  try {
    await ensureSeeded();
    const listaPreguntas = await db.select().from(preguntas).orderBy(preguntas.moduloId, preguntas.orden);
    const listaModulos = await db.select().from(modulos);

    const result = listaPreguntas.map((p) => {
      const mod = listaModulos.find((m) => m.id === p.moduloId);
      return {
        ...p,
        moduloSlug: mod ? mod.slug : 'general',
        moduloTitulo: mod ? mod.titulo : 'General',
      };
    });

    res.json({ ok: true, data: result });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

app.post('/api/admin/preguntas', async (req, res) => {
  try {
    await ensureSeeded();
    const { moduloSlug, enunciado, opciones, respuestaCorrecta, explicacion } = req.body;

    if (!moduloSlug || !enunciado || !Array.isArray(opciones) || respuestaCorrecta === undefined || !explicacion) {
      return res.status(400).json({ ok: false, error: 'Campos requeridos incompletos' });
    }

    const modRecord = await db.select().from(modulos).where(eq(modulos.slug, moduloSlug)).limit(1);
    if (modRecord.length === 0) {
      return res.status(404).json({ ok: false, error: 'Módulo no encontrado' });
    }

    const nuevaPregunta = await db
      .insert(preguntas)
      .values({
        moduloId: modRecord[0].id,
        enunciado,
        opciones,
        respuestaCorrecta: parseInt(respuestaCorrecta, 10),
        explicacion,
        orden: 99,
      })
      .returning();

    res.json({ ok: true, data: nuevaPregunta[0] });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

app.delete('/api/admin/preguntas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(preguntas).where(eq(preguntas.id, id));
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

// Serve frontend in production or integrate Vite in dev (when not on Vercel)
if (!process.env.VERCEL) {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
