import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Enums
export const perfilEnum = pgEnum('perfil_aprendiz', [
  'nuevo',
  'antiguo',
  'reingreso',
]);

export const modalidadEnum = pgEnum('modalidad_formacion', [
  'presencial',
  'virtual',
  'a_distancia',
  'mixta',
]);

export const nivelEnum = pgEnum('nivel_formacion', [
  'tecnico',
  'tecnologo',
  'especializacion',
  'auxiliar',
]);

export const estadoModuloEnum = pgEnum('estado_modulo', [
  'no_iniciado',
  'en_progreso',
  'completado',
]);

// Tabla: Regionales del SENA
export const regionales = pgTable('regionales', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  departamento: varchar('departamento', { length: 80 }).notNull(),
  descripcion: text('descripcion').notNull(),
  director: varchar('director', { length: 120 }).notNull(),
  contacto: varchar('contacto', { length: 120 }).notNull(),
  programasDestacados: jsonb('programas_destacados')
    .$type<string[]>()
    .notNull()
    .default([]),
});

// Tabla: Aprendices (caracterización principal)
export const aprendices = pgTable('aprendices', {
  id: serial('id').primaryKey(),
  documento: varchar('documento', { length: 30 }).notNull().unique(),
  nombreCompleto: varchar('nombre_completo', { length: 150 }).notNull(),
  correo: varchar('correo', { length: 150 }).notNull(),
  telefono: varchar('telefono', { length: 30 }),
  perfil: perfilEnum('perfil').notNull(),
  modalidad: modalidadEnum('modalidad').notNull(),
  nivel: nivelEnum('nivel').notNull(),
  programa: varchar('programa', { length: 200 }).notNull(),
  ficha: varchar('ficha', { length: 50 }).notNull(),
  regionalId: integer('regional_id')
    .notNull()
    .references(() => regionales.id),
  // Caracterización adicional
  senaAnterior: boolean('sena_anterior').notNull().default(false),
  motivoReingreso: text('motivo_reingreso'),
  expectativas: text('expectativas'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Tabla: Módulos de inducción
export const modulos = pgTable('modulos', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 60 }).notNull().unique(),
  titulo: varchar('titulo', { length: 150 }).notNull(),
  descripcion: text('descripcion').notNull(),
  orden: integer('orden').notNull(),
  obligatorio: boolean('obligatorio').notNull().default(true),
  aplicaPara: jsonb('aplica_para').$type<string[]>().notNull().default([
    'nuevo',
    'antiguo',
    'reingreso',
  ]),
  icono: varchar('icono', { length: 10 }).notNull().default('📘'),
});

// Tabla: Contenido/Secciones de cada módulo
export const secciones = pgTable('secciones', {
  id: serial('id').primaryKey(),
  moduloId: integer('modulo_id')
    .notNull()
    .references(() => modulos.id, { onDelete: 'cascade' }),
  titulo: varchar('titulo', { length: 200 }).notNull(),
  contenido: text('contenido').notNull(),
  puntosClave: jsonb('puntos_clave').$type<string[]>().notNull().default([]),
  orden: integer('orden').notNull(),
});

// Tabla: Progreso del aprendiz por módulo
export const progreso = pgTable('progreso', {
  id: serial('id').primaryKey(),
  aprendizId: integer('aprendiz_id')
    .notNull()
    .references(() => aprendices.id, { onDelete: 'cascade' }),
  moduloId: integer('modulo_id')
    .notNull()
    .references(() => modulos.id, { onDelete: 'cascade' }),
  estado: estadoModuloEnum('estado').notNull().default('no_iniciado'),
  porcentaje: integer('porcentaje').notNull().default(0),
  seccionesVistas: jsonb('secciones_vistas')
    .$type<number[]>()
    .notNull()
    .default([]),
  finalizadoEn: timestamp('finalizado_en'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Tabla: Preguntas de evaluación
export const preguntas = pgTable('preguntas', {
  id: serial('id').primaryKey(),
  moduloId: integer('modulo_id')
    .notNull()
    .references(() => modulos.id, { onDelete: 'cascade' }),
  enunciado: text('enunciado').notNull(),
  opciones: jsonb('opciones').$type<string[]>().notNull(),
  respuestaCorrecta: integer('respuesta_correcta').notNull(),
  explicacion: text('explicacion').notNull(),
  orden: integer('orden').notNull(),
});

// Tabla: Resultados de evaluación
export const evaluaciones = pgTable('evaluaciones', {
  id: serial('id').primaryKey(),
  aprendizId: integer('aprendiz_id')
    .notNull()
    .references(() => aprendices.id, { onDelete: 'cascade' }),
  moduloId: integer('modulo_id')
    .notNull()
    .references(() => modulos.id, { onDelete: 'cascade' }),
  calificacion: integer('calificacion').notNull(),
  totalPreguntas: integer('total_preguntas').notNull(),
  aprobado: boolean('aprobado').notNull(),
  detalle: jsonb('detalle')
    .$type<{ preguntaId: number; correcta: boolean }[]>()
    .notNull()
    .default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Tabla: Reglamento (artículos y obligaciones)
export const reglamentoArticulos = pgTable('reglamento_articulos', {
  id: serial('id').primaryKey(),
  numero: varchar('numero', { length: 20 }).notNull(),
  titulo: varchar('titulo', { length: 200 }).notNull(),
  categoria: varchar('categoria', { length: 80 }).notNull(), // deber, derecho, prohibicion
  contenido: text('contenido').notNull(),
  consecuencia: text('consecuencia'),
  aplicaPara: jsonb('aplica_para').$type<string[]>().notNull().default([
    'nuevo',
    'antiguo',
    'reingreso',
  ]),
  orden: integer('orden').notNull(),
});
