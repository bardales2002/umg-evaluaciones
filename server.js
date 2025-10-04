import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import profesoresRoutes from './src/routes/profesores.routes.js';
import evaluacionesRoutes from './src/routes/evaluaciones.routes.js';
import statsRoutes from './src/routes/stats.routes.js';

// Helpers ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* Middlewares base */
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60_000, max: 300 });
app.use(limiter);

/* Estáticos (frontend opcional en /public) */
app.use(express.static(path.join(__dirname, 'public')));

/* Portada simple */
app.get('/', (_req, res) => {
  res.send(`
    <style>
      body{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial;padding:24px;line-height:1.5}
      a{color:#0b74de;text-decoration:none} a:hover{text-decoration:underline}
      code{background:#f3f4f6;padding:2px 6px;border-radius:6px}
    </style>
    <h1>API Evaluación de Catedráticos (Local)</h1>
    <ul>
      <li><a href="/api">/api</a></li>
      <li><a href="/api/profesores">/api/profesores</a></li>
      <li><a href="/api/stats">/api/stats</a></li>
    </ul>
    <p>Frontend (si existe): <a href="/index.html">/index.html</a> y <a href="/stats.html">/stats.html</a></p>
  `);
});

/* Rutas API */
app.get('/api', (_req, res) => res.json({ ok: true, message: 'API Local OK' }));
app.use('/api/profesores', profesoresRoutes);
app.use('/api/evaluaciones', evaluacionesRoutes);
app.use('/api/stats', statsRoutes);

/* 404 para cualquier ruta que empiece con /api NO manejada arriba */
app.use('/api', (_req, res) => {
  res.status(404).json({ ok: false, message: 'Ruta no encontrada' });
});

/* 404 general (no-API) si no hay archivo estático */
app.use((_req, res) => {
  res.status(404).send('404 — Recurso no encontrado. Revisa la ruta o agrega tu frontend en /public');
});

/* Arranque */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API local en http://localhost:${PORT}`);
});
